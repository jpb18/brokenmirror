//this script controls the ship movement
#pragma strict

var properties : shipProperties;

var speedStatus : float; //from -.25 to 1, this controls the ship "impulse"
var speedStep : float = 0.25f; //how much speed increase there is
var keys : KeyControlMovemnt; //this controls all keys related to movement
var movProps : MovementProperties; //this controls all movement properties

var debugvar : float;

class KeyControlMovemnt {
	var KeyDelay : float = 0.2f;
	var SpeedIncreaseKey : float;
	var SpeedDecreaseKey : float;
	
}

class MovementProperties {
	var minStatus : float = - 0.25;
	var maxStatus : float = 1.0f;


}


function Start () {

	properties = gameObject.GetComponent(shipProperties);
	

}

function Update () {
	var isPlayer : boolean = properties.playerProps.isPlayer;
	if (isPlayer)
	{
		shipPlayer_speed();
		shipPlayer_movement();
		
	}
	
}

//this function controls the ship speed
function shipPlayer_speed () {
	var shipSpeed : float = properties.movement.impulseSpeed * Time.deltaTime;
	
	if(Input.GetAxis("ShipSpeed") > 0 && Time.time >= keys.SpeedIncreaseKey + keys.KeyDelay)
	{
		keys.SpeedIncreaseKey = Time.time;
		if (speedStatus < movProps.maxStatus)
		{
			speedStatus += speedStep;
		}
		
		
	
	}
	else if (Input.GetAxis("ShipSpeed") < 0 && Time.time >= keys.SpeedDecreaseKey + keys.KeyDelay)
	{
		keys.SpeedDecreaseKey = Time.time;
		if (speedStatus > movProps.minStatus)
		{
			speedStatus -= speedStep;
		}
	}
	
	var SpeedChange : float = speedStatus * shipSpeed;
	
	rigidbody.velocity = transform.forward * SpeedChange;
	


}

function shipPlayer_movement () {
	
	
	var shipAgility : float = properties.movement.agility * Time.deltaTime;
	
	//get axis input
	var inputHor : float = -Input.GetAxis("Horizontal");
	var inputVer : float = Input.GetAxis("Vertical");
	var inputRot : float = Input.GetAxis("Rotate");
	
	//apply rotation
	transform.Rotate(Vector3(inputVer * shipAgility, shipAgility * inputHor, inputRot * shipAgility));	
	
}



