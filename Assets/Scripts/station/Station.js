#pragma strict

var health : Health;
var weapon : StationWeapons;
var factionInfo : FactionInfo;
var faction : int = -1;

function Start () {
	//get station weapons script
	weapon = gameObject.GetComponent(StationWeapons);
	health = gameObject.GetComponent(Health);

}

function Update () {
	updateFaction();
	scan();
	fire();
	life();
	

}


//updates all faction info
private function updateFaction() {
	//find the game object with said info
	var obj : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	var scr : GeneralInfo = obj.GetComponent(GeneralInfo);
	factionInfo = scr.getFactionInfo(faction);
	
	
}

//make all weapons scan
private function scan() {
	
	//scan for phasers
	for(var x : int = 0; x < weapon.getLength(WeaponType.beam); x++) {
		weapon.scan(x, WeaponType.beam, factionInfo.hostileFactions);
		
	}

	//scan for torpedoes
	for(x  = 0; x < weapon.getLength(WeaponType.torpedo); x++) {
		weapon.scan(x, WeaponType.torpedo, factionInfo.hostileFactions);
	}
	
	//scan for pulses
	for(x = 0; x < weapon.getLength(WeaponType.pulse); x++) {
		weapon.scan(x, WeaponType.pulse, factionInfo.hostileFactions);
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