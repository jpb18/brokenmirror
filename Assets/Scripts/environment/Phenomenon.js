#pragma strict

public class Phenomenon extends MonoBehaviour implements INameable, IDescribable, IScanneable, IImageable, ITypeable {

	var phenomenonName : String;
	var type : String;
	var image : Texture;
	var description : String;
	var scanned : boolean;

	function Set(name : String, description : String, scanned : boolean) {
		this.phenomenonName = name;
		this.description = description;
		this.scanned = scanned;
	} 
	
	function getName() : String {
		return this.phenomenonName;
	}
		
	function setName(name : String) {
		this.phenomenonName = name;
	}
	
	function getImage() : Texture {
		return this.image;	
	}
	
	function getDescription() : String {
		this.description = description;
	}
	
	function getDetailsDescription() : String {/*todo*/}
	
	function setScanned(scanned : boolean) {
		this.scanned = scanned;
	}
	
	function isScanned() : boolean {
		return this.scanned;
	}
	
	function getType() : String {
		return this.type;
	}

}