//this script is used to contain all properties of a ship, without any modification
#pragma strict

//create classes
//stores all player/ship properties
class ShipPlayerProps {
	var isPlayer : boolean = false;
	var inventory : GameObject[];
	
	
}

//this class is used to caracterize ship movement
class ShipMovementProps {
	var agility : float; //Standard Agility of the craft, soon to be controled through stored variables. In degrees per second.
	var impulseSpeed : float; //Standard Maximum Speed of the craft at sublight, soon to be controled through stored variables
}

//this contains the basic health status of the ship
class ShipHealthProps {
	var basicHealth : float;
	var armor : float = 0.0f;
}

class ShipProps {
	var shipStrenght : float; //this var contains the ship strenght... Used in AI, and calculating fleet and planet strenght
}

class ShipModifiers {
	var reloadSpeed : float;
}

class ShipInfo {
	var faction : int;
	var hostileFactions : int[];
	var alliedFactions : int[];

}

//use classes
var playerProps : ShipPlayerProps;
var movement : ShipMovementProps;
var shipHealth : ShipHealthProps;
var shipProps : ShipProps;
var shipModifiers : ShipModifiers;
var shipInfo : ShipInfo;