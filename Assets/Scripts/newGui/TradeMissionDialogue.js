

class TradeMissionDialogue extends MissionDialogue {
	
	var station : StationInt;
	var mission : TradeMission;
	public static var DESCRIPTION : String = "{0} \n {1} \n Reward: {2} GPL\n ";
	
	

	
	function setMission(mission : TradeMission, station : StationInt) {
		this.mission = mission;
		var name : String = mission.getName();
		var desc : String = mission.getDescription();
		var reward : int = mission.getCargo().getTotalPrice();
		var description : String = String.Format(DESCRIPTION, name, desc, reward.ToString());
		super.setDescription(description);
		this.setOn();
		
	}
	
	function accept() {
		mission.start();
		super.missions.addTradeMission(mission);	
		this.setOff();
	}
	
	


}