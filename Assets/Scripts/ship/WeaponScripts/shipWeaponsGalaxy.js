//this script controls the weapon fire of a galaxy class ship
#pragma strict

class WeaponSlot {
	var slot_num : int;
	var weapon_go : GameObject;
	var compat : weapon_compat;
	var orientation : weapon_orientation;
	var size_limit : int;
	var phaser_point : GameObject;
	var torpedo_point : GameObject;
	var pulse_point : GameObject;
	var lastShot : float = 0.0f;
}

class weapon_compat {
	var canBeam : boolean;
	var canTorp : boolean;
	var canPulse : boolean;

}

enum weapon_orientation {

	forward,
	backward,

}

var weapon1 : WeaponSlot;
var weapon2 : WeaponSlot;
var weapon3 : WeaponSlot;

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
	if (Input.GetAxis("Fire1"))
	{
		var ws : weaponScript = weapon1.weapon_go.GetComponent(weaponScript);
		if(ws.type == WeaponType.beam)
		{
			var target1 : GameObject = shipTar.target;
			
			if (target1)
			{
				var cd1 : float = weapon1.weapon_go.GetComponent(phaserScript).standard_cd;
				
				if (Time.time >= cd1 + weapon1.lastShot)
				{
				
					var origin1 : GameObject = weapon1.phaser_point;
					var weapon_go1 : GameObject = weapon1.weapon_go;
					
					FireBeam(target1, origin1, weapon_go1);
					weapon1.lastShot = Time.time;
				}
			}
		}
	
	
	}
	
	if (Input.GetAxis("Fire2"))
	{
	
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