#pragma strict

function Start () {

}

function Update () {

}

function OnGUI () {

	if (GUI.Button(Rect(100, 100, 300, 200), "Galaxy + B'rel (Dead) vs Starbase"))
	{
		Application.LoadLevel(1);
	
	}
	
	if (GUI.Button(Rect(500, 100, 300, 200), "B'rel + Galaxy vs Starbase"))
	{
		Application.LoadLevel(2);
	}
	
	if (GUI.Button(Rect(900, 100, 300, 200), "Interactions"))
	{
		Application.LoadLevel(3);
	}
	
	if (GUI.Button(Rect(500, 400, 300, 200), "Leave"))
	{
		Application.Quit();
	}
	


}