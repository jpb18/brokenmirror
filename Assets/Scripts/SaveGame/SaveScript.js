import System.IO;
#pragma strict

private var save : SaveGame;
private var general : GeneralInfo;
private var map : MapInfo;
private var inventory : Inventory;
private var cargo : CargoHold;

private var folder : String;

function Start () {
	
	var saveGO : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	save = saveGO.GetComponent(SaveGame);
	general = saveGO.GetComponent(GeneralInfo);
	inventory = saveGO.GetComponent(Inventory);
	cargo = saveGO.GetComponent(CargoHold);
	
	var mapGO : GameObject = GameObject.FindGameObjectWithTag("MapInfo");
	map = mapGO.GetComponent(MapInfo);
	folder = Application.dataPath;
}


function writeToFile(name : String) {
	try {
		var outfile : StreamWriter = new StreamWriter(folder + "\\" + name);
		outfile.Write(serialize());
		
	} catch (e : IOException) {
		Debug.LogError("Can't write to file.\n" + e);
	} finally {
		outfile.Flush();
		outfile.Close();
	}

}

function XmlSave() {
	//Collect information for serialization
	var dif : Dificulty = general.getDificulty();
	var name : String = general.getPlayerName();
	var system : String = Application.loadedLevelName;
	var game : GameData = new GameData("TestSave", general, inventory);
	
	//build file destination
	var path : String = Path.Combine(Application.dataPath, "TestSave.xml");
	
	//Serialize
	var serializer : XmlSerializer = new XmlSerializer(GameData);
 	var stream : Stream = new FileStream(path, FileMode.Create);
 	serializer.Serialize(stream, game);
 	stream.Close();
	
}


function serialize() : String {
	var serie : String = "";
	
	
	serie = serie + general.serialize();
	serie = serie + save.serialize();
	serie = serie + map.serialize();
	serie = serie + inventory.serialize();
	serie = serie + cargo.serialize();
		
	return serie;
	
}

function readFromFile(name : String) {
	
	try {
		var reader : StreamReader = new StreamReader(folder + "\\" + name);
		general.readFromFile(reader);
		save.readFromFile(reader);
		map.readFromFile(reader);
		inventory.readFromFile(reader);
		cargo.readFromFile(reader);
		
	} catch (e : IOException) {
		Debug.LogError("Can't write to file.\n" + e);
	} finally {
		reader.Close();
	}

}