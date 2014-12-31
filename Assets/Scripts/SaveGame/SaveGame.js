import System.Collections.Generic;
#pragma strict

class SaveShip extends System.Object{
	
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
		var upgrades : List.<GameObject>;
		var actives : List.<GameObject>;
		
		function ShipInventory() {
			phaser = null;
			torp1 = null;
			torp2 = null;
			upgrades = new List.<GameObject>();
		}
		
		
		
		
		
	}
	
	
	var shipPrefab : GameObject;
	var shipInfo : ShipInfo;
	var shipHea : ShipHealth;
	var shipInv : ShipInventory;
	var dilithium : int;
	
	function SaveShip() {
		this.shipInfo = new ShipInfo();
		this.shipHea = new ShipHealth();
		this.shipInv = new ShipInventory();
		this.shipPrefab = null;
		this.dilithium = 0;
		
	}
	
	function SaveShip(ship : GameObject) {
		this();
		setShip(ship);
		
	}
	
	function SaveShip(ship : GameObject, faction : int) {
		this(ship);
		shipInfo.Faction = faction;
		
		var general : GeneralInfo = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
		var factionInfo : FactionInfo = general.getFactionInfo(faction);
		var name : String = factionInfo.getRandomShipName();
		shipInfo.Name = name;
		
	}
	
	function SaveShip(ship : ShipData) {
		this();
		setName(ship.name);
		setFaction(ship.faction);
		setPlayer(ship.player);
		setRedAlert(ship.alert);
		setHull(ship.hull);
		setShield(ship.shield);
		setPhaser(ship.getPhaser());
		setForwardTorpedo(ship.getForwardTorpedo());
		setBackwardTorpedo(ship.getBackwardTorpedo());
		setUpgrades(ship.getUpgrades());
		setActives(ship.getActives());
		setPrefab(ship.getPrefab());
		setDilithium(ship.dilithium);
		
	}
	
	function getName() : String {
		return shipInfo.Name;
	}
	
	function setName(name : String) {
		shipInfo.Name = name;
	}
	
	function getStrenght() : int {
		return shipInfo.strenght;
	}
	
	function getFaction() : int {
		return shipInfo.Faction;
	}
	
	function setFaction(faction : int) {
		shipInfo.Faction = faction;
	}
	
	function isPlayer() : boolean {
		return shipInfo.isPlayer;
	}
	
	function setPlayer(player : boolean) {
		shipInfo.isPlayer = player;
	}
	
	function isRedAlert() : boolean {
		return shipInfo.isRedAlert;
	}
	
	function setRedAlert(alert : boolean) {
		shipInfo.isRedAlert = alert;
	}
	
	function getPhaser() : GameObject {
		return shipInv.phaser;
	}
	
	function setPhaser(phaser : GameObject) {
		shipInv.phaser = phaser;
	}
	
	function getForwardTorpedo() : GameObject {
		return shipInv.torp1;
	}
	
	function setForwardTorpedo(torpedo : GameObject) {
		shipInv.torp1 = torpedo;
	} 
	
	function getBackwardTorpedo() : GameObject {
		return shipInv.torp2;
	}
	
	function setBackwardTorpedo(torpedo : GameObject) {
		shipInv.torp2 = torpedo;
	}
	
	function getUpgrades() : List.<GameObject> {
		return shipInv.upgrades;
	}
	
	function setUpgrades(upgrades : List.<GameObject>) {
		shipInv.upgrades = upgrades;
	}
	
	function getActives() : List.<GameObject> {
		return shipInv.actives;
	}
	
	function setActives(actives : List.<GameObject>) {
		shipInv.actives = actives;
	}
	
	function getHull() : float {
		return shipHea.curHull;
	}
	
	function setHull(hull : float) {
		shipHea.curHull = hull;
	}
	
	function getShield() : float {
		return shipHea.curShield;
	}
	
	function setShield(shield : float) {
		shipHea.curShield = shield;
	}
	
	function getMaintenance() : int {
		var maint : IMaintainable = shipPrefab.GetComponent(typeof(IMaintainable)) as IMaintainable;
		return maint.getMaintenanceCost();
		
	}
	
	function getDilithium() : int {
		return dilithium;
	}
	
	function setDilithium(dilithium : int) {
		this.dilithium = dilithium;
	}
	
	function getPrefabName() : String {
		return shipPrefab.name;
	} 
	
	function setPrefab(prefab : GameObject) {
		shipPrefab = prefab;
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
			
			var up : Upgrades = ship.GetComponent(Upgrades);
			up.upgrades = shipInv.upgrades;
			
			up.resetActiveUpgrades();
			for(var active : GameObject in shipInv.actives) {
				up.setActiveUpgrade(active);
			}
			
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
		var up : Upgrades = ship.GetComponent(Upgrades);
		
		
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
		
		//get upgrades
		shipInv.upgrades = up.upgrades;
		shipInv.actives = new List.<GameObject>();
		var actives : List.<Active> = up.getActiveUpgradesList();
		for(var active : Active in actives) {
			var go : GameObject = active.getUpgrade();
			shipInv.actives.Add(go);
		}
		
		
		//get dilithium
		dilithium = shipFuel.getCurrentLoad();
		
		//now get load a prefab for this ship
		shipPrefab = Resources.Load(ship.name) as GameObject;
		
	}
	
	function Equals(ship : GameObject) {
		
		if(ship.tag != "Ship") return false;
		
		var props : shipProperties = ship.GetComponent(shipProperties);
		if(props.getNameWithNoPrefix() != shipInfo.Name) return false;
		
		var pprops : shipProperties = shipPrefab.GetComponent(shipProperties);
		if(props.getClass() != pprops.getClass()) return false;
		
		
		return true;
	
	}
	
	function Equals(ship : SaveShip) {
		
		if(this.shipInfo.Name != ship.shipInfo.Name) return false;
		
		if(this.shipPrefab != ship.shipPrefab) return false;
		
		return true;
		
	}

	
}

