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

//main menu
var gradientMain : Texture2D;
var MainWidth : int;
var MainHeight : int;
var MainX :int;
var MainY : int;


var PlayButton : Button;
var OptionsButton : Button;
var CreditsButton : Button;



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
	
	//Create area
	GUILayout.BeginArea(Rect(Screen.width - MainX, Screen.height - MainY, MainWidth, MainHeight));
		//Draw Play Button
		GUI.Button(Rect(PlayButton.CoodX, PlayButton.CoodY, PlayButton.width, PlayButton.height), "Play Game", PlayButton.Style);
		
		//Draw Options Button
		GUI.Button(Rect(OptionsButton.CoodX, OptionsButton.CoodY, OptionsButton.width, OptionsButton.height), "Options", OptionsButton.Style);
		
		//Draw Credits Button
		GUI.Button(Rect(CreditsButton.CoodX, CreditsButton.CoodY, CreditsButton.width, CreditsButton.height), "Credits", CreditsButton.Style);
		
	GUILayout.EndArea();
	
	

}