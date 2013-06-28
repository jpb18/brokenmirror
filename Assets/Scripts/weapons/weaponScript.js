//this "class" is more here to identify the weapon type than anything else...
#pragma strict

var type : WeaponType;
var firingAngle : float;

enum WeaponType {
	beam,
	torpedo,
	pulse,

}

class GuiInfo {
	var name : String;
	var description : String;
	var image : Texture2D;

}


function Start () {

}

function Update () {

}