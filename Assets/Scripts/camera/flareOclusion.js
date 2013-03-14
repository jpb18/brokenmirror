//this script controls if all flares are showing or not
#pragma strict

var maxDistance : float;
var mainCamera : GameObject;
var flareObject : GameObject[];



function Start () {

	mainCamera = Camera.main.gameObject;
	


}

function Update () {

	if (Vector3.Distance(mainCamera.transform.position, transform.position) <= maxDistance)
	{
		
		for (var flare : GameObject in flareObject)
		{
			var lightObj : Light = flare.GetComponent(Light);
			lightObj.enabled = true;
		}
	
	}
	else
	{
		
		for (var flare : GameObject in flareObject)
		{
			var lightObj1 : Light = flare.GetComponent(Light);
			lightObj1.enabled = false;
		}
	}

}