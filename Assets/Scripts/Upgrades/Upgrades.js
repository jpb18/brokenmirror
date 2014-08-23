import System.Collections.Generic;
#pragma strict
class Upgrades extends MonoBehaviour {
	var upgrades : List.<GameObject>;
	var activeUpgrades : List.<UpgradeClass>;
	
	private var reactor : ShipReactor;
	private var props : shipProperties;
	
	public static final var ACT_LIMIT : int = 5;
	public static final var UP_START : int = 4;
	public static final var KEY_CODE : String = "Fire{0}"; 
	
	private var keys : List.<String>;
	private var last : float[];
	public static final var TIME : float = 0.2f;

	function Start () {
		keys = new List.<String>();
		for(var x : int = 0; x < ACT_LIMIT; x++) {
			var str : String = String.Format(KEY_CODE, x + UP_START);
			keys.Add(str);
		}
		last = new float[ACT_LIMIT];
		for(x = 0; x < ACT_LIMIT; x++) {
			last[x] = 0;
		}
		reactor = gameObject.GetComponent(ShipReactor);
		props = gameObject.GetComponent(shipProperties);

	}

	function Update () {
		var activeList : List.<Active> = getActiveUpgradesList();
		if(props.getPlayer()) {
			checkUsage(activeList);
		}
		checkConsumption(activeList);
		
		
	}
	
	private function checkUsage(activeList : List.<Active>) {
		for(var x : int = 0; x < activeList.Count; x++) {
			if(Input.GetAxis(keys[x]) && hasTimeIntervalPassed(x)) {
				last[x] = Time.time;
				var up : Active = activeList[x];
				if(up.canUse()) {
					if(!up.isActive()) {
						up.use(gameObject);
						
					} else {
						if(up.isDisabable()) {
							up.disable(gameObject);
						}
					}
					
				}
				
			}
		
		}
	}
	
	private function checkConsumption(activeList : List.<Active>) {
		var up : GameObject;
		var scr : IActive;
		var cons : float;
		for(var active : Active in activeList) {
			if(active.isActive()) {
				up = active.getUpgrade();
				scr = up.GetComponent(typeof(IActive)) as IActive;
				cons = scr.getConsumption() * Time.deltaTime;
				if(reactor.hasEnough(cons)) {
					reactor.spend(cons);
				} else {
					active.disable(gameObject);
				} 
			}
		
		}
		
	} 
	
	private function hasTimeIntervalPassed(x : int) {
		return Time.time > last[x] + TIME;
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
	
	function getActiveUpgradesList() : List.<Active> {
		var list : List.<Active> = new List.<Active>();
		for(var up : UpgradeClass in activeUpgrades) {
			list.Add(up as Active);
		}
		return list;
		
	}
	
	function getActiveUpgradesArray() : Active[] {
	
		return getActiveUpgradesList().ToArray();
		
	}
	
	function resetActiveUpgrades() {
		activeUpgrades = new List.<UpgradeClass>();
	}
	
	function setActiveUpgrade(upgrade : GameObject) {
		var active : UpgradeClass = new UpgradeClass(upgrade);
		activeUpgrades.Add(active);
	}
}