#pragma strict
//lets start by creating some enumerations
enum Formation {close, standard, loose}
enum ShipType {Frigate, AttackShip, Cruiser, BattleShip, Boss}


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
var weapons : shipWeapons;

//other variables
var faceAngle : float = 1.0f;


function Start () {

	triggers = gameObject.GetComponent(shipTriggers);
	target = gameObject.GetComponent(shipTarget);
	props = gameObject.GetComponent(shipProperties);
	move = gameObject.GetComponent(shipMovement);
	weapons = gameObject.GetComponent(shipWeapons);
	arriveTime = Time.time;

}

function Update () {
	if(!props.playerProps.isPlayer)
	{
		botFunction();
	}

}

function botFunction() {
	if(hasLeader()) {
		leaderFunction();	
	}
}

function leaderFunction () {
	
	if(formation == Formation.close) {
				follow(leader);			
	} else if(formation == Formation.standard) {
		if(hasTarget() && isInRange(getTarget().transform.position)) {
			intercept(getTarget());
		} else {
			follow(leader);
		}
		
	} else {
		if(hasTarget()) {
			intercept(getTarget());
		} else {
			follow(leader);
		}
	
	}

}



//this function checks if the target position is inside range
function isInRange(target : Vector3) {
	
	return (transform.position - target).sqrMagnitude <= interceptRange * interceptRange;

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
	var distance : float = (target.transform.position - transform.position).sqrMagnitude;
	return distance <= (followDistance * followDistance);
}

//checks if the ship is too close to another one
//pre target != null
//pre target.transform.tag == "Ship"
function isTooClose(target : GameObject) : boolean {

	var distance : float = (target.transform.position - transform.position).sqrMagnitude;
	return distance <= (minDistance * minDistance);

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

	var targetDir = target.transform.position - transform.position;
	var forward = transform.forward;
	
	var angle = Vector3.Angle(targetDir, forward);
	
	return angle < faceAngle;
		
}

//this function makes the ship look at target
//pre target.transform.tag == "Ship"
function LookAt(target : GameObject) {
	var v3 : Vector3 = transform.InverseTransformPoint(target.transform.position);
	AlignX(v3);
	AlignY(v3);
	

}






//this function aligns the ship to the target ship on X
//pre target.transform.tag == "Ship"
function AlignX(target : Vector3)  {
	
	
	
	
	if(target.x < 0) {
		move.turnLeft();
	}
	else if(target.x > 0) {
		
		move.turnRight();
	}

}

//this function aligns the ship to the target ship on Y
//pre target.transform.tag == "Ship"
function AlignY(target : Vector3)  {
	
	
	
	
	if(target.y < 0) {
		move.turnDown();
		
	}
	else if(target.y > 0) {
		move.turnUp();
	}

}

//this function aligns the ship to the target ship on Z
//pre target.transform.tag == "Ship"
function AlignZ(target : GameObject) {

	if(target.transform.rotation.z > transform.rotation.z) {
		move.rotLeft();
	}
	else if (target.transform.rotation.z > transform.rotation.z) {
		move.rotRight();
	}


}

//this function makes the ship follow target
//pre target.transform.tag == "Ship"
function follow(target : GameObject) {
	if(!isLookingAt(target)) {
		LookAt(target);
	}
	
	if(isTooClose(target)) {
		if(!move.isAtMin()) {
			move.decreaseSpeed();
		}
	}
	else if(!isFollowDistance(target)) {
		if(!move.isAtMax()) {
			move.increaseSpeed();
		}
	}
	else {
		move.matchSpeed(target);
	}
}

//controls the intercept order
function intercept(target : GameObject) {
	if(isWeaponRange(target)) {
		attack(target);
	} else {
		follow(target);
	}

}

//this function makes the ship take a fire barrage stance
function barrage(target : GameObject) {
	
	if(!isLookingAt(target)) {
		LookAt(target);
	}

}

//this function controls the attack order

function attack(target : GameObject) {
	if(type == ShipType.AttackShip) {
	
	} else if (type == ShipType.BattleShip) {
		barrage(target);
	} else if (type == ShipType.Frigate || type == ShipType.Cruiser) {
	
	} else {
	
	}
	
}

//this checks if any of the weapons is in range
function isWeaponRange(target : GameObject) : boolean {
	return weapons.hasWeaponInRange(target);
}