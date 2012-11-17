#pragma strict

var headStyle : GUIStyle;
var buttonStyle : GUIStyle;

function OnGUI() {

	GUILayout.BeginArea(Rect (Screen.width/2 - 515/2, 100 - 150/2, 515, 150));
		GUILayout.Label("Broken Mirror III: Rise Of the Empire", headStyle);
	
	GUILayout.EndArea ();
	
	GUILayout.BeginArea (Rect (Screen.width/2 - 150/2, Screen.height/2 - 300/2, 150, 300));
		if (GUILayout.Button ("New Game", buttonStyle))
		{
			Debug.Log("Clicked New Game"); //Goes to New Game Menu
		}
		
		if (GUILayout.Button ("Play Saved", buttonStyle))
		{
			Debug.Log("Clicked Play Saved"); //Goes to Play Saved Menu
		}
		
		if (GUILayout.Button ("Setup", buttonStyle))
		{
			Application.LoadLevel("setupMenu"); //Goes to Setup Menu
		}
		
		
		if (GUILayout.Button ("Help", buttonStyle))
		{
			Debug.Log("Clicked Help"); //Goes to Help Menu
		}
		

		if(GUILayout.Button ("Exit Game", buttonStyle))
		{
			Application.Quit(); //leaves the game
		}

		
	GUILayout.EndArea ();
	

}