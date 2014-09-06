#pragma strict

class stats {
	var speed : float; //torpedo speed
	var hullDmg : float; //torpedo damage vs hull
	var shieldDmg : float; //torpedo damage vs shield
	var range : float; //torpedo range
	var cost : float; //torpedo "normal" cost, to be used in GUI only
	var cooldown : float; // torpedo cooldown
	
}

class Effects {
	var explosion : GameObject; //the explosion Game Object
	var exploded : boolean = false; //checks if the torpedo has already detonated
	
	
	
	function hasExploded() : boolean {
		return exploded;
	}
	
	function getExplosion() : GameObject {
		return explosion;
	}
	
	function setExploded(s : boolean) {
		exploded = s;
	}

}

var status : stats;
var effect : Effects;
var target : GameObject; //target ship
var origin : GameObject; //origin ship
private var originPoint : Transform;
var launched : float; //launch time
var isSpread : boolean = false; //checks if the torpedo is already a spread

private var trans : Transform;
private var go : GameObject;

private var upgrades : Upgrades;

function FixedUpdate () {
	
	calc_range();
	CheckTTargetAndOrigin();
	

}

function CheckTTargetAndOrigin () {
	if(!target || !origin)
	{
		Destroy(gameObject);
	}

}


function calc_range() {
	var time_passed : int = Time.time - launched;
	var distance_made : int = time_passed * status.speed;
	
	if (distance_made >= status.range)
	{
		Destroy(gameObject);
	}

}

function Awake() {
	trans = transform;
	go = gameObject;

}


function OnEnable() {
	
	var audio : AudioSource = gameObject.GetComponent(AudioSource);
	audio.Play();
	
	var intersect : Vector3;
	
	if(target)
	{	
		var originPos : Vector3 = this.origin.transform.position;
		var speed : float = status.speed;
		var targetPos : Vector3 = target.transform.position;
		var targetVel : Vector3 = target.rigidbody.velocity;
		intersect = FindInterceptVector(originPos, speed, targetPos, targetVel);
		
		
	} else {
		intersect = transform.forward * status.speed;
	}

	rigidbody.velocity = intersect;
	
	
	launched = Time.time;
	effect.setExploded(false);
	
	
	
}


function OnTriggerEnter(hit : Collider) {

	//check if it's a shield trigger
	var h : boolean = hit.tag == "Shields";
	var ex : boolean = !effect.hasExploded();
	if(h && ex)
	{
		var hitGO : GameObject = getParent(hit.transform).gameObject;
		var e = origin.Equals(hitGO);
		if(!e)
		{
			validHit(hitGO);	
		} else {
			
		}
	
	
	}



}

private function validHit(hitGO : GameObject) {
	if (hitGO.tag == "Ship") {			
				shipTrigger(hitGO);
			} else if (hitGO.tag == "Station") {
				stationTrigger(hitGO);
				
			}
}

private function shipTrigger(hitGO : GameObject)  {

		//get red alert status
		var isRedAlert : boolean = hitGO.GetComponent(shipProperties).combatStatus.isRedAlert;
		
		if(isRedAlert) {
			
			var hitHS : shipHealth = hitGO.GetComponent(shipHealth);
			var shields = hitHS.shipHealth.shields;
			if(shields > 0)
			{
				effect.setExploded(true);
				if(shields >= status.shieldDmg)
				{
					hitHS.shipHealth.shields -= status.shieldDmg;
				}
				else
				{
					hitHS.shipHealth.shields = 0;
				}
			
				hitHS.shieldShow.lastHit = Time.time;
				hitHS.shieldRegen.lastHit = Time.time;
				Instantiate(effect.explosion, transform.position, transform.rotation);
				Destroy(gameObject);
			}
		}

}


private function stationTrigger(hitGO : GameObject) {

	

		var hitHS : Health = hitGO.GetComponent(Health);
		
		if(hitHS.hasShield())
		{
			effect.setExploded(true);
					
			hitHS.getDamage(status.shieldDmg, false);
			
			Instantiate(effect.explosion, transform.position, transform.rotation);
			Destroy(gameObject);
		}
	



}

function OnCollisionEnter (hit: Collision) {
	var go : GameObject = hit.gameObject;
	var e : boolean = go != origin;
	if(e && !effect.hasExploded())
	{		
		if(go.tag == "Ship")
		{
			shipCollision(go);
		}
		else if(go.tag == "Station") {
			stationCollision(go);
		}
		else if(go.tag == "Torpedoes")
		{
			Destroy(gameObject);
		}
		
		registerHit(go);
			
	}

}

private function stationCollision(hit : GameObject) {
	effect.setExploded(true);
	var hitHS : Health = hit.GetComponent(Health);
	hitHS.getDamage(getDamage(false), false);
	Instantiate(effect.explosion, transform.position, transform.rotation);
	Destroy(gameObject);

}

private function shipCollision(hit : GameObject) {
	effect.setExploded(true);
	var hitHS : shipHealth = hit.GetComponent(shipHealth);
	hitHS.shipHealth.health -= getDamage(false);
	hitHS.shieldRegen.lastHit = Time.time;
	Instantiate(effect.explosion, transform.position, transform.rotation);
	Destroy(gameObject);

}

function Destroy(obj : GameObject) {
	obj.SetActive(false);
}

//this method set the target
//pre: target != null
function setTarget(target : GameObject) {
	this.target = target;
}
//this method sets the origin
//pre origin != null
function setOrigin(origin : GameObject) {
	trans.position = origin.transform.position;
	originPoint = origin.transform;
	this.origin = origin.transform.root.gameObject;
	
}

