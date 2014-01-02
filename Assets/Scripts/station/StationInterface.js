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
private var camScript : MouseOrbit;
private var general : GeneralInfo;

function Start () {
	mainCam = Camera.main;
	radar.Set(gameObject);
	camScript = mainCam.GetComponent(MouseOrbit);
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
}

function Update () {

}

function OnGUI() {
	var pos : Vector3 = mainCam.WorldToScreenPoint(transform.position);
	var player : GameObject = camScript.target.gameObject;
	if(pos.z > 0) {
		radar.Draw(pos, player, general);
	}

}