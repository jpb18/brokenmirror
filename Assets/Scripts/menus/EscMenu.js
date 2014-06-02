#pragma strict

var isOn : boolean = false;

var menu_rect : Rect;

var skin : GUISkin;

public static final var MENU_STYLE : String = "MenuButton";
public static final var MAIN_MENU : String = "text";

private var lastPress : float;
private var timeInt : float = 0.2f;

private var message : ShowMessage;

function Start () {

	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);

}

function Update () {
	if(Input.GetAxis("EscapeMenu") && message.isGame && lastPress + timeInt < Time.time) {
		if(isOn) {
			setOff();
		} else {
			setOn();
		}
		lastPress = Time.time;
	}
	

}

function OnGUI() {
	if(isOn) {
		drawMenu();
	}
	

}

function drawMenu() {
	GUILayout.BeginArea(menu_rect);
		var style : GUIStyle = skin.GetStyle(MENU_STYLE);
		
		if(GUILayout.Button("Return", style)) {
			setOff();
		}
		
		GUILayout.Button("Video/Audio", style);
		GUILayout.Button("Controls", style);
		
		if(GUILayout.Button("Quit", style)) {
			quit();
		}
		
		if(GUILayout.Button("Leave Game", style)) {
			leave();
		}
		
	GUILayout.EndArea();
}



function setOn() {
	isOn = true;
	Time.timeScale = 0;
}

function setOff() {
	isOn = false;
	Time.timeScale = 1;
}

function quit() {
	Application.LoadLevel(MAIN_MENU);
}

function leave() {
	Application.Quit();
}