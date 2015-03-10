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



enum Dificulty {
	Easy, //Slow reacting bots
	Medium, //Average reacting bots
	Hard, //Bots react as fast as humans
	Hardcore //Superhuman bots

}

var playerInfo : PlayerInfo;
var factionInfo : List.<FactionInfo>;


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

function GetPlayerAllegianceId() : int {
	var name : String =  playerInfo.allegience.factionName;
	return getFactionIdByName(name);
}

function SetPlayerAllegiance(faction : FactionInfo) {
	playerInfo.allegience = faction;
	
	factionInfo[0].hostileFactions = faction.hostileFactions;
	factionInfo[0].alliedFactions = faction.alliedFactions;
	factionInfo[0].alliedFactions.Add(getFactionIdByName(faction.factionName));
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


