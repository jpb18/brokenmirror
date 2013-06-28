//this script controls the weapon fire of a galaxy class ship
#pragma strict

class WeaponSlot {
	var isEnabled : boolean = false; //checks if the weapon is enabled
	var slot_num : int; //number (still has no function)
	var weapon_go : GameObject; //weapon GameObject. It contains the projectile
	var phaser_point : GameObject; //if the weapon is a beam weapon, it fires from this game object
	var torpedo_point : GameObject; //if the weapon is a torpedo weapon, it fires from this game object
	var pulse_point : GameObject; //if the weapon is a pulse weapon, it fires from this game object
	var nextShot : float = 0.0f; //contains the time reference for when the weapon is able to fire again
	var isAngle : boolean = false; //checks if the target is inside the firing arch
	var isRange : boolean = false; //checks if the target is in range
	
	
}

class BotWeapons {
	
	var isFiring : boolean = false;

}



//bot
var botWeapon : BotWeapons;


//forward weapons
var weapon1 : WeaponSlot;
var weapon2 : WeaponSlot;
var weapon3 : WeaponSlot;

//backward weapons
var weapon4 : WeaponSlot;
var weapon5 : WeaponSlot;
var weapon6 : WeaponSlot;

//side weapons
var weapon7 : WeaponSlot; //left weapon
var weapon8 : WeaponSlot; //right weapon

var shipProps : shipProperties;
var shipTar : shipTarget;
var genInfo : GeneralInfo;
var globInfo : GlobalInfo;

var torpSpread : int = 1;
var torpVolley : int = 1;
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

}

