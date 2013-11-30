#pragma strict

class ship_Health {

	var maxHealth : float;
	var health : float;
	var maxShields : float;
	var shields : float;

}

class ShieldsShow {
	var lastHit : float;
	var showDur : float = 1.0f;
}

class ShieldRegeneration {
	var isRegen : boolean = false; //checks if the ships shields can regenerate
	var lastHit : float; //checks last hit by a weapon
	var timeInt : float; //contains time interval from last hit before the shield start regenerating
	var regenRate : float; //contains the regeneration rate

}

var shipHealth : ship_Health;
var shieldShow : ShieldsShow;
var shieldRegen : ShieldRegeneration;
var properties : shipProperties;
var triggers : shipTriggers;
var explosion : GameObject;
var smokeTrails : GameObject[];
var plasmaParticles : GameObject[];
var shield : GameObject;


function Start () {

	//get other scripts
	properties = gameObject.GetComponent(shipProperties);
	triggers = gameObject.GetComponent(shipTriggers);
	
	//get health stats
	shipHealth.maxHealth = properties.shipHealth.basicHealth;
	shipHealth.health = shipHealth.maxHealth;
	
	//get shield stats
	shipHealth.maxShields = properties.shipHealth.basicShield;
	shipHealth.shields = shipHealth.maxShields;
	
	
	//get smoke trails
	
	smokeTrails = gameObject.FindGameObjectsWithTag("Smoke");
	
	for(var smoke : GameObject in smokeTrails)
	{
		smoke.GetComponent(TrailRenderer).enabled = false;
	
	}
	
	//get plasma particles
	plasmaParticles = gameObject.FindGameObjectsWithTag("plasma");
	
	for(var plasma : GameObject in plasmaParticles)
	{
		
		plasma.particleSystem.Stop();
	}
	

}

function Update () {

	updateHealth();
	Triggers();
	Die();
	Trails();
	PlasmaLeak();
	ShieldShow();
	shield_regen();

}

//this function controls a ship shield regeneration
function shield_regen() {
	//checks if the time interval has passed and the shield is able of regenerating
	if (shieldRegen.lastHit + shieldRegen.timeInt <= Time.time && shieldRegen.isRegen == true && shipHealth.shields < shipHealth.maxShields)
	{
	
		shipHealth.shields += shieldRegen.regenRate * Time.deltaTime; //adds shield
	
	}

}

function updateHealth () {

	shipHealth.maxHealth = properties.shipHealth.basicHealth;
	

}

function Die () {

	if (shipHealth.health <= 0)
	{
		Instantiate(explosion, transform.position, transform.rotation);
		gameObject.SetActive(false);
		
		
	}
	

}

function Triggers () {
	var isKill : boolean = triggers.triggerProps.isKill;
	
	if (isKill)
	{
		shipHealth.shields = 0;
		shipHealth.health = 0;
	}
	

}

function Trails () {
	var isTurbulence : boolean = triggers.triggerProps.isTurbulence;
	
	if (isTurbulence || shipHealth.health <= shipHealth.maxHealth * 0.5)
	{
		for (var trail : GameObject in smokeTrails)
		{
			
			var rend : TrailRenderer = trail.GetComponent(TrailRenderer);
			rend.enabled = true;			
			
		}
	}
	else
	{
		for (var trail : GameObject in smokeTrails)
		{
			var rend1 : TrailRenderer = trail.GetComponent(TrailRenderer);
			rend1.enabled = false;			
			
		}
	}



}

function PlasmaLeak() {
	if (shipHealth.health <= shipHealth.maxHealth * 0.15)
	{
		for (var plasma : GameObject in plasmaParticles)
		{
			
			plasma.particleSystem.Play();
			
		}
	}
	else
	{
		for (var plasma : GameObject in plasmaParticles)
		{
			
			plasma.particleSystem.Stop();
			plasma.particleSystem.Clear();
			
		}
	}

}

function ShieldShow () {
	
	if (Time.time <= shieldShow.lastHit + shieldShow.showDur && shield.renderer.enabled == true && shieldShow.lastHit != 0)
	{
		var totTime : float = shieldShow.showDur + shieldShow.lastHit;
		var remTime : float = totTime - Time.time;
		
		
		
		var alpha : float = (1 * remTime)/shieldShow.showDur;
		
		shield.renderer.material.color.a = alpha;
		
		
	
	}
	else
	{
		shield.renderer.material.color.a = 0;
	}

}

function OnDestroy () {
	
	gameObject.SetActive(false);
 
} 

