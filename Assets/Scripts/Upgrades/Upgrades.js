import System.Collections.Generic;
#pragma strict

var upgrades : List.<GameObject>;

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