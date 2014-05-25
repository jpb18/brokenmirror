//this script controls the weapon fire of a galaxy class ship
import System.Collections.Generic;
#pragma strict

class Phaser {
	
	var isEnabled : boolean;
	var phaser : GameObject;
	var phaserPoint : List.<GameObject>;
	var lastShot : float;
	var isFiring : boolean;
	var duration : float = 1.0f;
	var hullLayerMask : LayerMask;
	var shieldLayerMask : LayerMask;
	
	function setPhaser(phaser : GameObject) {
		this.phaser = phaser;	
	}
	
	///<summary>This will check if the phaser can fire</summary>
	///<param name="target">Object to be checked (target)</param>
	function canFire(target : GameObject) : boolean {
		var can : boolean = false;
		if(isEnabled && phaser) {
			var isTime : boolean = Time.time >= lastShot + getCooldown();
			can = isTime && canRangeAndAngle(target) && !isFiring;
		}
		
		return can;
	
	}
	
	function canRangeAndAngle(target : GameObject) : boolean {
		
		var can : boolean = false;
		var ws : weaponScript = phaser.GetComponent(weaponScript);
		
		for(var x : int = 0; x < phaserPoint.Count && !can; x++) {
			if(ws.isRange(phaserPoint[x], target) && ws.isAngle(phaserPoint[x], target)) {
				can = true;			
			}
		}
		
		return can;
	
	}
	
	
	
	
	///<summary>This will get the closest point where the phaser can fire from. Must check canFire(target) first</summary>
	///<param name="target">Target GameObject</param>
	function getPoint(target : GameObject) : GameObject {
		var point : GameObject;
		var ws : weaponScript = phaser.GetComponent(weaponScript);
		
		for(var i : int = 0; i < phaserPoint.Count; i++) {
			var p : GameObject = phaserPoint[i];
			if(!point) {
				if(ws.isRange(p, target) && ws.isAngle(p, target)) {
					point = p;
				}
			} else {
				if(ws.isRange(p, target) && ws.isAngle(p, target)) {
					var o : float = (point.transform.position - target.transform.position).sqrMagnitude;
					var n : float = (p.transform.position -target.transform.position).sqrMagnitude;					
					if(n < o) {
						point = p;
					}
				}
			}
		
		}
		
		return point;
	
	}
	
	///<summary>This will fire the phaser. Must check canFire(target) first. Also, make sure this is started as a coroutine.</summary>
	///<param name="target">Target GameObject</param>
	function fire(target : GameObject) {
		lastShot = Time.time;
		if(getType() == WeaponType.beam) {
			fireBeam(target, getPoint(target));
		}	
	
	}
	
