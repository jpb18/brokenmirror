#pragma strict

class TradeMission extends Mission {
	
	var destination : String;
	var cargo : Cargo;
	
	
	function TradeMission(destination : String, cargo : Cargo, name : String, description : String) {
		super(name, description);
		this.destination = destination;
		this.cargo = cargo;
	}
	
	function getDestination() : String {
		return destination;
	}
	
	function getCargo() : Cargo {
		return cargo;
	}
	
	

}