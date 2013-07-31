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





function Start () {

	transform.LookAt(target.transform.position);
	rigidbody.velocity = speed * transform.forward * Time.deltaTime;
	spawnTime = Time.time;


}

function Update () {
	transform.LookAt(target.transform.position);
	deletePhaser();
	CheckPTargetAndOrigin();
	designLine();
	
	

}

function designLine () {

	var line_renderer : LineRenderer = beam_renderer.GetComponent(LineRenderer);
	line_renderer.SetPosition(0, origin.transform.position);
	line_renderer.SetPosition(1, gameObject.transform.position);


}



function OnCollisionEnter (hit : Collision) {
	//if the phaser object hits a ship
	if (hit.transform.gameObject != origin.transform.parent.parent.parent.parent.gameObject && !hitshield)
	{
		if (hit.transform.tag == "Ship")
		{
			rigidbody.velocity = Vector3(0,0,0);
			transform.parent = hit.transform;
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
				Debug.Log("Red Alert: " + isRedAlert.ToString());
				if(isRedAlert)
				{
					var healthSC : shipHealth = hit.transform.parent.parent.gameObject.GetComponent(shipHealth);
					
					if(healthSC.shipHealth.shields > 0)
					{
						
						
						transform.parent = hit.transform.parent.parent.transform;
						rigidbody.velocity = Vector3(0,0,0);
						
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