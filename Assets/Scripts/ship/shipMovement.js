//this script controls the ship movement
#pragma strict



var speedStatus : float; //from -.25 to 1, this controls the ship "impulse"
var keys : KeyControlMovemnt; //this controls all keys related to movement
var movProps : MovementProperties; //this controls all movement properties

var speedChanged : boolean = false; //Checks if the speed has been changed in the last cycle
var isChanging : boolean = false;
var speedTarget : float;

var redAlertSlowdown : float = 0.7f;

var impulseParticleSystem : ParticleSystem;

var auto : boolean;

class KeyControlMovemnt {
	public static final var TIME : float = 0.1f;
	var SpeedIncreaseKey : float;
	var SpeedDecreaseKey : float;
	
	var autoAim : float;
	var warp : float;
		
	function setAutoAim() {
		autoAim = Time.time;
	}
	
	function canAutoAim() : boolean {
		return Time.time > autoAim + TIME;
	}
	
	function SetWarp() {
		this.warp = Time.time;
	}
	
	function CanWarp() : boolean {
		return Time.time > warp + TIME;
	}
	
	
}

class MovementProperties {
	var minStatus : float = - 0.25;
	var maxStatus : float = 1.0f;


}

//warp deceleration variables
private var isWarp = true;
private var isLoad = true;
private static final var WARP_SPEED : float = 500.0f;
private static final var DRAG_DECEL : float = 10.0f;
private static final var DRAG_DUR : float = 3.0f;
var spawnTime : float;

var isAtWarp : boolean;
var warpMulti : float = 5f;
private var curWarpMulti : float = 1f;
var warpTime : float = 1f;
private var isSpeeding : boolean = false;
public static var WARP_MIN : float = 1f;

public var warpBurnout : float = 10f;
public var burnoutRecover : float = 5f;
private var warpInitTime : float;
private var burnoutTime : float = 0f;
private var burnout : boolean = false;
public static final var BURN_WARNING : float = 0.1f;

private var impulseParticleSpeed : float;
private var message : ShowMessage;
private var upgrades : Upgrades;
private var reactor : ShipReactor;
private var target : shipTarget;
private var properties : shipProperties;
private var balance : ReactorBalance;
private var skills : Skills;

var warpParticle : ParticleSystem;

var warpConsumption : float;

function Start () {

	this.warpInitTime = -warpBurnout;

	
	properties = gameObject.GetComponent(shipProperties);
	upgrades = gameObject.GetComponent(Upgrades);
	reactor = gameObject.GetComponent(ShipReactor);
	target = gameObject.GetComponent(shipTarget);
	balance = gameObject.GetComponent.<ReactorBalance>();
	
	if(!impulseParticleSystem) {
		Debug.LogWarning("Check if the impulse particle system exists at " + gameObject.name + ".");
	} else {
		impulseParticleSpeed = impulseParticleSystem.startSpeed;
	}
	
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	skills = GameObject.FindGameObjectWithTag("SaveGame").GetComponent.<Skills>();
	
}

function Update () {
	
	if(isAtWarp) {
		warp();
	} else {
		sublight();
	}
	selectWarp();
	toggleAutoAim();
	CheckWarpBurnout();
}

function toggleAutoAim() {
	if(Input.GetAxis("AutoAim") && keys.canAutoAim()) {
		keys.setAutoAim();
		auto = !auto;
	}
	
	if(!properties.getPlayer()) {
		auto = false;
	}

}

function sublight() {
	if(impulseParticleSystem) {
		setImpulseSpeed();
		setImpulseParticlesVisible();	
	}
	
	if(isLoad && isWarp) {
		rigidbody.velocity = transform.forward * WARP_SPEED;
		rigidbody.drag = DRAG_DECEL;
		spawnTime = Time.time;
		isLoad = false;
	
	}

	var isPlayer : boolean = properties.playerProps.isPlayer;
	if (isPlayer && !isWarp)
	{
		shipPlayer_speed();
		shipPlayer_movement();
		
	}
	
	if(Time.time >= spawnTime + DRAG_DUR && isWarp) {
		isWarp = false;
		rigidbody.drag = 0;
		
	}
	
	var shipSpeed : float = getShipSpeed() * Time.deltaTime * speedStatus;
	rigidbody.velocity = transform.forward * shipSpeed;
}

