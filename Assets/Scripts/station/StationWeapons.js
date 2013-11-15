#pragma strict

var phaser : GameObject;
var torpedo : GameObject;

private var phaserPoints : WeaponPoints[];
private var torpedoPoints : WeaponPoints[];


function Start () {

	//set phaser points
	setWeaponSystem(phaserPoints, "Phasers", phaser);
	
	//set torpedoes points
	setWeaponSystem(torpedoPoints, "Torpedoes", torpedo);
	

}

private function setWeaponSystem(system : WeaponPoints[], tag : String, weapon : GameObject){
	//set phaser points
	var systems : GameObject[] = gameObject.FindGameObjectsWithTag(tag);
	
	//resize array
	system = Statics.resizeArray(system, systems.Length);
	
	//now set its values
	for(var x : int = 0; x < systems.Length; x++) {
	
		system[x] = new WeaponPoints(systems[x], weapon);
	
	}

}

function Update () {

}