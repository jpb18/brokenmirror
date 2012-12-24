//this script controls the torpedoes...
#pragma strict

var target : Transform; //torpedoes target
var launched : Transform; //ship from where the torpedo was launched
var damage : float; //torpedoes damage
var speed : float; //torpedoes speed
var shieldMulti : float; //multiplies the torpedo strenght against shields
var hullMulti : float; //multiplies the torpedo strenght against hull
var explosion : GameObject; //torpedo explosion
var shieldImp : Transform; //shield impact
var hasHit : boolean = false; //checks if it hits something
var launchSound : AudioSource; //torpedo launch audio source




function Start () {
	rigidbody.velocity = transform.forward * speed;
}




function FixedUpdate () {
	//if there isn't a target
	if(target == null)
	{
		Destroy(gameObject);
		Instantiate(explosion, transform.position, transform.rotation);
	}

	
	
	transform.LookAt(target);
	CheckTargetCloak();
	rigidbody.velocity = transform.forward * speed;	

}





//Collision with hull
function OnCollisionEnter (hit : Collision) {
	if(hasHit == false)
	{
		
		if (hit.transform != launched.transform || launched == null)
		{
		
			
			if(hit.transform.tag == "Ship")
			{
			
				var script : playerShip = hit.gameObject.GetComponent(playerShip);
				
				if (script.shields <= 0 || script.isRedAlert == false)
				{
					script.lastShieldHit = Time.time;
					script.health -= damage * hullMulti;
					Destroy(gameObject);
					Instantiate(explosion, transform.position, transform.rotation);
					hasHit = true;
				}
			
			}
			else if(hit.transform.tag == "Station")
			{
				var stat_script : stationScript = hit.gameObject.GetComponent(stationScript);
				
				if(stat_script.health.shield <= 0)
				{
					stat_script.health.lastShieldHit = Time.time;
					stat_script.health.health -= damage * hullMulti;
					Destroy(gameObject);
					Instantiate(explosion, transform.position, transform.rotation);
					hasHit = true;
					
				}
			}
			else if (hit.transform.tag == "Planet")
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
		
		var launchGO : GameObject = launched.gameObject;
		var launchTransf : Transform;
		if(launchGO != null)
		{
			launchTransf = launchGO.transform;
		}
		
		var hitGO : GameObject = hit.transform.parent.parent.transform.gameObject;
		var hitTransf : Transform;
		if( hitGO != null)
		{
			hitTransf = hitGO.transform;
		}
		
		if (hitTransf != launchTransf)
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
						instanteated.transform.parent = target;
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
						stat_instanteated.transform.parent = target;
						hasHit = true;
					
					}
				
				}
				
			
			}
		
		}
		
	}

}

function CheckTargetCloak() {
	
	if (target.tag == "Ship")
	{
		var scrShip : playerShip = target.GetComponent(playerShip);
		if (scrShip.isCloaked == true)
		{
			Destroy(gameObject);
			Instantiate(explosion, transform.position, transform.rotation);
		}
	}
	else if (target.tag == "Station")
	{
		var scrStation : stationScript = target.GetComponent(stationScript);
		if (scrStation.properties.isCloaked == true)
		{
			Destroy(gameObject);
			Instantiate(explosion, transform.position, transform.rotation);
		}
	}

}

