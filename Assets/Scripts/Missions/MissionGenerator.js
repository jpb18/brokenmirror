#pragma strict
import System.Collections.Generic;
import System.Random;

var cargoItems : List.<GameObject>;
var cargoMax : int;
var combatMax : int;
private var r : System.Random;

private var map : MapInfo;
private var general : GeneralInfo;

function Start() {
	map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
	r = new System.Random();
}

function generateTradeMission() : TradeMission {
	var cargo : Cargo = generateCargo();
	var destination : String = getDestination();
	var mission : TradeMission = new TradeMission(destination, cargo);
	return mission;	
}

function hasCommonEnemies(emp : FactionInfo) : boolean {
	return general.getFactionInfo(0).hasCommonEnemies(emp);
}

function generateCombatMission(employer : FactionInfo) : CombatMission {
	var target : FactionInfo = pickTarget(selectCommonEnemies(employer));
	var objective : int = r.Next(1, combatMax + 1);
	return new CombatMission(target, employer, objective);
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

function pickTarget(targets : List.<FactionInfo>) : FactionInfo {
	var num : int = r.Next(0, targets.Count - 1);
	return targets[num];
	
}

function selectCommonEnemies(emp : FactionInfo) : List.<FactionInfo> {
	var player : FactionInfo = general.getFactionInfo(0);
	var e : List.<int> = player.getCommonEnemies(emp);
	var enemies : List.<FactionInfo> = new List.<FactionInfo>();
	for(var i : int in e) {
		enemies.Add(general.getFactionInfo(i));
	}
	return enemies;
}
