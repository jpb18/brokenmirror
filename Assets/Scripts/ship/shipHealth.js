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

var shipHealth : ship_Health;
var shieldShow : ShieldsShow;
var properties : shipProperties;
var triggers : shipTriggers;
var explosion : GameObject;
var smokeTrails : GameObject[];
var plasmaParticles : GameObject[];
var shipModel : GameObject[];
var shield : GameObject;


function Start () {

	//get other scripts
	properties = gameObject.GetComponent(shipProperties);
	triggers = gameObject.GetComponent(shipTriggers);
	
	//get health stats
	shipHealth.maxHealth = properties.shipHealth.basicHealth;
	shipHealth.health = shipHealth.maxHealth;
	
	/*this is commented, because it's now being done at hand, because, somehow, it's not working properly
	//get smoke trails
	var smokeGroup : Transform = gameObject.Find("trail_renderers/smoke_trails").transform;
	var trails = new Array();
	for (var trail : Transform in smokeGroup)
	{
		if(trail.parent.parent.parent.gameObject == gameObject)
		{
			trail.gameObject.GetComponent(TrailRenderer).enabled = false;
			trails.Add(trail.gameObject);
		}
	}
	
	
	smokeTrails = trails.ToBuiltin(GameObject);
	
	//Get plasma leaks
	var plasmas = new Array();
	var plasmaGroup : Transform = gameObject.Find("/ParticleSystems/PlasmaParticles").transform;
	
	for (var plasma : Transform in plasmaGroup)
	{
		if(plasma.parent.parent.parent.gameObject == gameObject)
		{
			plasmas.Add(plasma.gameObject);
			plasma.gameObject.particleSystem.enableEmission = false;
		}
	}
	plasmaParticles = plasmas.ToBuiltin(GameObject);

	*/

}

function Update () {

	updateHealth();
	Triggers();
	Die();
	Trails();
	PlasmaLeak();
	ShieldShow();

}

function updateHealth () {

	shipHealth.maxHealth = properties.shipHealth.basicHealth;
	

}

function Die () {

	if (shipHealth.health <= 0)
	{
		
		for (var go : GameObject in shipModel)
		{
			go.transform.parent = null;
			go.AddComponent(Rigidbody);
		}
		
		Destroy(gameObject);
		
		
		
		Instantiate(explosion, transform.position, transform.rotation);
		
		
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
			plasma.particleSystem.enableEmission = true;
			plasma.particleSystem.Play();
			
		}
	}
	else
	{
		for (var plasma : GameObject in plasmaParticles)
		{
			plasma.particleSystem.enableEmission = false;
			plasma.particleSystem.Stop();
			
		}
	}

}

function ShieldShow () {
	
	if (Time.time <= shieldShow.lastHit + shieldShow.showDur && shield.renderer.enabled == true && shieldShow.lastHit != 0)
	{
		var totTime : float = shieldShow.showDur + shieldShow.lastHit;
		var remTime : float = totTime - Time.time;
		
		Debug.Log(remTime.ToString());
		
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