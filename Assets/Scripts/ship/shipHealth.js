#pragma strict

class ship_Health {

	var maxHealth : float;
	var health : float;
	var maxShields : float;
	var shields : float;

}

var shipHealth : ship_Health;
var properties : shipProperties;
var explosion : GameObject;

function Start () {

	properties = gameObject.GetComponent(shipProperties);
	
	shipHealth.maxHealth = properties.shipHealth.basicHealth;
	shipHealth.health = shipHealth.maxHealth;
	shipHealth.maxShields = properties.shipHealth.basicShields;
	shipHealth.shields = shipHealth.maxShields;

}

function Update () {

	updateHealth();
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

