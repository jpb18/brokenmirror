#pragma strict

class stats {
	var speed : float; //torpedo speed
	var hullDmg : float; //torpedo damage vs hull
	var shieldDmg : float; //torpedo damage vs shield
	var range : float; //torpedo range
	var cost : float; //torpedo "normal" cost, to be used in GUI only
	var cooldown : float; // torpedo cooldown
	var spread : int; //number of torpedoes fired in a spread
}

var status : stats;
var target : GameObject; //target ship
var origin : GameObject; //origin ship
var launched : float; //launch time
var isSpread : boolean = false; //checks if the torpedo is already a spread

function Start () {
	rigidbody.velocity = status.speed * transform.forward;
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
	
	transform.LookAt(target.transform);

}

function Spread() {
	if (status.spread > 1 && Time.time - launched >= 0.5f && isSpread == false )
	{
		for (var x : int = 0; x <= status.spread - 1; x++)
		{
			var displacement : Vector3 = Vector3(Random.Range(-0.1,0.1),Random.Range(-0.1,0.1),Random.Range(-0.1,0.1));
			var torpedo : GameObject = Instantiate(gameObject, transform.position + displacement, transform.rotation);
			var ts : TorpedoScript = torpedo.GetComponent(TorpedoScript);
	
			ts.target = target;
			ts.origin = origin;
			ts.isSpread = true;
		}
		
		Destroy(gameObject);
	
	}
	

}

Function OnTriggerEnter() {

	



}