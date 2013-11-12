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

//warp deceleration variables
private var isWarp = true;
private var isWarping = false;
private static final var WARP_SPEED : float = 9000.0f;
private static final var FULL_STOP : float = 0.0f;
private static final var LOG_CONST : float = 10.0f;
var start : SceneStart;


function Start () {

	properties = gameObject.GetComponent(shipProperties);
	

}

function Update () {
	var isPlayer : boolean = properties.playerProps.isPlayer;
	if (isPlayer && !isWarp)
	{
		shipPlayer_speed();
		shipPlayer_movement();
		
	}
	
	if(isWarp && !isWarping) {
		isWarping = true;
		StartCoroutine(warpDecel());
	}
	
}

//this function controls the ship speed
function shipPlayer_speed () {
	var shipSpeed : float = properties.movement.impulseSpeed * Time.deltaTime;
	var shipAcceleration : float = properties.movement.acceleration;
	
	if(Input.GetAxis("ShipSpeed") > 0 && !isChanging)
	{
		
		if (speedStatus < movProps.maxStatus )
		{
			speedStatus += shipAcceleration * Time.deltaTime;
			
		}
		
		
	
	}
	else if (Input.GetAxis("ShipSpeed") < 0 && !isChanging)
	{
		
		if (speedStatus > movProps.minStatus)
		{
			speedStatus -= shipAcceleration * Time.deltaTime;
			
		}
	}
	
	if (Input.GetAxis("FullStop") && !isChanging && speedStatus != 0)
	{
		
			StartCoroutine(FullStop(speedStatus, properties.movement.acceleration));
	}
	
	
	
	
	
	var SpeedChange : float = speedStatus * shipSpeed;
	
	rigidbody.velocity = transform.forward * SpeedChange;
	


}

function shipPlayer_movement () {
	
	
	
		var shipAgility : float = properties.movement.agility * Time.deltaTime;
		
		//get axis input
		var inputHor : float = Input.GetAxis("Horizontal");
		var inputVer : float = Input.GetAxis("Vertical");
		var inputRot : float = Input.GetAxis("Rotate");
		
		//apply rotation
		transform.Rotate(Vector3(inputVer * shipAgility, shipAgility * inputHor, inputRot * shipAgility));	
	
	
}


function FullStop (currentSpeed : float, acceleration : float)
{
	isChanging = true;
	var isIncreasing : boolean;
	if (currentSpeed > 0) 
	{
		isIncreasing = false;
	}
	else
	{
		isIncreasing = true;
	}

	var time : float = Mathf.Sqrt(Mathf.Pow(currentSpeed, 2))/acceleration;
	var rate : float = 1/time;
	var i : float = 0;
	if(isIncreasing)
	{
		while(i < 1)
		{
		i += Time.deltaTime * rate;
		speedStatus += acceleration * Time.deltaTime;
		yield;
		
		}
	}
	else
	{
		while(i < 1)
		{
		i += Time.deltaTime * rate;
		speedStatus -= acceleration * Time.deltaTime;
		yield;
		
		}
	}
	
	if(Mathf.Sqrt(Mathf.Pow(speedStatus, 2)) < acceleration * Time.deltaTime)
	{
		speedStatus = 0;
	}
	
	
	isChanging = false;


}


//this function controls de deceleration of the ship
//its a coroutine
function warpDecel() {
	
	//calc distance
	var distance : float = Vector3.Distance(start.getSpawn(), start.getWarp());
	
	while(rigidbody.velocity.z > FULL_STOP) {
	
		//get the distance between the ship and the warpStop point
		var dist1 : float = Vector3.Distance(transform.position, start.getWarp());
		
	
		var x : float = (dist1 * LOG_CONST)/distance;	//calc le X
		var speed : float = WARP_SPEED * Mathf.Log10(x); //calculate the speed
		
		rigidbody.velocity.z = speed;
		
		yield;
	
	}
	
	isWarp = false;

}