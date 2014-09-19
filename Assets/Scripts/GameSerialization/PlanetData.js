#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("PlanetData")
public class PlanetData extends Data{
	@XmlAttribute("name")
	var name : String;
	@XmlAttribute("faction")
	var faction : int;
	@XmlAttribute("scene")
	var scene : String;
	var description : String;
	var image : String;
	var cood : Vector2;
	var defenseFleet : List.<ShipData>;
	var stations : List.<StationData>;
	
	var population : float;
	var reputation : int;
	var dilithium : boolean;
	var profit : int;
	
	var hasPlayerVisit : boolean;
	var isColonized : boolean;
	@XmlAttribute("enabled")
	var isEnabled : boolean;
	
	function PlanetData() {
		name = "";
		faction = 0;
		scene = "";
		description = "";
		image = "";
		cood = new Vector2();
		defenseFleet = new List.<ShipData>();
		stations = new List.<StationData>();
		population = 0f;
		reputation = 0;
		dilithium = false;
		profit = 0;
		hasPlayerVisit = false;
		isColonized = false;
		isEnabled = false;
	
	}
	
	function PlanetData(planet : PlanetInfo) {
		this();
		name = planet.name;
		faction = planet.faction;
		scene = planet.scene;
		description = planet.description;
		image = planet.image ? planet.image.name : "null";
		cood = planet.cood.getVector();
		
			
		for(var f : SaveShip in planet.defenseFleet) {
			defenseFleet.Add(new ShipData(f));
		}
		
		for(var s : SaveStation in planet.stations) {
			stations.Add(new StationData(s));
		}
		
		population = planet.population;
		reputation = planet.reputation;
		dilithium = planet.dilithium;
		profit = planet.profit;
		hasPlayerVisit = planet.hasPlayerVisit;
		isColonized = planet.isColonized;
		isEnabled = planet.isEnabled;
		 		 		
		
	}
	
	function getImage() : Texture {
		return Resources.Load(image) as Texture;
	}


}
