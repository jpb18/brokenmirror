#pragma strict

class stats {
	var speed : float; //torpedo speed
	var hullDmg : float; //torpedo damage vs hull
	var shieldDmg : float; //torpedo damage vs shield
	var range : float; //torpedo range
	var cost : float; //torpedo "normal" cost, to be used in GUI only
	var cooldown : float; // torpedo cooldown
	
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
	if(target)
	{	
		transform.LookAt(target.transform);
	}

	rigidbody.velocity = status.speed * transform.forward * Time.deltaTime;
	launched = Time.time;
}

function FixedUpdate () {
	
	calc_range();
	HomeIn();
	CheckTTargetAndOrigin();
	

}

function CheckTTargetAndOrigin () {
	if(!target || !origin)
	{
		Destroy(gameObject);
	}

}


function calc_range() {
	var time_passed : int = Time.time - launched;
	var distance_made : int = time_passed * status.speed * Time.deltaTime;
	
	if (distance_made >= status.range)
	{
		Destroy(gameObject);
	}

}

function HomeIn() {
	rigidbody.velocity = status.speed * transform.forward * Time.deltaTime;
	

}





function OnTriggerEnter(hit : Collider) {

	//check if it's a shield trigger
	if(hit.tag == "Shields" && effect.hasExploded == false)
	{
		var hitGO : GameObject = hit.transform.parent.parent.transform.gameObject;
		if(hitGO != origin)
		{
			if (hitGO.tag == "Ship")
			{
				//get red alert status
				var isRedAlert : boolean = hitGO.GetComponent(shipProperties).combatStatus.isRedAlert;
				
				if(isRedAlert) {
					
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
					
						hitHS.shieldShow.lastHit = Time.time;
						hitHS.shieldRegen.lastHit = Time.time;
						Instantiate(effect.explosion, transform.position, transform.rotation);
						Destroy(gameObject);
					}
				}
			}
		}
	
	
	}



}




function OnCollisionEnter (hit: Collision) {

	
	if(hit.transform.gameObject != origin && effect.hasExploded == false)
	{
		
		if(hit.transform.tag == "Ship")
		{
			effect.hasExploded = true;
			var hitHS : shipHealth = hit.gameObject.GetComponent(shipHealth);
			hitHS.shipHealth.health -= status.hullDmg;
			hitHS.shieldRegen.lastHit = Time.time;
			Instantiate(effect.explosion, transform.position, transform.rotation);
			Destroy(gameObject);
		}
		else if(hit.transform.tag == "Torpedoes")
		{
			Destroy(gameObject);
		}
			
	}

}

//this method set the target
//pre: target != null
function setTarget(target : GameObject) {
	this.target = target;
}
//this method sets the origin
//pre origin != null
function setOrigin(origin : GameObject) {
	this.origin = origin.transform.parent.parent.parent.gameObject;
}