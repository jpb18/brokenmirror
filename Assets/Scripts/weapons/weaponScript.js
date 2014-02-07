//this "class" is more here to interface the rest of the game with the several weapon scripts, plus status
#pragma strict

var type : WeaponType;
var firingAngle : float;
var guiInfo : GuiInfo;
var altRate : float;

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

///<summary>Gets the weapon type</summary>
function getType() : WeaponType {
	return type;
}

//this method gets the weapon cooldown
function getCooldown() : float {
	var cd : float = 0.0f;
	
	switch(type) {
		case WeaponType.beam:
			cd = gameObject.GetComponent(phaserScript).standard_cd;
			break;
		case WeaponType.torpedo:
			cd = gameObject.GetComponent(torpedoScript).status.cooldown;
			break;
		case WeaponType.pulse:
			cd = gameObject.GetComponent(pulseScript).cooldown;
			
	
	}
	
	return cd;


}

//this method gets the weapon range
function getRange() : float {
	var range : float = 0.0f;
	
	switch(type) {
		case WeaponType.beam:
			range = gameObject.GetComponent(phaserScript).range;
			break;
		case WeaponType.torpedo:
			range = gameObject.GetComponent(torpedoScript).status.range;
			break;
		case WeaponType.pulse:
			range = gameObject.GetComponent(pulseScript).range;
		
	
	}
	
	return range;
	
}

//this method checks if the target is in range
function isRange(origin : GameObject, target : GameObject) : boolean {
	var range : float = getRange();
	var or : Vector3 = origin.transform.position;
	var tar : Vector3 = target.transform.position;
	return ((or - tar).sqrMagnitude <= range * range);


}

//this method check if the target is inside the firing arc
function isAngle(origin : GameObject, target : GameObject) : boolean {

	return Vector3.Angle(target.transform.position - origin.transform.position, origin.transform.forward) <= firingAngle/2;

}


//this method set the weapon target
//@pre target != null
function setTarget(target : GameObject) {
	switch(type) {
		
		case WeaponType.torpedo:
			gameObject.GetComponent(torpedoScript).setTarget(target);
			break;
		case WeaponType.pulse:
			gameObject.GetComponent(pulseScript).setTarget(target);
			
	
	}
}

//this method sets the weapon origin point
//@pre origin != null
function setOrigin(origin : GameObject) {

	switch(type) {
		
		case WeaponType.torpedo:
			gameObject.GetComponent(torpedoScript).setOrigin(origin);
			break;
		case WeaponType.pulse:
			gameObject.GetComponent(pulseScript).setOrigin(origin);
	
	}


}