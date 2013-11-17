//this script controls the phaser beam
#pragma strict

var damage : float;
var speed : float;
var range : float;

var target : GameObject;
var origin : GameObject;

var beam_renderer : GameObject;

var standard_cd : float = 5.0f;

var spawnTime : float;
var durTime : float;

var hitshield : boolean = false;

var isCalc : boolean = false;
var isMoving : boolean = false;





function Start () {

	spawnTime = Time.time;
	

}

function FixedUpdate () {
	
	deletePhaser();
	CheckPTargetAndOrigin();
	designLine();
	
	if (!isCalc)
    {
    //calc the flight time
            var time = travel_time(target.transform.position, origin.transform.position, speed);
            isCalc = true;
    }
    //fly!!!!
    if (!isMoving)
    {
            isMoving = true;
            StartCoroutine(flight(transform, origin.transform.position, target.transform.position, time));
    }
                    
    transform.LookAt(target.transform.position);
	
	

}

function designLine () {

	var line_renderer : LineRenderer = beam_renderer.GetComponent(LineRenderer);
	line_renderer.SetPosition(0, origin.transform.position);
	line_renderer.SetPosition(1, gameObject.transform.position);


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
        
        
        while (i < 1 && !hitshield)
        {
        
        	
        	if(!hitshield)
        	{
        		
                i += rate;
                ThisTransform.position = Vector3.Lerp(startPos, endPos, i);
           	}
           	else
           	{
           		i = 1;
           	}
           	
            yield;
        }


}



function OnCollisionEnter (hit : Collision) {
	//if the phaser object hits a ship
	if (hit.transform.gameObject != origin.transform.parent.parent.parent.parent.gameObject && !hitshield)
	{
		if (hit.transform.tag == "Ship")
		{
			collider.isTrigger = true;
			
			var healthSC : shipHealth = hit.transform.gameObject.GetComponent(shipHealth);
			
			var propScript : shipProperties = hit.transform.gameObject.GetComponent(shipProperties);
			
			
			healthSC.shipHealth.health -= damage - propScript.shipHealth.armor;
			healthSC.shieldRegen.lastHit = Time.time;
			
			
			Debug.Log("Origin: " + origin.transform.parent.parent.parent.parent.gameObject.name + "/Hit: " + hit.transform.gameObject.name);
			
		
		}
	}
}

function OnTriggerEnter (hit : Collider) {

	//if the phaser object hits a ships shield
	if (hit.tag == "Shields" && !hitshield)
	{
		
		if(hit.transform.parent.parent.gameObject != origin.transform.parent.parent.parent.parent.gameObject)
		{
		
			if (hit.transform.parent.parent.gameObject.tag == "Ship")
			{
			
				//checks the target red alert status
				var isRedAlert : boolean = hit.transform.parent.parent.gameObject.GetComponent(shipProperties).combatStatus.isRedAlert;
				if(isRedAlert)
				{
					var healthSC : shipHealth = hit.transform.parent.parent.gameObject.GetComponent(shipHealth);
					
					if(healthSC.shipHealth.shields > 0)
					{
						
						
						
						
						healthSC.shipHealth.shields -= damage;
						//make shield show up
						healthSC.shieldShow.lastHit = Time.time;
						healthSC.shieldRegen.lastHit = Time.time;
						hitshield = true;
						
						
						
						
					}
				}
			}
		}
	}

}

function deletePhaser () {
	if (Time.time >= spawnTime + durTime)
	{
		Destroy(gameObject);
	}

}

function CheckPTargetAndOrigin() {
	if(!target || !origin)
	{
		Destroy(gameObject);
	}

}

function OnTriggerExit(hit : Collider) {
	if(hit.tag == "Shields" && gameObject.layer == LayerMask.NameToLayer("PhaserStart"))
	{
		var hitGO : GameObject = hit.transform.parent.parent.transform.gameObject;
		var originGO : GameObject = origin.transform.parent.parent.parent.parent.gameObject;
		
		if (hitGO == originGO)
		{
			gameObject.layer = LayerMask.NameToLayer("Weapon");			
			
		}
	
	}

}


//@pre target != null
function setTarget(target : GameObject) {

	this.target = target;
}

//this method sets the origin
//pre origin != null
function setOrigin(origin : GameObject) {
	this.origin = origin;
}