function getDamage(isShield : boolean) : float {
	var dmg : float;
	if(isShield) {
		dmg = status.shieldDmg;
	} else {
		dmg = status.hullDmg;
	}
	
	if(upgrades) {
		dmg = dmg + upgrades.getDamageBonus();
	}
	
	return dmg;
}

private function getParent(trans : Transform) : Transform {
		
		
		return trans.root;
	
}

function registerHit(target : GameObject) {
	if(target.tag == "Ship") {
		registerShipHit(target);
	}

}

private function registerShipHit(ship : GameObject) {
	var health : shipHealth = ship.GetComponent(shipHealth);
	health.setLastHitter(origin);
}

function setUpgrade(upgrades : Upgrades) {
	this.upgrades = upgrades;
}

///<summary>This function calculates the most likelly colision between two objects a (target) and b (projectille)</summary>
///<param name="Pa">Vector3 with the position of object a</param>
///<param name="Va">Vector3 with the velocity of object a</param>
///<param name="Pb">Vector3 with the position of object b</param>
///<param name="Vb">Vector3 with the velocity of object b</param>
///<returns>Most likelly intersect point</returns>
function calculateIntersectPoint(Pa : Vector3, Va : Vector3, Pb : Vector3, Vb : Vector3) : Vector3 {
	var t : float = calculateIntersectTime(Pa, Va, Pb, Vb);
	
	var pos : Vector3 = calculatePosition(Pa, Va, t);
	
	return pos;
}	

function calculatePosition(p : Vector3, v : Vector3, t : float) : Vector3 {
	return p + (v*t);
}

///<summary>This function calculates the intersect time</summary>
///<param name="Pa">Vector3 with the position of object a</param>
///<param name="Va">Vector3 with the velocity of object a</param>
///<param name="Pb">Vector3 with the position of object b</param>
///<param name="Vb">Vector3 with the velocity of object b</param>
///<returns>Most likelly intersect point</returns>
function calculateIntersectTime(Pa : Vector3, Va : Vector3, Pb : Vector3, Vb : Vector3) : float {
	var Pab : Vector3 = Pa - Pb;
	var Vab : Vector3 = Va - Vb;
	var a  : float = Vector3.Dot(Vab, Vab);
	var b : float = Vector3.Dot(Pab, Pab);
	var c : float = b;
	
	var discriminant : float = calculateDiscriminant(a,b,c);
	
	var t : float;
	
	if(discriminant <= 0) {
		t = calculateSinglePoint(a, b);
	} else {
		t = calculateTwoPoints(a, b, discriminant);
	}
	
	
	
	if(t < 0) {
		t = 0;
	}
	
	return t;

}

///<summary>Calculates de discriminant of a quadratic function</summary>
function calculateDiscriminant(a : float, b : float, c : float) : float {
	return (b * b) - (4 * a * c);
}

function calculateSinglePoint(a : float, b : float) : float {
	return -(b/(2*a));
}

function calculateTwoPoints(a : float, b : float, discriminant : float) : float {
	var t0 : float = (-b + Mathf.Sqrt(discriminant))/(2*a);
	var t1 : float = (-b - Mathf.Sqrt(discriminant))/(2*a);
	
	return Mathf.Min(-t0, -t1);
}

private function FindInterceptVector(shotOrigin : Vector3,shotSpeed : float,targetOrigin : Vector3,targetVel : Vector3) : Vector3 {
	var dirToTarget : Vector3 = Vector3.Normalize(targetOrigin - shotOrigin);
	
	// Decompose the target's velocity into the part parallel to the
    // direction to the cannon and the part tangential to it.
    // The part towards the cannon is found by projecting the target's
    // velocity on dirToTarget using a dot product.
	var targetVelOrth : Vector3 = Vector3.Dot(targetVel, dirToTarget) * dirToTarget;
	
	 // The tangential part is then found by subtracting the
    // result from the target velocity.
    var targetVelTang : Vector3 = targetVel - targetVelOrth;
    
    /*
    * targetVelOrth
    * |
    * |
    *
    * ^...7  <-targetVel
    * |  /.
    * | / .
    * |/ .
    * t--->  <-targetVelTang
    *
    *
    * s--->  <-shotVelTang
    *
    */
    
    // The tangential component of the velocities should be the same
    // (or there is no chance to hit)
    // THIS IS THE MAIN INSIGHT!
    
    var shotVelTang : Vector3 = targetVelTang;
    
     // Now all we have to find is the orthogonal velocity of the shot
    var shotVelSpeed : float = shotVelTang.magnitude;
    
    
    var vector : Vector3;
    if(shotVelSpeed > shotSpeed) {
    	  // Shot is too slow to intercept target, it will never catch up.
        // Do our best by aiming in the direction of the targets velocity.
        vector = targetVel.normalized * shotSpeed;
    
    } else {
    
	  	// We know the shot speed, and the tangential velocity.
	    // Using pythagoras we can find the orthogonal velocity.
	   var shotSpeedOrth : float =	Mathf.Sqrt(shotSpeed * shotSpeed - shotVelSpeed * shotVelSpeed);
		var shotVelOrth : Vector3 = dirToTarget * shotSpeedOrth;

		// Finally, add the tangential and orthogonal velocities.
		vector = shotVelOrth + shotVelTang;
	}
	
	return vector;
	

	
    
}

