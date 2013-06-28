//this script controls the ship movement
#pragma strict

var properties : shipProperties;

var speedStatus : float; //from -.25 to 1, this controls the ship "impulse"
var speedStep : float = 0.25f; //how much speed increase there is
var keys : KeyControlMovemnt; //this controls all keys related to movement
var movProps : MovementProperties; //this controls all movement properties

var speedChanged : boolean = false; //Checks if the speed has been changed in the last cycle
var isChanging : boolean = false;
var speedTarget : float;

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
		if (speedTarget < movProps.maxStatus)
		{
			speedTarget += speedStep;
			speedChanged = true;
		}
		
		
	
	}
	else if (Input.GetAxis("ShipSpeed") < 0 && Time.time >= keys.SpeedDecreaseKey + keys.KeyDelay)
	{
		keys.SpeedDecreaseKey = Time.time;
		if (speedTarget > movProps.minStatus)
		{
			speedTarget -= speedStep;
			speedChanged = true;
		}
	}
	
	if (Input.GetAxis("FullStop"))
	{
		speedTarget = 0;
		speedChanged = true;
	}
	
	
	
	if(isChanging == false || speedChanged == true)
	{
		var targetSpeed : float = speedTarget;
		var currentSpeed : float = speedStatus;
		var shipAcceleration : float = properties.movement.acceleration;
		StartCoroutine(ChangeSpeed(targetSpeed, currentSpeed, shipAcceleration));
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


function ChangeSpeed(targetSpeed : float, currentSpeed : float, shipAcceleration : float)
{
	//check if its increasing or reducing
	var isIncreasing : boolean = false;
	if(currentSpeed > targetSpeed)
	{
		isIncreasing = false;
	}
	else if (currentSpeed < targetSpeed)
	{
		isIncreasing = true;
	}
	
	//set time duration
	var speedInterval : float = Mathf.Sqrt(Mathf.Pow(targetSpeed - currentSpeed, 2));
	var time : float = speedInterval/shipAcceleration;
	var increment : float = shipAcceleration * Time.deltaTime;
	var i : float = 0;
	var rate : float = 1/time;
	//Debug.Log("SpeedInt: " + speedInterval.ToString() + " time: " + time.ToString());
		
	while(i < 1)
	{
		if(speedChanged == true && isChanging == true)
		{
			speedChanged = false;
			isChanging = false;
			return;
		}
		else if (speedChanged == true && isChanging == false)
		{
			speedChanged = false;
			isChanging = true;
		}
		
		i += rate * Time.deltaTime;
		
		if(isIncreasing)
		{
			speedStatus += increment * Time.deltaTime;
		}
		else
		{
			speedStatus -= increment * Time.deltaTime;
		}
		
		yield;
	}
	
	isChanging = false;
		
		
	
	

}


