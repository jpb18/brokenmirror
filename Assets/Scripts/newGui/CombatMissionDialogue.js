#pragma strict

class CombatMissionDialogue extends MissionDialogue {
	
	var station : StationInt;
	var mission : CombatMission;
	public static var DESCRIPTION : String = "{0} \n {1} \n Employer: {4} \n Reward:\n {2} GPL, \n {3} reputation increase towards {4}.\n ";
		
	function setMission(mission : CombatMission, station : StationInt) {
		this.mission = mission;
		var name : String = mission.getName();
		var desc : String = mission.getDescription();
		var latinum : int = mission.getLatinumReward();
		var rep : int = mission.getReputationReward();
		var faction : String = mission.getEmployer().getName();
		var description : String = String.Format(DESCRIPTION, name, desc, latinum, rep, faction);
		super.setDescription(description);
		this.setOn();
		
	}
	
	function accept() {
		
		super.missions.addCombatMission(mission);	
		this.setOff();
	}


}