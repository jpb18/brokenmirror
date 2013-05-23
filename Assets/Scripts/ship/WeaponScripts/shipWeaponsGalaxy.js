//this script controls the weapon fire of a galaxy class ship
#pragma strict

class WeaponSlot {
	var slot_num : int;
	var weapon_go : GameObject;
	var orientation : weapon_orientation;
	var phaser_point : GameObject;
	var torpedo_point : GameObject;
	var pulse_point : GameObject;
	var nextShot : float = 0.0f;
}



enum weapon_orientation {

	forward,
	backward,
	left,
	right,

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
	

}


function PlayerFire() {
	if (Input.GetAxis("Fire1")) //Player fires weapon 1
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
						FireTorpedo(target1, origin1, weapon_go1);
						var cd1_1 : float = weapon_go1.GetComponent(TorpedoScript).status.cooldown;
						weapon1.nextShot = Time.time + cd1_1;
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
	
	if (Input.GetAxis("Fire2")) //Player fires weapon2
	{
		if(weapon2 != null) //checks if there's a weapon on slot 2
		{
			var target2 : GameObject = shipTar.target; //gets the target
			
			if (target2) //if there's a target
			{
				
				if (Time.time >= weapon2.nextShot) //check if the cooldown has finished
				{
				
					var origin2 : GameObject; 
					var weapon_go2 : GameObject = weapon1.weapon_go; //gets weapon GameObject
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
						//put torpedo stuff here
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
	
	if (Input.GetAxis("Fire3"))
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

function FireTorpedo (target : GameObject, origin : GameObject, weapon : GameObject)
{
	var torpedo : GameObject = Instantiate(weapon, origin.transform.position, origin.transform.rotation);
	var ts : TorpedoScript = torpedo.GetComponent(TorpedoScript);
	
	ts.target = target;
	ts.origin = origin.transform.parent.parent.gameObject;

}