//this script is used to contain all properties of a ship
#pragma strict

//create classes
//stores all player/ship properties
class ship_PlayerProps {
	var isPlayer : boolean = false;

}

//this class is used to caracterize ship movement
class ship_Movement {
	var agility : float; //Agility of the craft, soon to be controled through stored variables. In degrees per second.
	var speed : float; //Maximum Speed of the craft, soon to be controled through stored variables
	
}



//use classes
var playerProps : ship_PlayerProps;
var movement : ship_Movement;