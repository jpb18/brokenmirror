//special end of the world script for 21-12-2012
#pragma strict
var explosion : GameObject;

function Start () {

}

function Update () {

	if(Input.GetAxis("Fire1"))
	{
		Destroy(gameObject);
		Instantiate(explosion, transform.position, transform.rotation);
	}

}