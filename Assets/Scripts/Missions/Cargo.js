
#pragma strict

class Cargo extends Object implements INameable, IDescribable {
	
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
	
	function getName() : String {
		var script : CargoItem = this.cargo.GetComponent.<CargoItem>();
		return script.getName();		
	}
	
	function getDescription() : String {
		var script : CargoItem = this.cargo.GetComponent.<CargoItem>();
		return script.getDescription();
	}
	
	function getDetailsDescription() : String {
		var description : String = getDescription() + "\n";
		description = description + "Size: " + size + "\n";
		description = description + "Unit Price: " + price + " GPL\n";
		description = description + "Total Cost: " + getTotalPrice() + " GPL\n";
		return description;
	}
	
	function Equals(obj : Object) : boolean {
		if(ReferenceEquals(this, obj)) {
			return true;
		}
		
		if(!(obj instanceof Cargo)) {
			return false;
		}
		
		var tmp : Cargo = obj as Cargo;
		
		if(cargo == tmp.getCargo() && price == tmp.getUnitPrice()) {
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


