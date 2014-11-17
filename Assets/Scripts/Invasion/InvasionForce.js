#pragma strict

class InvasionForce extends MonoBehaviour implements INameable, IImageable, IDescribable, IPriceable, IInvasion {

	@Tooltip("Maximum population size this force can handle.")
	var population : float;
	@Tooltip("Name of the item.")
	var itemName : String;
	@Tooltip("Description of the item.")
	var description : String;
	@Tooltip("Image of the item.")
	var image : Texture;
	@Tooltip("Price of the item.")
	var price : int;

	function getName() : String {
		return itemName;
	}
	
	function getPopulation() : float {
		return population;
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
	
	function canInvade(population : float) : boolean {
		return this.population >= population;
	}
	
	function invade(planet : IConquerable, faction : int) {
		planet.conquer(faction);
	}

}


