import System.Collections.Generic;

var tradeMissions : List.<TradeMission>;
var tradeMissionsCompleted : int;
var tradeMissionsAccepted : int;


private var inventory : Inventory;
private var message : ShowMessage;
private var map : MapInfo;

public static var TRADE_FINISHED : String = "Trade mission finished. {0} Latinum deposited into account.";
public static var TRADE_STARTED : String = "Trade mission begun. Destiny: {0}."; 
public static var NO_TRADE : String = "No trade missions to be completed in this system.";

// Use this for initialization
function Start () {
	inventory = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Inventory);
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
}	

function addTradeMission(mission : TradeMission) {
	if(!tradeMissions.Contains(mission)) {
		tradeMissions.Add(mission);
		tradeMissionsAccepted++;
		
		var msg : String = String.Format(TRADE_STARTED, mission.getDestination());
		message.AddMessage(msg);
	}

}

function removeTradeMission(mission : TradeMission) {
	if(tradeMissions.Contains(mission)) {
		tradeMissions.Remove(mission);	
	}

}

function getTradeMission(mission : TradeMission) {
	for(var m : TradeMission in tradeMissions) {
		if(mission == m) {
			return m;	
		}
	
	}
}


function getTradeMissionsByDestination(destination : String) : List.<TradeMission> {
	
	var list : List.<TradeMission> = new List.<TradeMission>();
	
	for(var mission : TradeMission in tradeMissions) {
		if(mission.getDestination().Equals(destination)) {
			list.Add(mission);		
		}
	
	}
	
	return list;

}

function finishTradeMissionInSystem() {

    var scene : String = Application.loadedLevelName;
    var planet : PlanetInfo = map.getPlanetBySceneName(scene);
    finishTradeMissions(planet.name);

}

function finishTradeMissions(destination : String) {

	var missions : List.<TradeMission> = getTradeMissionsByDestination(destination);
	
	if(missions.Count == 0) {
		message.AddMessage(NO_TRADE);
	}
	else {
		for(var mission : TradeMission in missions) {
			if(!mission.hasFinished()) {
				var cargo : Cargo = mission.getCargo();
				var reward : int = cargo.getTotalPrice();
				inventory.addLatinum(reward);
				inventory.removeItem(cargo);
				mission.finish();
				tradeMissionsCompleted++;
				
				var mes : String = String.Format(TRADE_FINISHED, reward);
				message.AddMessage(mes); 
				
			}
		}
	}
	

}

function clearMissions() {
	clearTradeMissions();

}

function clearTradeMissions() {
	for(var mission : TradeMission in tradeMissions) {
		if(mission.hasFinished()) {
			tradeMissions.Remove(mission);
		}
	}

}