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
var durTime : float = 5.0f;

var hitshield : boolean = false;
var hitHull : boolean = false;

var isCalc : boolean = false;
var isMoving : boolean = false;





function Start () {

	spawnTime = Time.time;
	
	

}

function Update () {
	
	
	deletePhaser();
	CheckPTargetAndOrigin();
	designLine();
	
	if(!hitshield && !hitHull) {
    	transform.LookAt(target.transform.position);
		rigidbody.velocity = speed * transform.forward;
	} else {
		rigidbody.velocity = Vector3.zero;
	}

}

function designLine () {

	var line_renderer : LineRenderer = beam_renderer.GetComponent(LineRenderer);
	line_renderer.SetPosition(0, origin.transform.position);
	line_renderer.SetPosition(1, gameObject.transform.position);


}

//calculates the distance between the origin and the target
function OnCollisionEnter (hit : Collision) {
	//if the phaser object hits a ship
	if(hit.transform.gameObject && origin.transform.parent.parent.parent.parent.gameObject) {
		if (hit.transform.gameObject != origin.transform.parent.parent.parent.parent.gameObject && !hitshield)
		{
			if (hit.transform.tag == "Ship")
			{
				collider.isTrigger = true;
				
				var healthSC : shipHealth = hit.transform.gameObject.GetComponent(shipHealth);
				
				var propScript : shipProperties = hit.transform.gameObject.GetComponent(shipProperties);
				
				
				healthSC.shipHealth.health -= damage - propScript.shipHealth.armor;
				healthSC.shieldRegen.lastHit = Time.time;
				
				
				
				hitHull = true;
			
			}
		}
	}
}

function OnTriggerEnter (hit : Collider) {
	if(hit) {
	//if the phaser object hits a ships shield
	if (hit.tag == "Shields" && !hitshield)
	{
		if(hit.transform.parent.parent.gameObject && origin.transform.parent.parent.parent.parent.gameObject) {
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
	}

}

function deletePhaser () {
	if (Time.time >= spawnTime + durTime)
	{
		gameObject.SetActive(false);
	}

}

function CheckPTargetAndOrigin() {
	if(!target || !origin)
	{
		gameObject.SetActive(false);
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