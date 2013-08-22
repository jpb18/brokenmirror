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
			
			isPause = false;
			Time.timeScale = 0;
		}
		else
		{
			
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
				
					if(GUILayout.Button("Restart Game"))
					{
						Application.LoadLevel(0);					
					}
					
					if(GUILayout.Button("Load Earth"))
					{
						Application.LoadLevel(1);
					}
					
					if(GUILayout.Button("Load Alpha Centauri"))
					{
						Application.LoadLevel(2);
					}
					
					if(GUILayout.Button("Load Andoria"))
					{
						Application.LoadLevel(3);
					}
					
					if(GUILayout.Button("Load Tygokor"))
					{
						Application.LoadLevel(4);
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