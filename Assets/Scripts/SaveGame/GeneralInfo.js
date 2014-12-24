import System.IO;
#pragma strict

class PlayerInfo {
	var name : String;
	var race : Race;
	var gameDificulty : Dificulty;
	var allegience : FactionInfo;
	
	
	function PlayerInfo(player : PlayerData) {
		this.name = player.name;
		this.race = Enum.Parse(typeof(Race), player.race);
	}
	
	function setAllegience(faction : FactionInfo) {
		allegience = faction;
	}
	

	
	
		
}

class FactionInfo {
	var factionName : String;
	var factionRace : Race;
	var hostileFactions : List.<int>;
	var alliedFactions : List.<int>;
	var invasionFleet : List.<GameObject>;
	var stations : List.<GameObject>;
	var prefix : String;
	var shipNames : List.<String>;
	var stationNames : List.<String>; 
	
	function FactionInfo() {
		factionName = "";
		factionRace = Race.Unknown;
		hostileFactions = new List.<int>();
		alliedFactions = new List.<int>();
		invasionFleet = new List.<GameObject>();
	}
	
	function FactionInfo(faction : FactionData) {
		this();
		factionName = faction.name;
		factionRace = Enum.Parse(typeof(Race), faction.race);
		prefix = faction.prefix;
		invasionFleet = faction.getFleet();
		stations = faction.getStations();
		hostileFactions = faction.enemies;
		alliedFactions = faction.allies;
		
	}
	
	function getInfo() : FactionInfo {
		
		return this;
	
	}
		
	function setInfo(info : FactionInfo) {
	
		this.factionName = info.factionName;
		this.factionRace = info.factionRace;
		this.hostileFactions = info.hostileFactions;
		this.alliedFactions = info.alliedFactions;
	
	} 
	
	 function getName() : String {
	 	return factionName;
	 }
	 
	 function setName(name : String) {
	 	factionName = name;
	 }
	 
	 function getRace() : Race {
	 	return factionRace;
	 }
	 
	 function isHostile(faction : int) : boolean {
	 	for(var f : int in hostileFactions) {
	 		if(f == faction) {
	 			return true;
	 		}
	 	}
	 	return false;
	 }
	 
	 function isAllied(faction : int) {
	 	for(var f : int in alliedFactions) {
	 		if(f == faction) {
	 			return true;
	 		}
	 	}
	 	return false;
	 }
	 
	 function getFleet() : List.<GameObject> {
	 	return invasionFleet;
	 }
	 
	 function removeHostile(faction : int) {
	 	hostileFactions.Remove(faction);
	 }
	 
	 function removeAlly(faction : int) {
	 	alliedFactions.Remove(faction);
	 }
	 
	 function addAlly(faction : int) {
	 	removeHostile(faction);
	 	if(!alliedFactions.Contains(faction)) {
	 		alliedFactions.Add(faction);
	 	}
	 }
	 
	 function addHostile(faction : int) {
	 	removeAlly(faction);
	 	if(!hostileFactions.Contains(faction)) {
	 		hostileFactions.Add(faction);
	 	}
	 }
	 
	 function getPrefix() : String {
	 	return prefix;
	 }
	 
	 function setPrefix(prefix : String) {
	 	this.prefix = prefix;
	 }
	 
	 function getRandomShipName() : String {
	  	var num : int = Random.Range(0, shipNames.Count-1);
	  	return shipNames[num];
	 }
	 
	 function getRandomStationName() : String {
	 	var num : int = Random.Range(0, stationNames.Count-1);
	 	return stationNames[num];
	 }
	 
	 function hasHostiles() : boolean {
	 	return hostileFactions.Count > 0;
	 }
	 
	 function isPlayerHostile() : boolean {
	 	return isHostile(0);
	 }
	 
	 function getHostileCount() : int {
	 	return hostileFactions.Count;
	 }
	 
