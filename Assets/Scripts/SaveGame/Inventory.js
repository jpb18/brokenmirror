import System.Collections.Generic;
#pragma strict


//@tooltip("Items on inventory.")
var items : List.<GameObject>;
//@tooltip("Maximum capacity of inventory.")
var maxSize : int = 30;
//@tooltip("Player's latinum.")
var latinum : int = 5000;


//var guiInventory : ResourcePanel;


function addItem(item : GameObject) {
	
	
		items.Add(item);
		
}

function removeItem(item : GameObject) {
	if(items.Contains(item)) {
		items.Remove(item);
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

function serialize() : String {
	var serie : String = latinum + "\n";
	serie = serie + maxSize + "\n";
	serie = serie + items.Count + "\n";
	for(var item : GameObject in items) {
		serie = serie + item.name + "\n";
	}
	return serie;
}

function readFromFile(stream : StreamReader) {
	latinum = int.Parse(stream.ReadLine());
	maxSize = int.Parse(stream.ReadLine());
	items = getItemsList(stream);
}

private function getItemsList(stream : StreamReader) : List.<GameObject> {
	var count : int = int.Parse(stream.ReadLine());
	var list : List.<GameObject> = new List.<GameObject>();
	for(var x : int = 0; x < count; x++) {
		var name : String = stream.ReadLine();
		var go : GameObject = Resources.Load(name) as GameObject; 
		list.Add(go);
	}
	return list;
}