#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("FactionData")
public class FactionData {
	@XmlAttribute("id")
	var id : int;
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
	
	function FactionData() {
		id = 0;
		name = "";
		race = "";
		prefix = "";
		enemies = new List.<int>();
		allies = new List.<int>();
		ships = new List.<String>();
	}
	
	function FactionData(id : int, name : String, race : String, prefix : String, enemies : List.<int>, allies : List.<int>, ships : List.<GameObject>) {
		this.id = id;
		this.name = name;
		this.race = race;
		this.prefix = prefix;
		this.enemies = enemies;
		this.allies = allies;
		this.ships = new List.<String>();
		for(var ship : GameObject in ships) {
			this.ships.Add(ship.name);
		}	
	}
	
	function getFleet() : List.<GameObject> {
		var fleet : List.<GameObject> = new List.<GameObject>();
		for(var ship : String in ships) {
			fleet.Add(Resources.Load(ship));
		}
		return fleet;
	}
	
	
}

