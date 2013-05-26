#pragma strict

class stats {
	var speed : float; //torpedo speed
	var hullDmg : float; //torpedo damage vs hull
	var shieldDmg : float; //torpedo damage vs shield
	var range : float; //torpedo range
	var cost : float; //torpedo "normal" cost, to be used in GUI only
	var cooldown : float; // torpedo cooldown
	var spread : int; //number of torpedoes fired in a spread
	var spreadTime : float = 1.5f;
}

class effects {
	var explosion : GameObject; //the explosion Game Object
	var hasExploded : boolean = false; //checks if the torpedo has already detonated

}

var status : stats;
var effect : effects;
var target : GameObject; //target ship
var origin : GameObject; //origin ship
var launched : float; //launch time
var isSpread : boolean = false; //checks if the torpedo is already a spread

function Start () {
	rigidbody.velocity = status.speed * transform.forward * Time.deltaTime;
	launched = Time.time;
}

function Update () {
	
	calc_range();
	HomeIn();
	Spread();
	

}

function calc_range() {
	var time_passed : int = Time.time - launched;
	var distance_made : int = time_passed * status.speed;
	
	if (distance_made >= status.range)
	{
		Destroy(gameObject);
	}

}

function HomeIn() {
	rigidbody.velocity = status.speed * transform.forward * Time.deltaTime;
	transform.LookAt(target.transform);

}

function Spread() {
	if (status.spread > 1 && Time.time - launched >= status.spreadTime && isSpread == false )
	{
		for (var x : int = 0; x <= status.spread - 1; x++)
		{
			var displacement : Vector3 = Vector3(Random.Range(-0.1,0.1),Random.Range(-0.1,0.1),Random.Range(-0.1,0.1));
			var torpedo : GameObject = Instantiate(gameObject, transform.position + displacement, transform.rotation);
			var ts : torpedoScript = torpedo.GetComponent(torpedoScript);
	
			ts.target = target;
			ts.origin = origin;
			ts.isSpread = true;
		}
		
		Destroy(gameObject);
	
	}
	

}

function OnTriggerEnter(hit : Collider) {

	//check if it's a shield trigger
	if(hit.tag == "Shields" && effect.hasExploded == false)
	{
		var hitGO : GameObject = hit.transform.parent.parent.transform.gameObject;
		if(hitGO != origin)
		{
			var hitHS : shipHealth = hitGO.GetComponent(shipHealth);
			var shields = hitHS.shipHealth.shields;
			if(shields > 0)
			{
				effect.hasExploded = true;
				if(shields >= status.shieldDmg)
				{
					hitHS.shipHealth.shields -= status.shieldDmg;
				}
				else
				{
					hitHS.shipHealth.shields = 0;
				}
			
			
				Instantiate(effect.explosion, transform.position, transform.rotation);
				Destroy(gameObject);
			}
			
		}
	
	
	}



}

function OnCollisionEnter(hit: Collision) {

	if(hit.transform.gameObject != origin && !effect.hasExploded)
	{
		effect.hasExploded = true;
		var hitHS : shipHealth = hit.gameObject.GetComponent(shipHealth);
		hitHS.shipHealth.health -= status.hullDmg;
		Instantiate(effect.explosion, transform.position, transform.rotation);
		Destroy(gameObject);
			
	}

}