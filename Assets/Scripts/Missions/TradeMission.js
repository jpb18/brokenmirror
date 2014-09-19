#pragma strict

class TradeMission extends Mission {
	
	var destination : String;
	var cargo : Cargo;
	public static var NAME : String = "Trade Mission";
	public static var DESC : String = "Deliver {0} to {1}.";
	
	function TradeMission(destination : String, cargo : Cargo) {
		
		this.destination = destination;
		this.cargo = cargo;
		
		var item : GameObject = cargo.getCargo();
		var cargoName : String = item.GetComponent(CargoItem).getName();
		var desc : String = String.Format(DESC, cargoName, destination);		
		super(NAME, desc);
		
	}
	
	function TradeMission(data : TradeMissionData) {
		destination = data.destination;
		cargo = data.cargo.getCargo();
		super(data as MissionData);
	}
	
	function getDestination() : String {
		return destination;
	}
	
	function getCargo() : Cargo {
		return cargo;
	}
	
	

}