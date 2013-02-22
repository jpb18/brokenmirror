//this script is used to contain all properties of a ship, without any modification
#pragma strict

//create classes
//stores all player/ship properties
class ship_PlayerProps {
	var isPlayer : boolean = false;
	var inventory : GameObject[];

}

//this class is used to caracterize ship movement
class ship_MovementProps {
	var agility : float; //Standard Agility of the craft, soon to be controled through stored variables. In degrees per second.
	var impulseSpeed : float; //Standard Maximum Speed of the craft at sublight, soon to be controled through stored variables
	
}

//this contains the basic health status of the ship
class ship_HealthProps {
	var basicHealth : float;
	var basicShields : float;
}



//use classes
var playerProps : ship_PlayerProps;
var movement : ship_MovementProps;
var shipHealth : ship_HealthProps;