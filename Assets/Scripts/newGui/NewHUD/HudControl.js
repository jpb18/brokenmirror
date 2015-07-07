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


//repeater button stuff
private var isIncreasingSpeed : boolean = false;
private var isDecreasingSpeed : boolean = false;


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
private function UpdateShipSpeed() {
	forwardSpeedBar.value = movement.GetForwardPercentage();
	backwardSpeedBar.value = movement.GetBackwardsPercentage();
	
	if(this.isIncreasingSpeed) {
		this.IncreaseShipSpeed();
	} else if (this.isDecreasingSpeed) {
		this.DecreaseShipSpeed();
	}
	
}

///<summary>This sets the control for speed increase</summary>
function PressSpeedIncrease() {
	this.isIncreasingSpeed = true;
}

///<summary>This unsets the control for speed increase</summary>
function ReleaseSpeedIncrease() {
	this.isIncreasingSpeed = false;
}

///<summary>This sets the control for speed decrease</summary>
function PressSpeedDecrease() {
	this.isDecreasingSpeed = true;
}

///<summary>This unsets the control for speed decrease</summary>
function ReleaseSpeedDecrease() {
	this.isDecreasingSpeed = false;
}


///<summary>This allows the HUD button to increase the ships speed. If speed it's at maximum, or a Full Stop Order has been issued, it'll do nothing</summary>
private function IncreaseShipSpeed() {
	if(!movement.isAtMax() && !movement.isChanging)
		movement.increaseSpeed();
}

///<summary>This allows the HUD Button to reduce the ships speed. If Speed it's at minimum, or a Full Stop order has been issued, it'll do nothing</summary>
private function DecreaseShipSpeed() {
	if(!movement.isAtMin() && !movement.isChanging)
		movement.decreaseSpeed();
}

///<summary>This makes the ship go full stop. If it's stopped, or the speed is changing, it'll ignore</summary>
function FullStop() {
	if(!movement.isStop() && !movement.isChanging) {		
				movement.fullStop();	  
	} 
}