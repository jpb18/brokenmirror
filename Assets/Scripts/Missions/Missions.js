import System.Collections.Generic;

var tradeMissions : List.<TradeMission>;
private var tradeMissionsCompleted : int;
private var tradeMissionsAccepted : int;

var combatMissions : List.<CombatMission>;
private var combatMissionsCompleted : int;
private var combatMissionsAccepted : int;


private var inventory : Inventory;
private var message : ShowMessage;
private var map : MapInfo;
private var hold : CargoHold;
private var general : GeneralInfo;

public static var TRADE_FINISHED : String = "Trade mission finished. {0} Latinum deposited into account.";
public static var TRADE_STARTED : String = "Trade mission begun. Destiny: {0}."; 
public static var NO_TRADE : String = "No trade missions to be completed in this system.";
public static var CARGO_FULL : String = "Can't accept new mission. Not enough space in cargo hold.";
public static var COMBAT_STARTED : String = "Combat mission against {0} begun.";
public static var COMBAT_FINISHED : String = "Combat mission completed. {0} Latinum deposited into account. Reputation in {1} increased.";
public static var COMBAT_KILL : String = "Combat Mission: {0} of {1} kills.";

// Use this for initialization
function Start () {
	var save : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	inventory = save.GetComponent(Inventory);
	hold = save.GetComponent(CargoHold);
	general = save.GetComponent(GeneralInfo);
	
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
}

function Update() {
	finishCombatMissions();

}	

function addTradeMission(mission : TradeMission) {
	if(!tradeMissions.Contains(mission)) {
		
		var size : int = mission.getCargo().getSize();
	
		if(hold.willBeFull(size)) {
			message.AddMessage(CARGO_FULL);
		} else {		
			mission.start();
			tradeMissions.Add(mission);
			tradeMissionsAccepted++;
			hold.addCargo(mission.getCargo());
			
			var msg : String = String.Format(TRADE_STARTED, mission.getDestination());
			message.AddMessage(msg);
		}
	}

}

function removeTradeMission(mission : TradeMission) {
	if(tradeMissions.Contains(mission)) {
		tradeMissions.Remove(mission);	
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
				hold.removeCargo(cargo);
				mission.finish();
				tradeMissionsCompleted++;
				
				var mes : String = String.Format(TRADE_FINISHED, reward);
				message.AddMessage(mes); 
				
			}
		}
	}
	

}


function addCombatMission(mission : CombatMission) {
	if(!combatMissions.Contains(mission)) {
		mission.start();
		combatMissions.Add(mission);
		var msg : String = String.Format(COMBAT_STARTED, mission.getHostile().getName());
		message.AddMessage(msg);
		combatMissionsAccepted++;
	}
}

function removeCombatMission(mission : CombatMission) {
	if(combatMissions.Contains(mission)) {
		combatMissions.Remove(mission);
	}
}

function addKillToCombatMissions(faction : FactionInfo) {

	for(var mission : CombatMission in combatMissions) {
		if(mission.getHostile() == faction) {
			mission.addKill();
			var msg : String = String.Format(COMBAT_KILL, mission.getCurrentStatus(), mission.getObjective());
			message.AddMessage(msg);
		}
		
	}


}

function finishCombatMissions() {
	for(var mission : CombatMission in combatMissions) {
		if(!mission.hasFinished()) {
			if(mission.getObjective() == mission.getCurrentStatus()) {
				var employer : FactionInfo = mission.getEmployer();
				var latinum : int = mission.getLatinumReward();
				var reputation : int = mission.getReputationReward();
				var msg : String = String.Format(COMBAT_FINISHED, latinum, employer.getName());
				inventory.addLatinum(latinum);
				map.addReputationToEmpire(general.getFactionId(employer), reputation);
				message.AddMessage(msg);
				mission.finish();
				combatMissionsCompleted++;
			}
		}
	}
}

function clearMissions() {
	clearTradeMissions();
	clearCombatMissions();

}

function clearTradeMissions() {
	for(var x : int = tradeMissions.Count; x > 0; x--) {
		if(tradeMissions[x-1].hasFinished()) {
			tradeMissions.Remove(tradeMissions[x-1]);
		}
	}

}

function clearCombatMissions() {
	for(var x : int = combatMissions.Count; x > 0; x--) {
		if(combatMissions[x-1].hasFinished()) {
			combatMissions.Remove(combatMissions[x-1]);
		}
	}

}