//this script controls all planetary triggers...
#pragma strict

class trigger_props {
	
	var isOrbit : boolean = false;
	var isTurbulence : boolean = false;
	var isKill : boolean = false;

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
	
	if (hit.collider.gameObject.name == "turbolence_trigger" && triggerProps.isTurbulence == false)
	{
		triggerProps.isTurbulence = true;
	}
	
	if (hit.collider.gameObject.name == "kill_trigger" && triggerProps.isKill == false)
	{
		triggerProps.isKill = true;
	}

}

function OnTriggerExit (hit : Collider) {

	if (hit.collider.gameObject.name == "orbit_trigger" && triggerProps.isOrbit == true)
	{
		triggerProps.isOrbit = false;
	}
	
	if (hit.collider.gameObject.name == "turbolence_trigger" && triggerProps.isTurbulence == true)
	{
		triggerProps.isTurbulence = false;
	}

}