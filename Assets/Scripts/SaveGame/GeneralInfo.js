import System.IO;
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
	
	function readFromFile(stream : StreamReader) {
		name = stream.ReadLine();
		gameDificulty = System.Enum.Parse(typeof(Dificulty), stream.ReadLine());
		empireName = stream.ReadLine();
		allegience.readFromFile(stream);
		
	}
		
}

class FactionInfo {
	var factionName : String;
	var factionRace : String;
	var hostileFactions : List.<int>;
	var alliedFactions : List.<int>;
	var invasionFleet : List.<GameObject>;
	
	function FactionInfo() {
		factionName = "";
		factionRace = "";
		hostileFactions = new List.<int>();
		alliedFactions = new List.<int>();
		invasionFleet = new List.<GameObject>();
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
	 	
	 	serie = serie + invasionFleet.Count + "\n";
	 	for(var ship : GameObject in invasionFleet) {
	 		serie = serie + ship.name + "\n";
	 	}
	 	
	 	return serie;
	 
	 }
	 
	 function readFromFile(stream : StreamReader) {
	 	factionName = stream.ReadLine();
	 	factionRace = stream.ReadLine();
	 	
	 	//get hostile list
	 	hostileFactions = getIntList(stream);
	 	
	 	//get allied list
	 	alliedFactions = getIntList(stream);
	 	
	 	//get fleet list
	 	invasionFleet = getGameObjectList(stream);
	
	 }
	 
	 private function getIntList(stream : StreamReader) : List.<int> {
	 	var count : int = int.Parse(stream.ReadLine());
	 	var list : List.<int> = new List.<int>();
	 	for(var x : int = 0; x < count; x++) {
	 		list.Add(int.Parse(stream.ReadLine()));
	 	}
	 	return list;
	 }
	 
	 private function getGameObjectList(stream : StreamReader) : List.<GameObject> {
	 	var count : int = int.Parse(stream.ReadLine());
	 	var list : List.<GameObject> = new List.<GameObject>();
	 	for(var x : int = 0; x < count; x++) {
	 		var name : String = stream.ReadLine();
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


function getFactionInfo(faction : int) : FactionInfo {

	return factionInfo[faction];

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

function serialize() {
	var serie : String = playerInfo.serialize();
	
	serie = serie + factionInfo.Count + "\n";
	
	for(var fac : FactionInfo in factionInfo) {
		serie = serie + fac.serialize();
	}
	
	return serie;
	
}

function readFromFile(stream : StreamReader)  {
	playerInfo.readFromFile(stream);
	factionInfo = getFactionInfoList(stream);
	
}

private function getFactionInfoList(stream : StreamReader) : List.<FactionInfo> {
	var count : int = int.Parse(stream.ReadLine());
	var factions : List.<FactionInfo> = new List.<FactionInfo>();
	for(var x : int =0; x < count; x++) {
		var faction : FactionInfo = new FactionInfo();
		faction.readFromFile(stream);
		factions.Add(faction);
	}
	return factions;
}