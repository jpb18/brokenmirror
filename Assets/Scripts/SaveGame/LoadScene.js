#pragma strict

var image : Texture;
var show : boolean = false;

public static final var SCENE : String = "TransferScene";


function LoadScene() {
	

	
	Application.LoadLevel(SCENE);
	

}

function LoadScene(destiny : String, menu : MenuScript) {
	

	menu.startComponents();
	Application.LoadLevel(destiny);
	

}



function showScreen() {
	show = true;
}

function setOff() {
	show = false;
}

function OnGUI() {
	if(show) {
		GUI.DrawTexture(Rect(0,0,Screen.width, Screen.height), image);
	 }
}

