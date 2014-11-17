#pragma strict
import System.Globalization;

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
	
	function getDetailsDescription() : String {
		var description : String = description + "\n";
		description = description + "Population: " + population.ToString("F", CultureInfo.InvariantCulture) + " millions.\n";
		return description;
	
	}
	
	function getPrice() : int {
		return price;
	}


}
