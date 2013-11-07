#pragma strict

var image : Texture;
var show : boolean = false;


function LoadScene(destiny : String) {
	
	var save_obj : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	var save_scr : SaveGame = save_obj.GetComponent(SaveGame);
	save_scr.Save();
	
	Application.LoadLevel(destiny);
	
	
	

}



function showScreen() {
	show = true;
}

function OnGUI() {
	if(show) {
		GUI.DrawTexture(Rect(0,0,Screen.width, Screen.height), image);
	 }
}

