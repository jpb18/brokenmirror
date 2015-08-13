import UnityEngine.UI;
#pragma strict

var on : boolean = false;




//global stuff
private var message : ShowMessage;
private var missions : Missions;

//player ship stuff
var ship : GameObject;
private var movement : shipMovement;
private var properties : shipProperties;
private var weapons : shipWeapons;
private var triggers : shipTriggers;
private var upgrades : Upgrades;
private var health : shipHealth;
private var reactor : Reactor;
private var balance : ReactorBalance;
private var fuel : ShipFuel;

//hud stuff
var hudGo : GameObject;

//movement stuff
var forwardSpeedBar : Slider;
var backwardSpeedBar : Slider;
var warpImage : Image;

//repeater button stuff
private var isIncreasingSpeed : boolean = false;
private var isDecreasingSpeed : boolean = false;

//torpedo data
private var torpedoOptions : Volley[];
var torpedoButtons : Toggle[];

//weapons data
var weaponsImage : Image[];
var weaponsOverlay : Image[];

//active upgrades data
var upgradeImage : Image[];
var upgradeOverlay : Image[];

//health stuff
var shieldLabel : Text;
var shieldImage : Image;
var hullLabel : Text;
var hullImage : Image;

//power stuff
var powerBar : Slider;

//red alert stuff
var redAlertImage : Image;
var redAlertInterval : float;

//target stuff
var target : GameObject;
var targetGo : GameObject;
var factionOrbs : Image[];
var targetOrb : Image;
var classLabel : Text;
var nameLabel : Text;
var hullBar : Slider;
var shieldBar : Slider;
private var targetHealth : IHealtheable;
private var targetProps : shipProperties;

//target expansion
var extendTransform : RectTransform;
var extendDuration : float;
var xDiference : float;
private var animating : boolean;
private var extended : boolean;

//resources
var latinumLabel : Text;
var dilithiumLabel : Text;
private var inventory : Inventory;

//reputation
var globalReputationLabel : Text;
var localReputationLabel : Text;
private var map : MapInfo;

//constants
public static final var ORBIT_ERROR = "Not in a planets orbit.";
public static final var COLONIZE_ERROR = "You need a colonization team to colonize a planet.";
public static final var COLONIZED = "Planet colonized.";
public static final var INVASION_ERROR = "You need an invasion force to ocupy the planet.";
public static final var INVASION_FAILED = "Your invasion force has been defeated.";
public static final var INVADED = "Planet ocupied.";
public static final var TRANSPORT_ERROR = "Nothing to beam down.";


function Start () {

	torpedoOptions = new Volley[3];
	torpedoOptions[0] = Volley.three;
	torpedoOptions[1] = Volley.five;
	torpedoOptions[2] = Volley.eight;
	
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent.<ShowMessage>();
	missions = GameObject.FindGameObjectWithTag("Missions").GetComponent.<Missions>();
	inventory = GameObject.FindGameObjectWithTag("SaveGame").GetComponent.<Inventory>();
	map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent.<MapInfo>();
	
	animating = false;
	extended = false;
	

}

