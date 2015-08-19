import System.Collections.Generic;
#pragma strict

class PlanetInfo implements IPopuleable, IProfitable, IConquerable { //this class stores all planet information necessary for the map
	
	var name : String;
	var isEnabled : boolean;
	var faction : int;
	var scene : String;
	var description : String;
	var image : Texture;
	var cood : PlanetCood;
	var defenseFleet : List.<SaveShip>;
	var stations : List.<SaveStation>;
	var constructions : List.<Construction>;
	var phenomenons : List.<PhenomenonData>;
	
	var population : float;
	var reputation : int;
	var dilithium : boolean;
	var deuranium : boolean = true;
	var profit : int;
	
	var hasPlayerVisit : boolean = false;
	var isColonized : boolean = false;
	
	//these are to assist station placement
	var bodyLocation : Vector3[]; //here goes each of the celestial bodies locations...
	var minimumDistance : float[]; //and here goes the minimum distance from each one...
	var maximumDistance : float[]; //and here goes the maximum distance from each one...
	private static final var MIN_STATION_DISTANCE : int = 9; //minimum distance between stations, squared
	
	function PlanetInfo() {
		defenseFleet = new List.<SaveShip>();
		stations = new List.<SaveStation>();
		cood = new PlanetCood();
		constructions = new List.<Construction>();
	}
	
	function PlanetInfo(planet : PlanetData) {
		this();
		name = planet.name;
		faction = planet.faction;
		scene = planet.scene;
		description = planet.description;
		image = planet.getImage();
		cood.setVector(planet.cood);
		population = planet.population;
		reputation = planet.reputation;
		dilithium = planet.dilithium;
		profit = planet.profit;
		isEnabled = planet.isEnabled;
		hasPlayerVisit = planet.hasPlayerVisit;
		isColonized = planet.isColonized;
		for(var ship : ShipData in planet.defenseFleet) {
			defenseFleet.Add(new SaveShip(ship));
		}
		
		for(var station : StationData in planet.stations) {
			stations.Add(new SaveStation(station));
		}
		
		for(var phenomenon : PhenomenonSaveData in planet.phenomenons) {
			phenomenons.Add(new PhenomenonData(phenomenon));
		}
	
	}
	
	class PlanetCood {
		
		var x : int;
		var y : int;
		
		
		function PlanetCood() {
			x = 0;
			y = 0;
		}
		
		function getVector() : Vector2 {
			return new Vector2(x,y);
		}
		
		function setVector(vector : Vector2) {
			x = vector.x;
			y = vector.y;
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
	
	function hasShipDefense(ship : GameObject) : int {
		
		for(var x : int = 0; x < defenseFleet.Count; x++) {
			if(defenseFleet[x].Equals(ship)) {
				return x;
			}
		
		}
		
		return -1;
		
	}
	
	function removeDefenseShip(ship : GameObject) {
		var pos : int = hasShipDefense(ship);
		if(pos > -1) {
			defenseFleet.RemoveAt(pos);
		}
	
	}
	
	function addStation(station : SaveStation) {
		stations.Add(station);
	}
	
	function removeFinishedConstructions() {
		for(var x : int = constructions.Count - 1; x >= 0; x--) {
			if(constructions[x].end) {
				constructions.RemoveAt(x);
			}
		
		}
	}
	function addConstruction(construction : Construction) {
		constructions.Add(construction);
	}
	
	function killPopulation(amount : float) : float {
		var ret : float = 0;
		if(amount >= population) {
			ret = amount - population;
			population = 0;
			isColonized = false;
		} else {
			ret = amount;
			population -= amount;
		}
		return ret;
	}
	
	function growPopulation(amount : float) : float {
		population += amount;
		return population;
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
		if(fleet.Count <= 0) return null;
	
		var num : int = Random.Range(0, fleet.Count-1);
		var ship : GameObject = fleet[num];
		var newShip : SaveShip = new SaveShip(ship, faction);
		defenseFleet.Add(newShip);
		return ship;
	}
	
	function addRandomStation(stations : List.<GameObject>, faction : FactionInfo, stardate : int) : GameObject {
		if(stations.Count <= 0) return null;
		
		//pick station
		var num : int = Random.Range(0, stations.Count - 1);
		var station : GameObject = stations[num];
		
		//get its coordinates
		var cood : Vector3 = getStationCoordinate();
		
		//now get its name
		var name : String = faction.getRandomStationName();
						
		//and now generate construction
		var const : Construction = new Construction(stardate, name, this.faction, cood, station);
		this.constructions.Add(const);
		
		//return selected station
		return station;
	}
	
	private function getStationCoordinate() : Vector3 {
		//first pick a celestial body and get its coordinates
		var rnd : int = Random.Range(0, bodyLocation.Length - 1);
		var bodyCood : Vector3 = bodyLocation[rnd];
		
		//now lets find a suitable set of coordinates...
		var cood : Vector3;
		do {
			cood = bodyCood + (Random.insideUnitSphere * Random.Range(minimumDistance[rnd], maximumDistance[rnd]));
		} while (isOverlaping(cood));
		
		return cood;
		
	}
	
	private function isOverlaping(cood : Vector3) : boolean {
		var distance : float; //lets put it here, since its called through the entire code, and we don't want to be 
							  //allocating a new variable with each loop
							  
		//first check the planets
		//cycle through all celestial bodies in system
		for(var i : int = 0; i < bodyLocation.Length; i++) {
			var bodyCood : Vector3 = bodyLocation[i];
			distance = (cood - bodyCood).sqrMagnitude; //using squared magnitude because it's much faster than magnitude
			if(distance < minimumDistance[i] * minimumDistance[i]){ //if the squared distance is smaller than the 
															  //square of minimum distance
				return true;						   //return true
			}		
		}
		
		//then check each of the stations
		//cycle through all the stations in system
		for(var station : SaveStation in stations) {
			var stationCood : Vector3 = station.position;
			distance = (cood - stationCood).sqrMagnitude;
			if(distance < MIN_STATION_DISTANCE) { 
				return true;
			}
		}
		
		//and finally each of the existing constructions
		for(var construction : Construction in constructions) {
			var constructionCood : Vector3 = construction.position;
			distance = (cood - constructionCood).sqrMagnitude;
			if(distance < MIN_STATION_DISTANCE) {
				return true;
			}
		}
	
		//if none of the above complies
		return false;
	
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
		
		if(constructions.Count > 0) {
			str++;
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
	
	function canColonize() : boolean {
		return population <= 0 && !isColonized;
	}
	
	function colonize(faction : int, population : float) {
		this.faction = faction;
		this.population = population;
		this.isColonized = true;
		this.reputation = 100;
	}
	
	function canConquer(faction : int) : boolean {
		if(this.faction == faction) {
			return false;
		}
		
		if(getStrenght() > 0) {
			return false;
		}
		
		return true; 
		
	}
	
	function conquer(faction : int) {
		this.faction = faction;
	}

}