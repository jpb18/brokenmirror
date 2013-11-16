#pragma strict

var health : Health;
var weapon : StationWeapons;
var faction : FactionInfo;

function Start () {
	//get station weapons script
	weapon = gameObject.GetComponent(StationWeapons);
	health = gameObject.GetComponent(Health);

}

function Update () {
	scan();
	fire();
	life();
	

}

//make all weapons scan
private function scan() {
	
	//scan for phasers
	for(var x : int = 0; x < weapon.getLength(WeaponType.beam); x++) {
		weapon.scan(x, WeaponType.beam, faction.hostileFactions);
	}

	//scan for torpedoes
	for(x  = 0; x < weapon.getLength(WeaponType.torpedo); x++) {
		weapon.scan(x, WeaponType.torpedo, faction.hostileFactions);
	}
	
	//scan for pulses
	for(x = 0; x < weapon.getLength(WeaponType.pulse); x++) {
		weapon.scan(x, WeaponType.pulse, faction.hostileFactions);
	}

}

//makes all weapons fire
private function fire() {

	//fire phasers
	for(var x : int = 0; x < weapon.getLength(WeaponType.beam); x++) {
		weapon.fire(x, WeaponType.beam);
	}

	//fire torpedoes
	for(x  = 0; x < weapon.getLength(WeaponType.torpedo); x++) {
		weapon.fire(x, WeaponType.torpedo);
	}
	
	//fire pulses
	for(x = 0; x < weapon.getLength(WeaponType.pulse); x++) {
		weapon.fire(x, WeaponType.pulse);
	}


}

//check health status
private function life() {
	
	//check if the station is dead or alive
	if(!health.hasHull()) {
		health.die(gameObject); //kill it if its dead
	}
	
	//check if the shield can regen
	if(health.canRegen()) {
		health.shieldRegen(); //if so, regen
	}


}