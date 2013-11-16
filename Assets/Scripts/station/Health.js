#pragma strict

var hull : float;
var maxHull : float;
var shield : float;
var maxShield : float;
var shieldDissipation : float;
var shieldRegeneration : float;

var shieldTime : float;
var shieldObject : GameObject;

var regenInterval : float;
var lastHit : float;

var explosion : GameObject;


/**
* @pre maxHull > 0, maxShield > 0
*/
function Start () {
	hull = maxHull;
	shield = maxShield;
}

//checks if there's shield
function hasShield() : boolean {
	return shield > 0;
}

//check if there's hull
function hasHull() : boolean {
	return hull > 0;
}

//Damages the ship
function getDamage(damage : float, isEnergy : boolean) {

	if(hasShield()) {
		getShieldDamage(damage, isEnergy);
	} else {
		getHullDamage(damage);
	}
	
	lastHit = Time.time;
	
}

//this method reduces shield integrity
//@pre hasShield == true
private function getShieldDamage(damage : float, isEnergy : boolean) {
	
	if(isEnergy) {
		damage -= shieldDissipation;
	}
	
	if(shield >= damage) {
		shield -= damage;
	} else {
		shield = 0;
	}
	
	StartCoroutine(lightShield());
	
}

//this method reduces hull integrity
//@pre hasHull == true, hasShield == false
private function getHullDamage(damage  : float) {
	hull -= damage;

}

//this method lights up the shield
//@pre hasShield == true
private function lightShield() {
	var i : float = 0;
	
	
	while(i < shieldTime) {
		var remTime : float = shieldTime - i;	
		
		var alpha : float = (1 * remTime)/shieldTime;
		shieldObject.renderer.material.color.a = alpha;
		
		i += Time.deltaTime;
		
		yield;
	}
	
	
}

//this method checks if the shield can regen
function canRegen() : boolean {
	
	return (lastHit + regenInterval <= Time.time && shield <= maxShield);
	
}

//this method regenerates the shield
//@pre canRegen == true
function shieldRegen() {
	
	shield += shieldRegeneration * Time.deltaTime;
	
}

//this method kills the station
//pre object == gameObject, hasHull() == false
function die(object : GameObject) {

	Instantiate(explosion, object.transform.position, object.transform.rotation);
	Destroy(object);


}