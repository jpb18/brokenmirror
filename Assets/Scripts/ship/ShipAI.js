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
var target : shipTarget;
var triggers : shipTriggers;
var props : shipProperties;



function Start () {

	triggers = gameObject.GetComponent(shipTriggers);
	target = gameObject.GetComponent(shipTarget);
	props = gameObject.GetComponent(shipProperties);
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
function isFollowDistance(target : GameObject) : boolean {
	var distance : float = Vector3.Distance(target.transform.position, transform.position);
	return distance <= followDistance;
}

//checks if the ship is too close to another one
//pre target != null
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
function isWarpReady() : boolean {
	return Time.time > arriveTime + presenceTime;
}

