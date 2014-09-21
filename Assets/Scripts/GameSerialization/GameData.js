#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("GameData")
public class GameData {
	@XmlAttribute("name")
	var name : String;
	@XmlAttribute("date")
	var date : String;
	@XmlAttribute("stardate")
	var stardate : int;
	@XmlAttribute("current")
	var currentSystem : String;

	var player : PlayerData;
	var factions : List.<FactionData>;
	var map : MapData;
	var missions : MissionsData;
	
	function GameData() {
		name = "";
		date = "";
		stardate = 0;
		currentSystem = "";
		player = new PlayerData();
		factions = new List.<FactionData>();
		map = new MapData();
		missions = new MissionsData();
	}
	
	function GameData(name : String, general : GeneralInfo, inventory : Inventory, hold : CargoHold, save : SaveGame, stardate : Stardate, map : MapInfo, missions : Missions) {
		this.name = name;
		this.stardate = stardate.stardate;
		date = DateTime.Now.ToString();
		player = new PlayerData(general.getPlayerName(), general.getPlayerRace(), 0, inventory, hold, save);
		currentSystem = Application.loadedLevelName;
		this.factions = new List.<FactionData>();
		var facs : List.<FactionInfo> = general.factionInfo;
		for(var x : int = 0; x < facs.Count; x++) {
			var faction : FactionInfo = facs[x];
			var f : FactionData = new FactionData(faction.getName(), faction.getRace(), faction.getPrefix(), faction.hostileFactions, faction.alliedFactions, faction.invasionFleet);
			this.factions.Add(f);
		}
		this.map = new MapData(map);
		this.missions = new MissionsData(missions);
	}
	

	
	function getFactionList() : List.<FactionData> {
		return factions;
	}
	
	function getPlayer() : PlayerData {
		return player;
	}
	
	function getPlayerFaction() : FactionData {
		return factions[0];
	}

}