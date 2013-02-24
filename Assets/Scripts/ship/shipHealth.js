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
var smokeTrails : GameObject[];


function Start () {

	//get other scripts
	properties = gameObject.GetComponent(shipProperties);
	triggers = gameObject.GetComponent(shipTriggers);
	
	//get health stats
	shipHealth.maxHealth = properties.shipHealth.basicHealth;
	shipHealth.health = shipHealth.maxHealth;
	shipHealth.maxShields = properties.shipHealth.basicShields;
	shipHealth.shields = shipHealth.maxShields;
	
	//get smoke trails
	var smokeGroup : Transform = gameObject.Find("trail_renderers/smoke_trails").transform;
	var trails = new Array();
	for (var trail : Transform in smokeGroup)
	{
	
		trails.Add(trail.gameObject);
	
	}
	
	
	smokeTrails = trails.ToBuiltin(GameObject);

	

}

function Update () {

	updateHealth();
	Triggers();
	Die();
	Trails();

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

function Trails () {
	var isTurbulence : boolean = triggers.triggerProps.isTurbulence;
	
	if (isTurbulence || shipHealth.health <= shipHealth.maxHealth/10)
	{
		for (var trail : GameObject in smokeTrails)
		{
			var rend : TrailRenderer = trail.GetComponent(TrailRenderer);
			rend.renderer.enabled = true;			
			
		}
	}
	else
	{
		for (var trail : GameObject in smokeTrails)
		{
			var rend1 : TrailRenderer = trail.GetComponent(TrailRenderer);
			rend1.renderer.enabled = false;			
			
		}
	}



}