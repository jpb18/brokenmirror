#pragma strict
private var time : int;
private var fuel : int;
private var destiny : String;

function setCarry(time : int, fuel : int, destiny : String) {
	this.time = time;
	this.fuel = fuel;
	this.destiny = destiny;
}

function reset() {
	setCarry(0,0,"");
}

function getTime() : int {
	return time;
}

function getFuel() : int {
	return fuel;
}

function getDestiny() : String {
	return destiny;
}