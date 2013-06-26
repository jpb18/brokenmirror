#pragma strict

function Start () {

}

function Update () {
	var mainCam : Transform = Camera.main.transform;
	
	transform.LookAt(mainCam);
	
}