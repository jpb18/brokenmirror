import System.Collections.Generic;
#pragma strict

class SaveShip{
	
	var hasBeenSet : boolean = false;
	
	class ShipInfo { //general ship info
		var Name : String;
		var Faction : int;
		var isPlayer : boolean;
		var isRedAlert : boolean;
		var strenght : int;
		
		function ShipInfo() {
			Name = "";
			Faction = 0;
			isPlayer = false;
			isRedAlert = false;
			strenght = 0;
		}
	
	}
	
	class ShipHealth { //ship health information
		var curHull : float;
		var curShield : float;
		
		function ShipHealth() {
			curHull = 0;
			curShield = 0;
		}
	
	}

	class ShipInventory { //ship inventory information
		var phaser : GameObject;
		var torp1 : GameObject;
		var torp2 : GameObject;
		var upgrades : GameObject[];
		
		function ShipInventory() {
			phaser = null;
			torp1 = null;
			torp2 = null;
			upgrades = new GameObject[0];
		}
		
	}
	
	
	var shipPrefab : GameObject;
	var shipInfo : ShipInfo;
	var shipHea : ShipHealth;
	var shipInv : ShipInventory;
	var dilithium : int;
	
	function SaveShip() {
		shipInfo = new ShipInfo();
		shipHea = new ShipHealth();
		shipInv = new ShipInventory();
		shipPrefab = null;
		
	}
	
	//this function returns the ship stored here
	function getShip() : GameObject {
		var ship : GameObject = GameObject.Instantiate(shipPrefab);
			
		//input information into
		var shipProps : shipProperties = ship.GetComponent(shipProperties);
		shipProps.playerProps.isPlayer = shipInfo.isPlayer;
		shipProps.shipInfo.shipName = shipInfo.Name;
		shipProps.shipInfo.faction = shipInfo.Faction;
		shipProps.combatStatus.isRedAlert = shipInfo.isRedAlert;
		
		//input ship health info
		var shipHealth : shipHealth = ship.GetComponent(shipHealth);
		shipHealth.shipHealth.health = shipHea.curHull;
		shipHealth.shipHealth.shields = shipHea.curShield;
		
		//get dilithium
		var shipFuel : ShipFuel = ship.GetComponent(ShipFuel);
		shipFuel.setCurrentLoad(dilithium);
		
		//get ship weapons
		if(hasBeenSet) {
			var shipWeap : shipWeapons = ship.GetComponent(shipWeapons);
			shipWeap.phaser.setPhaser(shipInv.phaser);
			shipWeap.torp1.setTorpedo(shipInv.torp1);
			shipWeap.torp2.setTorpedo(shipInv.torp2);
		}
		
		return ship;
	
	}
	
	//this function stores the ship here
	function setShip(ship : GameObject) {
		hasBeenSet = true;
		
		//now lets fill the information
		//first get the scripts
		var shipProps : shipProperties = ship.GetComponent(shipProperties);
		var shipHeal : shipHealth = ship.GetComponent(shipHealth);
		var shipWea : shipWeapons = ship.GetComponent(shipWeapons);
		var shipFuel : ShipFuel = ship.GetComponent(ShipFuel);
		
		//now fill the ship info part
		shipInfo.Name =  shipProps.shipInfo.shipName;
		shipInfo.Faction = shipProps.shipInfo.faction;
		shipInfo.isPlayer = shipProps.playerProps.isPlayer;
		shipInfo.isRedAlert = shipProps.combatStatus.isRedAlert;
		shipInfo.strenght = shipProps.shipProps.shipStrenght;
		
		
		//now fill the ship health part
		shipHea.curHull = shipHeal.shipHealth.health;
		shipHea.curShield = shipHeal.shipHealth.shields;
		
		//and now the inventory part
		//first get the weapon game objects of each weaponslot
		shipInv.phaser = shipWea.phaser.phaser;
		shipInv.torp1 = shipWea.torp1.torpedo;
		shipInv.torp2 = shipWea.torp2.torpedo;
		
		//get dilithium
		dilithium = shipFuel.getCurrentLoad();
		
		//now get load a prefab for this ship
		shipPrefab = Resources.Load(ship.name) as GameObject;
		
	}
	
	
	
}

class Fleet extends System.Object{
	
	var ships : List.<SaveShip>;
	var formation : Formation = Formation.standard;
	
	function getShip(ship : int) : GameObject {
	
		return this.ships[ship].getShip();
	
	}

	
	function clearList() {
		this.ships.Clear();
	}
	
