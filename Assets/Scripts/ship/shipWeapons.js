import System.Collections.Generic;
#pragma strict

enum Volley {
	one,
	three,
	five,
	eight

}

public class shipWeapons extends MonoBehaviour implements IWeaponable {

	//weapons
	var phaser : Phaser;
	var torp1 : Torpedo;
	var torp2 : Torpedo;

	//needed scripts
	private var target : shipTarget;
	private var properties : shipProperties;
	private var upgrades : Upgrades;
	private var reactor : ShipReactor;
	private var balance : ReactorBalance;

	//volley
	var torpVolley : Volley;




	function Start() {
		target = gameObject.GetComponent(shipTarget);
		properties = gameObject.GetComponent(shipProperties);
		upgrades = gameObject.GetComponent(Upgrades);
		reactor = gameObject.GetComponent(ShipReactor);
		balance = gameObject.GetComponent.<ReactorBalance>();

	}

	function Update() {
		if(properties.getRedAlert() && !properties.isCloaked()) {
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
				var cost : float = phaser.getEnergyCost(volleyNum());
				if(reactor.hasEnough(cost)) {
					phaser.fire(target.target, volleyNum(), this, upgrades, balance);
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
				var cost : float = torp.getEnergyCost(volleyNum());
				if(reactor.hasEnough(cost)) {
					StartCoroutine(torp.fire(target.target, volleyNum(), upgrades, balance));
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

	function getPhaser() : GameObject {
		return phaser.phaser;
	}
	
	function getForwardTorpedo() : GameObject {
		return torp1.torpedo;
	}
	
	function getBackwardTorpedo() : GameObject {
		return torp2.torpedo;
	}
	
	
	function isPhaserEnabled() : boolean {
		return this.phaser.isEnabled;
	}
	
	function isForwardTorpedoEnabled() : boolean {
		return this.torp1.isEnabled;
	}
	
	function isBackwardTorpedoEnabled() : boolean {
		return this.torp2.isEnabled;
	}


}

