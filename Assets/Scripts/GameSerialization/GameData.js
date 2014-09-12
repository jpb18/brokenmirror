#pragma strict
import System.Xml.Serialization;
import System.DateTime;
import System.Collections.Generic;

@XmlRoot("GameData")
public class GameData {
	@XmlAttribute("name")
	var name : String;
	@XmlAttribute("date")
	var date : String;
	@XmlAttribute("dificulty")
	var dificulty : String;
	@XmlAttribute("current")
	var currentSystem : String;

	var player : PlayerData;
	var factions : List.<FactionData>;
	
	function GameData() {
		name = "";
		date = "";
		dificulty = "";
		currentSystem = "";
		player = new PlayerData();
		factions = new List.<FactionData>();
	}
	
	function GameData(name : String, general : GeneralInfo, inventory : Inventory) {
		this.name = name;
		this.dificulty = general.getDificulty().ToString();
		date = DateTime.Now.ToString();
		player = new PlayerData(general.getPlayerName(), 0, inventory);
		currentSystem = Application.loadedLevelName;
		this.factions = new List.<FactionData>();
		var facs : List.<FactionInfo> = general.factionInfo;
		for(var x : int = 0; x < facs.Count; x++) {
			var faction : FactionInfo = facs[x];
			var f : FactionData = new FactionData(x, faction.getName(), faction.getRace(), faction.getPrefix(), faction.hostileFactions, faction.alliedFactions, faction.invasionFleet);
			this.factions.Add(f);
		}
		
	}
	
	function getPlayerData() : PlayerData {
		return player;
	}
	
	function getFactionList() : List.<FactionData> {
		return factions;
	}

}