#pragma strict

class Colonizer extends MonoBehaviour implements IColonizer, INameable, IImageable, IDescribable, IPriceable {
	
	var itemName : String;
	var description : String;
	var image : Texture;
	var population : float;
	var price : int;

	function getPopulation() : float {
		return population;
	}
	
	function getName() : String {
		return itemName;
	}
	
	function getImage() : Texture {
		return image;
	}

	function getDescription() : String {
		return description;
	}
	
	function getPrice() : int {
		return price;
	}


}
