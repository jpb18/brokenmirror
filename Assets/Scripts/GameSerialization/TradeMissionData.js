#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("TradaMissionData")
public class TradeMissionData extends MissionData {
	@XmlAttribute("destination")
	var destination : String;
	var cargo : CargoItemData;
	
	function TradeMissionData() {
		super();
		destination = "";
		cargo = new CargoItemData();
	}
	
	function TradeMissionData(mission : TradeMission) {
		
		super(mission as Mission);
		destination = mission.getDestination();
		cargo = new CargoItemData(mission.getCargo());
		
	}
	
	function getMission() : TradeMission {
		return new TradeMission(this);
	}
	
	
	
	
}
