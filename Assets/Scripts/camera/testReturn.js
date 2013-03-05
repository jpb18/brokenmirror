#pragma strict

function Start () {

}

function Update () {

}

function OnGUI () {

	if(Input.GetKey(KeyCode.Escape))
	{
		Application.Quit();
	}

}