class Fleet extends System.Object{
	
	var ships : List.<SaveShip>;
	var formation : Formation = Formation.standard;
	
	function Fleet() {
		ships = new List.<SaveShip>();
		formation = formation.standard;
	}
	
	function Fleet(fleet : FleetData) {
		this();
		for(var ship : ShipData in fleet.fleet) {
			ships.Add(new SaveShip(ship));
		}
		formation = fleet.getFormation();
		
	}
	
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
	
	function setFormation(formation : Formation) {
		this.formation = formation;
		
		
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
	

	
	function getFleet() : List.<SaveShip> {
		return ships;
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

var lastSceneLoaded : String;

var rangeToAutoCommand : int = 50.0f;

static final var CLONE_NUM : int = 7; //number of chars in "(Clone)"

function Start() {
	show = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
//	start = GameObject.FindGameObjectWithTag("SceneStart").GetComponent.<SceneStart>();
	checkPlayerShip();
}

function Update() {
	changeFormation();
	
	if(Input.GetAxis("NearbyFleet")) {
		makeNearFleet();
	}
	
	
	checkPlayerShip();

}

function checkPlayerShip() {
	if(!playShip || !isPlayer(playShip)) {
		playShip = FindPlayerShip();
	}
}

function getPlayerShip() : GameObject {
	if(!playShip) {
		playShip = FindPlayerShip();
	}

	return playShip;
}

function setPlayer(ship : ShipData, fleet : FleetData) {
	playerShip = new SaveShip(ship);
	playerFleet = new Fleet(fleet);

}

function setPlayerShipName(name : String) {
	playerShip.setName(name);
}

function getPlayerShipName() : String {
	return playerShip.getName();
}

function getPlayerFleet() : List.<SaveShip> {
	return playerFleet.getFleet();
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

function Save(scene : String) {
	PlayerSave(); //first save the player ship
	SavePlayerFleet(); //then its fleet
	SaveScene(scene);
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
	playerFleet.setFormation(formation);
	for(var ship in fleet) {
		if(ship) {
			ship.GetComponent(ShipAI).formation = formation;
		}
	}

}

function takeShipCommand(ship : GameObject) {

	playerFleet.setShip(ship);
	var shipAi :  ShipAI = ship.GetComponent(ShipAI);
	shipAi.setLeader(getPlayerShip());
	shipAi.setFormation(playerFleet.formation);
	start.LoadNewSquadShip(ship);
}

function makeNearFleet() {
	
	//lets start by getting the player ship
	var player : GameObject = FindPlayerShip();

	//now by getting all ships nearby that are owned by the player
	var ships : GameObject[] = Statics.getNearbyOwnedShips(player.transform.position, rangeToAutoCommand, 0);
	
	//now lets set all ships to follow the player
	for(var ship : GameObject in ships) {
		takeShipCommand(ship);
	}


}

function SaveScene(scene : String) {
	lastSceneLoaded = scene;
}

function getLastScene() : String {
	return lastSceneLoaded;
}

function SetSceneStart(script : SceneStart) {
	this.start = script;
}

