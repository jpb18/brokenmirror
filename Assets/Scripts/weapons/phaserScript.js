//this script controls the phaser beam
#pragma strict

var range : float;
var damage : float;


var line_renderer : LineRenderer;

var standard_cd : float = 5.0f;







function setRenderer(origin : Vector3, target : Vector3) {
	line_renderer.SetPosition(0, origin);
	line_renderer.SetPosition(0, target);

}


