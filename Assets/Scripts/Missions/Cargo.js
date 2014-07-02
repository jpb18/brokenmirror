
#pragma strict

class Cargo extends Object {
	
	var cargo : GameObject;
	var size : int;
	var price : int;
	
	function Cargo(cargo : GameObject, size : int, price : int) {
		this.cargo = cargo;
		this.size = size;
		this.price = price;
	}
	
	function getCargo() : GameObject {
		return cargo;
	}
	
	function getSize() : int {
		return size;
	}
	
	function getUnitPrice() : int {
		return price;
	}
	
	function getTotalPrice() : int {
		return size * price;
	}
	
	function addUnit() {
		size++;
	}
	
	function Equals(obj : Cargo) : boolean {
		if(this == obj) {
			return false;
		}
		
		if(cargo == obj.getCargo() && price == obj.getUnitPrice()) {
			return true;
		}
		
		return false;
		
	}
	
	function serialize() : String {
		var serie : String = cargo.name + "\n";
		serie = serie + size + "\n";
		serie = serie + price + "\n";
		return serie;
	}

}