	 function pickRandomEnemy() : int {
	 	var rnd : int = Random.Range(0, hostileFactions.Count);
	 	return hostileFactions[rnd];
	 }
	 
	 function getCommonEnemies(faction : FactionInfo) : List.<int> {
	
	 	var enemies : List.<int> = new List.<int>();
	 	for(var enemy : int in hostileFactions)	 {
	 		if(faction.isHostile(enemy)) {
	 			enemies.Add(enemy);
	 		}
	 	}
	 	return enemies;
	 }
	 
	 function hasCommonEnemies(faction : FactionInfo) : boolean {
	 	return getCommonEnemies(faction).Count > 0;
	 }
	 
	function Equals(obj : Object) {
		
		if(!(obj instanceof FactionInfo)) {
			return false;
		}
		
		var fac : FactionInfo = obj as FactionInfo;
		
		if(this.factionName != fac.getName()) {
			return false;
		}
		
		return true;
	
	}
	 
	 private function getGameObjectList(names : List.<String>) : List.<GameObject> {
	 	
	 	var list : List.<GameObject> = new List.<GameObject>();
	 	for(var x : int = 0; x < names.Count; x++) {
	 		var name : String = names[x];
	 		list.Add(Resources.Load(name) as GameObject);
	 	}
	 	return list;
	 }

}


enum Dificulty {
	Easy, //Slow reacting bots
	Medium, //Average reacting bots
	Hard, //Bots react as fast as humans
	Hardcore //Superhuman bots

}

var playerInfo : PlayerInfo;
var factionInfo : List.<FactionInfo>;
var merchantFleet : GameObject[];

function getFactionInfo(faction : int) : FactionInfo {

	return factionInfo[faction];

}

function GetFactionByName(name : String) : FactionInfo {
	for(var i : int = 0; i < factionInfo.Count; i++) {
		if(factionInfo[i].getName().Equals(name)) {
			return factionInfo[i];
		}
	}
	return null;
}

function getFactionIdByName(name : String) : int {
	for(var i : int = 0; i < factionInfo.Count; i++) {
		if(factionInfo[i].getName().Equals(name)) {
			return i;
		}
	}
	return -1;
}

function setPlayer(player : PlayerData) {
	playerInfo = new PlayerInfo(player);
}

function setFactions(factions : List.<FactionData>) {
	factionInfo = new List.<FactionInfo>();
	
	for(var faction : FactionData in factions) {
		factionInfo.Add(new FactionInfo(faction));
	}

}

function setPlayerFactionName(name : String) {
	factionInfo[0].setName(name);
}

function setPlayerFactionPrefix(prefix : String) {
	factionInfo[0].setPrefix(prefix);
}

function getPlayerName() : String {
	return playerInfo.name;
}

function setPlayerName(name : String) {
	playerInfo.name = name;
}

function getPlayerRace() : Race {
	return playerInfo.race;
}

function setPlayerRace(race : Race) {
	playerInfo.race = race;
	factionInfo[0].factionRace = race;
}

function getDificulty() : Dificulty {
	return playerInfo.gameDificulty;
}

function getPlayerPrefix() : String {
	return playerInfo.allegience.getPrefix();
}

function getFactionId(faction : FactionInfo) : int {
	for(var i : int = 0; i < factionInfo.Count; i++) {
		if(factionInfo[i] == faction) {
			return i;
		}
	}
	return -1;
}

function Start () {
	playerInfo.setAllegience(getFactionInfo(0));
}

function isFactionEnemies(faction1 : int, faction2 : int) : boolean {
	var faction : FactionInfo = getFactionInfo(faction1);
	return faction.isHostile(faction2);

}

function isFactionAllies(faction1 : int, faction2 : int) : boolean {
	var faction : FactionInfo = getFactionInfo(faction1);
	return faction.isAllied(faction2);
}

function getRandomMerchantShip() : GameObject {
	return merchantFleet[Random.value * (merchantFleet.Length -1)];
}

