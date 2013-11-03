#pragma strict

var image : Texture2D;

function LoadScene(destiny : String) {

	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), image);
	//lets start scene saving
	//get first game object in question
	var save_obj : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	var save_scr : SaveGame = save_obj.GetComponent(SaveGame);
	save_scr.Save();
	
	Application.LoadLevel(destiny);

}