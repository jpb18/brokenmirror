#pragma strict

class Mission extends Object {

	var started : boolean;
	var finished : boolean;
	var name : String;
	var description : String;
	
	function Mission(name : String, description : String) {
		this.started = false;
		this.finished = false;
		this.name = name;
		this.description = description;
		
	}
	
	function Mission(data : MissionData) {
		started = data.started;
		finished = data.finished;
		name = data.name;
		description = data.description;
	}
	
	function start() {
		started = true;
	}
	
	function getName() : String {
		return name;
	}
	
	function getDescription() : String {
		return description;
	}
	
	function hasStarted() : boolean {
		return started;
	}
	
	function hasFinished() : boolean {
		return finished;
	}
	
	function finish() {
		finished = true;
	}
	

}