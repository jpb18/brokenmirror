#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("StationData")
public class StationData extends Data {

	//basic info
	@XmlAttribute("name")
	var name : String;
	@XmlAttribute("faction")
	var faction : int;
	var position : Vector3;
	
	//commerce
	var items : List.<String>;
	var ships : List.<String>;
	var	plans : List.<String>;
	var upgrades : List.<String>;
	
	//prefab
	@XmlAttribute("prefab")
	var prefab : String;
	
	function StationData() {
		name = "";
		faction = 0;
		position = new Vector3();
		
		items = new List.<String>();
		ships = new List.<String>();
		plans = new List.<String>();
		upgrades = new List.<String>();
		
		prefab = "";
	
	}
	
	function StationData(station : SaveStation) {
		this();
		this.name = station.name;
		this.faction = station.faction;
		this.position = station.position;
		
		for(var i : GameObject in station.items) {
			items.Add(i.name);
		}
		
		for (var s : GameObject in station.ships) {
			ships.Add(s.name);
		}
		
		for(var p : GameObject in station.plans) {
			plans.Add(p.name);
		}
		
		for(var u : GameObject in station.upgrades) {
			upgrades.Add(u.name);
		}
		
		prefab = station.prefab.name;
		
		
	}
	
	function getItems() : List.<GameObject> {
		return super.getGameObjectList(items);
	}
	
	function getShips() : List.<GameObject> {
		return super.getGameObjectList(ships);
	}
	
	function getPlans() : List.<GameObject> {
		return super.getGameObjectList(plans);
	}
	
	function getUpgrades() : List.<GameObject> {
		return super.getGameObjectList(upgrades);
	}
	
	function getPrefab() : GameObject {
		return super.getGameObject(prefab);
	}


}
