#pragma strict

var image : Texture;
var show : boolean = false;



function LoadScene(destiny : String) {
	

	
	Application.LoadLevel(destiny);
	

}

function LoadScene(destiny : String, menu : MenuScript) {
	

	menu.startComponents();
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