//this function controls the ship speed
function shipPlayer_speed () {
	//var shipAcceleration : float = properties.movement.acceleration;
	if(Input.GetAxis("ShipSpeed") > 0 && !isChanging){
		if (!isAtMax())	{
			increaseSpeed();	
		}
	}
	else if (Input.GetAxis("ShipSpeed") < 0 && !isChanging)	{
		if (!isAtMin())	{
			decreaseSpeed();
		}
	}
	
	if (Input.GetAxis("FullStop") && !isChanging && !isStop()){
		fullStop();
	}
}

function getShipSpeed() : float {
	var speed : float = properties.getSpeed();
	
	if(properties.isPlayer()) {
		speed = speed + skills.getSpeedBonus();
	}
	
	if(properties.getRedAlert()) {
		speed = speed * getSpeedReduction();
	}
		
	return speed * balance.speed;
}

function isStopping() : boolean {
	return isChanging;
}

function fullStop() {
	StartCoroutine(FullStop(speedStatus, properties.movement.acceleration));
}

function isStop() : boolean {
	return speedStatus == 0;
}

function shipPlayer_movement () {
	if(auto && target.hasTarget()) {
		automaticMovement();
	} else {
		manualMovement();
	}		
}

function manualMovement() {
		var shipAgility : float = shipAgility();
		
		//get axis input
		var inputHor : float = Input.GetAxis("Horizontal");
		var inputVer : float = Input.GetAxis("Vertical");
		var inputRot : float = Input.GetAxis("Rotate");
		
		//apply rotation
		transform.Rotate(Vector3(inputVer * shipAgility, shipAgility * inputHor, inputRot * shipAgility));	

}

function automaticMovement() {
	var tgt : GameObject = target.getTarget();
	var position : Vector3 = tgt.transform.position;
	var interval : float = shipAgility();
	
	if(isTargetAbove(position, interval)) {
		turnUp();
	} else if(isTargetUnder(position, interval)) {
		turnDown();
	}
	
	if(isTargetAtLeft(position, interval)) {
		turnLeft();
	} else if(isTargetAtRight(position, interval)) {
		turnRight();
	}
	


}

function isTargetAbove(target : Vector3, interval : float) : boolean {
	var v : Vector3 = transform.InverseTransformPoint(target);
	return v.y > interval;
}

function isTargetUnder(target : Vector3, interval : float) : boolean {
	var v : Vector3 = transform.InverseTransformPoint(target);
	return v.y < -interval;
}

function isTargetAtLeft(target : Vector3, interval : float) : boolean {
	var v : Vector3 = transform.InverseTransformPoint(target);
	return v.x < -interval;
}

function isTargetAtRight(target : Vector3, interval : float) : boolean {
	var v : Vector3 = transform.InverseTransformPoint(target);
	return v.x > interval;
}

function shipAgility() : float {
	var agility : float = properties.getAgility();
	
	if(properties.isPlayer()) {
		agility += skills.getAgilityBonus();
	}

	return agility * Time.deltaTime;
}

function FullStop (currentSpeed : float, acceleration : float)
{
	isChanging = true;
	var isIncreasing : boolean;
	if (currentSpeed > 0) 
	{
		isIncreasing = false;
	}
	else
	{
		isIncreasing = true;
	}

	var time : float = Mathf.Sqrt(Mathf.Pow(currentSpeed, 2))/acceleration;
	var rate : float = 1/time;
	var i : float = 0;
	if(isIncreasing)
	{
		while(i < 1)
		{
		i += Time.deltaTime * rate;
		speedStatus += acceleration * Time.deltaTime;
		yield;
		
		}
	}
	else
	{
		while(i < 1)
		{
		i += Time.deltaTime * rate;
		speedStatus -= acceleration * Time.deltaTime;
		yield;
		
		}
	}
	
	if(Mathf.Sqrt(Mathf.Pow(speedStatus, 2)) < acceleration * Time.deltaTime)
	{
		speedStatus = 0;
	}
	
	
	isChanging = false;
	speedStatus = 0;

}

