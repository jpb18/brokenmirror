import System.Collections.Generic;
#pragma strict


//@tooltip("Items on inventory.")
var items : List.<Cargo>;
//@tooltip("Maximum capacity of inventory.")
var maxSize : int = 30;
//@tooltip("Player's latinum.")
var latinum : int = 5000;


//var guiInventory : ResourcePanel;


function addItem(item : Cargo) {
	
	if(items.Contains(item)) {
		var i : Cargo = findItem(item);
		i.addUnit();
	} else {
		items.Add(item);
	}
	
	
}

function removeItem(item : Cargo) {
	if(items.Contains(item)) {
		items.Remove(item);
	}

}

function findItem(item : Cargo) {
	for(var i : Cargo in items) {
		if(item.Equals(i)) {
			return i;
		}
	}

}

function isFull() : boolean {
	
	return items.Count >= maxSize;
	
}

function resize(addSlots : int) {

	maxSize += addSlots;

}

function canBuy(latinum : int) : boolean{

	return this.latinum >= latinum ;
}

function spend(latinum : int) {
	this.latinum -= latinum;
	
}

function addLatinum(latinum : int) {
	this.latinum += latinum;
}

function getLatinum() : int {
	return this.latinum;
}