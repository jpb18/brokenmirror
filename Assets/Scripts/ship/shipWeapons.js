//this script controls the weapon fire of the ship
#pragma strict

class WeaponSlot {
	var slot_num : int;
	var weapon_go : GameObject;
	var compat : weapon_compat;
	var orientation : weapon_orientation;
	var size_limit : int;

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

var phaserPoints : GameObject[];
var torpedoPoints : GameObject[];
var pulsePoints : GameObject[];

var target : GameObject;
function Start () {




}

function Update () {

if (Input.GetAxis("Fire1"))
{

}

if (Input.GetAxis("Fire2"))
{

}

if (Input.GetAxis("Fire3"))
{


}

}

