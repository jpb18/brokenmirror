import System.Collections.Generic;

var tradeMissions : List.<TradeMission>;
var tradeMissionsCompleted : int;
var tradeMissionsAccepted : int;


private var inventory : Inventory;

// Use this for initialization
function Start () {
	inventory = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Inventory);
}	

function addTradeMission(mission : TradeMission) {
	if(!tradeMissions.Contains(mission)) {
		tradeMissions.Add(mission);
		tradeMissionsAccepted++;
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

function finishTradeMissions(destination : String) {

	var missions : List.<TradeMission> = getTradeMissionsByDestination(destination);
	
	for(var mission : TradeMission in missions) {
		if(!mission.hasFinished()) {
			var cargo : Cargo = mission.getCargo();
			var reward : int = cargo.getTotalPrice();
			inventory.addLatinum(reward);
			inventory.removeItem(cargo);
			mission.finish();
			tradeMissionsCompleted++;
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