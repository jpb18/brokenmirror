//this script controls all planetary triggers...
#pragma strict

class trigger_props {
	
	var isOrbit : boolean = false;
	var isTurbulence : boolean = false;
	var isKill : boolean = false;

}

var triggerProps : trigger_props;
var properties : shipProperties;
var reentryParticles : GameObject;

function Start () {

	properties = gameObject.GetComponent(shipProperties);
	reentryParticles = GameObject.Find("ParticleSystems/reentry_particles");
	reentryParticles.particleSystem.Play();
	reentryParticles.particleSystem.enableEmission = false;
	
	

}

function Update () {
	reentry();
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

function OnCollisionEnter(hit : Collision) {
	if(hit.transform.tag == "Planet")
	{
		triggerProps.isKill = true;
	}

}

function reentry() {

	
	if(triggerProps.isTurbulence)
	{
		reentryParticles.particleSystem.enableEmission = true;
				
	}
	else
	{
		reentryParticles.particleSystem.enableEmission = false;
	}


}