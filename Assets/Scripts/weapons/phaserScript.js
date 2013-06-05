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

var impactEffects : ImpactEffects;

class ImpactEffects {
	var shield : GameObject;
	var hull : GameObject;

}

function Start () {

	transform.LookAt(target.transform.position);
	rigidbody.velocity = speed * transform.forward;
	spawnTime = Time.time;


}

function FixedUpdate () {
	designLine();
	deletePhaser();
	

}

function designLine () {

	var line_renderer : LineRenderer = beam_renderer.GetComponent(LineRenderer);
	line_renderer.SetPosition(0, origin.transform.position);
	line_renderer.SetPosition(1, gameObject.transform.position);


}

function OnCollisionEnter (hit : Collision) {
	//if the phaser object hits a ship
	if (hit.transform.gameObject != origin.transform.parent.parent.parent.gameObject && !hitshield)
	{
		if (hit.transform.tag == "Ship")
		{
			rigidbody.velocity = Vector3(0,0,0);
			transform.parent = hit.transform;
			
			var healthSC : shipHealth = hit.transform.gameObject.GetComponent(shipHealth);
			if (impactEffects.hull)	{
				Instantiate(impactEffects.hull, transform.position, transform.rotation);
			}
			healthSC.shipHealth.health -= damage;
		
		}
	}
}

function OnTriggerEnter (hit : Collider) {

	//if the phaser object hits a ships shield
	if (hit.tag == "Shields" && !hitshield)
	{
		
		if(hit.transform.parent.parent.gameObject != origin.transform.parent.parent.parent.gameObject)
		{
			if (hit.transform.parent.parent.gameObject.tag == "Ship")
			{
				var healthSC : shipHealth = hit.transform.parent.parent.gameObject.GetComponent(shipHealth);
				
				if(healthSC.shipHealth.shields > 0)
				{
					rigidbody.velocity = Vector3(0,0,0);
					transform.parent = hit.transform;
					if(impactEffects.shield){
						Instantiate(impactEffects.shield, transform.position, transform.rotation);
					}
					
					healthSC.shipHealth.shields -= damage;
					//make shield show up
					healthSC.shieldShow.lastHit = Time.time;
					
					hitshield = true;
					
					
					
					
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