#pragma strict

class Mission extends Object {

	var start : boolean;
	var finished : boolean;
	var name : String;
	var description : String;
	
	function Mission(name : String, description : String) {
		this.start = true;
		this.finished = false;
		this.name = name;
		this.description = description;
		
	}
	
	function getName() : String {
		return name;
	}
	
	function getDescription() : String {
		return description;
	}
	
	function hasStarted() : boolean {
		return start;
	}
	
	function hasFinished() : boolean {
		return finished;
	}
	
	function finish() {
		finished = true;
	}
	

}