#pragma strict

var headStyle : GUIStyle;
var buttonStyle : GUIStyle;

function OnGUI() {

	GUILayout.BeginArea(Rect (Screen.width/2 - 515/2, 100 - 150/2, 515, 150));
		GUILayout.Label("Setup", headStyle);
	
	GUILayout.EndArea ();
	
	GUILayout.BeginArea (Rect (Screen.width/2 - 150/2, Screen.height/2 - 300/2, 150, 300));
		if (GUILayout.Button("Visual", buttonStyle))
		{
			Debug.Log("Clicked Visual"); //Goes to Visual Options Menu
		}
		
		if (GUILayout.Button("Audio", buttonStyle))
		{
			Debug.Log("Clicked Audio"); //Goes to Audio Options Menu
		}
		
		if (GUILayout.Button("Keybindings", buttonStyle))
		{
			Debug.Log("Clicked Keybindings"); //goes to keybindings options menu
		}
		
		if (GUILayout.Button("Return", buttonStyle))
		{
			Application.LoadLevel("mainMenu"); //returns to main menu
		}
		
		
	GUILayout.EndArea ();
	

}