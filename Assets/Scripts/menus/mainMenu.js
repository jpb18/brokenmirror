#pragma strict

//control vars
var isMain : boolean = true;
var isPlay : boolean = false;
var isSave : boolean = false;
var isOption : boolean = false;
var isCredits : boolean = false;



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
var MainWidth : int;
var MainHeight : int;
var MainX :int;
var MainY : int;


var PlayButton : Button;
var LoadButton : Button;
var OptionsButton : Button;
var CreditsButton : Button;

//version label
var VerCoodX : int;
var VerCoodY : int;
var VerWidth : int;
var VerHeight : int;
var VerText : String;
var VerStyle : GUIStyle;

//Play menu
var PlayWidth : int;
var PlayHeight : int;

var playBG : Texture2D;
var playBGW : int;
var playBGH : int;

//play title label
var playTitleX : int;
var playTitleY : int;
var playTitleW : int;
var playTitleH : int;
var playTitleStyle : GUIStyle;

//difficulty buttons
var difEasy : Button;
var difNormal : Button;
var difHard : Button;
var difReturn : Button;



//exit button
var ExitButton : Button;






function OnGUI() {

	//Draw Background
	GUI.DrawTexture(Rect(0,0, Screen.width, Screen.height), bgImg, bgMode);
	
	//Draw Version Text
	GUI.Label(Rect(Screen.width - VerCoodX, VerCoodY, VerWidth, VerHeight), VerText, VerStyle);
	
	
	if(isMain) {
		MainMenu();		
	}
	else if (isPlay) {
		PlayMenu();
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
		if(GUI.Button(Rect(PlayButton.CoodX, PlayButton.CoodY, PlayButton.width, PlayButton.height), "Play Game", PlayButton.Style)) {
			isMain = false;
			isPlay = true;
		}
		
		//Draw Load Game Button
		GUI.Button(Rect(LoadButton.CoodX, LoadButton.CoodY, LoadButton.width, LoadButton.height), "Load Game", LoadButton.Style);
		
		
		//Draw Options Button
		GUI.Button(Rect(OptionsButton.CoodX, OptionsButton.CoodY, OptionsButton.width, OptionsButton.height), "Options", OptionsButton.Style);
		
		//Draw Credits Button
		GUI.Button(Rect(CreditsButton.CoodX, CreditsButton.CoodY, CreditsButton.width, CreditsButton.height), "Credits", CreditsButton.Style);
		
	GUILayout.EndArea();
	
	

}

function PlayMenu () {
	//Create area
	GUILayout.BeginArea(Rect(Screen.width/2 - PlayWidth/2, Screen.height/2 - PlayHeight/2, PlayWidth, PlayHeight));
		//Draw Background
		GUI.DrawTexture(Rect(0,0, playBGW, playBGH), playBG);
		
		//Write title label
		GUI.Label(Rect(playTitleX, playTitleY, playTitleW, playTitleH), "Select Dificulty", playTitleStyle);
		
		//Easy button
		if(GUI.Button(Rect(difEasy.CoodX, difEasy.CoodY, difEasy.width, difEasy.height), "Easy", difEasy.Style)) {
			Application.LoadLevel("Earth");
		
		}
		
		//Normal button
		if(GUI.Button(Rect(difNormal.CoodX, difNormal.CoodY, difNormal.width, difNormal.height), "Normal", difNormal.Style)) {
			Application.LoadLevel("Earth");
		}
		
		//Hard button
		if(GUI.Button(Rect(difHard.CoodX, difHard.CoodY, difHard.width, difHard.height), "Hard", difHard.Style)) {
			Application.LoadLevel("Earth");
		}
		
		//Return Main Menu button
		if(GUI.Button(Rect(difReturn.CoodX, difReturn.CoodY, difReturn.width, difReturn.height), "Main Menu", difReturn.Style)) {
			isPlay = false;
			isMain = true;
		}
		
	GUILayout.EndArea();


}