
public interface IUpgrade {

	 function getName() : String;
	
	 function getClass(); //TODO set a enum for this

	 function getCost() : int;

	 function getDescription() : String;
	
	 function getImage() : Texture;

}