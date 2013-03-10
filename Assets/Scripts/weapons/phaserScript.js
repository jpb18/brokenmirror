//this script controls the phaser beam
#pragma strict

var damage : float;
var speed : float;

var target : GameObject;
var origin : GameObject;

var beam_renderer : GameObject;

var standard_cd : float = 5.0f;

var spawnTime : float;
var durTime : float;


function Start () {

	transform.LookAt(target.transform.position);
	rigidbody.velocity = speed * transform.forward;
	spawnTime = Time.time;


}

function Update () {
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
	if (hit.transform.gameObject != origin.transform.parent.parent.parent.gameObject)
	{
		if (hit.transform.tag == "Ship")
		{
			rigidbody.velocity = Vector3(0,0,0);
			transform.parent = hit.transform;
			
		
		}
	}
}

function deletePhaser () {
	if (Time.time >= spawnTime + durTime)
	{
		Destroy(gameObject);
	}

}