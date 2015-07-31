#pragma strict

var capacity : float;
var current : float;
var rechargeRate : float;

private var skills : Skills;

function Start () {
	initReactor();

}

function Update () {
	recharge();
}

function recharge() {
	var recharge : float = GetRechargeRate() * Time.deltaTime;

	if(capacity < current + recharge) {
		current = capacity;
	}
	else if(capacity > current) {
		current += recharge;
	}

}

function hasPower() : boolean {
	return current > 0;
}

function hasEnough(amount : float) : boolean {
	return amount <= current;
}

function spend(amount : float) {
	current -= amount;
}

function getPercentage() : int {
	return (current/capacity) * 100;
}

function getPowerPercentage() : float {
	return current/capacity;
}

function initReactor() {
	current = capacity;
	skills = GameObject.FindGameObjectWithTag("SaveGame").GetComponent.<Skills>();
}

function GetRechargeRate() : float {
	return rechargeRate + skills.getReactorBonus();
}



