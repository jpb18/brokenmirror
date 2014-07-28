


public class Passive extends Upgrade {
	
	var weaponRecharge : float;
	var weaponDamage : float;
	var shieldRecharge : float;
	var hullStrenght : float;
	var speedIncrease : float;
	var agilityTurn : float;


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

}