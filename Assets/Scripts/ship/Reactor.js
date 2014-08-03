#pragma strict

var capacity : float;
var current : float;
var rechargeRate : float;

function Start () {
	initReactor();

}

function Update () {
	recharge();
}

function recharge() {
	var recharge : float = rechargeRate * Time.deltaTime;

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

function initReactor() {
	current = capacity;
}