	function setShip(ship : GameObject) {
		var newShip : SaveShip = new SaveShip();
		newShip.setShip(ship);
		this.ships.Add(newShip);
	}
	
	function changeFormation() {
		switch(this.formation) {
			case Formation.close:
				formation = Formation.standard;
				break;
			case Formation.standard:
				formation = Formation.loose;
				break;
			case Formation.loose:
				formation = formation.close;
				break;
		}
		
		
		
	}
	
	
	
	function getFormation () : String {
		var text : String = "";
		switch(this.formation) {
			case Formation.close:
				text = "close";
				break;
			case Formation.standard:
				text = "standard";
				break;
			case Formation.loose:
				text = "loose";
				break;
		}
	
		return text;
	}
	
	function getSize() : int {
		return ships.Count;
	}
	

}

var playerShip : SaveShip; //player ship info
var playerFleet : Fleet; //player escort fleet

var changedFormation : float = 0.0f;
var pressWait : float = 0.2f;

var show : ShowMessage;
var load : LoadScene;
var start : SceneStart;

var playShip : GameObject;

var rangeToAutoCommand : int = 50.0f;

static final var CLONE_NUM : int = 7; //number of chars in "(Clone)"

function Start() {
	show = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
	
}

function Update() {
	changeFormation();
	
	if(Input.GetAxis("NearbyFleet")) {
		makeNearFleet();
	}
	
	if(!playShip || !isPlayer(playShip)) {
		playShip = FindPlayerShip();
	}
	

}

function getPlayerShip() : GameObject {
	return playShip;
}

function isPlayer(ship : GameObject) : boolean {
	var props : shipProperties = ship.GetComponent(shipProperties);
	return props.getPlayer();
}

function changeFormation() {
	if(Input.GetAxis("Formation") && changedFormation + pressWait < Time.time && show.isGame && !load.show) {
		changeFormation(playerFleet, start.playerFleet);
		changedFormation = Time.time;
	}
}

function Save() {
	PlayerSave(); //first save the player ship
	SavePlayerFleet(); //then its fleet
}

function PlayerSave() {

	playShip = FindPlayerShip(); //first get the player GameObject
	playerShip.setShip(playShip);
	  

}

function SavePlayerFleet() {
	playerFleet.clearList();
	
	for(var ship : GameObject in GameObject.FindGameObjectsWithTag("Ship")) {
		if(ship != playShip) {
		var ai : ShipAI = ship.GetComponent(ShipAI);
			if(ai) {
				if(ai.leader == this.playShip) {
					playerFleet.setShip(ship);
				}
			} else {
				Debug.LogWarning("Ai Script not set in " + ship.name);
			}
		}
		
	
	}
	
}

public static function FindPlayerShip() : GameObject {

	
	
	var playerShip : GameObject; //set the return variable
	
	var shipsGo : GameObject[] = GameObject.FindGameObjectsWithTag("Ship");
	
	
	
	for (var ship : GameObject in  shipsGo) { //loop through all ships in search of the player ship
		
		var shipPros : shipProperties = ship.GetComponent(shipProperties); //get ship properties script
		if(shipPros.playerProps.isPlayer) { //check if its player
		
			playerShip = ship; //set player ship var
			
		
		}
		
	
	}
	
	return playerShip;


}


//pre: last 7 letter must be "(Clone)"
public static function RemoveClone(name : String) : String {

		//remove last 7 characters of name
		return name.Substring(0, name.Length - CLONE_NUM);

}

function changeFormation(fleet : Fleet, squad : List.<GameObject>) {
	fleet.changeFormation();
	var message : String = "Fleet is now in " + fleet.getFormation() + " formation.";	
	
	setFleetFormation(fleet.formation, squad);
	
	//set new message
	show.AddMessage(message);
	
	
}

function setFleetFormation (formation : Formation, fleet : List.<GameObject>) {
	
	for(var ship in fleet) {
		ship.GetComponent(ShipAI).formation = formation;
	}

}

function makeNearFleet() {
	
	//lets start by getting the player ship
	var player : GameObject = FindPlayerShip();

	//now by getting all ships nearby that are owned by the player
	var ships : GameObject[] = Statics.getNearbyOwnedShips(player.transform.position, rangeToAutoCommand, 0);
	
	//now lets set all ships to follow the player
	for(var ship : GameObject in ships) {
		
		ship.GetComponent(ShipAI).setLeader(player);
		Debug.Log("Gets here" + ship.GetComponent(shipProperties).getName());
	}
	
	//and now set the new list in the fleet
	playerFleet.clearList();
	for(var ship : GameObject in ships) {
		playerFleet.setShip(ship);
	}
	
	
}



