


public class Passive extends Upgrade {
	
	var weaponRecharge : float;
	var weaponDamage : float;
	var shieldRecharge : float;
	var hullStrenght : float;
	var shieldStrenght : float;
	var speedIncrease : float;
	var agilityTurn : float;
	var reactorRecharge : float;


	function Passive(name : String, cost : int, description : String, image : Texture) {
		super(name , cost , description , image);
	
	}

	//Weapons
	function getWeaponRechargeBonus() : float {
		return weaponRecharge;
	}
	
	function getDamageBonus() : float {
		return weaponDamage;
	}
	
	//Shield
	function getShieldRechargeBonus() : float {
		return shieldRecharge;
	}
	
	function getShieldStrenghtBonus() : float {
		return shieldStrenght;
	}
	
	
	//Hull
	function getHullStrenghtBonus() : float {
		return hullStrenght;
	}

	//Speed
	function getSpeedIncreaseBonus() : float {
		return speedIncrease;
	}
	
	//Agility
	function getAgilityTurnBonus() : float {
		return agilityTurn;
	}
	
	function getReactorRechargeBonus() : float {
		return reactorRecharge;
	} 

}