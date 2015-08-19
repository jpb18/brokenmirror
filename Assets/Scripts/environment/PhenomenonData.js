
public class PhenomenonData extends Object implements INameable, IDescribable, IScanneable, IInstanteable {

	var name : String;
	var description : String;
	var position : Vector3;
	var scanned : boolean;	
	var gameObject : GameObject;
	
	var isWormhole : boolean;
	var isStable : boolean;
	var destinationScene : String;
	
	
	function PhenomenonData() {
		this.name = "";
		this.description = "";
		this.position = Vector3.zero;
		this.scanned = false;
		this.gameObject = null;
	}
	
	function PhenomenonData(save : PhenomenonSaveData) {
		var go : GameObject = Resources.Load(save.gameObject);
		this(save.name, save.description, save.position, save.scanned, go);
	}
	
	function PhenomenonData(name : String, description : String, position : Vector3, scanned : boolean, gameObject : GameObject) {
		this.name = name;
		this.description = description;
		this.position = position;
		this.scanned = scanned;
		this.gameObject = gameObject;
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
	
	function instantiate() : GameObject {
		var go : GameObject = GameObject.Instantiate(this.gameObject, this.position, Quaternion.identity);
		var script : Phenomenon = go.GetComponent.<Phenomenon>();
		script.Set(this.name, this.description, this.scanned);
		
		if(this.isWormhole) {
			var worm : Wormhole = go.GetComponent.<Wormhole>();
			worm.Set(this.isStable, this.destinationScene);
		}
		
		return go;
	}
	
	function getGameObject() : GameObject {
		return this.gameObject;	
	}

}

