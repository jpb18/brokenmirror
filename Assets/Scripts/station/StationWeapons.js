#pragma strict

var phaser : GameObject;
var torpedo : GameObject;
var pulse : GameObject;

private var phaserPoints : WeaponPoints[];
private var torpedoPoints : WeaponPoints[];
private var pulsePoints : WeaponPoints[];


function Start () {

	//set phaser points
	setWeaponSystem(phaserPoints, "Phasers", phaser);
	
	//set torpedoes points
	setWeaponSystem(torpedoPoints, "Torpedoes", torpedo);
	
	//set pulse points
	setWeaponSystem(pulsePoints, "Pulse", pulse);
	

}


//this method sets the weapon systems of the station
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

//this method fires the weapons on each slot
public function fire (weaponNum : int, type : WeaponType) {

	switch(type) {
	
		case WeaponType.beam:
			if(phaserPoints[weaponNum].canFire()) {
				phaserPoints[weaponNum].fire();
			}
			break;
		case WeaponType.torpedo:
			if(torpedoPoints[weaponNum].canFire()) {
				torpedoPoints[weaponNum].fire();
			}
			break;
		case WeaponType.pulse:
			if(pulsePoints[weaponNum].canFire()) {
				pulsePoints[weaponNum].fire();
			}
	
	}
	

}

//this method makes the weapon search for a new target
//pre 0 <= weaponNum < getLength()
public function scan (weaponNum : int, type : WeaponType, enemyList : int[]) {
	
	
	
	switch(type) {
		case WeaponType.beam:
			if(!phaserPoints[weaponNum].hasTarget()) {
				phaserPoints[weaponNum].scan(enemyList);
			}
			break;
		case WeaponType.torpedo:
			if(!torpedoPoints[weaponNum].hasTarget()) {
				torpedoPoints[weaponNum].scan(enemyList);
			}
			break;
		case WeaponType.pulse:
			if(!pulsePoints[weaponNum].hasTarget()) {
				pulsePoints[weaponNum].scan(enemyList);
			}
		
	
	}

}

//this method returns the length of the WeaponPoints arrays
public function getLength(type : WeaponType) : int {
	var length : int = 0;
	
	switch (type) {
		case WeaponType.beam: 
			length = phaserPoints.length;
			break;
		case WeaponType.torpedo:
			length = torpedoPoints.length;
			break;
		case WeaponType.pulse:
			length = pulsePoints.length;
			break;
	}
	
	return length;

}