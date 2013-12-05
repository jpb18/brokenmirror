//this script controls the weapon fire of a galaxy class ship
import System.Collections.Generic;
#pragma strict

class WeaponSlot {
	var isEnabled : boolean = false; //checks if the weapon is enabled
	var weapon_go : GameObject; //weapon GameObject. It contains the projectile
	var phaser_point : GameObject; //if the weapon is a beam weapon, it fires from this game object
	var torpedo_point : GameObject; //if the weapon is a torpedo weapon, it fires from this game object
	var pulse_point : GameObject; //if the weapon is a pulse weapon, it fires from this game object
	var nextShot : float; //time to fire again
	var lastReload : float;
	var isFiring : boolean = false; //checks if the weapon is firing
	
	///<summary>Returns current weapon type</summary>
	///<pre>isEnabled</pre>
	function getType() : WeaponType {
		return this.weapon_go.GetComponent(weaponScript).type;
	}
	
	///<summary>Checks if current weapon point has children</summary>
	///<pre>isEnabled</pre>
	function hasChild() : boolean {
		return getPoint().transform.childCount > 0;
		
		
	}
	
	///<summary>Returns child objects for the weapon</summary>
	///<pre>hasChild()</pre>
	function returnChild() : List.<GameObject> {
		
		var point : GameObject = this.getPoint();
		
		var list : List.<GameObject>;
		
		for(var trans : GameObject in point) {
			
			list.Add(trans);
			
		}
		
		return list;
		
	}
	
	///<summary>checks if the target is in angle</summary>
	///<param name="target">weapon target</param>
	///<pre>target != null</pre>
	///<pre>isEnabled</pre>
	function calcAngle(target : GameObject) : boolean {
		
		return this.weapon_go.GetComponent(weaponScript).isAngle(this.getPoint().gameObject, target);
	}
	
	///<summary>checks if the target is in range</summary>
	///<param name="target">weapon target</param>
	///<pre>target != null</pre>
	///<pre>isEnabled</pre>
	function calcRange(target : GameObject) : boolean {
		
		return this.weapon_go.GetComponent(weaponScript).isRange(this.getPoint().gameObject, target);
		
	}
	
	///<summary>Gets weapon point</summary>
	///<pre>isEnabled</pre>
	function getPoint() : GameObject {
		var point : GameObject;
		
		switch(getType()) {
			case WeaponType.beam:
				point = this.phaser_point;
				break;
			case WeaponType.torpedo:
				point = this.torpedo_point;
				break;
			case WeaponType.pulse:
				point = this.pulse_point;
		}
		
		return point;
	}
	
	///<summary>Sets new weapon</summary>
	///<param name="weapon">weapon to be added</param>
	function setWeapon(weapon : GameObject) {
		this.weapon_go = weapon;
		this.isEnabled = true;
	}
	
	///<summary>Removes weapon</summary>
	function removeWeapon() {
		this.weapon_go = null;
		this.isEnabled = false;
	}
	
	///<summary>Checks if the weapon can fire</summary>
	///<param name="target">target object</param>
	///<pre>target != null</pre>
	function canFire(target : GameObject) : boolean {
		
		return this.calcAngle(target) && this.calcRange(target) && isEnabled && nextShot < Time.time;
	}
	
	
	
	
	///<summary>Set the weapon to fire</summary>
	///<pre>canFire()</pre>
	function setFire() {
		isFiring = true;
	}
	
	
	
}

class BotWeapons {
	
	var isFiring : boolean = false;

}

enum Volley {
	one,
	three,
	five,
	eight

}



//bot
var botWeapon : BotWeapons;

//Ship weapons
var weapon : WeaponSlot[];


var shipProps : shipProperties;
var shipTar : shipTarget;
var genInfo : GeneralInfo;
var globInfo : GlobalInfo;

var torpVolley : Volley = Volley.one;
var volleyWait : float = 0.2f;
var torpLimit : int = 10;

var blastMode : boolean = true; //if true, fires all pulse at the same time. If not, fires in a ciclic pattern
var blastChange : float;
var blastWait : float = 0.2f;

var show : ShowMessage;
var load : LoadScene;


function Start () {

	shipProps = gameObject.GetComponent(shipProperties);
	shipTar = gameObject.GetComponent(shipTarget);
	show = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
	
	//get general info
	var gen_go : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	genInfo = gen_go.GetComponent(GeneralInfo);
	
	//get global info
	var glo_go : GameObject = GameObject.FindGameObjectWithTag("GlobalInfo");
	globInfo = glo_go.GetComponent(GlobalInfo);
	


}

function Update () {
	var isPlayer : boolean = shipProps.playerProps.isPlayer;
	if (isPlayer)
	{
		PlayerFire();
		FireWeapons();
		
		if(Input.GetAxis("SwapPulse") && blastChange + blastWait < Time.time && show.isGame && !load.show) {
			swapBlast();
		}	
	}
	else
	{
		if(!botWeapon.isFiring)
		{
			StartCoroutine(BotFire());
		}
	}
	
	
	

}


function PlayerFire() {
	//Get red alert mode
	var isRedAlert : boolean = shipProps.combatStatus.isRedAlert;
	if(isRedAlert)
	{
		
		for(var x : int = 0; x < weapon.Length; x++)
		{
			var key : String = "Fire" + (x+1);
			
			if (Input.GetAxis(key) && weapon[x].canFire(shipTar.target)) //Player fires weapon 1
			{
				weapon[x].setFire();
			}
		}
		
		if(Input.GetAxis("EnergyAll")) {
			setAllFire(WeaponType.beam);
			setAllFire(WeaponType.pulse);
		}
		
		if(Input.GetAxis("ProjectileAll")) {
			setAllFire(WeaponType.torpedo);
		}
		
	}
}

