#pragma strict
//lets start by creating some enumerations
enum Formation {close, standard, loose}
enum ShipType {Frigate, AttackShip, Cruiser, BattleShip}


//now le variables
var type : ShipType;
var formation : Formation = Formation.standard;
var leader : GameObject;
var defence : boolean;
var merchant : boolean;
var minDistance : float;
var followDistance : float;
var interceptRange : float;
var dockStation : float;
var dockShip : float;
var defenseStation : float;
var defenseShip : float;
var arriveTime : float;
var presenceTime : float = 180.0f; //3 minutes

//other scripts
var target : shipTarget;
var triggers : shipTriggers;
var props : shipProperties;
var move : shipMovement;

//other variables
var faceAngle : float = 1;


function Start () {

	triggers = gameObject.GetComponent(shipTriggers);
	target = gameObject.GetComponent(shipTarget);
	props = gameObject.GetComponent(shipProperties);
	move = gameObject.GetComponent(shipMovement);
	arriveTime = Time.time;

}

function Update () {

}

//this function checks if there's a leader
function hasLeader() : boolean {

	return leader != null;

}

//this function checks if the ship's a merchant
function isMerchant() : boolean {
	return merchant;
}

//this function checks if the ship belongs to some system defense
function isDefence() : boolean {
	return defence;
}

//this function checks if the ship has a target
function hasTarget() : boolean {
	return target.getTarget() != null;
} 

//this function searches for stations in the system
function hasStation() : boolean {
	var stations : GameObject[] = GameObject.FindGameObjectsWithTag("Station");
	return stations.Length > 0;


}

//this function searches for ships in the system
//pre isMerchant()
function hasShip() : boolean {
	var ships : GameObject[] = GameObject.FindGameObjectsWithTag("Ship");
	return ships.Length - 1 > 0;
}

//this function searches for hostile ships in the system
//pre !isMerchant(), !isDefense(), !hasLeader(), !isDanger()
function hasHostileShip() : boolean {
	var isHostile : boolean = false;
	var ships : GameObject[] = GameObject.FindGameObjectsWithTag("Ship");
	var hostileList : int[] = props.shipInfo.hostileFactions;
	
	for(var go : GameObject in ships && !isHostile) {
		var faction : int = go.GetComponent(shipProperties).shipInfo.faction;
		if(Statics.isEnemy(faction, hostileList)) {
			isHostile = true;
		}	
				
	}
	
	return isHostile;
	

}


//checks if the ship is in follow distance from game object
//pre target == leader, target != null
//pre target.transform.tag == "Ship"
function isFollowDistance(target : GameObject) : boolean {
	var distance : float = Vector3.Distance(target.transform.position, transform.position);
	return distance <= followDistance;
}

//checks if the ship is too close to another one
//pre target != null
//pre target.transform.tag == "Ship"
function isTooClose(target : GameObject) : boolean {

	var distance : float = Vector3.Distance(target.transform.position, transform.position);
	return distance <= minDistance;

}

//checks if the ship is in danger
//pre triggers != null
function isDanger() : boolean {
	//ping for nearby ships
	
	var hitColliders : Collider[] = Physics.OverlapSphere(transform.position, minDistance);
	
	return triggers.triggerProps.isTurbulence && hitColliders.Length - countColliders(gameObject) > 0;

}

//this function counts the amount of colliders the target has
//pre target != null
private function countColliders(target : GameObject) : int {

	var colliders : Collider[] = target.GetComponentsInChildren(Collider);
	return colliders.Length;

}

//this function returns the ship target
//pre hasTarget()
function getTarget() : GameObject {

	return target.getTarget();

}

//this function sets the ship as a merchant
function setMerchant() {
	merchant = true;
	defence = false;
	leader = null;
}

//this function sets the ship as a defender
function setDefence() {
	defence = true;
	merchant = false;
	leader = null;
}

//this function sets the ship leader
//pre leader.transform.tag == "Ship"
function setLeader(leader : GameObject) {
	this.leader = leader;
	defence = false;
	merchant = false;
}

//this function releases the ship from all his ties
function setFree() {
	leader = null;
	defence = false;
	merchant = false;
}

//this function returns the current formation mode the ship's in
function getFormation() : Formation {
	return formation;
}

//this function sets the ship formation
//pre form != null
function setFormation(form : Formation) {
	formation = form;
}

//this function sets the ship target
//pre target != null
function setTarget(target : GameObject) {
	this.target.setTarget(target);
}

//this function checks if the ship is ready to go to warp
//pre isMerchant()
function isWarpReady() : boolean {
	return Time.time > arriveTime + presenceTime;
}

//this functions gets the forward speed of a target ship
//pre target.transform.tag == "Ship"
function getSpeed(target : GameObject) : float{
	return target.rigidbody.velocity.z;

}

//this function checks if our ship is slower than the target ship
//pre target.transform.tag == "Ship"
function isSlower(target : GameObject) : boolean {
	return getSpeed(target) > getSpeed(gameObject);
}

//this function checks if our ship is faster than the target ship
//pre target.transform.tag == "Ship"
function isFaster(target : GameObject) : boolean {
	return getSpeed(target) < getSpeed(gameObject);
}

//this function attempts to match the ship speed with its target
//pre target.transform.tag == "Ship"
function matchSpeed(target : GameObject) {//pre target.transform.tag == "Ship"//pre leader.transform.tag == "Ship"return getSpeed(target) > getSpeed(gameObject);
	
	if(isSlower(target)) {
		move.increaseSpeed();
	} 
	else if (isFaster(target)) {
		move.decreaseSpeed();
	}
	

}

//this function checks if the ship is looking at target
//pre target.transform.tag == "Ship"
function isLookingAt(target : GameObject) {
	
	return Vector3.Angle(gameObject.transform.position, target.gameObject.position) < faceAngle
		
}

//this function makes the ship look at target
//pre target.transform.tag == "Ship"
function LookAt(target : GameObject) {

}


