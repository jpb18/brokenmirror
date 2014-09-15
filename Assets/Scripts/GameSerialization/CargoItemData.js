#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("CargoItem")
public class CargoItemData {
	@XmlAttribute("cargo")
	var name : String;
	@XmlAttribute("size")
	var size : int;
	@XmlAttribute("price")
	var price : int;
	
	function CargoItemData() {
		name = "";
		size = 0;
		price = 0;
	}
	
	function CargoItemData(cargo : Cargo) {
		name = cargo.getCargo().name;
		size = cargo.getSize();
		price = cargo.getUnitPrice();
	}
	
	function getCargo() : Cargo {
		var cargo : Cargo = new Cargo(Resources.Load(name) as GameObject, size, price);
		return cargo;
	
	}


}
