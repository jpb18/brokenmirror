//this script controls the phaser beam
#pragma strict

var range : float;
var damage : float;


var line_renderer : LineRenderer;

var standard_cd : float = 5.0f;


var origin : GameObject;
var target : GameObject;


function Update() {
	
	if(!origin || !target) {
		Destroy(gameObject);
	}
	if(origin) changeSoundFocus();

}

function setPhaser(origin : GameObject, target : GameObject) {
	this.origin = origin;
	this.target = target;
}

function setRenderer(origin : Vector3, target : Vector3) {
	line_renderer.SetPosition(0, origin);
	line_renderer.SetPosition(0, target);

}

function changeSoundFocus() {
	transform.position = origin.transform.position;
}


