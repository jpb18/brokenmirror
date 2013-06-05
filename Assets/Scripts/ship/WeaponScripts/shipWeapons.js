//this script controls the weapon fire of a galaxy class ship
#pragma strict

class WeaponSlot {
	var isEnabled : boolean = false; //checks if the weapon is enabled
	var slot_num : int; //number (still has no function)
	var weapon_go : GameObject; //weapon GameObject. It contains the projectile
	var orientation : weapon_orientation; //checks if the weapon is firing forward or backwards
	var phaser_point : GameObject; //if the weapon is a beam weapon, it fires from this game object
	var torpedo_point : GameObject; //if the weapon is a torpedo weapon, it fires from this game object
	var pulse_point : GameObject; //if the weapon is a pulse weapon, it fires from this game object
	var nextShot : float = 0.0f; //contains the time reference for when the weapon is able to fire again
	var isAngle : boolean = false; //checks if the target is inside the firing arch
	var isRange : boolean = false; //checks if the target is in range
	
}



enum weapon_orientation {

	forward,
	backward,
	
}

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

var torpSpread : int = 1;
var torpVolley : int = 1;
var volleyWait : float = 0.2f;
var torpLimit : int = 10;

function Start () {

	shipProps = gameObject.GetComponent(shipProperties);
	shipTar = gameObject.GetComponent(shipTarget);

}

function Update () {
	var isPlayer : boolean = shipProps.playerProps.isPlayer;
	if (isPlayer)
	{
		PlayerFire();
	}
	CheckWeapons();

}


function PlayerFire() {
	if (Input.GetAxis("Fire1") && weapon1.isEnabled == true && weapon1.isRange == true && weapon1.isAngle == true) //Player fires weapon 1
	{
		if (weapon1 != null) //checks if there's a weapon in the slot
		{
			var target1 : GameObject = shipTar.target;
			
			if (target1) //if there's a target
			{
				
				if (Time.time >= weapon1.nextShot) //check if the cooldown has finished
				{
				
					var origin1 : GameObject; 
					var weapon_go1 : GameObject = weapon1.weapon_go; //gets weapon GameObject
					var weapon1_sc = weapon_go1.GetComponent(weaponScript); //gets weapon script
					if(weapon1_sc.type == WeaponType.beam) //if weapon is a beam
					{
						origin1 = weapon1.phaser_point; //set the phaser origin
						FireBeam(target1, origin1, weapon_go1); //fire beam
						var cd1 : float = weapon_go1.GetComponent(phaserScript).standard_cd; //get weapon cooldown
						weapon1.nextShot = Time.time + cd1; //sets next shot
					}
					else if (weapon1_sc.type == WeaponType.torpedo) //if weapon is a torpedo
					{
						origin1 = weapon1.torpedo_point;
						StartCoroutine(FireTorpedo(target1, origin1, weapon_go1, torpSpread, torpVolley, volleyWait));
						var cd1_1 : float = weapon_go1.GetComponent(torpedoScript).status.cooldown;
						weapon1.nextShot = Time.time + cd1_1 * torpSpread * torpVolley;
					}
					else if (weapon1_sc.type == WeaponType.pulse) //if its a pulse weapon
					{
						//put pulse weapon stuff here
					}
				}
			
			}
	
		}
		else //if there's no weapon
		{
			Debug.Log("There's no weapon in the 1st Slot");
		}
	}
	
	if (Input.GetAxis("Fire2") && weapon2.isEnabled == true) //Player fires weapon2
	{
		if(weapon2 != null) //checks if there's a weapon on slot 2
		{
			var target2 : GameObject = shipTar.target; //gets the target
			
			if (target2) //if there's a target
			{
				
				if (Time.time >= weapon2.nextShot) //check if the cooldown has finished
				{
				
					var origin2 : GameObject; 
					var weapon_go2 : GameObject = weapon2.weapon_go; //gets weapon GameObject
					var weapon2_sc = weapon_go2.GetComponent(weaponScript); //gets weapon script
					if(weapon2_sc.type == WeaponType.beam) //if weapon is a beam
					{
						origin2 = weapon2.phaser_point; //set the phaser origin
						FireBeam(target2, origin2, weapon_go2); //fire beam
						var cd2 : float = weapon_go2.GetComponent(phaserScript).standard_cd; //get weapon cooldown
						weapon2.nextShot = Time.time + cd2; //sets next shot
					}
					else if (weapon2_sc.type == WeaponType.torpedo) //if weapon is a torpedo
					{
						origin2 = weapon2.torpedo_point;
						StartCoroutine(FireTorpedo(target2, origin2, weapon_go2, torpSpread, torpVolley, volleyWait));
						var cd2_1 : float = weapon_go2.GetComponent(torpedoScript).status.cooldown;
						weapon2.nextShot = Time.time + cd2_1 * torpSpread * torpVolley;
					}
					else if (weapon2_sc.type == WeaponType.pulse) //if its a pulse weapon
					{
						//put pulse weapon stuff here
					}
				}
			}
		}
		else
		{
			Debug.Log("There's no weapon in the 2nd Slot");
		}
	}
	
	if (Input.GetAxis("Fire3") && weapon3.isEnabled == true)
	{
	
	
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
		ts.origin = origin.transform.parent.parent.gameObject;
		ts.status.spread = spread;
		
		yield WaitForSeconds(waitReload);
	}

}

function OnGUI () {
	if(shipProps.playerProps.isPlayer)
	{
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