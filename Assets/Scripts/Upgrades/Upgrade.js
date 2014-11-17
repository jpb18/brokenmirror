
public class Upgrade extends MonoBehaviour implements INameable, IPriceable, IDescribable, IImageable{
	
	public var upgradeName : String;
	public var cost : int;
	public var description : String;
	public var image : Texture;
	
	function Upgrade(name : String, cost : int, description : String, image : Texture) {
		this.name = name;
		this.cost = cost;
		this.description = description;
		this.image = image;
	}
	
	public function getName() : String {
		return upgradeName;
	}
	
	public function getClass() {
	//TODO handle this
	
	}

	public function getCost() : int {
		return cost;
	}
	
	function getPrice() : int {
		return cost;
	}

	public function getDescription() : String {
		return description;
	}

	public function getImage() : Texture {
		return image;
	}
	
	function getDetailsDescription() : String {
		return description;
	}

}