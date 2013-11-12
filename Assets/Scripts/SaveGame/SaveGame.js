#pragma strict

class SaveShip {

	class ShipInfo { //general ship info
		var Name : String;
		var Faction : int;
		var isPlayer : boolean;
		var isRedAlert : boolean;
		var strenght : int;
	
	}
	
	class ShipHealth { //ship health information
		var curHull : float;
		var curShield : float;
	
	}

	class ShipInventory { //ship inventory information
		var weapons : GameObject[];
		var upgrades : GameObject[];
	}
	
	
	var shipPrefab : GameObject;
	var shipInfo : ShipInfo;
	var shipHea : ShipHealth;
	var shipInv : ShipInventory;
	
	
	
	//this function returns the ship stored here
	function getShip() : GameObject {
		var ship : GameObject = shipPrefab;
			
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
		
		//get ship weapons
		var shipWeap : shipWeapons = ship.GetComponent(shipWeapons);
		var weapons : GameObject[] = shipInv.weapons;
		for(var x : int = 0; x < weapons.Length; x++) {
			
			shipWeap.weapon[x].weapon_go = weapons[x];
			
		}
		
		return ship;
	
	}
	
	//this function stores the ship here
	function setShip(ship : GameObject) {
	
		//now lets fill the information
		//first get the scripts
		var shipProps : shipProperties = ship.GetComponent(shipProperties);
		var shipHeal : shipHealth = ship.GetComponent(shipHealth);
		var shipWea : shipWeapons = ship.GetComponent(shipWeapons);
		
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
		var Arr : Array = new Array();
		
		for(var x : int = 0; x < shipWea.weapon.Length; x++) 
		{
			Arr.Push(shipWea.weapon[x].weapon_go);
		}
		
		var newWeapons : GameObject[] = Arr.ToBuiltin(GameObject) as GameObject[];
		//now place it
		shipInv.weapons = newWeapons;
		
		//now get load a prefab for this ship
		shipPrefab = Resources.Load(ship.name);
		
	}
	
	
	
}

var playerShip : SaveShip; //player ship info




static final var CLONE_NUM : int = 7; //number of chars in "(Clone)"


function Save() {
	PlayerSave(); //first save the player ship
}

function PlayerSave() {

	var playShip : GameObject  = FindPlayerShip(); //first get the player GameObject
	playerShip.setShip(playShip);
	  

}

public static function FindPlayerShip() : GameObject {

	var allShips : GameObject[] = GameObject.FindGameObjectsWithTag("Ship"); //Find all ships
	var playerShip : GameObject; //set the return variable
	
	for (var ship : GameObject in allShips) { //loop through all ships in search of the player ship
		
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
