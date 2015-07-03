import UnityEngine.UI;
#pragma strict

var on : boolean = false;

//hud stuff
var hudGo : GameObject;

var forwardSpeedBar : Slider;
var backwardSpeedBar : Slider;



//player ship stuff
var ship : GameObject;
private var movement : shipMovement;
private var properties : shipProperties;


function Start () {

}

function Update () {
	if(on && ship) {
		UpdateShipSpeed();
	}
}


///<summary>Activate hud and load default values...</summary>
///<param name="ship">Ship to be loaded</param>
function SetHud(ship : GameObject) {
	
	//set ship
	this.ship = ship;
	
	//load necessary scripts...
	movement = ship.GetComponent.<shipMovement>();
	properties = ship.GetComponent.<shipProperties>();
	//TODO
	
	//set hud values
	UpdateShipSpeed();
	//TODO
	
	ShowHud();
}

///<summary>Just hide the hud...</summary>
function HideHud() {
	this.on = false;
	hudGo.SetActive(false);	
}

///<summary>Show the hud</summary>
function ShowHud() {
	this.on = true;
	hudGo.SetActive(true);
}

///<summary>This updates the ship speed</summary>
function UpdateShipSpeed() {
	forwardSpeedBar.value = movement.GetForwardPercentage();
	backwardSpeedBar.value = movement.GetBackwardsPercentage();
}