function Update () {
	if(on && ship) {
		UpdateShipSpeed();
		UpdateWeaponOverlay();
		UpdateUpgradesOverlay();
		UpdateHealth();
		UpdateRedAlert();
		UpdatePower();
		UpdateTarget();
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
	upgrades = ship.GetComponent.<Upgrades>();
	triggers = ship.GetComponent.<shipTriggers>();
	health = ship.GetComponent.<shipHealth>();
	reactor = ship.GetComponent.<Reactor>();
	balance = ship.GetComponent.<ReactorBalance>();
	fuel = ship.GetComponent.<ShipFuel>();
	//TODO
	
	//set hud values
	SetWeaponsPanel();
	SetUpgradesPanel();
	HideTarget();
	
	SetLatinumLabel(inventory.latinum);
	SetDilithiumLabel(fuel.getCurrentLoad());
	
	SetLocalReputation(map.getCurrentReputation());
	SetGlobalReputation(map.getGalacticReputation());
	
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
	warpImage.enabled = movement.isSystemWarp();
	
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
	for(var i : int = 0; i < weaponsImage.Length; i++) {
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

///<summary>This updates the weapons recharge overlay.</summary>
private function UpdateWeaponOverlay() {
	for(var i : int = 0; i < weaponsOverlay.Length; i++) {
		if(weapons.IsRecharging(i)) {
			weaponsOverlay[i].enabled = true;
			var percentage : float = weapons.RechargePercentage(i);			
			weaponsOverlay[i].color.a = percentage;									
		} else weaponsOverlay[i].enabled = false;
	}
}

///<summary>This sets the active upgrades on the HUD</summary>
function SetUpgradesPanel() {
	for(var x : int = 0; x < upgradeImage.Length; x++) {
		var u : GameObject = this.upgrades.GetActiveUpgrade(x);
		if(u) { 
			var up : Upgrade = u.GetComponent.<Upgrade>();
			var img : Texture = up.getImage();
			upgradeImage[x].sprite = Sprite.Create(img, new Rect(0,0, img.width, img.height), new Vector2(0.5f, 0.5f));
			upgradeImage[x].enabled = true;
		} else upgradeImage[x].enabled = false;
	}	
}

///<summary>Fires an active upgrade identified by its index...</summary>
///<param name="upgrade">upgrade indez</param>
function FireActiveUpgrade(upgrade : int) {
	upgrades.FireActiveUpgrade(upgrade);
}

///<summary>This updates the active upgrades recharge overlay.</summary>
private function UpdateUpgradesOverlay() {
	for(var x : int = 0; x < upgradeOverlay.Length; x++) {
		if(upgrades.IsActiveRecharging(x)) {
			upgradeOverlay[x].enabled = true;
			upgradeOverlay[x].color.a = upgrades.GetActiveRechargePercentage(x);
		} else upgradeOverlay[x].enabled = false;
	}
}

///<summary>This updates de Red Alert component.</summary>
private function UpdateRedAlert() {
	if(properties.getRedAlert()) {
		redAlertImage.enabled = true;
		redAlertImage.color.a = getTransparency(redAlertInterval);
	} else redAlertImage.enabled = false;
}	

///<summary>This returns a transparency value calculated with scene time.</summary>
///<param name="timePeriod">The time interval between each "flash"</param>
///<returns>Floating point Value from 0 to 1.</returns>	
private function getTransparency(timePeriod : float) : float {
	return (Mathf.Cos(Time.time * timePeriod)/2) + 0.5f;	
}


///<summary>This executes the "beaming down" function.</summary>
function Transport() {
	if(!triggers.isOrbit()) {
		message.AddMessage(ORBIT_ERROR);
	} else {
		transport();
	}
}

///<summary>Beams down to the planet surface.</summary>
private function transport() {
	var planet : GameObject = findSystemPlanet();
	var colonizable : IColonizable = planet.GetComponent(IColonizable) as IColonizable;
	var inventory : Inventory = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Inventory);
	var factionable : IFactionable = ship.GetComponent(IFactionable) as IFactionable;
	var faction : int = factionable.getFaction();
				
	if(colonizable.canColonize()) {
		if(inventory.hasColonizationTeams()) {
			var team : GameObject = inventory.getColonizationTeam();
			colonizable.colonize(faction, team);
			message.AddMessage(COLONIZED);
			return;
		}
		
	} 
	
	var conquerable : IConquerable = planet.GetComponent(IConquerable) as IConquerable;
	var populable : IPopuleable = planet.GetComponent(IPopuleable) as IPopuleable;
	
	if(conquerable.canConquer(faction)) {
	
		if(inventory.hasInvasionForce(populable.getPopulation())) {
			var force : GameObject = inventory.getInvasionForce();
			var invade : IInvasion = force.GetComponent(IInvasion) as IInvasion;
			if(!invade.canInvade(populable.getPopulation())) {
				message.AddMessage(INVASION_FAILED);
			} else {
				invade.invade(conquerable, faction);
				message.AddMessage(INVADED);
			}				
			return;	
		}	
		
	}
	
	
	if(!missions.finishTradeMissionInSystem()) {
		message.AddMessage(TRANSPORT_ERROR);
	}		
}

///<summary>Finds the main planet in the current system.</summary>
///<returns>Main Planet GameObject</returns>
private function findSystemPlanet() : GameObject {
	var planets : GameObject[] = GameObject.FindGameObjectsWithTag("Planet");
	
	for(var x : int = 0; x < planets.Length; x++) {
		var panel : PlanetPanel = planets[x].GetComponent(PlanetPanel);
		if(panel) {
			return planets[x];
		}
	}
	return null;

}

///<summary>This updates the health information on the HUD.</summary>
private function UpdateHealth() {
	var hull : float = health.getHullPercentage();
	hullImage.color.a = hull;
	hullLabel.text = Convert.ToInt32(hull * 100).ToString() + "%";
	
	var shield : float = health.getShieldPercentage();
	shieldImage.color.a = shield;
	shieldLabel.text = Convert.ToInt32(shield * 100).ToString() + "%";
}

///<summary>This updates the power information on the hud</summary>
private function UpdatePower() {
	powerBar.value = reactor.getPowerPercentage();
}

function ChangeWeaponsBalance(weapons : float) {
	balance.weapons = weapons;
} 

function ChangeDefenseBalance(defense : float) {
	balance.defense = defense;
}

function ChangeSpeedBalance(speed : float) {
	balance.speed = speed;
}

///<summary>This sets the Target Hud component</summary>
///<param name="target">Target GameObject</param>
function SetTarget(target : GameObject) {

	var faction : IFactionable = target.GetComponent(typeof(IFactionable)) as IFactionable;
	var text : ITextureable = target.GetComponent(typeof(ITextureable)) as ITextureable;
	SetTargetOrb(faction, text);

	var cls : IClasseable = target.GetComponent(typeof(IClasseable)) as IClasseable;
	var name : INameable = target.GetComponent(typeof(INameable)) as INameable;
	SetTargetLabel(cls, name);
	
	targetHealth = target.GetComponent(typeof(IHealtheable)) as IHealtheable;
	targetProps = target.GetComponent.<shipProperties>();
	this.target = target;
	
	targetGo.SetActive(true);
}


private function SetTargetOrb(faction : IFactionable, text : ITextureable) {
	if(properties.isOwn(faction.getFaction())) {
		SetTargetOrbFaction(2);
	} else if (properties.isAllied(faction.getFaction())) {
		SetTargetOrbFaction(0);
	} else if (properties.isHostile(faction.getFaction())) {
		SetTargetOrbFaction(3);
	} else if (properties.isNeutral(faction.getFaction())) {
		SetTargetOrbFaction(1);
	} else {
		Debug.LogWarning("We got a problem here!");
	}
	
	var t : Texture = text.getTargetImage();
	if(!t) return;
	targetOrb.sprite = Sprite.Create(t, new Rect(0,0,t.width,t.height), new Vector2(0.5f, 0.5f));  
	
}

private function SetTargetLabel(classe : IClasseable, name : INameable) {
	classLabel.text = classe.getClass();
	nameLabel.text = name.getName();
}


///<summary>This sets the faction type for the target orb</summary>
///<param name="type">Orb type: 0 - ally, 1 - neutral, 2 - owned, 3 - enemy</param>
private function SetTargetOrbFaction(type : int) {
	for(var x : int = 0; x < 4; x++) {
		factionOrbs[x].enabled = (x == type);
	}
}

///<summary>This hides the target hud component.</summary>
function HideTarget() {
	targetGo.SetActive(false);
	this.target = null;	
}


private function UpdateTarget() {
	if(this.target && targetGo.active) {
		hullBar.value = targetHealth.getHullPercentage();
		shieldBar.value = targetHealth.getShieldPercentage();
	} else if (targetGo.active) {
		HideTarget();
	}
}

///<summary>This toggles the target expansion.</summary>
function ToggleTargetExpansion() {
	
	if(animating) return;
	
	if(extended) {
		StartCoroutine(RetractTarget());
	} else {
		StartCoroutine(ExtendTarget());
	}
	
}

///<summary>Extends the target expansion.</summary>
private function ExtendTarget() {
	animating = true;
	var x : float = 0;
	var dx : float = xDiference/extendDuration;
	var dxi : float;
	
	while(x < xDiference) {
		dxi = dx * Time.deltaTime;	
		x += dxi;
		extendTransform.position.x -= dxi;
		yield;
	}
	
	extended = true;
	animating = false;
}


///<summary>Retracts the target expansion.</summary>
private function RetractTarget() {
	animating = true;
	var x : float = 0;
	var dx : float = xDiference/extendDuration;
	var dxi : float;
	
	while(x < xDiference) {
		dxi = dx * Time.deltaTime;	
		x += dxi;
		extendTransform.position.x += dxi;
		yield;
	}
	
	extended = false;
	animating = false;
}

///<summary>This hails the selected target.</summary>
function HailTarget() {
	if(!target) return;
	var hail : IHailable = target.GetComponent(typeof(IHailable)) as IHailable;
	hail.openComm();
}

///<summary>This sets the latinum label value.</summary>
///<param name="latinum">Value to be set</param>
function SetLatinumLabel(latinum : int) {
	latinumLabel.text = latinum.ToString();
}

///<summary>This sets the dilithium label value</summary>
///<param name="dilithium">Value to be set.</param>
function SetDilithiumLabel(dilithium : int) {
	dilithiumLabel.text = dilithium.ToString();
}

///<summary>This sets the local reputation label value</summary>
///<param name="local">Value to be set</param>
function SetLocalReputation(local : int) {
	localReputationLabel.text = local.ToString();
}

///<summary>This sets the global reputation label value</summary>
///<param name="global">Value to be set</param>
function SetGlobalReputation(global : int) {
	globalReputationLabel.text = global.ToString();
}

///<summary>This boards the targeted ship, after verifying if the target ship is ready to be boarded
/// The player shields are down and he has a boarding party on the inventory, and the hostile shields are down.
///Also, don't forget to check the ships faction</summary>
function BoardTargetShip() {
	if(isBoardable()) {
		message.AddMessage("Can't board that ship...");
	}else if(health.isShieldUp()) {
		message.AddMessage("Lower your shields before transporting.");
	} else if (!inventory.hasBoardingParty()) {
		message.AddMessage("Can't board without a boarding party...");
	} else if (targetHealth.isShieldUp()) {
		message.AddMessage("Bring down target shields before transporting.");
	} else {
		targetProps.Board(inventory.getBoardingParty(), properties.getFaction()); //BOARD!!!!!!
	}
}

private function isBoardable() : boolean {
	return !targetProps.isOwn(properties.getFaction());
} 






