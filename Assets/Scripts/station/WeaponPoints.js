#pragma strict

private var point : GameObject;
private var weapon : GameObject;
private var lastShot : float;
private var target : GameObject;

//this is the constructor
public function WeaponPoints (point : GameObject, weapon : GameObject) {

	this.point = point;
	this.weapon = weapon;
	target = null;
	lastShot = 0;

}

//this checks if the weapon can fire
//pre: point != null
public function canFire() : boolean {
	
	//gets weapon stats
	var script : weaponScript = weapon.GetComponent(weaponScript);
	
	var cd : int = script.getCooldown();
	var range : boolean = script.isRange(point, target);
		
	return (target != null && Time.time >= lastShot + cd && weapon != null && range);

}

//this method fires the weapon
//@pre canFire() == true
public function fire(target : GameObject) {

	var weapon : GameObject = Instantiate(weapon, point.transform.position, Quaternion.identity);
	weapon.GetComponent(weaponScript).setTarget(target);

}

//this function scans for a target inside its targeting radius
//@pre target != null
public function scan(enemyList : int[]) {
	var range : int = weapon.GetComponent(weaponScript).getRange();
	target = Statics.FindTarget(point, range, enemyList);

}

