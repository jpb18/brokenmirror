#pragma strict

class ShipFuel extends MonoBehaviour {

	var capacity : int;
	var current : int;
	var consumption : int;
	
	function getCapacity() : int {
		return capacity;
	}
	
	function getCurrentLoad() : int {
		return current;
	}
	
	function getConsumption() : int {
		return consumption;
	}
	
	
	function consume(distance : int) {
		current -= calculate(distance);
	}
	
	function hasEnough(distance : int) : boolean {
	
		return current >= calculate(distance);
	}
	
	private function calculate(distance : int) : int {
		return distance * consumption;
	}
	
	function setCurrentLoad(load : int) {
		current = load;
	}
	
}