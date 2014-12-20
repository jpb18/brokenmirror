#pragma strict
import System.Collections.Generic;

class SaveStation extends System.Object{
	//basic info
	var name : String;
	var faction : int;
	var position : Vector3;
	
	//commerce
	var items : List.<GameObject>;
	var ships : List.<GameObject>;
	var	plans : List.<GameObject>;
	var upgrades : List.<GameObject>;
	
	//prefab
	var prefab : GameObject;
	
	function SaveStation() {
		items = new List.<GameObject>();
		ships = new List.<GameObject>();
		plans = new List.<GameObject>();
		upgrades = new List.<GameObject>();
				
	}
	
	
	function SaveStation(prefab : GameObject, name : String, faction : int, position : Vector3) {
		this();
		this.prefab = prefab;
		this.name = name;
		this.faction = faction;
		this.position = position;
		
		var trade : ITradeable = prefab.GetComponent(typeof(ITradeable)) as ITradeable;
		items = trade.getItemList();
		ships = trade.getShipList();
		plans = trade.getPlanList();
		upgrades = trade.getUpgradeList();		
		
		
	}
	
	function SaveStation(station : StationData) {
		this();
		name = station.name;
		faction = station.faction;
		position = station.position;
		items = station.getItems();
		ships = station.getShips();
		plans = station.getPlans();
		upgrades = station.getUpgrades();
		prefab = station.getPrefab();
	}
	
	//this function sets the station information
	//pre station.tag == "Station"
	function setStation(station : GameObject) {
		//set position
		position = station.transform.position;
		
		//set name, weapons, ships and stations
		var statI : StationInterface = station.GetComponent(StationInterface);
		name = statI.stName;
		items = statI.items;
		ships = statI.ships;
		plans = statI.plans;
		upgrades = statI.upgrades;
		
		//set faction
		var statS : Station = station.GetComponent(Station);
		faction = statS.faction;
		
		//set prefab
		prefab = Resources.Load(station.name) as GameObject;
	
	}
	
	
	
	//this function returns a station
	function getStation() : GameObject {
		var station : GameObject = GameObject.Instantiate(prefab, this.position, prefab.transform.rotation);
		
		//set position
		station.transform.position = position;
		
		//set name, weapons, ships and stations
		var statI : StationInterface = station.GetComponent(StationInterface);
		statI.stName = name;
		statI.items = items;
		statI.ships = ships;
		statI.plans = plans;
		statI.upgrades = upgrades;
		
		//set faction
		var statS : Station = station.GetComponent(Station);
		statS.faction = faction;
		
		return station;
	}
	
	
	function getStrenght() : int {
		var station : Station = prefab.GetComponent(Station);
		return station.getStrenght();
	}
	
	

}
