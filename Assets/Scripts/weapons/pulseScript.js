#pragma strict

var range : float;
var speed : float;
var shieldDmg : float;
var hullDmg : float;
var target : GameObject;
var launchTime : float;
var origin : GameObject;
var cooldown : float;
var volleys : int;
var timeInt : float;

var effect : effects;

function Start () {
	//sets the launch time
	launchTime = Time.time;
	//always make the pulse look at the targets general direction
	transform.LookAt(target.transform);
	//give it speed
	transform.rigidbody.velocity = transform.forward * speed * Time.deltaTime;	

}

function FixedUpdate () {
	calc_range();
}

function CheckPUTargetAndOrigin() {
	if(!target || !origin)
	{
		Destroy(gameObject);
		
	}
	

}

function calc_range() {
	var timePassed : float = Time.time - launchTime;
	var distanceCrossed : float = timePassed * speed * Time.deltaTime;
	
	if (distanceCrossed >= range)
	{
		Destroy(gameObject);
	}
	

}

function OnTriggerEnter(hit : Collider) {

	//check if it's a shield trigger
	if(hit.tag == "Shields" && effect.hasExploded == false)
	{
		var hitGO : GameObject = hit.transform.parent.parent.transform.gameObject;
		Debug.Log(hitGO.name + " != " + origin.name);
		if(hitGO != origin)
		{
			if (hitGO.tag == "Ship")
			{
				//get red alert status
				var isRedAlert : boolean = hitGO.GetComponent(shipProperties).combatStatus.isRedAlert;
				
				if(isRedAlert)
				{
					var hitHS : shipHealth = hitGO.GetComponent(shipHealth);
					var shields = hitHS.shipHealth.shields;
					if(shields > 0)
					{
						effect.hasExploded = true;
						if(shields >= shieldDmg)
						{
							hitHS.shipHealth.shields -= shieldDmg;
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
			hitHS.shipHealth.health -= hullDmg;
			hitHS.shieldRegen.lastHit = Time.time;
			Instantiate(effect.explosion, transform.position, transform.rotation);
			Destroy(gameObject);
		}
			
	}

}