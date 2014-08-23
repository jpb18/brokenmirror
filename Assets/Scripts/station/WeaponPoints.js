#pragma strict

public class WeaponPoints extends Object { //added this so I could use the constructor

	var point : GameObject;
	var weapon : GameObject;
	var lastShot : float;
	var target : GameObject;
	var targetCache : GameObject[];
	var nextScan : float;
	var scanTime : float = 5.0f;
	var isFiring : boolean;
	var duration : float = 1.0f;
	var hullLayerMask : LayerMask;
	var shieldLayerMask : LayerMask;
	
	//this is the constructor
	public function WeaponPoints (point : GameObject, weapon : GameObject, hullMask : LayerMask, shieldMask : LayerMask) {
	
		this.point = point;
		this.weapon = weapon;
		target = null;
		lastShot = 0;
		this.hullLayerMask = hullMask;
		this.shieldLayerMask = shieldMask;
	
	}
	
	
	
	//this checks if the weapon can fire
	//pre: point != null
	public function canFire() : boolean {
		
		//gets weapon stats
		var script : weaponScript = weapon.GetComponent(weaponScript);
		
		var cd : int = script.getCooldown();
		
			
		return (!isFiring && hasAngle() && hasTarget() && Time.time >= lastShot + cd && weapon != null);
	
	}
	
	//this method fires the weapon
	//@pre canFire() == true
	public function fire() : IEnumerator{
		
		lastShot = Time.time;
		
		if(getWeaponType() == WeaponType.beam) {
		
			fireBeam();
		
		
		} else if(getWeaponType() == WeaponType.torpedo) {
			
			fireTorpedo();
		
		} else if(getWeaponType() == WeaponType.pulse) {
		
		
		}
		
		
	
	}
	
	//this function scans for a target inside its targeting radius
	//@pre target != null
	public function scan(faction : FactionInfo, origin : GameObject) {
		
		if(Time.time > this.nextScan) {
			
			this.searchEnemies(faction, origin);
			
			
		}
		
		if(targetCache.Length > 0) {
			if(!target) {
				target = this.pickClosest(origin.transform);
			} else {
				if(isInRange(target, origin)) {
					target = this.pickClosest(origin.transform);
				}
			}
		}
	
	}
	
	//this method returns the range of the weapon
	//pre weapon != null	
	private function getRange() : float {
		return weapon.GetComponent(weaponScript).getRange();
	
	}
	
