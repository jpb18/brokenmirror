#pragma strict

var isPause : boolean = false;
var lastClick : float;
var clickInt : float = 0.2f;

function Start () {

}

function Update () {
	if(Input.GetAxis("EscapeMenu") && Time.time >= lastClick + clickInt)
	{
		lastClick = Time.time;
		if(isPause == true)
		{
			Debug.Log("Is here");
			isPause = false;
			Time.timeScale = 0;
		}
		else
		{
			Debug.Log("Is there");
			isPause = true;
			Time.timeScale = 1;
		}
	}
}

function OnGUI () {

	
	
	if(isPause)
	{
		GUILayout.BeginArea(Rect(0, 0, 300, 600));
		
			GUILayout.BeginHorizontal();
			
				GUILayout.BeginVertical();
				
					if(GUILayout.Button("Reload Scene"))
					{
						Application.LoadLevel(0);					
					}
					
					if(GUILayout.Button("Exit"))
					{
						Application.Quit();
					}
				
				GUILayout.EndVertical();
			
			GUILayout.EndHorizontal();
		
		GUILayout.EndArea();
	}

}