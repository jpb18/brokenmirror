import System.Collections.Generic;
#pragma strict

//description stuff
var stName : String;
var stClass : String;
var description : String;
var image : Texture2D;

//services
var isRefuel : boolean;
var isRepair : boolean;

//sales
var weapons : List.<GameObject>;
var ships : List.<GameObject>;
var stations : List.<GameObject>;

//radar label
var radar : RadarLabel;

private var mainCam : Camera;

function Start () {
	mainCam = Camera.main;
	radar.Set(gameObject);
}

function Update () {

}

function OnGUI() {
	var pos : Vector3 = mainCam.WorldToScreenPoint(transform.position);
	if(pos.z > 0) {
		radar.Draw(pos);
	}

}