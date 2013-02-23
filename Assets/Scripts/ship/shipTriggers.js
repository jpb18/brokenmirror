//this script controls all planetary triggers...
#pragma strict

class trigger_props {
	
	var isOrbit : boolean = false;

}

var triggerProps : trigger_props;
var properties : shipProperties;

function Start () {

	properties = gameObject.GetComponent(shipProperties);

}

function Update () {

}

function OnTriggerEnter(hit : Collider) {
	
	if (hit.collider.gameObject.name == "orbit_trigger" && triggerProps.isOrbit == false)
	{
		triggerProps.isOrbit = true;
	}

}

function OnTriggerExit (hit : Collider) {

	if (hit.collider.gameObject.name == "orbit_trigger" && triggerProps.isOrbit == true)
	{
		triggerProps.isOrbit = false;
	}

}