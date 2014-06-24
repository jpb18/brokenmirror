import System.Collections.Generic;
#pragma strict

var cargoItems : List.<Cargo>;
var capacity : int;


private var message : ShowMessage;

function Start () {
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);

}

function addCargo(cargo : Cargo) {
	cargoItems.Add(cargo);
}

function isFull() : boolean {
	return getUsage() >= getCapacity();
}

function willBeFull(size : int) : boolean {
	return getUsage() + size >= getCapacity();
}

function getUsage() : int {
	
	var ret : int = 0;
	for(var cargo : Cargo in cargoItems) {
		ret += cargo.getSize();
		
	}
	
	return ret;

}

function getCapacity() : int {
	return capacity;
}

function addCapacity(increase : int) {
	capacity += increase;
}

function removeCargo(cargo : Cargo) {
	var found : boolean = false;
	for(var x : int = cargoItems.Count; x > 0 && !found; x--) {
		if(cargoItems[x - 1] == cargo) {
			cargoItems.RemoveAt(x - 1);
			found = true;
		}
	}
	
}