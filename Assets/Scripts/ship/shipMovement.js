//this script controls the ship movement
#pragma strict

var properties : shipProperties;

var speedStatus : float; //from -.25 to 1, this controls the ship "impulse"
var speedStep : float = 0.25f; //how much speed increase there is
var keys : KeyControlMovemnt; //this controls all keys related to movement


class KeyControlMovemnt {
	var KeyDelay : float = 0.2f;
	var SpeedIncreaseKey : float;
	var SpeedDecreaseKey : float;
}

function Start () {

	properties = gameObject.GetComponent(shipProperties);

}

function Update () {
	shipPlayer_speed();

}

//this function controls the ship speed
function shipPlayer_speed () {
	var shipSpeed : float = properties.movement.speed * Time.deltaTime;
	
	if(Input.GetAxis("ShipSpeed") > 0 && Time.time >= keys.SpeedIncreaseKey + keys.KeyDelay)
	{
		keys.SpeedIncreaseKey = Time.time;
		if (speedStatus < 1)
		{
			speedStatus += speedStep;
		}
		
		
	
	}
	else if (Input.GetAxis("ShipSpeed") < 0 && Time.time >= keys.SpeedDecreaseKey + keys.KeyDelay)
	{
		keys.SpeedDecreaseKey = Time.time;
		if (speedStatus > -0.25)
		{
			speedStatus -= speedStep;
		}
	}
	
	var SpeedChange : Vector3 = new Vector3(0, 0, speedStatus * shipSpeed);
	
	rigidbody.velocity = SpeedChange;


}