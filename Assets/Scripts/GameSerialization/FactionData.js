#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("FactionData")
public class FactionData {
	@XmlAttribute("name")	
	var name : String;
	@XmlAttribute("race")
	var race : String;
	@XmlAttribute("prefix")
	var prefix : String;
	
	@XmlArray("Enemies")
	@XmlArrayItem("Enemy")
	var enemies : List.<int>;
	
	@XmlArray("Allies")
	@XmlArrayItem("Ally")
	var allies : List.<int>;
	
	@XmlArray("Fleet")
	@XmlArrayItem("Ship")
	var ships : List.<String>;
	
	@XmlArray("Stations")
	@XmlArrayItem("Station")
	var stations : List.<String>;
	
	function FactionData() {
		name = "";
		race = "";
		prefix = "";
		enemies = new List.<int>();
		allies = new List.<int>();
		ships = new List.<String>();
		stations = new List.<String>();
	}
	
	function FactionData(name : String, race : Race, prefix : String, enemies : List.<int>, allies : List.<int>, ships : List.<GameObject>, stations : List.<GameObject>) {

		this.name = name;
		this.race = race.ToString();
		this.prefix = prefix;
		this.enemies = enemies;
		this.allies = allies;
		this.ships = new List.<String>();
		for(var ship : GameObject in ships) {
			this.ships.Add(ship.name);
		}
		
		this.stations = new List.<String>();
		for(var station : GameObject in stations) {
			this.stations.Add(station.name);
		}		
	}
	
	function FactionData(faction : FactionInfo) {
		this(faction.getName(), faction.getRace(), faction.getPrefix(), faction.hostileFactions, faction.alliedFactions, faction.invasionFleet, faction.stations);
	}
	
	function getFleet() : List.<GameObject> {
		var fleet : List.<GameObject> = new List.<GameObject>();
		for(var ship : String in ships) {
			fleet.Add(Resources.Load(ship));
		}
		return fleet;
	}
	
	function getStations() : List.<GameObject> {
		var stations : List.<GameObject> = new List.<GameObject>();
		for(var station : String in this.stations) {
			stations.Add(Resources.Load(station));
		}
		return stations;	
	}
	
	
}

