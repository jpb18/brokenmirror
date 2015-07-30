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
private var weapons : shipWeapons;


//repeater button stuff
private var isIncreasingSpeed : boolean = false;
private var isDecreasingSpeed : boolean = false;

//torpedo data
private var torpedoOptions : Volley[];
var torpedoButtons : Toggle[];

//weapons data
var weaponsImage : Image[];
var weaponsOverlay : Image[];


function Start () {

	torpedoOptions = new Volley[3];
	torpedoOptions[0] = Volley.three;
	torpedoOptions[1] = Volley.five;
	torpedoOptions[2] = Volley.eight;
	
}

function Update () {
	if(on && ship) {
		UpdateShipSpeed();
		UpdateWeaponOverlay();
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
	weapons = ship.GetComponent.<shipWeapons>();
	//TODO
	
	//set hud values
	UpdateShipSpeed();
	SetWeaponsPanel();
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

///<summary>Sets the ships torpedo volley</summary>
///<param name="volley">Volley size: 0 == 3 / 1 == 5 / 2 == 8</param>
function SetTorpedoVolley(volley : int) {
		weapons.toggleVolley(this.torpedoOptions[volley]);
}


///<summary>This sets the weapon images on the HUD
///Order: Phaser, Forward Torpedo, Backward Torpedo
///</summary>
function SetWeaponsPanel() {
	for(var i : int = 0; i < 3; i++) {
		var w : GameObject = this.weapons.GetWeapon(i);
		if(w) {
			var ws : weaponScript = w.GetComponent.<weaponScript>();
			var img : Texture = ws.getImage();
			weaponsImage[i].sprite = Sprite.Create(img, new Rect(0,0, img.width, img.height),new Vector2(0.5f, 0.5f));
			weaponsImage[i].enabled = true;
		} else weaponsImage[i].enabled = false;
	}						
}

///<summary>This fires the selected weapon.</summary>
///<param name="weapon">1 - Phaser; 2 - Forward Torpedo; 3 - Backward Torpedo</param>
function FireWeapon(weapon : int) {
	weapons.FireWeapon(weapon);
}


private function UpdateWeaponOverlay() {
	for(var i : int = 0; i < weaponsOverlay.Length; i++) {
		if(weapons.IsRecharging(i)) {
			weaponsOverlay[i].enabled = true;
			var percentage : float = weapons.RechargePercentage(i);			
			weaponsOverlay[i].color.a = percentage;									
		} else weaponsOverlay[i].enabled = false;
	}
}

