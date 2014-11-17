#pragma strict
import System.Globalization;

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
	
	function getDetailsDescription() : String {
		var description : String = super.description + "\n";
		if(weaponRecharge != 0) {
			description = description + "Weapon Recharge Bonus: " + formatValue(weaponRecharge) + "\n";
		}
		
		if(weaponDamage != 0) {
			description = description + "Weapon Damage Bonus: " + formatValue(weaponDamage) + "\n";
		}
		
		if(shieldRecharge != 0) {
			description = description + "Shield Recharge Bonus: " + formatValue(shieldRecharge) + "\n";
		}
		
		if(shieldStrenght != 0) {
			description = description + "Shield Strenght Bonus: " + formatValue(shieldStrenght) + "\n";
		}
		
		if(hullStrenght != 0) {
			description = description + "Hull Strenght Bonus: " + formatValue(hullStrenght) + "\n";
		}
		
		if(speedIncrease != 0) {
			description = description + "Speed Increase Bonus: " + formatValue(speedIncrease) + "\n";
		}
		
		if(agilityTurn != 0) {
			description = description + "Agility Bonus: " + formatValue(agilityTurn) + "\n";
		}
		
		if(this.reactorRecharge != 0) {
			description = description + "Reactor Recharge Bonus: " + formatValue(reactorRecharge) + "\n";
		}
		
		
		return description;
	}
	
	private function formatValue(val : float) : String {
		return val.ToString("F", CultureInfo.InvariantCulture);
	}

}