import System.Collections.Generic;
#pragma strict
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
	
	function getEnergyCost(num : int) : float {
		var weap : weaponScript = torpedo.GetComponent(weaponScript);
		return weap.getEnergyCost() * num;
	}

}