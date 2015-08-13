#pragma strict

///<summary>This behaviour contains informations about the Away Teams</summary>
public class AwayTeam extends MonoBehaviour implements INameable, IDescribable, IImageable, IPriceable, IStrenghteable {

	var Name : String;
	var description : String;
	var image : Texture;
	var price : int;
	var strenght : int;

	function getName() : String {
		return Name;
	}

	function getDescription() : String {
		return description;
	}
	
	function getDetailsDescription() : String {
		return this.description;
	}

	function getImage() : Texture {
		return image;
	}
	
	function getPrice() : int {
		return price;
	}
	
	function getStrenght() : int {
		return strenght;	
	}

}