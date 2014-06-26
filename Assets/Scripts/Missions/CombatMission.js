#pragma strict

class CombatMission extends Mission {
	
	var hostile : FactionInfo;
	var issued : FactionInfo;
	var objective : int;
	var current : int;
	
	public static var DESCRIPTION : String = "Destroy {0} ships belonging to the {1}.";
	public static var NAME : String = "Combat Mission";
	
	public static var LATINUM : int = 5000;
	public static var REPUTATION : int = 2;
	
	function CombatMission(hostile : FactionInfo, issued : FactionInfo, objective : int) {
		var desc : String = String.Format(DESCRIPTION, objective, hostile.getName());
		super(NAME, desc);
		this.hostile = hostile;
		this.issued = issued;
		this.objective = objective;		
		current = 0;
	}
	
	function getObjective() : int {
		return objective;
	}
	
	function getCurrentStatus() : int {
		return current;
	}
	
	function addKill() {
		current++;
		
	}
	
	function getHostile() : FactionInfo {
		return hostile;
	}
	
	function getEmployer() : FactionInfo {
		return issued;
	}
	
	function getLatinumReward() : int {
		return LATINUM * objective;
	}
	
	function getReputationReward() : int {
		return REPUTATION * objective;
	}

}