//this function increases the speed of the ship
//pre !isAtMax()
function increaseSpeed() {
	speedStatus += properties.movement.acceleration * Time.deltaTime;

}

//this function decreses the speed of the ship
//pre !isAtMin()
function decreaseSpeed() {
	speedStatus -= properties.movement.acceleration * Time.deltaTime;
}

//this function checks if the ship is at its max speed
function isAtMax() : boolean {

	return speedStatus >= movProps.maxStatus;

}

//this function checks if the ship is at is min speed
function isAtMin() : boolean {
	return speedStatus <= movProps.minStatus;
}

//this function matches the ship speed with the target speed
function matchSpeed(target : GameObject) {
	var shipAcceleration : float = properties.movement.acceleration;
	if(speedStatus * speedStatus > shipAcceleration * shipAcceleration * Time.deltaTime) {
		if(Statics.isSlower(target, gameObject)) {
			if(!isAtMax()) {
				increaseSpeed();
			}
		}
		else if(Statics.isFaster(target, gameObject)) {
			if(!isAtMin()) {
				decreaseSpeed();
			}
		}
	} else {
		speedStatus = 0;
	}

}

//AI Function: Turns the ship up
function turnUp() {

	transform.Rotate(Vector3(-shipAgility(),0,0));

}

//AI Function: Turns the ship down
function turnDown() {
	transform.Rotate(Vector3(shipAgility(), 0, 0));
}

//AI Function:  Turns the ship right
function turnRight() {
	transform.Rotate(Vector3(0, shipAgility(), 0));
}

//AI Function: Turns the ship left
function turnLeft() {
	transform.Rotate(Vector3(0, -shipAgility(), 0));
}

//AI Function: Rotates the ship right
function rotRight() {
	transform.Rotate(Vector3(0,0, -shipAgility()));
	
}

//AI Function: Rotates the ship left
function rotLeft() {
transform.Rotate(Vector3(0,0, shipAgility()));
	
}

function setWarp() {
	isWarp = true;
}

function getSpeedReduction() : float {
	return redAlertSlowdown;
}

private function setImpulseSpeed() {

	var speed : float = speedStatus * impulseParticleSpeed;
	impulseParticleSystem.startSpeed = speed;
}

private function setImpulseParticlesVisible() {
	
	if(isStop()) {
		impulseParticleSystem.renderer.enabled = false;
	} else {
		impulseParticleSystem.renderer.enabled = true;
	}

}

private function selectWarp() {

	
	if(Input.GetAxis("Warp") && properties.getPlayer()) {
		if(!keys.CanWarp()) return;
			keys.SetWarp();
		if(!isAtMax()) {
			message.AddMessage("Ship needs to be at maximum speed to enter warp.");
		} else if (isAtWarp) {
			message.AddMessage("Ship is already at warp.");
		} else if (isSpeeding) {
			message.AddMessage("Warp engine can't handle such reactions.");	
		} else if (this.burnout) {
			var time : int = BurnoutExpire() - Time.time;
			message.AddMessage("Warp engines at critical levels. Wait for " + time + " seconds.");	
		} else {
			SystemWarp();
		}
		
	}
	
	if(Input.GetAxis("ShipSpeed") < 0 && isAtWarp) {
		if (isSpeeding) {
			message.AddMessage("Warp engine can't handle such reactions.");	
		} else {
			stopWarp();
		}
	}
	
	if(Input.GetAxis("FullStop") && isAtWarp) {
		if (isSpeeding) {
			message.AddMessage("Warp engine can't handle such reactions.");	
		} else {
			stopWarp();
			fullStop();
		}
	}

}

