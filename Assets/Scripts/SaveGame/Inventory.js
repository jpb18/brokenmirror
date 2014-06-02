import System.Collections.Generic;
#pragma strict


//@tooltip("Items on inventory.")
var items : List.<GameObject>;
//@tooltip("Maximum capacity of inventory.")
var maxSize : int = 30;
//@tooltip("Player's latinum.")
var latinum : int = 5000;
//@tooltip("Player's deuranium.")
var dilithium : int = 5000;

//var guiInventory : ResourcePanel;


function addItem(item : GameObject) {
	
	items.Add(item);
	
}

function isFull() : boolean {
	
	return items.Count >= maxSize;
	
}

function resize(addSlots : int) {

	maxSize += addSlots;

}

function canBuy(latinum : int, dilithium : int) : boolean{

	return this.latinum >= latinum && this.dilithium >= dilithium;
}

function spend(latinum : int, dilithium : int) {
	this.latinum -= latinum;
	this.dilithium -=dilithium;
}

function getDilithium() : int {
	return this.dilithium;
}

function getLatinum() : int {
	return this.latinum;
}