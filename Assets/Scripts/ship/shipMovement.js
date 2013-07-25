//this script controls the ship movement
#pragma strict

var properties : shipProperties;

var speedStatus : float; //from -.25 to 1, this controls the ship "impulse"
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
	var shipAcceleration : float = properties.movement.acceleration;
	
	if(Input.GetAxis("ShipSpeed") > 0)
	{
		
		if (speedStatus < movProps.maxStatus)
		{
			speedStatus += shipAcceleration * Time.deltaTime;
			
		}
		
		
	
	}
	else if (Input.GetAxis("ShipSpeed") < 0)
	{
		
		if (speedStatus > movProps.minStatus)
		{
			speedStatus -= shipAcceleration * Time.deltaTime;
			
		}
	}
	
	if (Input.GetAxis("FullStop"))
	{
		speedTarget = 0;
		ChangeSpeed(speedTarget, speedStatus, shipAcceleration);
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
	var increment : float = shipAcceleration;
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
			speedStatus += increment * Mathf.Pow(Time.deltaTime, 2);
		}
		else
		{
			speedStatus -= increment * Mathf.Pow(Time.deltaTime, 2);
		}
		
		if (Mathf.Sqrt(Mathf.Pow(speedStatus - targetSpeed, 2)) < increment * Time.deltaTime)
		{
			speedStatus = targetSpeed;
		}
		
		
		yield;
	}
	
	isChanging = false;
		
		
	
	

}


