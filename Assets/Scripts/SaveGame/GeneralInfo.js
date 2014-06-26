#pragma strict

class PlayerInfo {
	var name : String;
	var gameDificulty : Dificulty;
	var allegience : FactionInfo;
	var empireName : String;
	
	function setAllegience(faction : FactionInfo) {
		allegience = faction;
	}
	
	function serialize() : String {
		var serie : String = name + "\n";
		serie = serie + gameDificulty.ToString() + "\n";
		serie = serie + empireName + "\n";
		serie = serie + allegience.serialize();
		return serie;		
	}
		
}

class FactionInfo {
	var factionName : String;
	var factionRace : String;
	var hostileFactions : List.<int>;
	var alliedFactions : List.<int>;
	var invasionFleet : List.<GameObject>;
	
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
	 
	 function getRace() : String {
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
	 
	 function hasHostiles() : boolean {
	 	return hostileFactions.Count > 0;
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
	 
	 function serialize() : String {
	 	var serie : String = factionName + "\n";
	 	
	 	serie = serie + factionRace + "\n";
	 	serie = serie + hostileFactions.Count + "\n";
	 	
	 	for(var i : int in hostileFactions) {
	 		serie = serie + i + "\n";
	 	}
	 	
	 	serie = serie + alliedFactions.Count + "\n";
	 	
	 	for(var a : int in alliedFactions) {
	 		serie = serie + a + "\n";
	 	}
	 	
	 	for(var ship : GameObject in invasionFleet) {
	 		serie = serie + ship.name + "\n";
	 	}
	 	
	 	return serie;
	 
	 }

}


enum Dificulty {
	Easy, //Slow reacting bots
	Medium, //Average reacting bots
	Hard, //Bots react as fast as humans
	Hardcore //Superhuman bots

}

var playerInfo : PlayerInfo;
var factionInfo : FactionInfo[];


function getFactionInfo(faction : int) : FactionInfo {

	return factionInfo[faction];

}

function getFactionId(faction : FactionInfo) : int {
	for(var i : int = 0; i < factionInfo.Length; i++) {
		if(factionInfo[i] == faction) {
			return i;
		}
	}
	return -1;
}

function Start () {
	playerInfo.setAllegience(getFactionInfo(0));
}

function serialize() {
	var serie : String = playerInfo.serialize();
	
	for(var fac : FactionInfo in factionInfo) {
		serie = serie + fac.serialize();
	}
	
	return serie;
	
}