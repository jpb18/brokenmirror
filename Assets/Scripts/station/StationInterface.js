import System.Collections.Generic;
#pragma strict

//description stuff
var stName : String;
var stClass : String;
var description : String;
var image : Texture2D;

//services
var isRefuel : boolean;
var isRepair : boolean;

//sales
var items : List.<GameObject>;
var ships : List.<GameObject>;
var plans : List.<GameObject>;
var upgrades : List.<GameObject>;

//radar label
var radar : RadarLabel;

//GUI
var gui : StationGui;

private var mainCam : Camera;
private var camScript : MouseOrbit;
private var general : GeneralInfo;
private var health : Health;
private var hud : HUDStatus;
private var inv : Inventory;




function Start () {
	mainCam = Camera.main;
	radar.Set(gameObject);
	camScript = mainCam.GetComponent(MouseOrbit);
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
	health  = gameObject.GetComponent(Health);
	inv = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Inventory);
	gui.setWindow(health, this, inv);
	hud = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
	
}

function Update () {

}

function OnGUI() {
	if(hud.isShowingGui()) guiFunction();
	
}

function guiFunction() {
	drawLabel();

	if(gui.isOn()) {
		gui.draw();
	} 
}

function drawLabel() {
	var pos : Vector3 = mainCam.WorldToScreenPoint(transform.position);
	if(camScript.target) {
		var player : GameObject = camScript.target.gameObject;
		if(isOnScreen(pos)) {
			radar.Draw(pos, player, general);
		} else {
		
		}
	}
	
	
}

function isOnScreen(cood : Vector3) : boolean {
	return cood.x > 0 && cood.x < Screen.width && cood.y > 0 && cood.y < Screen.height && cood.z > 0;
}

function getStore(mode : StoreMode) {
	var res : List.<GameObject>;
	
	switch (mode) {
		case (StoreMode.ships):
			res = ships;
			break;
		case (StoreMode.items):
			res = items;
			break;
		case (StoreMode.upgrades):
			res = upgrades;
			break;
		case (StoreMode.plans):
			res = plans;
			break;
	
	}
		
	return res;	
	
}

function openGUI () {
	gui.setOn();
}