	private function isInRange(target : GameObject, origin : GameObject) : boolean {
		var rng : float = getRange();
		return rng * rng <= (target.transform.position - origin.transform.position).sqrMagnitude; 
	
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
	public function searchEnemies(faction : FactionInfo, origin : GameObject) {
		
		targetCache = Statics.findAllEnemyShips(faction, origin);
		nextScan = Time.time + Random.value * scanTime;
		
	}
	
	///<summary>This picks the closest game object in cache as a target</summary>
	///<pre>targetCache.Length > 0</pre>
	
	public function pickClosest(origin : Transform) : GameObject{
		
		var closest : GameObject = targetCache[0];
		
		for(var x : int = 1; x < targetCache.Length; x++) {
			if(!closest) {
			
				closest = targetCache[x];
			
			}else if(targetCache[x]) {
				var distance1 : float = (closest.transform.position - origin.position).sqrMagnitude;
				var distance2 : float = (targetCache[x].transform.position - origin.position).sqrMagnitude;
				
				if(distance2 < distance1) {
					closest = targetCache[x];
				}
			}
			
		}
		
		return closest;
	}
	
	function getWeaponType() : WeaponType {
		return weapon.GetComponent(weaponScript).getType();
	
	}
	
	function fireBeam() {
		lastShot = Time.time;
		var rate : float = 1/duration;
		var i : float = 0;
		var phaserGO : GameObject;
		isFiring = true;
		while (i < 1) {
			if(target){
				i += rate * Time.deltaTime; 
				var or : Vector3 = point.transform.position;
				var ta : Vector3 = target.transform.position;
				var dir : Vector3 = (ta - or).normalized;
				var hit : RaycastHit;
				
				if(hasTargetShield(target)) {
					phaserGO = fireShields(target, or, dir, hit, phaserGO);
				} else {
					phaserGO = fireHull(target, or, dir, hit, phaserGO);
				}
			} else {
				i = 2;
			}
			
			
			yield;
		}
		GameObject.Destroy(phaserGO);
		isFiring = false;
	}
	
	private function hasTargetShield(target : GameObject) : boolean {
		var health : shipHealth = target.GetComponent(shipHealth);
		return health.isShieldUp();
			
	}
	//pre hasTargetShield()
	private function fireShields(target : GameObject, or : Vector3, dir : Vector3, hit : RaycastHit, phaserGO : GameObject) : GameObject {
		if(Physics.Raycast(or, dir, hit, getRange(), shieldLayerMask)) {
				
		
				//do phaser logic here
				//get target health script
				var ship : GameObject = getParent(hit.transform).gameObject;
				ship.GetComponent(shipHealth).damageShield(getDamage(true) * Time.deltaTime);
				
				//get hit point
				var point : Vector3 = hit.point;
				
				//draw phaser
				if(phaserGO == null) {
					phaserGO = GameObject.Instantiate(weapon);
					setLastShot();
				}
				
				var script : phaserScript = phaserGO.GetComponent(phaserScript);
				script.setPhaser(getParent(this.point), target);
				var line : LineRenderer = script.line_renderer;
				line.SetPosition(0, or);
				line.SetPosition(1, point);
				
				
			} 
			
			return phaserGO;
	
	}
	
	private function fireHull(target : GameObject, or : Vector3, dir : Vector3, hit : RaycastHit, phaserGO : GameObject) : GameObject {
		if(Physics.Raycast(or, dir, hit, getRange(), hullLayerMask)) {
				
				//do phaser logic here
				//get target health script
				var ship : GameObject = getParent(hit.transform).gameObject;
				ship.GetComponent(shipHealth).damageHull(getDamage(false) * Time.deltaTime);
				
				//get hit point
				var point : Vector3 = hit.point;
				
				//draw phaser
				if(phaserGO == null) {
					phaserGO = GameObject.Instantiate(weapon);
					setLastShot();
				}
				var script : phaserScript = phaserGO.GetComponent(phaserScript);
				script.setPhaser(getParent(this.point), target);
				var line : LineRenderer = script.line_renderer;
				line.SetPosition(0, or);
				line.SetPosition(1, point);
				
				
			}
			
			return phaserGO;
	}
	
	private function getParent(trans : Transform) : Transform {
		
		
		return trans.root;
	
	}
	
	private function getParent(trans : GameObject) : GameObject {
		
		
		return getParent(trans.transform).gameObject;
	
	}
	
	function getNextShot() : float{
		return lastShot + getCooldown();	
	}
	
	function getDamage(isShield : boolean) : float {
		return weapon.GetComponent(weaponScript).getDamage(isShield);
	
	}
	
	function setLastShot() {
		lastShot = Time.time;
	}
	
	function getCooldown() : float {
			var ws : weaponScript = weapon.GetComponent(weaponScript);
		 	return ws.getCooldown();
	
	}
	
	function fireTorpedo() {
		
		var torp : GameObject = getPooledWeapon();
		var ws : weaponScript = torp.GetComponent(weaponScript);
		
		ws.setTarget(target);
		ws.setOrigin(point);
		torp.SetActive(true);
	}
	
	function getPooledWeapon() : GameObject {
		var pools : GameObject[] = GameObject.FindGameObjectsWithTag("Pooler");
		var pool : GameObject = null;
		var i : int = 0;
		while(i < pools.Length && pool == null) {
			if(pools[i].GetComponent(ObjectPooler).equals(weapon)) {
				pool = pools[i];
			}
			i++;
		}
		
		return pool.GetComponent(ObjectPooler).getObject();
	
	}

}
