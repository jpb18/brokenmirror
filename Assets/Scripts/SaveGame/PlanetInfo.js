import System.Collections.Generic;
#pragma strict

class PlanetInfo implements IPopuleable, IProfitable { //this class stores all planet information necessary for the map
	var isEnabled : boolean;
	var name : String;
	var faction : int;
	var scene : String;
	var description : String;
	var image : Texture;
	var cood : PlanetCood;
	var defenseFleet : List.<SaveShip>;
	var stations : List.<SaveStation>;
	
	var population : float;
	var reputation : int;
	var dilithium : boolean;
	var profit : int;
	
	var hasPlayerVisit : boolean = false;
	var isColonized : boolean = false;
	
	function PlanetInfo(stream : StreamReader) {
		readFromFile(stream);
	}
	
	class PlanetCood {
		
		var x : int;
		var y : int;
		
		function PlanetCood(stream : StreamReader) {
			readFromFile(stream);
		}
		
		function getVector() : Vector2 {
			return new Vector2(x,y);
		}
		
		function serialize() : String {
			return x + "\n" + y + "\n";
		}
		
		function readFromFile(stream : StreamReader) {
			x = int.Parse(stream.ReadLine());
			y = int.Parse(stream.ReadLine());
		}
	
	}
	
	function getPopulation() : float {
		return population + getStationPopulation();
	}
	
	private function getStationPopulation() : float {
		var popul : float;
		
		for(var station : SaveStation in stations) {
			var pop : IPopuleable = station.prefab.GetComponent(typeof(IPopuleable)) as IPopuleable;
			popul += pop.getPopulation();
			
		}
		
		
		return popul;
	}
	
	function addDefenseShip(ship : GameObject) {
		var s : SaveShip = new SaveShip(ship); 
		defenseFleet.Add(s);
	}
	
	function killPopulation(amount : float) {
		population -= amount;
	}
	
	function growPopulation(amount : float) {
		population += amount;
	}
	
	function getImage() : Texture {
		return image;
	}
	
	//this method return the defense fleet present on the planet
	function getFleet() : List.<SaveShip> {
	
		return defenseFleet;
	
	}
	
	//this method checks if this scene is the wished scene
	function isScene(scene : String) : boolean {
	
		return scene.Equals(this.scene);
	 
	}
	
	function addRandomShip(fleet : List.<GameObject>) : GameObject {
		var num : int = Random.Range(0, fleet.Count-1);
		var ship : GameObject = fleet[num];
		var newShip : SaveShip = new SaveShip(ship, faction);
		defenseFleet.Add(newShip);
		return ship;
	}
	
	function destroyRandomShip() {
		if(defenseFleet.Count > 0) {
			var num : int = Random.Range(0, defenseFleet.Count - 1);
			defenseFleet.RemoveAt(num);			
		}	
	}
	
	function destroyRandomStation() {
		if(stations.Count > 0) {
			var num : int = Random.Range(0, stations.Count - 1);
			stations.RemoveAt(num);	
		}
	}
	
	function getReputation() : int {
		
		return reputation;
		
	}
	
	function getFaction() : int {
		return faction;
	}
	
	function hasDefenseFleet() : boolean {
		return defenseFleet.Count > 0;
	}
	
	function conquer(faction : int, fleet : List.<GameObject>) {
		this.faction = faction;
		setConquerFleet(fleet, faction);
	}
	
	private function setConquerFleet(fleet : List.<GameObject>, faction : int) {
		for(var x : int = 0; x < 6; x++) {
			if(fleet.Count > 0) {
				var ship : GameObject = fleet[Random.Range(0, fleet.Count - 1)];
				var newShip : SaveShip = new SaveShip(ship, faction);
				defenseFleet.Add(newShip);
			}
		}
	}
	
	function addReputation(amount : int) {
		reputation += amount;
	}
	
	function getProfit() : int {
		return profit * population;	
	}
	
	function getStrenght() : int {
		var str : int = 0;
		
		for(var ship : SaveShip in defenseFleet) {
			str += ship.getStrenght();
		}
		
		for(var station : SaveStation in stations) {
			str += station.getStrenght();
		}
		
		
		return str;
	}
	
	function getDefenseShipsByFaction(faction : int) : List.<SaveShip> {
		var list : List.<SaveShip> = new List.<SaveShip>();
		
		for(var ship : SaveShip in defenseFleet) {
			
			if(ship.getFaction() == faction) {
				list.Add(ship);			
			}		
		
		}
		
		return list;
	}
	
	function hasDilithium() : boolean {
		return dilithium;
	}
	
	
	function serialize() : String {
		var serie : String = "";
		
		serie = serie + isEnabled + "\n";
		serie = serie + name + "\n";
		serie = serie + faction + "\n";
		serie = serie + scene + "\n";
		serie = serie + description + "\n";
		//TODO : Planet images
		serie = serie + cood.serialize();
		serie = serie + defenseFleet.Count + "\n";
		for(var ship : SaveShip in defenseFleet) {
			serie = serie + ship.serialize();
		}
		serie = serie + stations.Count + "\n";
		for(var station : SaveStation in stations) {
			serie = serie + station.serialize();
		}
		serie = serie + reputation + "\n";
		serie = serie + hasPlayerVisit + "\n";
		serie = serie + isColonized + "\n";
		//serie = serie + image.name + "\n";
		return serie;
	}
	
	function readFromFile(stream : StreamReader) {
		isEnabled = boolean.Parse(stream.ReadLine());
		name = stream.ReadLine();
		faction = int.Parse(stream.ReadLine());
		scene = stream.ReadLine();
		description = stream.ReadLine();
		//TODO : Planet Images
		cood = new PlanetCood(stream);
		defenseFleet = getSaveShipList(stream);
		stations = getSaveStationList(stream);
		reputation = int.Parse(stream.ReadLine());
		hasPlayerVisit = boolean.Parse(stream.ReadLine());
		isColonized = boolean.Parse(stream.ReadLine());
		//image = Resources.Load(stream.ReadLine()) as Texture2D;
		
	}
	
	private function getSaveShipList(stream : StreamReader) : List.<SaveShip> {
		var count : int = int.Parse(stream.ReadLine());
		var list : List.<SaveShip> = new List.<SaveShip>();
		for(var x : int = 0; x < count; x++) {
			var ship : SaveShip = new SaveShip();
			ship.readFromFile(stream);
			list.Add(ship);
		}
		return list;
	}
	
	private function getSaveStationList(stream : StreamReader) : List.<SaveStation> {
		var count : int = int.Parse(stream.ReadLine());
		var list : List.<SaveStation> = new List.<SaveStation>();
		for(var x : int = 0; x < count; x++) {
			var station : SaveStation = new SaveStation(stream);
			list.Add(station);
		}
		return list;
	}
	
	function colonize(faction : int, population : float) {
		this.faction = faction;
		this.population = population;
		this.isColonized = true;
		this.reputation = 100;
	}

}