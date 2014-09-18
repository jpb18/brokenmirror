#pragma strict
import System.Xml.Serialization;
import System.DateTime;
import System.Collections.Generic;

@XmlRoot("FleetData")
public class FleetData {
	@XmlAttribute("formation")
	var formation : String;
	var fleet : List.<ShipData>;
	
	function FleetData() {
		formation = "";
		fleet = new List.<ShipData>();
	}
	
	function FleetData(fleet : Fleet) {
		this();
		formation = fleet.getFormation();
		
		var ships : List.<SaveShip> = fleet.ships;
		
		for(var ship : SaveShip in ships) {
			this.fleet.Add(new ShipData(ship));
		}
		
		
	}
	

}