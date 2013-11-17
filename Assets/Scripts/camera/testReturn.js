#pragma strict

var isPause : boolean = false;
var lastClick : float;
var clickInt : float = 0.2f;

var dstScene : String;
var isLoading : boolean;

function Start () {

}

function FixedUpdate () {

	if(Input.GetAxis("EscapeMenu") && Time.time >= lastClick + clickInt)
	{
		lastClick = Time.time;
		if(isPause == true)
		{
			
			isPause = false;
			Time.timeScale = 1;
		}
		else
		{
			
			isPause = true;
			Time.timeScale = 0;
		}
	}
	
}

function OnGUI () {

	
	
	if(isPause)
	{
		GUILayout.BeginArea(Rect(0, 0, 300, 600));
		
			GUILayout.BeginHorizontal();
			
				GUILayout.BeginVertical();
					if(GUILayout.Button("Resume Game")) {
						isPause = false;
						Time.timeScale = 1;
									
					}				
				
					if(GUILayout.Button("Restart Game"))
					{
						Time.timeScale = 1;
						var per_go : GameObject = GameObject.FindWithTag("Persistent");
						Destroy(per_go);
						dstScene = "gameLoad";
						isLoading = true;
						
											
					}
					
					if(GUILayout.Button("Load Earth"))
					{
						
						Time.timeScale = 1;
						
						dstScene = "Earth";
						isLoading = true;
						
					}
					
					if(GUILayout.Button("Load Alpha Centauri"))
					{
						Time.timeScale = 1;
						
						dstScene = "AlphaCentauri";
						isLoading = true;
						
					}
					
					if(GUILayout.Button("Load Andoria"))
					{
						Time.timeScale = 1;
						
						dstScene = "Andoria";
						isLoading = true;
					}
					
					if(GUILayout.Button("Load Tygokor"))
					{
						Time.timeScale = 1;
						
						dstScene = "Tygokor";
						isLoading = true;
					}
					
					if(GUILayout.Button("Load Vulcan")) {
						Time.timeScale = 1;
						dstScene = "Vulcan";
						isLoading = true;
					}
					
					if(GUILayout.Button("Load Romulus/Remus")) {
						Time.timeScale = 1;
						dstScene = "Romulus_Remus";
						isLoading = true;
					
					}
					
					if(GUILayout.Button("Load Bajor")) {
						Time.timeScale = 1;
						dstScene = "Bajor";
						isLoading = true;
					
					}
					
					if(GUILayout.Button("Exit"))
					{
						Time.timeScale = 1;
						Application.Quit();
					}
				
				GUILayout.EndVertical();
			
			GUILayout.EndHorizontal();
		
		GUILayout.EndArea();
	}
	
	if(isLoading)
	{
		Application.LoadLevel(dstScene);
		
		
	
	}

}