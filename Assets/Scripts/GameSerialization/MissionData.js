#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("MissionData")
public class MissionData extends Data {
	@XmlAttribute("started")
	var started : boolean;
	@XmlAttribute("finished")
	var finished : boolean;
	@XmlAttribute("name")
	var name : String;
	var description : String;
	
	function MissionData() {
		started = false;
		finished = false;
		name = "";
		description = "";
	}
	
	function MissionData(name : String, description : String, started : boolean, finished : boolean) {
		this.started = started;
		this.finished = finished;
		this.name = name;
		this.description = description;
		
	}
	
	function MissionData(mission : Mission) {
		this(mission.getName(), mission.getDescription(), mission.hasStarted(), mission.hasFinished());
	}
	
	


}