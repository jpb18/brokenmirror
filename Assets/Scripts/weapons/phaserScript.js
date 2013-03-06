//this script controls the phaser beam
#pragma strict

var damage : float;
var speed : float;

var target : GameObject;
var origin : GameObject;

var beam_renderer : GameObject;


function Start () {

	transform.LookAt(target.transform.position);
	rigidbody.velocity = speed * transform.forward;


}

function Update () {
	designLine();
	

}

function designLine () {

	var line_renderer : LineRenderer = beam_renderer.GetComponent(LineRenderer);
	line_renderer.SetPosition(0, origin.transform.position);
	line_renderer.SetPosition(1, gameObject.transform.position);


}