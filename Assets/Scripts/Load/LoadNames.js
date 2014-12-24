#pragma strict
import Assets.Standard_Assets.Scripts.NameLoader;
import BmNameGenerator;

public static final var NAMES : String = "names.json";

function Start () {
	
	//get general info script
    var general : GeneralInfo = GameObject.FindGameObjectWithTag("SaveGame").GetComponent.<GeneralInfo>();
	//get the names path...
	var path : String = Path.Combine(Application.dataPath, NAMES);
	
	//now do the serialization thingy
	try {
		var namer : Namer = Serializer.Deserialize(path);
	} catch (e : Exception) {
		Debug.Log("Failed to open names file. Quiting...");
		return;
	}
	
	//now get the factions list
	var factions : List.<Faction> = namer.factions;
	
	//now loop through them
	for(var faction : Faction in factions) {
		//first check if faction exists
		var f : FactionInfo = FindFaction(general, faction.name);
		if(!f) {
			Debug.Log("Failed to find faction " + faction.name + ".");
			continue;
		}
		
		//if it exists, load its names
		f.shipNames = faction.ships;
		f.stationNames = faction.stations;
		
		
	}
	
	//and voila!

}

function FindFaction(general : GeneralInfo, faction : String) : FactionInfo {
	return general.GetFactionByName(faction);
}
