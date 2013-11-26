//this script controls the weapon fire of a galaxy class ship
#pragma strict

class WeaponSlot {
	var isEnabled : boolean = false; //checks if the weapon is enabled
	var weapon_go : GameObject; //weapon GameObject. It contains the projectile
	var phaser_point : GameObject; //if the weapon is a beam weapon, it fires from this game object
	var torpedo_point : GameObject; //if the weapon is a torpedo weapon, it fires from this game object
	var pulse_point : GameObject; //if the weapon is a pulse weapon, it fires from this game object
	var nextShot : float = 0.0f; //contains the time reference for when the weapon is able to fire again
	var isAngle : boolean = false; //checks if the target is inside the firing arch
	var isRange : boolean = false; //checks if the target is in range
	var isFiring : boolean = false; //checks if the weapon is firing
	var lastReload : float; //total time it took for the last reload
	
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
var weaponKey : String[] = new String[8];

var shipProps : shipProperties;
var shipTar : shipTarget;
var genInfo : GeneralInfo;
var globInfo : GlobalInfo;

var torpVolley : Volley = Volley.one;
var volleyWait : float = 0.2f;
var torpLimit : int = 10;



function Start () {

	shipProps = gameObject.GetComponent(shipProperties);
	shipTar = gameObject.GetComponent(shipTarget);
	
	//get general info
	var gen_go : GameObject = GameObject.Find("SaveGame");
	genInfo = gen_go.GetComponent(GeneralInfo);
	
	//get global info
	var glo_go : GameObject = GameObject.Find("GlobalInfo");
	globInfo = glo_go.GetComponent(GlobalInfo);
	
	//set weapons keys from global info
	weaponKey = globInfo.weaponKeys;

}

function Update () {
	var isPlayer : boolean = shipProps.playerProps.isPlayer;
	if (isPlayer)
	{
		PlayerFire();
		FireWeapons();
	}
	else
	{
		if(!botWeapon.isFiring)
		{
			StartCoroutine(BotFire());
		}
	}
	CheckWeapons();

}


function PlayerFire() {
	//Get red alert mode
	var isRedAlert : boolean = shipProps.combatStatus.isRedAlert;
	if(isRedAlert)
	{
		
		for(var x : int = 0; x < weapon.Length; x++)
		{
			
			if (Input.GetAxis(weaponKey[x]) && weapon[x].isEnabled == true && weapon[x].isRange == true && weapon[x].isAngle == true) //Player fires weapon 1
			{
				
				weapon[x].isFiring = true;
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
			FireWeapon(weapon[x], shipTar.target);
			weapon[x].isFiring = false;
		}
	}
	

}

function FireWeapon (weapon : WeaponSlot, target : GameObject) {
	if (weapon.weapon_go != null) //checks if there's a weapon in the slot
	{
			if (target) //if there's a target
			{
				
				if (Time.time >= weapon.nextShot) //check if the cooldown has finished
				{
				
					var origin : GameObject; 
					var weapon_go : GameObject = weapon.weapon_go; //gets weapon GameObject
					var weapon_sc = weapon_go.GetComponent(weaponScript); //gets weapon script
					if(weapon_sc.type == WeaponType.beam) //if weapon is a beam
					{
						origin = weapon.phaser_point; //set the phaser origin
						FireBeam(target, origin, weapon_go); //fire beam
						var cd1 : float = weapon_go.GetComponent(phaserScript).standard_cd; //get weapon cooldown
						weapon.nextShot = Time.time + cd1 * shipProps.shipModifiers.reloadSpeed; //sets next shot
						weapon.lastReload = cd1 * shipProps.shipModifiers.reloadSpeed;
					}
					else if (weapon_sc.type == WeaponType.torpedo) //if weapon is a torpedo
					{
						
						//get volley size value
						var sizeVolley : int;
						if(torpVolley == Volley.one) {
							sizeVolley = 1;
						} else if (torpVolley == Volley.three) {
							sizeVolley = 3;
						} else if (torpVolley == Volley.five) {
							sizeVolley = 5;
						} else if (torpVolley == Volley.eight) {
							sizeVolley = 8;
						}
						
						//Fire weapon
						origin = weapon.torpedo_point;
						StartCoroutine(FireTorpedo(target, origin, weapon_go, sizeVolley, volleyWait));
						var cd2 : float = weapon_go.GetComponent(torpedoScript).status.cooldown;
						weapon.nextShot = Time.time + cd2 * sizeVolley * shipProps.shipModifiers.reloadSpeed;
						weapon.lastReload = cd2 * sizeVolley * shipProps.shipModifiers.reloadSpeed;
						
						//Reset volley status
						torpVolley = Volley.one;
						
						
						
					}
					else if (weapon_sc.type == WeaponType.pulse) //if its a pulse weapon
					{
						origin = weapon.pulse_point;
						StartCoroutine(FirePulse(target, origin, weapon_go));
						var cd3 : float = weapon_go.GetComponent(pulseScript).cooldown;
						weapon.nextShot = Time.time + cd3 * shipProps.shipModifiers.reloadSpeed;
						weapon.lastReload = cd3 * shipProps.shipModifiers.reloadSpeed;
					}
				}
			
			}
	
		}
		else //if there's no weapon
		{
			Debug.Log("There's no weapon in that Slot");
		}



}

function FireBeam (target : GameObject, origin : GameObject, weapon : GameObject)
{
	var beam : GameObject = Instantiate(weapon, origin.transform.position, origin.transform.rotation);
	var ps : phaserScript = beam.GetComponent(phaserScript);
	
	ps.target = target;
	ps.origin = origin;
	
}

function FireTorpedo (target : GameObject, origin : GameObject, weapon : GameObject, volley : int, waitReload : float)
{

	for (var x : int = 0; x < volley; x++)
	{
		var torpedo : GameObject = Instantiate(weapon, origin.transform.position, origin.transform.rotation);
		var ts : torpedoScript = torpedo.GetComponent(torpedoScript);
		
		ts.target = target;
		ts.origin = origin.transform.parent.parent.parent.gameObject;
		
		
		yield WaitForSeconds(waitReload);
	}

}

function FirePulse (target : GameObject, origin : GameObject, weapon : GameObject) {

	var ps1 : pulseScript = weapon.GetComponent(pulseScript);
	var volley : int = ps1.volleys;
	var timeInt : float = ps1.timeInt;

	for (var x : int = 0; x < volley; x++)
	{
		var pulse : GameObject = Instantiate(weapon, origin.transform.position, origin.transform.rotation);
		var ps : pulseScript = pulse.GetComponent(pulseScript);
		
		ps.target = target;
		ps.origin = origin.transform.parent.parent.gameObject;
		
		yield WaitForSeconds(timeInt);
	
	}
	

}


//this function checks if the weapons are ready to fire
function CheckWeapons() {
	if (shipTar.target != null)
	{
	
		for(var x : int = 0; x < weapon.Length; x++)
		{	
			if(weapon[x].isEnabled && weapon[x].weapon_go != null)
			{
				weapon[x].isRange = CheckWeaponRange(weapon[x], shipTar.target.transform);
				weapon[x].isAngle = CheckWeaponAngle(weapon[x], shipTar.target.transform);
			}
		}
		
	}
	


}




//this function can be used to check if the target is withing the firing angle
function CheckWeaponAngle(weapon : WeaponSlot, target : Transform) : boolean {

	//get weapon script and firing angle
	var weaponGO : GameObject = weapon.weapon_go;
	var weaponScr : weaponScript = weaponGO.GetComponent(weaponScript);
	var firingAngle : float = weaponScr.firingAngle;
	
	//get weapon origin
	var weaponType = weaponScr.type;
	var origin : Transform;
	
	if(weaponType == WeaponType.beam)
	{
		origin = weapon.phaser_point.transform;
	}
	else if (weaponType == WeaponType.torpedo)
	{
		origin = weapon.torpedo_point.transform;
	}
	else if (weaponType == WeaponType.pulse)
	{
		origin = weapon.pulse_point.transform;
	}
	
	//get angle between the objects
	var targetDir = target.position - origin.position;
	var forward = origin.forward;
	
	var angle = Vector3.Angle(targetDir, forward);
	
	
	//check if it's inside the angle or not
	var isAngle : boolean;
	if (angle <= firingAngle/2)
	{
		isAngle = true;
	}
	else
	{
		isAngle = false;
	}
	
	//return result
	return isAngle;
	
	
}

//this function will confirm is the weapon is in range
function CheckWeaponRange(weapon : WeaponSlot, target : Transform) : boolean {

	//get weapon script and weapon type
	var weaponGO : GameObject = weapon.weapon_go;
	var weaponScr : weaponScript = weaponGO.GetComponent(weaponScript);
	var weaponType : WeaponType = weaponScr.type;
	
	//get range from the weapon and origin point
	var range : float;
	var origin : Transform;
	
	if(weaponType == WeaponType.beam)
	{
		var phaserScr : phaserScript = weaponGO.GetComponent(phaserScript);
		range = phaserScr.range;
		origin = weapon.phaser_point.transform;
	}
	else if (weaponType == WeaponType.torpedo)
	{
		var torpedoScr : torpedoScript = weaponGO.GetComponent(torpedoScript);
		range = torpedoScr.status.range;
		origin = weapon.torpedo_point.transform;
	}
	else if (weaponType == WeaponType.pulse)
	{
		var pulseScr : pulseScript = weaponGO.GetComponent(pulseScript);
		range = pulseScr.range;
		origin = weapon.pulse_point.transform;
	}

	//get distance between target and origin point
	var distance : float = Vector3.Distance(origin.position, target.position);
	
	//checks if target is in range
	var isRange : boolean;
	
	if(distance <= range)
	{
		isRange = true;
	}
	else
	{
		isRange = false;
	}

	//return result
	return isRange;

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
			if (weapon[0].isEnabled == true && weapon[0].isRange == true && weapon[0].isAngle == true) //Player fires weapon 1
			{
				FireWeapon(weapon[0], shipTar.target);
				
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
		if(type == type_go && weapon[x].isEnabled == true && weapon[x].isRange == true && weapon[x].isAngle == true) {
			weapon[x].isFiring = true;	
		} 
		
		
	}

}