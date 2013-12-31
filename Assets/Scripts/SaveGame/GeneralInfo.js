#pragma strict

class PlayerInfo {
	var name : String;
	var gameDificulty : Dificulty;
		
}

class FactionInfo {
	var factionName : String;
	var factionRace : String;
	var hostileFactions : int[];
	var alliedFactions : int[];
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

	return factionInfo[faction].getInfo();

}

function Start () {

}

function Update () {

}