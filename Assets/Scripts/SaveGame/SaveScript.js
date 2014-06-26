import System.IO;
#pragma strict

private var save : SaveGame;
private var general : GeneralInfo;
private var map : MapInfo;

private var folder : String;


function Start () {
	
	var saveGO : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	save = saveGO.GetComponent(SaveGame);
	general = saveGO.GetComponent(GeneralInfo);
	
	var mapGO : GameObject = GameObject.FindGameObjectWithTag("MapInfo");
	map = mapGO.GetComponent(MapInfo);
	
	folder = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Desktop); //test part...

}


function writeToFile(name : String) {

	var outfile : StreamWriter = new StreamWriter(folder + "\\" + name);
	outfile.Write(serialize());
	outfile.Flush();
	outfile.Close();

}

function serialize() : String {
	var serie : String = "";
	
	
	serie = serie + general.serialize();
	serie = serie + save.serialize();
	serie = serie + map.serialize();
	
	return serie;
	
}