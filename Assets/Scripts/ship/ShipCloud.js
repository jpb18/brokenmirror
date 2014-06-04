#pragma strict

var isDilithium : boolean = false;

private var props : shipProperties;
private var message : ShowMessage;

public static var ENTER_DILITHIUM : String = "Entering Dilithium Cloud. Shields inoperative.";
public static var EXIT_DILITHIUM : String = "Exiting Dilithium Cloud. Shields are back online.";

function Start() {
	props = gameObject.GetComponent(shipProperties);
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
}


function OnTriggerEnter(hit : Collider) {
	if(hit.tag == "DilithiumCloud") {
		
		addShip(hit.gameObject);
		if(props.getPlayer() && !isDilithium) {
			message.AddMessage(ENTER_DILITHIUM);
		}
		isDilithium = true;
		
	}


}

function OnTriggerExit(hit : Collider) {
	if(hit.tag == "DilithiumCloud") {
		
		removeShip(hit.gameObject);
		if(props.getPlayer() && isDilithium) {
			message.AddMessage(EXIT_DILITHIUM);
		}
		isDilithium = false;
	}
}

function isShieldInibited() : boolean {
	return isDilithium;
}

function addShip(cloud : GameObject) {
	var cloud_comp : Cloud = cloud.GetComponent(Cloud);
 	cloud_comp.addShip(gameObject);
 
 }
 
 function removeShip(cloud : GameObject) {
	var cloud_comp : Cloud = cloud.GetComponent(Cloud);
 	cloud_comp.removeShip(gameObject);
 }