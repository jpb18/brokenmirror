#pragma strict

class SaveShip {

	class ShipInfo { //general ship info
		var Name : String;
		var Faction : int;
		var isPlayer : boolean;
		var isRedAlert : boolean;
	
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
	var shipHealth : ShipHealth;
	var shipInv : ShipInventory;
	
	
}

var playerShip : SaveShip; //player ship info


function Save() {
	PlayerSave(); //first save the player ship
}

function PlayerSave() {

	var playShip : GameObject  = FindPlayerShip(); //first get the player GameObject
	
	//now lets fill the information
	//first get the scripts
	var shipProps : shipProperties = playShip.GetComponent(shipProperties);
	var shipHea : shipHealth = playShip.GetComponent(shipHealth);
	var shipWea : shipWeapons = playShip.GetComponent(shipWeapons);
	
	//now fill the ship info part
	playerShip.shipInfo.Name =  shipProps.shipInfo.shipName;
	playerShip.shipInfo.Faction = shipProps.shipInfo.faction;
	playerShip.shipInfo.isPlayer = true;
	playerShip.shipInfo.isRedAlert = shipProps.combatStatus.isRedAlert;
	
	//now fill the ship health part
	playerShip.shipHealth.curHull = shipHea.shipHealth.health;
	playerShip.shipHealth.curShield = shipHea.shipHealth.shields;
	
	//and now the inventory part
	//first get the weapon game objects of each weaponslot
	var Arr : Array = new Array();
	
	for(var x : int = 0; x < shipWea.weapon.Length; x++) 
	{
		Arr.Push(shipWea.weapon[x].weapon_go);
	}
	
	var newWeapons : GameObject[] = Arr.ToBuiltin(GameObject) as GameObject[];
	//now place it
	playerShip.shipInv.weapons = newWeapons;
	
	//now get load a prefab for this ship
	playerShip.shipPrefab = Resources.Load(playShip.name);
	  

}

static function FindPlayerShip() : GameObject {

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

