#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("CombatMissionData")
public class CombatMissionData extends MissionData {

	var hostile : FactionData;
	var issued : FactionData;
	@XmlAttribute("objective")
	var objective : int;
	@XmlAttribute("current")
	var current : int;

	function CombatMissionData() {
		super();
		hostile = new FactionData();
		issued = new FactionData();
		objective = 0;
		current = 0;
	}
	
	function CombatMissionData(mission : CombatMission) {
		super(mission as Mission);
		hostile = new FactionData(mission.getHostile());
		issued = new FactionData(mission.getEmployer());
		objective = mission.getObjective();
		current = mission.getCurrentStatus();
		
	}
	
	function getMission() : CombatMission {
		return new CombatMission(this);
	}

}