	function fireBeam(target : GameObject, origin : GameObject) {
		var rate : float = 1/duration;
		var i : float = 0;
		var phaserGO : GameObject;
		isFiring = true;
		
		while (i < 1) {
			if(target){
				i += rate * Time.deltaTime; 
				var or : Vector3 = origin.transform.position;
				var ta : Vector3 = target.transform.position;
				var dir : Vector3 = (ta - or).normalized;
				var hit : RaycastHit;
				
				if(hasTargetShield(target)) {
					
					phaserGO = fireShields(target, origin, or, dir, hit, phaserGO);
				} else {
					phaserGO = fireHull(target, origin, or, dir, hit, phaserGO);
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
		if(target.tag.Equals("Ship")) {
		var health : shipHealth = target.GetComponent(shipHealth);
		return health.isShieldUp();
		} else if (target.tag.Equals("Station")) {
		var shealth : Health = target.GetComponent(Health);
		return shealth.hasShield();
		
		}
			
	}
	//pre hasTargetShield()
	private function fireShields(target : GameObject, origin : GameObject, or : Vector3, dir : Vector3, hit : RaycastHit, phaserGO : GameObject) : GameObject {
		
		if(Physics.Raycast(or, dir, hit, getRange(), shieldLayerMask)) {
				
		
				//do phaser logic here
				//get target health script
				var ship : GameObject = getParent(hit.transform).gameObject;
				if(ship.tag.Equals("Ship")) {
					ship.GetComponent(shipHealth).damageShield(getDamage() * Time.deltaTime);
				} else if (ship.tag.Equals("Station")) {
					ship.GetComponent(Health).getDamage(getDamage() *  Time.deltaTime, true);
				}
				//get hit point
				var point : Vector3 = hit.point;
				//Debug.Log("Gets here");
				//draw phaser
				if(phaserGO == null) {
					phaserGO = GameObject.Instantiate(phaser);
					setLastShot();
				}
				var script : phaserScript = phaserGO.GetComponent(phaserScript);
				script.setPhaser(origin, target);
				var line : LineRenderer = script.line_renderer;
				line.SetPosition(0, or);
				line.SetPosition(1, point);
				
				
			} 
			
			return phaserGO;
	
	}
	
	private function fireHull(target : GameObject, origin : GameObject, or : Vector3, dir : Vector3, hit : RaycastHit, phaserGO : GameObject) : GameObject {
		if(Physics.Raycast(or, dir, hit, getRange(), hullLayerMask)) {
				
				//do phaser logic here
				//get target health script
				var ship : GameObject = getParent(hit.transform).gameObject;
				ship.GetComponent(shipHealth).damageHull(getDamage() * Time.deltaTime);
				
				//get hit point
				var point : Vector3 = hit.point;
				
				//draw phaser
				if(phaserGO == null) {
					phaserGO = GameObject.Instantiate(phaser);
					setLastShot();
				}
				var script : phaserScript = phaserGO.GetComponent(phaserScript);
				script.setPhaser(origin, target);
				var line : LineRenderer = script.line_renderer;
				line.SetPosition(0, or);
				line.SetPosition(1, point);
				
				
			}
			
			return phaserGO;
	}
	
	///<summary>This returns the weapon cooldown</summary>
	function getCooldown() : float {
			var ws : weaponScript = phaser.GetComponent(weaponScript);
		 	return ws.getCooldown();
	
	}
	
	///<summary>This return the weapon type</summary>
	function getType() : WeaponType {
		return phaser.GetComponent(weaponScript).type;
	}
	
	function getRange() : float {
		return phaser.GetComponent(weaponScript).getRange();	
	}
	
	private function getParent(trans : Transform) : Transform {
		var par : Transform = trans;
	
		while(par.parent) {
			par = par.parent.transform;
		}
		
		return par;
	
	}
	
	function getNextShot() : float{
		return lastShot + getCooldown();	
	}
	
	function getDamage() : float {
		return phaser.GetComponent(phaserScript).damage;
	
	}
	
	function setLastShot() {
		lastShot = Time.time;
	}
	
}


class Torpedo {
	var isEnabled : boolean;
	var torpedo : GameObject;
	var torpedoPoint : GameObject;
	var nextShot : float;
	var rate : float;
	
	function setTorpedo(torpedo : GameObject) {
		this.torpedo = torpedo;
	
	}
	
	function canFire(target : GameObject) : boolean {
		var can : boolean = false;
		if(isEnabled && torpedo) {
			var isTime : boolean = Time.time >= nextShot;
			can = isRange(target) && isAngle(target) && isTime;
		}
		return can;
	}
	
	function isRange(target : GameObject) : boolean {
		var ws : weaponScript = torpedo.GetComponent(weaponScript);
		return ws.isRange(torpedoPoint, target);
	}
	
	function isAngle(target : GameObject) : boolean {
		var ws : weaponScript = torpedo.GetComponent(weaponScript);
		return ws.isAngle(torpedoPoint, target);
	}
	
	function fire(target : GameObject, num : int) {
		
		nextShot = Time.time + getCooldown() * num;
		
		for(var x : int = 0; x < num; x++) {
			var torp : GameObject = getPooledWeapon();
			if(torp) {
				
				var ws : weaponScript = torp.GetComponent(weaponScript);
				ws.setTarget(target);
				ws.setOrigin(torpedoPoint);
				torp.SetActive(true);
			yield WaitForSeconds(rate);
			} else {
				Debug.LogWarning(torpedoPoint.transform.parent.parent.parent.name + "Isn't getting any torpedo!");
			}
		}
	
	}
	
	///<summary>This returns the weapon cooldown</summary>
	function getCooldown() : float {
		 return torpedo.GetComponent(weaponScript).getCooldown();
	
	}
	
	///<summary>This return the weapon type</summary>
	function getType() : WeaponType {
		return torpedo.GetComponent(weaponScript).type;
	}
	
	function getRange() : float {
		return torpedo.GetComponent(weaponScript).getRange();	
	}
	
	function getNextShot() : float{
		return nextShot;	
	}
	
	function getDamage() : float {
		return torpedo.GetComponent(phaserScript).damage;
	
	}
	
	function getPooledWeapon() : GameObject {
		var pools : GameObject[] = GameObject.FindGameObjectsWithTag("Pooler");
		var pool : GameObject = null;
		var i : int = 0;
		while(i < pools.Length && pool == null) {
			if(pools[i].GetComponent(ObjectPooler).equals(torpedo)) {
				pool = pools[i];
			}
			i++;
		}
		
		return pool.GetComponent(ObjectPooler).getObject();
	
	}

}

enum Volley {
	one,
	three,
	five,
	eight

}

//weapons
var phaser : Phaser;
var torp1 : Torpedo;
var torp2 : Torpedo;

//needed scripts
var target : shipTarget;
var properties : shipProperties;

//volley
var torpVolley : Volley;




function Start() {
	target = gameObject.GetComponent(shipTarget);
	properties = gameObject.GetComponent(shipProperties);

}

function Update() {
	if(properties.getRedAlert()) {
		fire();
	}

}

function fire() {
	if(properties.getPlayer()) {
		playerFire();
	} else {
		botFire();
	}

}

function playerFire() {
	if(target.target) {
		if(Input.GetAxis("Fire1")) {
			phaserFunction();
		}
		
		if(Input.GetAxis("Fire2")) {
			torpFunction(torp1);
		}
		
		if(Input.GetAxis("Fire3")) {
			torpFunction(torp2);
		}
	}

}

function botFire() {
	if(target.target) 
	{
		phaserFunction();
		torpFunction(torp1);
		torpFunction(torp2);
	}
}

function phaserFunction() {
	
	if(phaser.canFire(target.target)) {
		StartCoroutine(phaser.fireBeam(target.target, phaser.getPoint(target.target)));	
	}
	
}

function hasWeaponInRange(target : GameObject) : boolean {
		
	return hasPhaserInRange(target) || hasTorpedoInRange(target);
}

function hasPhaserInRange(target : GameObject) : boolean {
	var has : boolean = false;
	if(phaser.isEnabled) {
		has = phaser.canRangeAndAngle(target);
	}
	return has;
}

function hasTorpedoInRange(target : GameObject) : boolean {
	var isTorp1 : boolean = false;
	var isTorp2 : boolean = false;
	
	if(torp1.isEnabled) {
		isTorp1 = torp1.isRange(target);
	}
	
	if(torp2.isEnabled) {
		isTorp2 = torp2.isRange(target);
	}

	return isTorp1 || isTorp2;

}


function torpFunction(torp : Torpedo) {
	if(torp.canFire(target.target)) {
		StartCoroutine(torp.fire(target.target, volleyNum()));
	}


}

function volleyNum() : int {
	var num: int;
	
	switch(torpVolley) {
		case Volley.three:
			num = 3;
		break;
		case Volley.five: 
			num = 5;
		break;
		case Volley.eight:
			num = 8;
		break;
		default:
			num = 1;
	
	
	}
	
	

	return num;
}
