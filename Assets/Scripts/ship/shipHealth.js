import System.Collections.Generic;
#pragma strict

class ship_Health {

	var maxHealth : float;
	var health : float;
	var maxShields : float;
	var shields : float;
	
	function hasShield(upgrades : Upgrades) : boolean {
		return getShield(upgrades) > 0;	
	}
	
	function hasHull(upgrades : Upgrades) : boolean {
		return getHull(upgrades) > 0;
	}
	
	//pre hasShield()
	function shieldDamage(damage : float) {
		shields -= damage;	
	}
	
	function hullDamage(damage : float) {
		health -= damage;
	}
	
	function getMaxHull(upgrades : Upgrades) : float {
		return maxHealth + upgrades.getHullStrenght();
	}
	
	function getHull(upgrades : Upgrades) : float {
		return health + upgrades.getHullStrenght();
	}
	
	function getMaxShield(upgrades : Upgrades) : float {
		return maxShields + upgrades.getShieldStrenght();
	}
	
	function getShield(upgrades : Upgrades) : float {
		return shields + upgrades.getShieldStrenght();
	}

}

class ShieldsShow {
	var lastHit : float;
	var showDur : float = 1.0f;
	
	function setHit() {
		lastHit = Time.time;
	}
	
}

class ShieldRegeneration {
	var isRegen : boolean = false; //checks if the ships shields can regenerate
	var lastHit : float; //checks last hit by a weapon
	var timeInt : float; //contains time interval from last hit before the shield start regenerating
	var regenRate : float; //contains the regeneration rate in seconds
	var lastRegen : float; //contains the last regeneration
	var regenConsumption : float; //contains energy consumption
	
	function canRegen(modifier : float) : boolean {
		return isRegen && Time.time >= lastRegen + regenRate - modifier && Time.time >= lastHit + timeInt;
	}
	
	function setRegen() {
		lastRegen = Time.time;
	}
	
	function getEnergyCost() : float {
		return regenConsumption;
	}

}

class shipHealth extends MonoBehaviour implements IHealtheable, IDamageable {

	var shipHealth : ship_Health;

	var shieldShow : ShieldsShow;
	var shieldRegen : ShieldRegeneration;

	var explosion : GameObject;
	var smokeTrails : List.<GameObject>;
	var plasmaParticles : List.<GameObject>;
	var shield : GameObject;

	var lastHit : GameObject;



	//other scripts
	private var properties : shipProperties;
	private var triggers : shipTriggers;
	private var cloud : ShipCloud;
	private var escape : shipEscapePods;
	private var missions : Missions;
	private var general : GeneralInfo;
	private var over : GameOver;
	private var upgrades : Upgrades;
	private var reactor : ShipReactor;

	function Start () {

		//get other scripts
		properties = gameObject.GetComponent(shipProperties);
		triggers = gameObject.GetComponent(shipTriggers);
		cloud = gameObject.GetComponent(ShipCloud);
		escape = gameObject.GetComponent(shipEscapePods);
		upgrades = gameObject.GetComponent(Upgrades);
		reactor = gameObject.GetComponent(ShipReactor);
		
		missions = GameObject.FindGameObjectWithTag("Missions").GetComponent(Missions);
		general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
		over = GameObject.FindGameObjectWithTag("GameOver").GetComponent(GameOver);
		
		//get health stats
		shipHealth.maxHealth = properties.ShipHealth.basicHealth;
		shipHealth.health = shipHealth.maxHealth;
		
		//get shield stats
		shipHealth.maxShields = properties.ShipHealth.basicShield;
		shipHealth.shields = shipHealth.maxShields;
		
		
		//get smoke trails 
		var smokeGOs : GameObject[] = GameObject.FindGameObjectsWithTag("Smoke");
		for(var smoke : GameObject in smokeGOs) {
			if(smoke.transform.parent.parent.parent.gameObject == gameObject) {
				smokeTrails.Add(smoke);
			}
		}
		//and plasma particles
		var plasmaGOs : GameObject[] = GameObject.FindGameObjectsWithTag("plasma");
		for(var plasma : GameObject in plasmaGOs) {
			if(plasma.transform.parent.parent.parent.gameObject == gameObject) {
				plasmaParticles.Add(plasma);
			}
		}
		

		
		

	}

	function Update () {

		
		Triggers();
		Die();
		Trails();
		PlasmaLeak();
		ShieldShow();
		shield_regen();

	}

	//this function controls a ship shield regeneration
	function shield_regen() {
		//checks if the time interval has passed and the shield is able of regenerating
		if (shieldRegen.canRegen(upgrades.getShieldRecharge()) == true && shipHealth.getShield(upgrades) < shipHealth.getMaxShield(upgrades))
		{
			var cost : float = shieldRegen.getEnergyCost();
		
			if(reactor.hasEnough(cost))
			{
				reactor.spend(cost);
				shieldRegen.setRegen();
				var rate : float = shieldRegen.regenRate;
				shipHealth.shields += rate; //adds shield
			}
		
		}

	}


	function Die () {

		if (!shipHealth.hasHull(upgrades))
		{
			reportKill();
			
			Instantiate(explosion, transform.position, transform.rotation);
			Destroy(gameObject);
			
			if(properties.getPlayer()) {
				gameOver();
			}
			instantiatePods();
		}
		

	}

