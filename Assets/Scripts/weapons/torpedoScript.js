//this script controls the torpedoes...
#pragma strict

var target : Transform; //torpedoes target
var launched : Transform; //ship from where the torpedo was launched
var damage : float; //torpedoes damage
var speed : float; //torpedoes speed
var shieldMulti : float; //multiplies the torpedo strenght against shields
var hullMulti : float; //multiplies the torpedo strenght against hull
var isCalc : boolean = false; //check if the travel time has been calculated
var explosion : Transform; //torpedo explosion
var isMoving : boolean; //check if the coroutine is working
var shieldImp : Transform; //shield impact
var hasHit : boolean = false; //checks if it hits something
var launchSound : AudioSource; //torpedo launch audio source




function Start () {

}




function FixedUpdate () {
	//if there isn't a target
	if(target == null)
	{
		Destroy(gameObject);
	}

	if ( isCalc != true)
	{
	//calc the flight time
		var time = travel_time(target.position, launched.position, speed);
		isCalc = true;
	}
	//fly!!!!
	if (isMoving == false)
	{
		isMoving = true;
		StartCoroutine(flight(transform, launched.position, target.position, time));
	}
			
	transform.LookAt(target);
		

}

//calculates the distance between the origin and the target

function travel_time(target : Vector3, start : Vector3, speed : float) {

	var distance = Vector3.Distance(start, target);
	return distance/speed;	

}

//flight Coroutine
function flight (ThisTransform : Transform, startPos : Vector3, endPos : Vector3, time : float)
{
	var i : float = 0;
	var rate : float = 1/time * Time.deltaTime;
	
	if( i == 1)
	{
		Destroy(gameObject);
		Instantiate(explosion, transform.position, transform.rotation);
	
	}
	
	while (i < 1)
	{
		i += rate;
		ThisTransform.position = Vector3.Lerp(startPos, endPos, i);
		yield;
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
					script.health -= damage * hullMulti;
					Destroy(gameObject);
					Instantiate(explosion.transform.gameObject, transform.position, transform.rotation);
					hasHit = true;
				}
			
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
				var go = hit.transform.parent.parent.gameObject;
				var script : playerShip = go.gameObject.GetComponent(playerShip);
				
				if(script.shields > 0 && script.isRedAlert == true)
				{
					script.shields -= damage * shieldMulti;
					Destroy(gameObject);
					var instanteated : Transform = Instantiate(shieldImp, transform.position, transform.rotation);
					instanteated.transform.parent = target;
					hasHit = true;
				
				}
			
			}
		
		}
	}

}

