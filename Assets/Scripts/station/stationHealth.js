#pragma strict

class StationHealth {

	var maxHull : float;
	var curHull : float;
	var maxShield : float;
	var curShield : float;

}

var health : StationHealth; //this class contains the health info of the station
var shield : ShieldsShow; //this class helps control the shield effect
var regen : ShieldRegeneration; //this class helps control the shield regeneration
var shieldGO : GameObject; //this variable contains the shield game object
var explosion : GameObject; //this variable contains the explosion game object;
var statProps : stationProperties; 

function Start () {

	//get health properties from stationProperties component
	statProps : stationProperties = gameObject.GetComponent(stationProperties);
	health.maxHull = statProps.status.basicHull;
	health.curHull = health.maxHull;
	health.maxShield = statProps.status.basicShield;
	health.curShield = health.maxShield;
	

}

function Update () {

	//lets update health information here
	health.maxHull = statProps.status.basicHull;
	health.maxShield = statProps.status.basicShield;
	
	//lets check if station dies here
	if(health.curHull <= 0) {
		
		Instantiate(explosion, transform.position, transform.rotation);//first instanteate an explosion
		Destroy(gameObject); //then destroy the gameObject
	
	}
	
	//

}