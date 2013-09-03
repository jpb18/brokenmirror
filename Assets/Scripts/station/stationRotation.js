#pragma strict

var rotMovement : Vector3;



function Update () {

	transform.Rotate(rotMovement * Time.deltaTime);

}