#pragma strict

public class WeaponPoints extends MonoBehaviour { //added this so I could use the constructor

	var point : GameObject;
	var weapon : GameObject;
	var lastShot : float;
	var target : GameObject;
	var targetCache : GameObject[];
	var lastScan : float;
	var scanTime : float = 20.0f;
	
	//this is the constructor
	public function WeaponPoint (point : GameObject, weapon : GameObject) {
	
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
		
			
		return ( hasAngle() && hasTarget() && Time.time >= lastShot + cd && weapon != null);
	
	}
	
	//this method fires the weapon
	//@pre canFire() == true
	public function fire() {
		
		var weapon : GameObject = Instantiate(weapon, point.transform.position, Quaternion.identity);
		weapon.GetComponent(weaponScript).setTarget(target);
		weapon.GetComponent(weaponScript).setOrigin(point);
		lastShot = Time.time;
	
	}
	
	//this function scans for a target inside its targeting radius
	//@pre target != null
	public function scan(enemyList : int[]) {
		
		target = Statics.FindTarget(point, getRange(), enemyList);
	
	}
	
	//this method returns the range of the weapon
	//pre weapon != null	
	private function getRange() : float {
		return weapon.GetComponent(weaponScript).getRange();
	
	}
	
	//this method checks if there's a target in range
	
	public function hasTarget() : boolean {
		var has : boolean = false;
		
		if(target) {
			var distance : float = (point.transform.position - target.transform.position).sqrMagnitude;
			var range : float = getRange();
			has = distance <= range * range;
		}
		
		return has;
	
	}
	
	//this method checks if the target is inside the weapon angle
	public function hasAngle() : boolean {
		var has : boolean = false;
		if(target) {
		 has = weapon.GetComponent(weaponScript).isAngle(point, target);
		}
		return has;
	}
	
	///<summary>This caches all enemies in the scene</summary>
	///<param name="enemyList">List of enemy factions</param>
	public function searchEnemies(enemyList : int[]) {
		
		targetCache = Statics.findAllEnemyShips(enemyList, gameObject);
		
	}
	
	

}
