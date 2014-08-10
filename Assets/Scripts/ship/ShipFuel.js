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
	
	
	function consume(distance : int) : int {
		var cons : int = calculate(distance);
		current -= cons;
		return cons;
	}
	
	function hasEnough(distance : int) : boolean {
	
		return current >= calculate(distance);
	}
	
	private function calculate(distance : int) : int {
		return distance * getConsumption();
	}
	
	function setCurrentLoad(load : int) {
		current = load;
	}
	
	function addFuel(fuel : int) {
		if(current + fuel < getCapacity()) {
			current += fuel;
		} else {
			current = getCapacity();
		}
	}
	
	function isFull() : boolean {
		return current >= getCapacity();
	}
	
}