function Update () {
	var isPlayer : boolean = shipProps.playerProps.isPlayer;
	if (isPlayer)
	{
		PlayerFire();
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
	if (Input.GetAxis("Fire1") && weapon1.isEnabled == true && weapon1.isRange == true && weapon1.isAngle == true) //Player fires weapon 1
	{
		FireWeapon(weapon1, shipTar.target);
	}
	
	if (Input.GetAxis("Fire2") && weapon2.isEnabled == true && weapon2.isRange == true && weapon2.isAngle == true) //Player fires weapon2
	{
		FireWeapon(weapon2, shipTar.target);
	}
	
	if (Input.GetAxis("Fire3") && weapon3.isEnabled == true && weapon3.isRange == true && weapon3.isAngle == true)
	{
		FireWeapon(weapon3, shipTar.target);	
	}
	if (Input.GetAxis("Fire4") && weapon4.isEnabled == true && weapon4.isRange == true && weapon4.isAngle == true)
	{
		FireWeapon(weapon4, shipTar.target);	
	}
	if (Input.GetAxis("Fire5") && weapon5.isEnabled == true && weapon5.isRange == true && weapon5.isAngle == true)
	{
		FireWeapon(weapon5, shipTar.target);	
	}
	if (Input.GetAxis("Fire6") && weapon6.isEnabled == true && weapon6.isRange == true && weapon6.isAngle == true)
	{
		FireWeapon(weapon6, shipTar.target);	
	}
	if (Input.GetAxis("Fire7") && weapon7.isEnabled == true && weapon7.isRange == true && weapon7.isAngle == true)
	{
		FireWeapon(weapon7, shipTar.target);	
	}
	if (Input.GetAxis("Fire8") && weapon8.isEnabled == true && weapon8.isRange == true && weapon8.isAngle == true)
	{
		FireWeapon(weapon8, shipTar.target);	
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
					}
					else if (weapon_sc.type == WeaponType.torpedo) //if weapon is a torpedo
					{
						origin = weapon.torpedo_point;
						StartCoroutine(FireTorpedo(target, origin, weapon_go, torpSpread, torpVolley, volleyWait));
						var cd2 : float = weapon_go.GetComponent(torpedoScript).status.cooldown;
						weapon.nextShot = Time.time + cd2 * torpSpread * torpVolley * shipProps.shipModifiers.reloadSpeed;
					}
					else if (weapon_sc.type == WeaponType.pulse) //if its a pulse weapon
					{
						origin = weapon.pulse_point;
						StartCoroutine(FirePulse(target, origin, weapon_go));
						var cd3 : float = weapon_go.GetComponent(pulseScript).cooldown;
						weapon.nextShot = Time.time + cd3 * shipProps.shipModifiers.reloadSpeed;
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

function FireTorpedo (target : GameObject, origin : GameObject, weapon : GameObject, spread : int, volley : int, waitReload : float)
{

	for (var x : int = 0; x < volley; x++)
	{
		var torpedo : GameObject = Instantiate(weapon, origin.transform.position, origin.transform.rotation);
		var ts : torpedoScript = torpedo.GetComponent(torpedoScript);
		
		ts.target = target;
		ts.origin = origin.transform.parent.parent.parent.gameObject;
		ts.status.spread = spread;
		
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

function OnGUI () {
	

	//gets escape menu status
	var cam_go : GameObject = Camera.main.gameObject;
	var cam_sc : testReturn = cam_go.GetComponent(testReturn);
	var isPause : boolean = cam_sc.isPause;
	
	if(!isPause)
	{
		if(shipProps.playerProps.isPlayer)
		{
		//inventory modules
		
		
		
		
		//tactical module
		GUILayout.BeginArea(Rect(0,0,200,200));
		
			GUILayout.BeginHorizontal();
			
				GUILayout.BeginVertical();
					GUILayout.Box("Volley");
					if(GUILayout.Button("+"))
					{
						if(torpVolley * torpSpread < torpLimit)
						{
							torpVolley += 1;
						}
					}
					
					GUILayout.Label(torpVolley.ToString());
					
					if(GUILayout.Button("-"))
					{
						if(torpVolley > 1)
						{
							torpVolley -= 1;
						}
					}
					
				
				GUILayout.EndVertical();
				
				GUILayout.BeginVertical();
					GUILayout.Box("Spread");
					if(GUILayout.Button("+"))
					{
						if(torpVolley * torpSpread < torpLimit)
						{
							torpSpread += 1;
						}
					}
					
					GUILayout.Label(torpSpread.ToString());
					
					if(GUILayout.Button("-"))
					{
						if(torpSpread > 1)
						{
							torpSpread -= 1;
						}
					}
				
				GUILayout.EndVertical();
			
			GUILayout.EndHorizontal();
		
		GUILayout.EndArea();
		}
	}

}

//this function checks if the weapons are ready to fire
function CheckWeapons() {
	if (shipTar.target != null)
	{
		if(weapon1.isEnabled && weapon1.weapon_go != null)
		{
			weapon1.isRange = CheckWeaponRange(weapon1, shipTar.target.transform);
			weapon1.isAngle = CheckWeaponAngle(weapon1, shipTar.target.transform);
		}
		if(weapon2.isEnabled && weapon2.weapon_go != null)
		{
			weapon2.isRange = CheckWeaponRange(weapon2, shipTar.target.transform);
			weapon2.isAngle = CheckWeaponAngle(weapon2, shipTar.target.transform);
		}
		if(weapon3.isEnabled && weapon3.weapon_go != null)
		{
			weapon3.isRange = CheckWeaponRange(weapon3, shipTar.target.transform);
			weapon3.isAngle = CheckWeaponAngle(weapon3, shipTar.target.transform);
		}
		if(weapon4.isEnabled && weapon4.weapon_go != null)
		{
			weapon4.isRange = CheckWeaponRange(weapon4, shipTar.target.transform);
			weapon4.isAngle = CheckWeaponAngle(weapon4, shipTar.target.transform);
		}
		if(weapon5.isEnabled && weapon5.weapon_go != null)
		{
			weapon5.isRange = CheckWeaponRange(weapon5, shipTar.target.transform);
			weapon5.isAngle = CheckWeaponAngle(weapon5, shipTar.target.transform);
		}
		if(weapon6.isEnabled && weapon6.weapon_go != null)
		{
			weapon6.isRange = CheckWeaponRange(weapon6, shipTar.target.transform);
			weapon6.isAngle = CheckWeaponAngle(weapon6, shipTar.target.transform);
		}
		if(weapon7.isEnabled && weapon7.weapon_go != null)
		{
			weapon7.isRange = CheckWeaponRange(weapon7, shipTar.target.transform);
			weapon7.isAngle = CheckWeaponAngle(weapon7, shipTar.target.transform);
		}
		if(weapon8.isEnabled && weapon8.weapon_go != null)
		{
			weapon8.isRange = CheckWeaponRange(weapon8, shipTar.target.transform);
			weapon8.isAngle = CheckWeaponAngle(weapon8, shipTar.target.transform);
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

	if(shipTar.target)
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
		if (weapon1.isEnabled == true && weapon1.isRange == true && weapon1.isAngle == true) //Player fires weapon 1
		{
			FireWeapon(weapon1, shipTar.target);
			yield WaitForSeconds (waitTime);
		}
		
		if (weapon2.isEnabled == true && weapon2.isRange == true && weapon2.isAngle == true) //Player fires weapon2
		{
			FireWeapon(weapon2, shipTar.target);
			yield WaitForSeconds (waitTime);
		}
		
		if (weapon3.isEnabled == true && weapon3.isRange == true && weapon3.isAngle == true)
		{
			FireWeapon(weapon3, shipTar.target);
			yield WaitForSeconds (waitTime);	
		}
		
		if ( weapon4.isEnabled == true && weapon4.isRange == true && weapon4.isAngle == true)
		{
			FireWeapon(weapon4, shipTar.target);
			yield WaitForSeconds (waitTime);	
		}
		if (weapon5.isEnabled == true && weapon5.isRange == true && weapon5.isAngle == true)
		{
			FireWeapon(weapon5, shipTar.target);
			yield WaitForSeconds (waitTime);	
		}
		if (weapon6.isEnabled == true && weapon6.isRange == true && weapon6.isAngle == true)
		{
			FireWeapon(weapon6, shipTar.target);
			yield WaitForSeconds (waitTime);	
		}
		if (weapon7.isEnabled == true && weapon7.isRange == true && weapon7.isAngle == true)
		{
			FireWeapon(weapon7, shipTar.target);
			yield WaitForSeconds (waitTime);	
		}
		if (weapon8.isEnabled == true && weapon8.isRange == true && weapon8.isAngle == true)
		{
			FireWeapon(weapon8, shipTar.target);
			yield WaitForSeconds (waitTime);	
		}
		botWeapon.isFiring = false;
	}
	
		

}