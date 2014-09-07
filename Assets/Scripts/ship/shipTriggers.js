
//this script controls all planetary triggers...
#pragma strict

class trigger_props {
	
	var isOrbit : boolean = false;
	var isTurbulence : boolean = false;
	private var lastTurbulence : boolean = false;
	var isKill : boolean = false;
	
	function setOrbit(orbit : boolean) {
		isOrbit = orbit;
	}
	
	function setTurbulence(turbulence : boolean) {
		isTurbulence = turbulence;
	}
	
	function setKill(kill : boolean) {
		isKill = kill;
	}
	
	function hasTurbulenceChanged() : boolean {
		var change : boolean = this.lastTurbulence != this.isTurbulence;
		lastTurbulence = isTurbulence;
		return change;
	}
	

}

var triggerProps : trigger_props;
var properties : shipProperties;
var reentryParticles : GameObject;
var message : ShowMessage;

public static var IN_ORBIT : String = "Entering planetary orbit.";
public static var OUT_ORBIT : String = "Leaving planetary orbit.";

function Start () {
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	properties = gameObject.GetComponent(shipProperties);
	reentryParticles = getReentryParticles();
	if(reentryParticles) {
		reentryParticles.particleSystem.Play();
		reentryParticles.particleSystem.enableEmission = false;
	}
	

}


function Update () {
	reentry();
}

function OnTriggerEnter(hit : Collider) {
	
	if (hit.collider.gameObject.name == "orbit_trigger" && triggerProps.isOrbit == false)
	{
		triggerProps.setOrbit(true);
		if(properties.getPlayer()) {
			message.AddMessage(IN_ORBIT);
		}
	}
	
	if (hit.collider.gameObject.name == "turbolence_trigger" && triggerProps.isTurbulence == false)
	{
		triggerProps.setTurbulence(true);
	}
	
	if (hit.collider.gameObject.name == "kill_trigger" && triggerProps.isKill == false)
	{
		triggerProps.setKill(true);
	}

}

function OnTriggerExit (hit : Collider) {

	if (hit.collider.gameObject.name == "orbit_trigger" && triggerProps.isOrbit == true)
	{
		triggerProps.setOrbit(false);
		if(properties.getPlayer()) {
			message.AddMessage(OUT_ORBIT);
		}
	}
	
	if (hit.collider.gameObject.name == "turbolence_trigger" && triggerProps.isTurbulence == true)
	{
		triggerProps.setTurbulence(false);
	}

}

function OnCollisionEnter(hit : Collision) {
	if(hit.transform.tag == "Planet")
	{
		triggerProps.setKill(true);
	}

}

function reentry() {

	if(reentryParticles) {
		if(triggerProps.isTurbulence)
		{
			reentryParticles.particleSystem.enableEmission = true;
					
		}
		else
		{
			reentryParticles.particleSystem.enableEmission = false;
		}
	}


}

function isOrbit() : boolean {
	
	return triggerProps.isOrbit;

}

function getReentryParticles () : GameObject {
	var particles : GameObject[] = GameObject.FindGameObjectsWithTag("reentry");
	var particle : GameObject;
	
	for(var part : GameObject in particles) {
		if(part.transform.parent.parent.gameObject == gameObject) {
			particle = part;
		}
	
	}
	
	return particle;

}

function hasTurbulenceChanged() : boolean {
	return triggerProps.hasTurbulenceChanged();
}

function isTurbulence() : boolean {
	return triggerProps.isTurbulence;
}