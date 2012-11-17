//this script controls the asteroid generation in Broken Mirror III. It specifically handles with the rigidbody, size and mesh


var density : float; //contains the value of the density, between 1 and 0.1.
var size : float; //contains the size multiplier of the base asteroid.
var dmgRatio : float = 100.0; //contains the damage per mass unit cause by the asteroid

//rotation of the asteroid
var rotX : float; //contains the rotation on the X axis
var rotY : float; //contains the rotation on the Y axis
var rotZ : float; //contains the rotation on the Z axis 

//rotation minimum and maximum
var minRot : float = -1;
var maxRot : float = 1;

function Start () {
	//random generators
	density = Random.Range(0.1, 1.0); //generates the density of the object
	size = Random.Range(0.5, 5.0); //generates the size of the object
	rotX = Random.Range(minRot, maxRot) * Time.deltaTime; //generates the rotation on the X axis
	rotY = Random.Range(minRot, maxRot) * Time.deltaTime; //generates the rotation on the Y axis
	rotZ = Random.Range(minRot, maxRot) * Time.deltaTime; //generates the rotation on the Z axis
	
	
	//sets mass
	var mass = density * size; //obtain mass value
	gameObject.rigidbody.mass = mass; //sets mass to the value obtained
	
	//sets dimenstion
	transform.localScale = transform.localScale * size;
	
	//sets rotation
	rigidbody.AddTorque(Vector3(rotX, rotY, rotZ));
	
	//set tag
	transform.tag = "Asteroid";


}

function Update () {

}