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




function Start () {

}




function FixedUpdate () {

	if ( isCalc != true)
	{
	//calc the flight time
		var time = travel_time(target.position, launched.position, speed);
		isCalc = true;
	}
	//fly!!!!
	StartCoroutine(flight(transform, launched.position, target.position, time));
			
		
		

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
	
	while (i < 1)
	{
		i += rate;
		ThisTransform.position = Vector3.Lerp(startPos, endPos,i);
		yield;
	}


}

//Collision
function OnCollisionEnter (hit : Collision) {
	
	if (hit.transform != launched.transform)
	{
		
		if(hit.transform.tag == "Ship")
		{
			var script : playerShip = hit.gameObject.GetComponent(playerShip);
			
			if(script.shields > 0)
			{
				script.shields -= damage * shieldMulti;
			
			}
			else
			{
				script.health -= damage * hullMulti;
			}
		
		}
		
		
		Destroy(gameObject);
		Instantiate(explosion.transform.gameObject, transform.position, transform.rotation);
		
		
	
	}

}