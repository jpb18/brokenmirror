#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("CargoData")
public class CargoData {
	var items : List.<CargoItemData>;
	@XmlAttribute("capacity")
	var capacity : int; 
	
	function CargoData() {
		items = new List.<CargoItemData>();
		capacity = 0;
	}
	
	function CargoData(hold : CargoHold) {
		this();
		capacity = hold.getCapacity();
		for(var item : Cargo in hold.cargoItems) {
			items.Add(new CargoItemData(item));
		}
	}
	
	
	function getCargo() : List.<Cargo> {
		var c : List.<Cargo> = new List.<Cargo>();
		
		for(var i : CargoItemData in items) {
			c.Add(i.getCargo());
		}
		
		return c;
	
	}
	

}
