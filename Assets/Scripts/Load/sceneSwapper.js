#pragma strict




function Start () {

}

function Update () {

	if(Input.GetAxis("Map")) {
		//get scene id
		var sceneId : int = Application.loadedLevel;
		
		//swap scene
		if (sceneId == 1)
		{
			Application.LoadLevel(2);
		}
		else
		{
			Application.LoadLevel(1);
		}
	
	}

	

}