#pragma strict
var mainCam : Camera;
var shipName : String;
var shipClass : String;
var shipProps : shipProperties;
var parent : Transform;
var classLabel : TextMesh;
var nameLabel : TextMesh;

function Start () {
	//get main camera
	mainCam = Camera.main;

	parent = transform.parent.transform; //get parent transform

	shipProps = transform.parent.parent.gameObject.GetComponent(shipProperties);	//get ship properties
	
	//get ship name and ship class
	shipName = shipProps.shipInfo.shipName;
	shipClass = shipProps.shipInfo.shipClass;
	
	//name the text fields
	classLabel.text = shipClass;
	nameLabel.text = shipName;
	
	
}

function Update() {
	//make parent look at camera
	parent.LookAt(mainCam.transform.position);
	
	//set renderer
	renderer.active = !shipProps.playerProps.isPlayer;
	
	

}