function SystemWarp() {
	this.warpInitTime = Time.time;
	isAtWarp = true;
	startWarpParticles();
	StartCoroutine(accelerateToWarp());
}

function stopWarp() {
	isAtWarp = false;
	stopWarpParticles();
	StartCoroutine(desacelerateFromWarp());
}

private function startWarpParticles() {
	if(warpParticle) {
		warpParticle.Play();
	} else {
		Debug.Log(gameObject.name + "doesn't have a WarpParticle assigned in the movement script.");
	}
}

private function stopWarpParticles() {
	if(warpParticle) {
		warpParticle.Stop();
	} else {
		Debug.Log(gameObject.name + "doesn't have a WarpParticle assigned in the movement script.");
	}
}

private function warp() {

	var consume : float = warpConsumption * Time.deltaTime;
	
	if(!reactor.hasEnough(consume)) {
		message.AddMessage("Not enough power to sustain warp.");
		stopWarp();
		
	} else {
		reactor.spend(consume);
		var shipSpeed : float = properties.movement.impulseSpeed * Time.deltaTime * properties.getWarpSpeed();
		var SpeedChange : float = curWarpMulti * shipSpeed;
		if(properties.getRedAlert()) {
			SpeedChange = SpeedChange * getSpeedReduction() * balance.speed;
		}
		rigidbody.velocity = transform.forward * SpeedChange;
	}

}

private function accelerateToWarp() {
	var i : float = 0;
	var rate : float = 1/warpTime;
	var dist : float = warpMulti - WARP_MIN;
	isSpeeding = true;
	while(i < 1) {
		i += Time.deltaTime * rate;
		curWarpMulti += dist * rate * Time.deltaTime;
		yield;
	}
	isSpeeding = false;
}

private function desacelerateFromWarp() {
	var i : float = 0;
	var rate : float = 1/warpTime;
	var dist : float = warpMulti - WARP_MIN;
	isSpeeding = true;
	while(i < 1) {
		i += Time.deltaTime * rate;
		curWarpMulti -= dist * rate * Time.deltaTime;
		yield;
	}
	isSpeeding = false;
	curWarpMulti = WARP_MIN;
}

function isSystemWarp() : boolean {
	return isAtWarp || isWarp;
}

function IsWarpBurnOut() : boolean {
	return this.burnout;
}

function ShowBurnoutWarning() : boolean {
	if(this.burnout) return true;
	
	var less : boolean = Time.time > WarningTime();
	var more : boolean = Time.time < BurnoutExpire();
	
	if(less && more) return true;
	
	return false;
	
}

private function WarningTime() : float {
	var warningTime : float = this.warpBurnout * BURN_WARNING;
	return this.warpInitTime + this.warpBurnout - warningTime;
}

private function BurnoutExpire() : float {
	return this.burnoutTime + this.burnoutRecover;
}

function CheckWarpBurnout() {
	if(this.burnout) {
		if(Time.time > this.burnoutTime + this.burnoutRecover) {
			this.burnout = false;
		}
	} else {
		if(this.isAtWarp && Time.time > this.warpInitTime + this.warpBurnout) {
			this.burnout = true;
			this.burnoutTime = Time.time;
			this.stopWarp();
			message.AddMessage("Warp engine under heavy stress. Ready in " + this.burnoutRecover + " seconds.");
		}
	}
}

function GetLastBurnoutTime() : float {
	return burnoutTime;
}

function GetForwardPercentage() : float {
	if(this.speedStatus > 0) {
		return this.speedStatus/this.movProps.maxStatus;
	} else return 0;
}

function GetBackwardsPercentage() : float {
	if(this.speedStatus < 0) {
		return this.speedStatus/this.movProps.minStatus;
	} else return 0;
}
