#pragma strict

class PlayerInfo {
	var name : String;
	var gameDificulty : Dificulty;
		
}

class FactionInfo {
	var hostileFactions : int[];
	var alliedFactions : int[];

}


enum Dificulty {
	Easy, //Slow reacting bots
	Medium, //Average reacting bots
	Hard, //Bots react as fast as humans
	Hardcore //Superhuman bots

}

var playerInfo : PlayerInfo;
var factionInfo : FactionInfo[];

function Start () {

}

function Update () {

}