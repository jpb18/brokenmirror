#pragma strict

var isOn : boolean = false;

var menu_rect : Rect;

var skin : GUISkin;

public static final var MENU_STYLE : String = "MenuButton";
public static final var MAIN_MENU : String = "text";

private var lastPress : float;
private var timeInt : float = 0.2f;

private var message : ShowMessage;
private var saveScript : SaveScript;

public static var SAVE_TEXT : String = "SaveGame";
public static var SAVE_EXT : String = ".bm";

private var hud : HUDStatus;
private var music : PlaybackScript;


function Start () {
	
	music = GameObject.FindGameObjectWithTag("OST").GetComponent(PlaybackScript);
	hud  = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	saveScript = GameObject.FindGameObjectWithTag("SaveScript").GetComponent(SaveScript);

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
		
		if(GUILayout.Button("Save Game", style)) {
			save();
			setOff();
		}
		
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
	var camera : Camera = Camera.main;
	stopComponents();
	Destroy(camera.gameObject);
	setOff();
	Application.LoadLevel(MAIN_MENU);
}

function leave() {
	Application.Quit();
}

function save() {
	var fileName : String = SAVE_TEXT + SAVE_EXT;
	saveScript.writeToFile(fileName);
}

private function stopComponents() {
	message.setOff();
	music.stopPlaying();
	hud.setGame(false);
}