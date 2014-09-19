﻿import System.IO;
#pragma strict

private var save : SaveGame;
private var general : GeneralInfo;
private var map : MapInfo;
private var inventory : Inventory;
private var cargo : CargoHold;
private var stardate : Stardate;
private var missions : Missions;

private var folder : String;

function Start () {
	
	var saveGO : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	save = saveGO.GetComponent(SaveGame);
	general = saveGO.GetComponent(GeneralInfo);
	inventory = saveGO.GetComponent(Inventory);
	cargo = saveGO.GetComponent(CargoHold);
	stardate = saveGO.GetComponent(Stardate);
	
	var mapGO : GameObject = GameObject.FindGameObjectWithTag("MapInfo");
	map = mapGO.GetComponent(MapInfo);
	
	var missionGo : GameObject = GameObject.FindGameObjectWithTag("Missions");
	missions = missionGo.GetComponent(Missions);
	
	folder = Path.Combine(Application.dataPath, "SaveGames");
}


function XmlSave(name : String) {
	
	var game : GameData = new GameData(name, general, inventory, cargo, save, stardate, map, missions);
	
	if(!Directory.Exists(folder)) {
		Directory.CreateDirectory(folder);
	}
	
	//build file destination
	var path : String = Path.Combine(folder, name);
	
	//Serialize
	var serializer : XmlSerializer = new XmlSerializer(GameData);
 	var stream : Stream = new FileStream(path, FileMode.Create);
 	serializer.Serialize(stream, game);
 	stream.Close();
	
}


//pre XmlExists(name)
function XmlLoad(name : String) : GameData {
	
	//build file destination
	var path : String = Path.Combine(folder, name);
	
	var serializer : XmlSerializer = new XmlSerializer(GameData);
 	var stream : Stream = new FileStream(path, FileMode.Open);
	var game : GameData = serializer.Deserialize(stream) as GameData;
 	stream.Close();

	return game;

}

function XmlExists(name : String) : boolean {
	//build file destination
	var path : String = Path.Combine(folder, name);
	
	if(File.Exists(path)) {
	
		try {
			var serializer : XmlSerializer = new XmlSerializer(GameData);
	 		var stream : Stream = new FileStream(path, FileMode.Open);
			var game : GameData = serializer.Deserialize(stream) as GameData;
			return true;
	 		
		} catch (e : Exception) {
			return false;
		} finally {
			stream.Close();
		}
	}
	return false;

}