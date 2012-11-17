//Broken Mirror III
//this script controls the if the player has reached the limit of the planetary orbit or not

#pragma strict

var isGUI : boolean = false; //this verifies if the GUI question is up

function OnTriggerExit(collision : Collider) {
	if(collision.gameObject.tag == "Player") //if the object that triggered it was the player
	{
		isGUI = true; //open the GUI question
		Time.timeScale = 0; //put time scale to 0
	
	}
}

function OnGUI () {
	if(isGUI == true) //if the question is up
	{
		GUILayout.BeginArea(Rect(Screen.width/2 - Screen.width/4, Screen.height/2, Screen.width/2, Screen.height/2));
		
			GUILayout.BeginVertical("Leave System");
							//ask the question
							GUILayout.Label("Do you wish to leave this planets orbit?");
							GUILayout.BeginHorizontal();
								if(GUILayout.Button("Yes")) //if player presses yes
								{
									//leave the system
								}
								if(GUILayout.Button("No")) //if player presses no
								{
									isGUI = false; //lower question
									Time.timeScale = 1; //put time scale back to 1
								}
							GUILayout.EndHorizontal();
							
			GUILayout.EndVertical();
		
		GUILayout.EndArea();
	
	}

}