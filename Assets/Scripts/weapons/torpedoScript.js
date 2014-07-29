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
	
	
	if(target)
	{	
		transform.LookAt(target.transform);
	}


	rigidbody.velocity = status.speed * transform.forward;
	
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
	this.origin = getParent(origin.transform).gameObject;
	
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
		var par : Transform = trans;
		
		while(par.parent) {
			
			par = par.parent.transform;
		}
		
		return par;
	
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

