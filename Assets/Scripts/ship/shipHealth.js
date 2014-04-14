import System.Collections.Generic;
#pragma strict

class ship_Health {

	var maxHealth : float;
	var health : float;
	var maxShields : float;
	var shields : float;
	
	function hasShield() : boolean {
		return shields > 0;	
	}
	
	//pre hasShield()
	function shieldDamage(damage : float) {
		shields -= damage;	
	}
	
	function hullDamage(damage : float) {
		health -= damage;
	}

}

class ShieldsShow {
	var lastHit : float;
	var showDur : float = 1.0f;
	
	function setHit() {
		lastHit = Time.time;
	}
	
}

class ShieldRegeneration {
	var isRegen : boolean = false; //checks if the ships shields can regenerate
	var lastHit : float; //checks last hit by a weapon
	var timeInt : float; //contains time interval from last hit before the shield start regenerating
	var regenRate : float; //contains the regeneration rate

}

var shipHealth : ship_Health;
var escape : shipEscapePods;
var shieldShow : ShieldsShow;
var shieldRegen : ShieldRegeneration;
var properties : shipProperties;
var triggers : shipTriggers;
var explosion : GameObject;
var smokeTrails : List.<GameObject>;
var plasmaParticles : List.<GameObject>;
var shield : GameObject;


function Start () {

	//get other scripts
	properties = gameObject.GetComponent(shipProperties);
	triggers = gameObject.GetComponent(shipTriggers);
	
	//get health stats
	shipHealth.maxHealth = properties.ShipHealth.basicHealth;
	shipHealth.health = shipHealth.maxHealth;
	
	//get shield stats
	shipHealth.maxShields = properties.ShipHealth.basicShield;
	shipHealth.shields = shipHealth.maxShields;
	
	
	//get smoke trails 
	var smokeGOs : GameObject[] = GameObject.FindGameObjectsWithTag("Smoke");
	for(var smoke : GameObject in smokeGOs) {
		if(smoke.transform.parent.parent.parent.gameObject == gameObject) {
			smokeTrails.Add(smoke);
		}
	}
	//and plasma particles
	var plasmaGOs : GameObject[] = GameObject.FindGameObjectsWithTag("plasma");
	for(var plasma : GameObject in plasmaGOs) {
		if(plasma.transform.parent.parent.parent.gameObject == gameObject) {
			plasmaParticles.Add(plasma);
		}
	}
	
	//get escape pod script
	escape = gameObject.GetComponent(shipEscapePods);
	

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

	shipHealth.maxHealth = properties.ShipHealth.basicHealth;
	

}

function Die () {

	if (shipHealth.health <= 0)
	{
		instantiatePods();
		Instantiate(explosion, transform.position, transform.rotation);
		Destroy(gameObject);
		
		
	}
	

}

function instantiatePods() {
	var isPlayer : boolean = properties.getPlayer();
	if(!escape.isEscapePod()) {
		while(escape.hasEscapePod()) {
			var pos : Vector3 = calculatePosition(transform.position, 1.0f);
			var obj : GameObject = escape.instantiateEscapePod(pos, Random.rotation);
			if(isPlayer) {
				obj.GetComponent(shipProperties).setPlayer(isPlayer);
				Camera.main.GetComponent(MouseOrbit).target = obj.transform;
				isPlayer = false;
			}
		}
	}

}

function calculatePosition(position : Vector3, drift : float) : Vector3{

	var v : Vector3 = Random.insideUnitSphere;
	
	for(var i : int = 0;  i < 3; i++) {
		v[i] = v[i] * drift;
	}
	
	return v + position;

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

function isShieldUp() : boolean {

	return shipHealth.hasShield() && properties.getRedAlert();
}

//pre: isShieldUp()
function damageShield(damage : float) {
	shipHealth.shieldDamage(damage);
	shieldShow.setHit();

}

//pre: !isShieldUp()
function damageHull(damage : float) {
	shipHealth.hullDamage(damage);

}

function showShields() {
	shieldShow.setHit();

}

//note: there're more conditions to be checked
function setDamage(damage : float) {
	//get red alert status
	var ra : boolean = properties.getRedAlert();

	if(shipHealth.shields - damage > 0 && ra) {
		shipHealth.shields -= damage;
		shieldShow.setHit();
	} else if (shipHealth.shields > 0 && ra) {
		shipHealth.shields = 0;
		shieldShow.setHit();
	} else {
		shipHealth.health -= damage;
	}
}