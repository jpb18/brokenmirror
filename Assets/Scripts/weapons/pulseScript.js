//this script controls the trajectory and impact of every pulse projectile
#pragma strict

var launched : Transform; //ship from where the pulse has been launched
var damage : float; //pulse damage
var speed : float; //pulse speed
var shieldMulti : float; //multiplies the damage against shields
var hullMulti : float; //multiplies de damage against hull
var explosion : Transform; //pulse impact explosion
var shieldImp : Transform; //pulse impact against shield
var hasHit : boolean = false; //checks if the target has been hit
var maxLife : float = 5.0f; //checks the maximum life of a pulse
var timeLimit : float;

function Start () {
	rigidbody.velocity = speed * transform.forward;
	timeLimit = Time.time + maxLife;

}

function FixedUpdate() {
	if (Time.time > timeLimit)
	{
		Destroy(gameObject);
	}

}

//Collision with hull
function OnCollisionEnter (hit : Collision) {
	if(hasHit == false)
	{
		
		if (hit.transform != launched.transform)
		{
		
			
			if(hit.transform.tag == "Ship")
			{
			
				var script : playerShip = hit.gameObject.GetComponent(playerShip);
				
				if (script.shields <= 0 || script.isRedAlert == false)
				{
					script.lastShieldHit = Time.time;
					script.health -= damage * hullMulti;
					Destroy(gameObject);
					Instantiate(explosion.transform.gameObject, transform.position, transform.rotation);
					hasHit = true;
				}
			
			}
			if(hit.transform.tag == "Station")
			{
				var stat_script : stationScript = hit.gameObject.GetComponent(stationScript);
				
				if (stat_script.health.shield <= 0)
				{
					stat_script.health.lastShieldHit = Time.time;
					stat_script.health.health -= damage * hullMulti;
					Destroy(gameObject);
					Instantiate(explosion.transform.gameObject, transform.position, transform.rotation);
					hasHit = true;
					
				}
				
			
			}
			if(hit.transform.tag == "Planet")
			{
				Destroy(gameObject);
			}
		
		
		}
		
	}
	
}
	
//Collision with shields
function OnTriggerEnter (hit : Collider)
{

	if(hasHit == false)
	{
		if (hit.transform.parent.parent.transform != launched.transform)
		{
		
			if (hit.tag == "Shields")
			{
			
				if (hit.transform.parent.parent.tag == "Ship")
				{
					var go = hit.transform.parent.parent.gameObject;
					var script : playerShip = go.gameObject.GetComponent(playerShip);
					
					if(script.shields > 0 && script.isRedAlert == true)
					{
						script.lastShieldHit = Time.time;
						script.shields -= damage * shieldMulti;
						Destroy(gameObject);
						var instanteated : Transform = Instantiate(shieldImp, transform.position, transform.rotation);
						hasHit = true;
					
					}
				}
				else if (hit.transform.parent.parent.tag == "Station")
				{
					var station = hit.transform.parent.parent.gameObject;
					var stat_script : stationScript = station.GetComponent(stationScript);
					
					if (stat_script.health.shield > 0)
					{	
						stat_script.health.lastShieldHit = Time.time;
						stat_script.health.shield -= damage * shieldMulti;
						Destroy(gameObject);
						var stat_instanteated : Transform = Instantiate(shieldImp, transform.position, transform.rotation);
						hasHit = true;
					
					}
				
				}
				
			
			}
		
		}
	}

}
