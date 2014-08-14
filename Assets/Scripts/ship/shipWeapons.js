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

	///<summary>This will set a new phaser weapon</summary>
	///<param name="phaser">New phaser weapon</param>
	function setPhaser(phaser : GameObject) {
		this.phaser = phaser;	
	}
	
	///<summary>This will check if the phaser can fire</summary>
	///<param name="target">Object to be checked (target)</param>
	function canFire(target : GameObject, upgrades : Upgrades) : boolean {
		var can : boolean = false;
		if(isEnabled && phaser) {
			var isTime : boolean = Time.time >= lastShot + getCooldown(upgrades);
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
	function fire(target : GameObject, repeat : int, wep : shipWeapons, upgrades : Upgrades) {
		lastShot = Time.time;
		
		if(getType() == WeaponType.beam) {
 			wep.StartCoroutine(fireBeam(target, getPoint(target), upgrades));
		} else if (getType() == WeaponType.pulse) {
			wep.StartCoroutine(firePulse(target, repeat, upgrades));
		}
		

	
	}
	
	function firePulse(target : GameObject, repeat : int, upgrades : Upgrades) {
		isFiring = true;
		var time : float = getAlternateFireRate();
		var i : int = 0;
		
		while(i < repeat) {
			for(var point : GameObject in phaserPoint) {
				var pulse : GameObject = getPooledWeapon();
				var ws : weaponScript = pulse.GetComponent(weaponScript);
				ws.setTarget(target);
				ws.setOrigin(point);
				ws.setUpgrade(upgrades);
				pulse.SetActive(true);
			}
			yield WaitForSeconds(time);
			i++;
		}

		
		isFiring = false;
	}
	
	function fireBeam(target : GameObject, origin : GameObject, upgrades : Upgrades) {
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
					
					phaserGO = fireShields(target, origin, or, dir, hit, phaserGO, upgrades);
				} else {
					phaserGO = fireHull(target, origin, or, dir, hit, phaserGO, upgrades);
				}
			} else {
				i = 2;
			}
			yield;
		}
		GameObject.Destroy(phaserGO);
		registerHit(target);
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
		return false;
			
	}
	//pre hasTargetShield()
	private function fireShields(target : GameObject, origin : GameObject, or : Vector3, dir : Vector3, hit : RaycastHit, phaserGO : GameObject, upgrades : Upgrades) : GameObject {
		
		var isHit : boolean = Physics.Raycast(or, dir, hit, getRange(), shieldLayerMask);
		if(isHit) {
			//do phaser logic here
			//get target health script
			var ship : GameObject = getParent(hit.transform).gameObject;
			if(ship.tag.Equals("Ship")) {
				ship.GetComponent(shipHealth).damageShield(getDamage(upgrades) * Time.deltaTime);
			} else if (ship.tag.Equals("Station")) {
				ship.GetComponent(Health).getDamage(getDamage(upgrades) *  Time.deltaTime, true);
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
	
	private function fireHull(target : GameObject, origin : GameObject, or : Vector3, dir : Vector3, hit : RaycastHit, phaserGO : GameObject, upgrades : Upgrades) : GameObject {
		if(Physics.Raycast(or, dir, hit, getRange(), hullLayerMask)) {
				
				//do phaser logic here
				//get target health script
				var ship : GameObject = getParent(hit.transform).gameObject;
				ship.GetComponent(shipHealth).damageHull(getDamage(upgrades) * Time.deltaTime);
				
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
	function getCooldown(upgrades : Upgrades) : float {
			var ws : weaponScript = phaser.GetComponent(weaponScript);
			var cooldown : float = ws.getCooldown();
		 	return cooldown - upgrades.getWeaponRecharge();
	
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
	
	function getNextShot(upgrades : Upgrades) : float{
		return lastShot + getCooldown(upgrades);	
	}
	
	function getDamage(up : Upgrades) : float {
		var damage : float = phaser.GetComponent(phaserScript).damage;
		return damage  + up.getDamageBonus();
	
	}
	
	function setLastShot() {
		lastShot = Time.time;
	}
	
	function getAlternateFireRate() : float {
		var scr : weaponScript = phaser.GetComponent(weaponScript);
		return scr.getAlternateRate();
	}
	
	function getPooledWeapon() : GameObject {
		var pools : GameObject[] = GameObject.FindGameObjectsWithTag("Pooler");
		var pool : GameObject = null;
		var i : int = 0;
		while(i < pools.Length && pool == null) {
			if(pools[i].GetComponent(ObjectPooler).equals(phaser)) {
				pool = pools[i];
			}
			i++;
		}
		
		return pool.GetComponent(ObjectPooler).getObject();
	
	}
	
	function registerHit(target : GameObject) {
		if(target && target.tag == "Ship") {
			registerShipHit(target);
		}

	}
	
	private function registerShipHit(ship : GameObject) {
		var health : shipHealth = ship.GetComponent(shipHealth);
		health.setLastHitter(ship);
	}
	
	function getEnergyCost() : float {
		var weap : weaponScript = phaser.GetComponent(weaponScript);
		return weap.getEnergyCost();
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
	
	function fire(target : GameObject, num : int, upgrades : Upgrades) {
		
		nextShot = Time.time + (getCooldown(upgrades)) * num;
		
		for(var x : int = 0; x < num; x++) {
			var torp : GameObject = getPooledWeapon();
			if(torp) {
				
				var ws : weaponScript = torp.GetComponent(weaponScript);
				ws.setTarget(target);
				ws.setOrigin(torpedoPoint);
				ws.setUpgrade(upgrades);
				torp.SetActive(true);
			yield WaitForSeconds(rate);
			} else {
				Debug.LogWarning(torpedoPoint.transform.parent.parent.parent.name + "Isn't getting any torpedo!");
			}
		}
	
	}
	
	///<summary>This returns the weapon cooldown</summary>
	function getCooldown(upgrades : Upgrades) : float {
		 return torpedo.GetComponent(weaponScript).getCooldown() - upgrades.getWeaponRecharge();
	
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
	
	function getEnergyCost() : float {
		var weap : weaponScript = torpedo.GetComponent(weaponScript);
		return weap.getEnergyCost();
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
private var target : shipTarget;
private var properties : shipProperties;
private var upgrades : Upgrades;
private var reactor : ShipReactor;

//volley
var torpVolley : Volley;




function Start() {
	target = gameObject.GetComponent(shipTarget);
	properties = gameObject.GetComponent(shipProperties);
	upgrades = gameObject.GetComponent(Upgrades);
	reactor = gameObject.GetComponent(ShipReactor);


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
	
	
		if(phaser.canFire(target.target, upgrades)) {
			var cost : float = phaser.getEnergyCost();
			if(reactor.hasEnough(cost)) {
				phaser.fire(target.target, volleyNum(), this, upgrades);
				reactor.spend(cost);		
			}
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
			var cost : float = torp.getEnergyCost();
			if(reactor.hasEnough(cost)) {
				StartCoroutine(torp.fire(target.target, volleyNum(), upgrades));
				reactor.spend(cost);
			}
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

function setVolleyOne() {
	torpVolley = Volley.one;
}

function toggleVolley(volley : Volley) {
	if(torpVolley != volley) {
		torpVolley = volley;
	} else {
		setVolleyOne();
	}
}





