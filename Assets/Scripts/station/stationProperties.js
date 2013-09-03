#pragma strict

class StationStatus {

	var isRedAlert : boolean;
	
	var stationStrenght : int;
	
	var basicHull : float;
	var basicShield : float;
	var basicArmor : float;
	var isShieldRegen : boolean;
	var basicRegen : float;

}

class StationInfo {

	var faction : int;
	var hostileFactions : int[];
	var alliedFactions : int[];
	
	var stationName : String;
	var stationClass : String;
	var stationIcon : Texture;

}

var status : StationStatus;
var info : StationInfo;

function Start () {

}

function Update () {

	//update faction info
	//get permanent game object and script
	var save_go : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	var gen_scr : GeneralInfo = save_go.GetComponent(GeneralInfo);
	
	//now get faction info
	info.alliedFactions = gen_scr.factionInfo[info.faction].alliedFactions;
	info.hostileFactions = gen_scr.factionInfo[info.faction].hostileFactions;

}