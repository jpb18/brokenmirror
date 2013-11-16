#pragma strict

public class WeaponPoints extends MonoBehaviour { //added this so I could use the constructor

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
		
			
		return (hasTarget() && Time.time >= lastShot + cd && weapon != null);
	
	}
	
	//this method fires the weapon
	//@pre canFire() == true
	public function fire() {
	
		var weapon : GameObject = Instantiate(weapon, point.transform.position, Quaternion.identity);
		weapon.GetComponent(weaponScript).setTarget(target);
	
	}
	
	//this function scans for a target inside its targeting radius
	//@pre target != null
	public function scan(enemyList : int[]) {
		
		target = Statics.FindTarget(point, getRange(), enemyList);
	
	}
	
	//this method returns the range of the weapon
	//pre weapon != null	
	private function getRange() {
		return weapon.GetComponent(weaponScript).getRange();
	
	}
	
	//this method checks if there's a target in range
	//pre weapon != nul && target != null
	public function hasTarget() {
	
		var distance : int = Vector3.Distance(point.transform.position, target.transform.position);
	
		return target != null && distance > getRange();
	
	}

}
