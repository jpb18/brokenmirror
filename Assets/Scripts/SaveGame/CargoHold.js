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

function serialize() : String {
	var serie : String = capacity + "\n";
	serie = serie + cargoItems.Count + "\n";
	for(var item : Cargo in cargoItems) {
		serie = serie + item.serialize();
	}
	return serie;
}

function readFromFile(stream : StreamReader) {
	capacity = int.Parse(stream.ReadLine());
	cargoItems = getCargoItemsList(stream);
}

function getCargoItemsList(stream : StreamReader) : List.<Cargo> {
	var count : int = int.Parse(stream.ReadLine());
	var list : List.<Cargo> = new List.<Cargo>();
	for(var x : int = 0; x < count; x++) {
		var go : GameObject = Resources.Load(stream.ReadLine()) as GameObject;
		var size : int = int.Parse(stream.ReadLine());
		var price : int = int.Parse(stream.ReadLine());
		var cargo : Cargo = new Cargo(go, size, price);
		list.Add(cargo);		
	}
	return list;
}

function setHold(data : CargoData) {
	capacity = data.capacity;
	cargoItems = data.getCargo();
}

function getCargoArray() : Cargo[] {
	return cargoItems.ToArray();
}