function FireWeapons() {
	for(var x : int = 0; x < weapon.Length; x++)
	{
		if (weapon[x].isFiring) //Player fires weapon 1
		{
			StartCoroutine(fire(weapon[x], shipTar.target,blastMode, volleyTimes()));
			
		}
	}
	

}



function volleyTimes() : int {
	var times : int = 0;
	switch(torpVolley) {
		case Volley.one: times = 1; break;
		case Volley.three: times = 3; break;
		case Volley.five: times = 5; break;
		case Volley.eight:  times = 8; break;
		
		
	}
	
	return times;
}


function BotFire() {

	if(shipTar.target && shipProps.combatStatus.isRedAlert)
	{
		botWeapon.isFiring = true;
		//get waiting time
		var dificulty : Dificulty = genInfo.playerInfo.gameDificulty;
		var wait : WaitingTimes = globInfo.waitingTimes;
		var waitTime : float;
		
		if(dificulty == Dificulty.Easy)
		{
			waitTime = wait.easy;
		}
		else if (dificulty == Dificulty.Medium)
		{
			waitTime = wait.medium;
		}
		else if (dificulty == Dificulty.Hard)
		{
			waitTime = wait.hard;
		}
		else if (dificulty == Dificulty.Hardcore)
		{
			waitTime = wait.hardcore;
		}
		
		//process firing
		yield WaitForSeconds (waitTime);
		for(var x : int = 0; x < weapon.Length; x++)
		{
			if (weapon[x].canFire(shipTar.target)) //Player fires weapon 1
			{
					StartCoroutine(fire(weapon[x], shipTar.target,blastMode, volleyTimes()));
				
			}
		}
		
		botWeapon.isFiring = false;
	}
	
		

}

///<summary>Sets all weapons of a certain type to fire</summary> 
///<param name="type">type of the weapon to set</param>
///<pre> type == WeaponType</pre> 
function setAllFire(type : WeaponType) {
	
	for(var x : int = 0; x < weapon.Length; x++) {
		var weapon_go : GameObject = weapon[x].weapon_go;
		var type_go : WeaponType = weapon_go.GetComponent(weaponScript).getType();
		if(type == type_go && weapon[x].canFire(shipTar.target)) {
			weapon[x].setFire();	
		} 
		
		
	}

}


function swapBlast() {
	blastMode = !blastMode;
	var mode : String;
	if(blastMode) {
		mode = "blast";		
	} else {
		mode = "alternate";		
	}
	
	var message : String = "Pulse weapons are now set in " + mode + " mode";
	var show : ShowMessage = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	show.AddMessage(message);
	
	blastChange = Time.time;
	
}

///<summary>Fires the weapon</summary>
	///<param name="target">target object</param>
	///<param name="isBlast">is firing in blasts?</param>
	///<pre>target != null</pre>
	///<pre>weapon.canFire()</pre>
function fire(weapon : WeaponSlot, target : GameObject, isBlast : boolean, volley : int) {
		
		var cooldown : float = weapon.weapon_go.GetComponent(weaponScript).getCooldown();
		var rate : float = weapon.weapon_go.GetComponent(weaponScript).altRate;
		weapon.isFiring = false;
		weapon.lastReload = cooldown * volley;
		weapon.nextShot = Time.time + weapon.lastReload;
		
		if(isBlast) {
			if(weapon.hasChild()) {
				for(var i : int; i < volley; i++) {
					for(var trans : GameObject in weapon.returnChild()) {
						FireWeapon(weapon, target, trans);
					}
					yield WaitForSeconds(cooldown);	
				}
			} else {
				for(var z : int; z < volley; z++) {
					FireWeapon(weapon, target, weapon.getPoint());
					yield WaitForSeconds(cooldown);	
				}
			}
			
		} else {
			if(weapon.hasChild()) {
				for(var x : int; x < volley; x++) {
					for(var trans : GameObject in weapon.returnChild()) {
						FireWeapon(weapon, target, trans);
						yield WaitForSeconds(rate);
					}
					yield WaitForSeconds(cooldown);	
				}
			} else {
				for(var a : int; a < volley; a++) {
					FireWeapon(weapon, target, weapon.getPoint());
					yield WaitForSeconds(cooldown);	
				}
			}
		}
		
		
		
	}
	
	
	
	///<summary>Fires any weapon</summary>
	///<param name="target">target object</param>
	///<param name="origin">point of origin</param>
	///<pre>target != null</pre>
	///<pre>weapon.canFire()</pre>
	private function FireWeapon(weaponS : WeaponSlot, target : GameObject, origin : GameObject) {
		var weapon : GameObject = GameObject.Instantiate(weaponS.weapon_go, origin.transform.position, origin.transform.rotation);
		var ws : weaponScript = weapon.GetComponent(weaponScript);
		
		ws.setTarget(target);
		ws.setOrigin(origin);
	}
	
	function hasWeaponInRange(target : GameObject) : boolean {
		var range : boolean = false;
	
		for(var weap in weapon) {
			range = weap.calcRange(target);
		}
	
		return range;
	}
	
