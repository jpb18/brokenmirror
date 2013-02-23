#pragma strict

class ship_Health {

	var maxHealth : float;
	var health : float;
	var maxShields : float;
	var shields : float;

}

var shipHealth : ship_Health;
var properties : shipProperties;
var triggers : shipTriggers;
var explosion : GameObject;

function Start () {

	properties = gameObject.GetComponent(shipProperties);
	triggers = gameObject.GetComponent(shipTriggers);
	
	
	shipHealth.maxHealth = properties.shipHealth.basicHealth;
	shipHealth.health = shipHealth.maxHealth;
	shipHealth.maxShields = properties.shipHealth.basicShields;
	shipHealth.shields = shipHealth.maxShields;

}

function Update () {

	updateHealth();
	Triggers();
	Die();

}

function updateHealth () {

	shipHealth.maxHealth = properties.shipHealth.basicHealth;
	shipHealth.maxShields = properties.shipHealth.basicShields;

}

function Die () {

	if (shipHealth.health <= 0)
	{
		Instantiate(explosion, transform.position, transform.rotation);
		Destroy(gameObject);
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
