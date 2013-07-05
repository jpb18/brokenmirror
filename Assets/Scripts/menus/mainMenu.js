#pragma strict

//control vars
var mainBool : boolean = true;



//background
var bgImg : Texture2D;
var bgMode : ScaleMode;

class Button {
	var width : int;
	var height : int;
	var CoodX : int;
	var CoodY : int;
	var Style : GUIStyle;

}

//exit button
var ExitButton : Button;






function OnGUI() {

	//Draw Background
	GUI.DrawTexture(Rect(0,0, Screen.width, Screen.height), bgImg, bgMode);
	
	if(mainBool) {
		MainMenu();		
	}	

	//Draw exit button
	if(GUI.Button(Rect(ExitButton.CoodX, Screen.height - ExitButton.CoodY, ExitButton.width, ExitButton.height), "Quit", ExitButton.Style)) {
	
		Application.Quit();
	}
	

}

function MainMenu() {
	

}