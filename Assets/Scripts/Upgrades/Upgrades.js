import System.Collections.Generic;
#pragma strict
class Upgrades extends MonoBehaviour {
	var upgrades : List.<GameObject>;
	var activeUpgrades : List.<UpgradeClass>;
	
	public static var ACT_LIMIT : int = 5;

	function Start () {

	}

	function Update () {

	}

	function getSpeedBonus() : float {
		var bonus : float;
		var passive : Passive;
		for(var up : GameObject in upgrades) {
			passive = up.GetComponent(Passive);
			bonus += passive.getSpeedIncreaseBonus();
		
		}
		return bonus;

	}


	function getShieldRecharge() : float {
		var bonus : float;
		var passive : Passive;
		for(var up : GameObject in upgrades) {
			passive = up.GetComponent(Passive);
			bonus += passive.getShieldRechargeBonus();
		
		}
		return bonus;
	}

	function getDamageBonus() : float {
		var bonus : float;
		var passive : Passive;
		for(var up : GameObject in upgrades) {
			passive = up.GetComponent(Passive);
			bonus += passive.getDamageBonus();
		
		}
		return bonus;
	}

	function getWeaponRecharge() : float {
		var bonus : float;
		var passive : Passive;
		for(var up : GameObject in upgrades) {
			passive = up.GetComponent(Passive);
			bonus += passive.getWeaponRechargeBonus();
		
		}
		return bonus;

	}

	function getHullStrenght() : float {
		var bonus : float;
		var passive : Passive;
		for(var up : GameObject in upgrades) {
			passive = up.GetComponent(Passive);
			bonus += passive.getHullStrenghtBonus();
		
		}
		return bonus;
	}

	function getAgilityBonus() : float {
		var bonus : float;
		var passive : Passive;
		for(var up : GameObject in upgrades) {
			passive = up.GetComponent(Passive);
			bonus += passive.getAgilityTurnBonus();
		
		}
		return bonus;
	}

	function getShieldStrenght() : float {
		var bonus : float;
		var passive : Passive;
		for(var up : GameObject in upgrades) {
			passive = up.GetComponent(Passive);
			bonus += passive.getShieldStrenghtBonus();
		
		}
		return bonus;
	}

	function getReactorRecharge() : float {
		var bonus : float;
		var passive : Passive;
		for(var up : GameObject in upgrades) {
			passive = up.GetComponent(Passive);
			bonus += passive.getReactorRechargeBonus();
		
		}
		return bonus;
		
	}
	
	function getActiveUpgrades() : List.<Active> {
		var list : List.<Active> = new List.<Active>();
		for(var up : UpgradeClass in activeUpgrades) {
			list.Add(up as Active);
		}
		return list;
		
	}
}