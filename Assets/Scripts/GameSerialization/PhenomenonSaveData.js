#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("PhenomenonData")
public class PhenomenonSaveData extends Object implements INameable, IDescribable, IScanneable {
	@XmlAttribute("name")
	var name : String;
	var description : String;
	var position : Vector3;
	var scanned : boolean;	
	var gameObject : String;
	
	var isWormhole : boolean;
	var isStable : boolean;
	var destinationScene : String;
	
	function PhenomenonSaveData() {
		this.name = "";
		this.description = "";
		this.position = Vector3.zero;
		this.scanned = false;
		this.gameObject = "";
		
		this.isWormhole = false;
		this.isStable = false;
		this.destinationScene = "";
	}
	
	function PhenomenonSaveData(data : PhenomenonData) {
		this.name = data.name;
		this.description = data.description;
		this.position = data.position;
		this.scanned = data.scanned;
		this.gameObject = data.gameObject.name;
		
		this.isWormhole = data.isWormhole;
		this.isStable = data.isStable;
		this.destinationScene = data.destinationScene;
		
	}
	
	function getName() : String {
		return this.name;
	}
	
	function setName(name : String) {
		this.name = name;
	}	
	
	function setScanned(scanned : boolean) {
		this.scanned = scanned;
	}
	
	function isScanned() : boolean {
		return this.scanned;
	}
	
	function getDescription() : String {
		return this.description;
	}
	
	function getDetailsDescription() : String {
	 	//todo?
	 }
	
}