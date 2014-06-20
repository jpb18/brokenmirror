#pragma strict
import System.Collections.Generic;
import System.Random;

var cargoItems : List.<GameObject>;
var cargoMax : int;
private var r : System.Random;

private var map : MapInfo;

function Start() {
	map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	r = new System.Random();
}

function generateTradeMission() : TradeMission {
	var cargo : Cargo = generateCargo();
	var destination : String = getDestination();
	var mission : TradeMission = new TradeMission(destination, cargo);
	return mission;	
}

private function generateCargo() : Cargo {
	var cargoItem : GameObject = pickRandomCargoItem();

	var cargo : Cargo = new Cargo(cargoItem, genCargoSize(), getCargoPrice(cargoItem));
	
	return cargo;
}

private function pickRandomCargoItem() : GameObject {
	
	var rnd : int = r.Next(0, cargoItems.Count - 1);
	
	return cargoItems[rnd];
	
}

private function genCargoSize() : int {
	return (Random.value * cargoMax);
}

private function getCargoPrice(cargo : GameObject) : int {
	return  cargo.GetComponent(CargoItem).getCost();
}

private function getDestination() : String {
	var count : int = map.getPlanetCount();
	
	do {
		var rnd : int = r.Next(0, count-1);
		var planet : PlanetInfo = map.getPlanetByNumber(rnd);
	} while(planet.scene == Application.loadedLevelName);
	return planet.name;
	
}