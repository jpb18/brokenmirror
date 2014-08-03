#pragma strict


public class ShipReactor extends Reactor {

	private var upgrades : Upgrades;

	function Start () {
		super.initReactor();
		upgrades = gameObject.GetComponent(Upgrades);
	}
	
	function recharge() {
		var recharge : float = (rechargeRate + upgrades.getReactorRecharge()) * Time.deltaTime;

		if(capacity < current + recharge) {
			current = capacity;
		}
		else if(capacity > current) {
			current += recharge;
		}

	}


}