	function instantiatePods() {
		var isPlayer : boolean = properties.getPlayer();
		if(!escape.isEscapePod()) {
			while(escape.hasEscapePod()) {
				var pos : Vector3 = calculatePosition(transform.position, 1.0f);
				var obj : GameObject = escape.instantiateEscapePod(pos, Random.rotation);
				if(isPlayer) {
					obj.GetComponent(shipProperties).setPlayer(isPlayer);
					Camera.main.GetComponent(MouseOrbit).target = obj.transform;
					isPlayer = false;
				}
			}
		}

	}

	function calculatePosition(position : Vector3, drift : float) : Vector3{

		var v : Vector3 = Random.insideUnitSphere;
		
		for(var i : int = 0;  i < 3; i++) {
			v[i] = v[i] * drift;
		}
		
		return v + position;

	}

	function Triggers () {
		var isKill : boolean = triggers.triggerProps.isKill;
		
		if (isKill)
		{
			shipHealth.shields = 0;
			shipHealth.health = 0;
		}
		

	}

	function Trails () {
		var isTurbulence : boolean = triggers.triggerProps.isTurbulence;
		
		if (isTurbulence || shipHealth.getHull(upgrades) <= shipHealth.getMaxHull(upgrades) * 0.5)
		{
			for (var trail : GameObject in smokeTrails)
			{
				
				var rend : TrailRenderer = trail.GetComponent(TrailRenderer);
				rend.enabled = true;			
				
			}
		}
		else
		{
			for (var trail : GameObject in smokeTrails)
			{
				var rend1 : TrailRenderer = trail.GetComponent(TrailRenderer);
				rend1.enabled = false;			
				
			}
		}



	}

	function PlasmaLeak() {
		if (shipHealth.getHull(upgrades) <= shipHealth.getMaxHull(upgrades) * 0.15)
		{
			for (var plasma : GameObject in plasmaParticles)
			{
				
				plasma.particleSystem.Play();
				
			}
		}
		else
		{
			for (var plasma : GameObject in plasmaParticles)
			{
				
				plasma.particleSystem.Stop();
				plasma.particleSystem.Clear();
				
			}
		}

	}

	function ShieldShow () {
		if(shield) {
			if (Time.time <= shieldShow.lastHit + shieldShow.showDur && shield.renderer.enabled == true && shieldShow.lastHit != 0)
			{
				var totTime : float = shieldShow.showDur + shieldShow.lastHit;
				var remTime : float = totTime - Time.time;
				
				
				
				var alpha : float = (1 * remTime)/shieldShow.showDur;
				
				shield.renderer.material.color.a = alpha;
				
				
			
			}
			else
			{
				shield.renderer.material.color.a = 0;
			}
		}

	}

	function OnDestroy () {
		
		gameObject.SetActive(false);
	 
	} 

	function isShieldUp() : boolean {

		return shipHealth.hasShield(upgrades) && properties.getRedAlert() && !properties.isCloaked() && !cloud.isShieldInibited();
	}

	//pre: isShieldUp()
	function damageShield(damage : float) {
		shipHealth.shieldDamage(damage);
		shieldShow.setHit();

	}

	//pre: !isShieldUp()
	function damageHull(damage : float) {
		shipHealth.hullDamage(damage);

	}

	function showShields() {
		shieldShow.setHit();

	}

	//note: there're more conditions to be checked
	function setDamage(damage : float) {
		//get red alert status
		var ra : boolean = properties.getRedAlert();

		if(shipHealth.shields - damage > 0 && ra) {
			shipHealth.shields -= damage;
			shieldShow.setHit();
		} else if (shipHealth.shields > 0 && ra) {
			shipHealth.shields = 0;
			shieldShow.setHit();
		} else {
			shipHealth.health -= damage;
		}
	}
	
	function setDamage(damage : float, isEnergy : boolean) {
		setDamage(damage);
	}

	function setLastHitter(ship : GameObject) {
		lastHit = ship;
	}

	function reportKill() {
		if(lastHit) {
			var hostileFaction : FactionInfo = getFaction(lastHit);
			if(hostileFaction === general.getFactionInfo(0)) {
				var faction : FactionInfo = getFaction(gameObject);
				missions.addKillToCombatMissions(faction);
			}
		}
	}

	private function getFaction(ship : GameObject) : FactionInfo {
		if(ship.tag == "Ship") {
			return getShipFaction(ship);
		} else if (ship.tag == "Station") {
			return getStationFaction(ship);
		}
		
		return null;

	}

	private function getStationFaction(station : GameObject): FactionInfo {
		var stat : Station = station.GetComponent(Station);
		return stat.getFactionInfo();
	}

	private function getShipFaction(ship : GameObject) : FactionInfo {
		var props : shipProperties = ship.GetComponent(shipProperties);
		var faction : int = props.getFaction();
		return general.getFactionInfo(faction);
	}

	function gameOver() {
		var esc : boolean = !escape.isEscapePod() && escape.hasEscapePod();
		over.setGameOver(esc);
	}

	function getMaxHull() : float {
		return shipHealth.getMaxHull(upgrades);
	}

	function getHull() : float {
		return shipHealth.getHull(upgrades);
	}

	function getMaxShield() : float {
		return shipHealth.getMaxShield(upgrades);
	}

	function getShield() : float {
		return shipHealth.getShield(upgrades);
	}
	
	function getHullPercentage() : float {
		return getHull()/getMaxHull();
	}
	
	function getShieldPercentage() : float {
		return getShield()/getMaxShield();
	}

}
