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
private var target : shipTarget;
private var triggers : shipTriggers;
private var props : shipProperties;
private var move : shipMovement;
private var weapons : shipWeapons;
private var general : GeneralInfo;
private var message : ShowMessage;
private var shipProps : shipProperties;

//other variables
var faceAngle : float = 1.0f;
var isClearing : boolean = false;

//patrol variables
var patrolPoint : Vector3;
var isPatroling : boolean = false;
var patrolDistance : float = 10.0f;
var patrolRange : float = 1000.0f;

//message
var hailMsg : String = "You're being hailed by ";

//docking vars
var dockTarget : GameObject;

function Start () {
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	triggers = gameObject.GetComponent(shipTriggers);
	target = gameObject.GetComponent(shipTarget);
	props = gameObject.GetComponent(shipProperties);
	move = gameObject.GetComponent(shipMovement);
	weapons = gameObject.GetComponent(shipWeapons);
	shipProps = gameObject.GetComponent(shipProperties);
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
	} else if (defence) {
		defenseFunction();
	} else if (merchant) {
		merchantFunction();
	} else {
		freeShip();
	}
}

function defenseFunction () {

	if(hasTarget()) {
		intercept(getTarget());
	} else if (hasStation()){
		defend(getStation());
	} else {
		patrol();
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


function merchantFunction () {
	if(hasStation()) {
		if(!dockTarget || dockTarget.tag == "Ship") {
			dockTarget = getStation();
		} else {
			dock(dockTarget);
		}
	
	} else if(hasShip()) {
		if(!dockTarget || dockTarget.tag == "Station") {
			dockTarget = getShip();
		} else {
			dock(dockTarget);
		}
	
	} else {
		orbit();
	}

}

function freeShip() {
	if(hasHostileShip() || hasHostileStation()) {
		intercept(getTarget());
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
	var hostileList : int[] = general.factionInfo[props.shipInfo.faction].hostileFactions;
	
	for(var x : int = 0; x < ships.Length && !isHostile; x++) {
	
		var faction : int = ships[x].GetComponent(shipProperties).shipInfo.faction;
		if(Statics.isEnemy(faction, hostileList)) {
			isHostile = true;
		}	
				
	}
	
	return isHostile;
	

}

///<summary>Checks if there're any hostile stations</summary>
function hasHostileStation() : boolean {
	var isHostile : boolean = false;
	var ships : GameObject[] = GameObject.FindGameObjectsWithTag("Station");
	var hostileList : int[] = general.factionInfo[props.shipInfo.faction].hostileFactions;
	
	for(var x : int = 0; x < ships.Length && !isHostile; x++) {
	
		var faction : int = ships[x].GetComponent(Station).faction;
		if(Statics.isEnemy(faction, hostileList)) {
			isHostile = true;
		}	
				
	}
	
	return isHostile;
}

//checks if the ship is in follow distance from game object
function isFollowDistance(target : Vector3) : boolean {
	var distance : float = (target - transform.position).sqrMagnitude;
	return distance <= (followDistance * followDistance);
}

//checks if the ship is too close to another one
//pre target != null
//pre target.transform.tag == "Ship"
function isTooClose(target : Vector3) : boolean {

	var distance : float = (target - transform.position).sqrMagnitude;
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
function isLookingAt(target : Vector3) : boolean {

	var targetDir = target - transform.position;
	var forward = transform.forward;
	
	var angle = Vector3.Angle(targetDir, forward);
	
	return angle < faceAngle;
		
}

//this function makes the ship look at target
//pre target.transform.tag == "Ship"
function LookAt(target : Vector3) {
	var v3 : Vector3 = transform.InverseTransformPoint(target);
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
	var pos : Vector3 = target.transform.position;
	if(!isLookingAt(pos)) {
		LookAt(pos);
	}
	
	if(isTooClose(pos)) {
		if(!move.isAtMin()) {
			move.decreaseSpeed();
		}
	}
	else if(!isFollowDistance(pos)) {
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
//it'll sto
function barrage(target : GameObject) {
	
	if(!move.isStop() && !move.isChanging) { 
			move.fullStop();
	}
	
	var pos : Vector3 = target.transform.position;
	
	if(!isLookingAt(pos)) {
		LookAt(pos);
		isClearing = false;
	}

}

//this function makes the ship "hunt" the hostile ship
//It'll make the ship continuously orbit its target at 1/2 of minimum weapons range
function predator(target : GameObject) {
	if(isShortestWeaponInRange(target)) {
		if(!isShowingSide(target)) {
			var v3 : Vector3 = transform.InverseTransformPoint(target.transform.position);
			if(isLeft(v3)) {
				move.turnRight();	
			} else {
				move.turnLeft();
			}
		
		}
		
		
			
	} else {
		follow(target);
						
	}

}


//this function controls the attack order

function attack(target : GameObject) {
	if(type == ShipType.AttackShip) {
		AttackRun(target);
	} else if (type == ShipType.BattleShip) {
		barrage(target);
	} else if (type == ShipType.Frigate || type == ShipType.Cruiser) {
		predator(target);
	} else { //future boss stuff
	
	}
	
}

//this checks if any of the weapons is in range
function isWeaponRange(target : GameObject) : boolean {
	return weapons.hasWeaponInRange(target);
}

//this checks if the shortest weapon is in range
function isShortestWeaponInRange(target : GameObject) : boolean {
	return weapons.isShortestInRange(target);
}

//this checks if the ship its showing the target any of its sides
function isShowingSide(target : GameObject) : boolean {
	var from : Vector3 = target.transform.position - transform.position;
	var to : Vector3 = transform.forward;
	var angle : float = Vector3.Angle(from, to);
	return angle <= 90 + faceAngle/2 && angle >= 90 - faceAngle;
	
}

//this checks if the target is at the left
function isLeft(target : Vector3) : boolean {
	
	return target.x < 0;

}

//this checks if the target is in front
function isFront(target : Vector3) : boolean {
	return target.z > 0;
}

//This function controls the Attack Run made by attack ships like the Defiant, B'rel, etc
//When its called, it checks if its "diving"... If so, it will Look At the target
//if not, it will get away from the target until it leaves weapon range
//the status is restarted after that
function AttackRun(target : GameObject) {
	if(isTooClose(target.transform.position)) {
		isClearing = true;
	}

	if(isClearing) {
		
		LookAway(target);
	}

}

//this function makes the ship Look Away from the target
function LookAway(target : GameObject) {
	var v3 : Vector3 = transform.InverseTransformPoint(target.transform.position);
	if(isFront(v3)) {
		if(isLeft(v3)) {
			move.turnRight();
		} else {
			move.turnLeft();
		}
	}
	
}

///<summary>function containing the defensive behaviour - guard something</summary>
///<param name="target">Object to be defended</param>
function defend(target : GameObject) {
	if(target.tag == "Station") {
		defendStation(target);
	} else if (target.tag == "Ship") {
		defendShip(target);
	}


}

///<summary>This function controls the defend station position</summary>
///<param name="target">Object to be defended</param>
function defendStation (target : GameObject) {
	if((transform.position - target.transform.position).sqrMagnitude > (defenseStation * defenseStation)) {
		follow(target);
	
	} else {
		if(!move.isStop() && !move.isChanging) {
			move.fullStop();
		}
	}//if it doesn't enter, it must hold position in the perimeter

}

///<summary>This function controls the defend ship stance</summary>
///<param name="target">Object to be defended</param>
function defendShip (target : GameObject) {
	if((transform.position - target.transform.position).sqrMagnitude > (defenseShip * defenseShip)) {
		follow(target);
	} else {
		if(!move.isStop() && !move.isChanging) {
			move.fullStop();
		}
	}//if it doesn't enter, it must hold position in the perimeter

}

///<summary>This function obtains an ally station in the scene</summary>
function getStation() : GameObject {
	var station : GameObject;
	
	var stations : GameObject[] = GameObject.FindGameObjectsWithTag("Station");
	
	var r : float = Random.value;
	var num : int = (stations.length - 1) * r;
	
	station = stations[num];
		
	return station;
}


///<summary>This function makes the ship go on patrol</summary>
function patrol() {
	
	if(!isPatroling) {
		patrolPoint = genPoint(patrolRange);
		isPatroling = true;
	}
	
	if(isPatroling) {
		if((patrolPoint - transform.position).sqrMagnitude > patrolDistance * patrolDistance) {
			goToPoint(patrolPoint);		
		}
	
	
	}

}


///<summary>This function generates a patrol destination for the ship. Center is the scene start</summary>
///<param name="radius">Radius of the patrol sphere</param>
function genPoint(radius : float) : Vector3{
	
	var startScene : GameObject = GameObject.FindGameObjectWithTag("SceneStart");
	
	var point : Vector3 = Random.insideUnitSphere * radius;
	
	return point + startScene.transform.position;

}

///<summary>This makes the ship go to a certain point</summary>
///<param name="point">Destination point</param>
function goToPoint(point : Vector3) {
	if(!isLookingAt(point)) {
		LookAt(point);
	}
	
	if(!move.isAtMax()) {
		move.increaseSpeed();
	
	}
			

}

///<summary>This function makes the ship dock with the target</summary>
///<param name="target">Object to dock</param>
function dock(target : GameObject) {
	var distance : float = (transform.position - target.transform.position).sqrMagnitude;
	if(target.tag == "Station") {
		if(distance > dockStation * dockStation) {
			follow(target);
		} else {
			if(!move.isStop() && !move.isChanging) {
				move.fullStop();			
			}
		}
			
	} else if (target.tag == "Ship"){
		if(distance > dockShip * dockShip) {
			follow(target);
		} else {
			if(!move.isStop() && !move.isChanging) {
				move.fullStop();			
			}
		}
		
		if(target.GetComponent(shipProperties).playerProps.isPlayer) {
			hailPlayer();
		}
		
	}

}

///<summary>This function will hail the player</summary>
///<pre>Only used when hailing the player</pre>
function hailPlayer() {
	message.AddMessage(hailMsg + shipProps.shipInfo.shipName);
}


///<summary>This function will pick a random ship from the system</summary>
function getShip() {
	var ships : GameObject[] = GameObject.FindGameObjectsWithTag("Ship");
	var rnd : int = Random.value * (ships.length - 1);
	return ships[rnd];
	
}

///<summary>This function will make the ship head towards the planet and stop once its in orbit</summary>
function orbit() {
	if(!triggers.triggerProps.isOrbit) {
		var planet : GameObject = GameObject.FindGameObjectWithTag("MainPlanet");
		follow(planet);
	} else {
		if(!move.isStop()) {
			move.fullStop();
		}	
	}


}
