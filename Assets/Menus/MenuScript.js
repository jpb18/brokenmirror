#pragma strict

var mainCam : Camera;
var startGame : boolean;
var image : Texture2D;
var showSplash : boolean;

var rolls : GameObject[];
var lights : GameObject[];
var texts : TextMesh[];

var sColor : Color;
var uColor : Color;

public static final var MENU_LAYER : String = "MenuText";

private var hud : HUDStatus;
private var show : ShowMessage;
private var music : PlaybackScript;

private var load : LoadScene;
private var fade : FadeInOut;

function Start () {
	show = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	music = GameObject.FindGameObjectWithTag("OST").GetComponent(PlaybackScript);
	hud  = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
	load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
	
	fade = gameObject.GetComponent(FadeInOut);
	if(fade) {
		fade.fadeIn();
	}

}

function Update () {
	getPress();
	getMouseOver();

}

function getPress() {
	if(Input.GetKey(KeyCode.Mouse0)) {
	
		var ray : Ray = mainCam.ScreenPointToRay (Input.mousePosition);
		var hit : RaycastHit = new RaycastHit ();
		var layer : LayerMask = LayerMask.NameToLayer (MENU_LAYER);
		if (Physics.Raycast (ray, hit, 1000.0f, ~layer.value)) {
				var hitGo : GameObject = hit.transform.gameObject;
				if (hitGo.tag == "NewGame") {
						startGame = true;
				}
				else if(hitGo.tag == "resume") {
					loadLatestGame();
				}
		}
	
	}
}

function getMouseOver() {

	var ray : Ray = mainCam.ScreenPointToRay(Input.mousePosition);
	var hit : RaycastHit = new RaycastHit();
	var layer : LayerMask = LayerMask.NameToLayer(MENU_LAYER);
	if (Physics.Raycast (ray, hit, 1000.0f, ~layer.value)) {
				var hitGo : GameObject = hit.transform.gameObject;
				setMouseOver(getNumber(hitGo.tag));
		}
	

}

function setMouseOver(i : int) {
	if(!rolls[i].activeInHierarchy) {
		hideRoll();
		rolls[i].SetActive(true);
		lights[i].SetActive(true);
		texts[i].color = sColor;
	}

}

function getNumber(tag : String) : int {
	var res : int;

	switch(tag) {
		case ("resume"):
			res = 0;
			break;
		case ("NewGame"):
			res = 1;
			break;
		case ("LoadGame"):
			res = 2;
			break;
		case ("Options"):
			res = 3;
			break;
		default:
			res = -1;
			
	}
	
	return res;

}

function FixedUpdate() {
	if (startGame) {
			
			Application.LoadLevel ("Intro");
	}


}

function startComponents() {
	show.setGame();
	music.startPlaying();
	hud.setGame(true);
}

function OnGUI ()
{
		if (showSplash) {
				load.showScreen();
				startGame = true;
		}
}

function hideRoll() {
	for(var roll : GameObject in rolls) {
		roll.SetActive(false);
				
	}
	
	for(var light : GameObject in lights) {
		light.SetActive(false);
	}
	
	for(var text : TextMesh in texts) {
		text.color = uColor;
	}
	
}

function loadLatestGame() {
	//first load save game
	var go : GameObject = GameObject.FindGameObjectWithTag("SaveScript");
	var save : SaveScript = go.GetComponent(SaveScript);
	var file : String = EscMenu.SAVE_TEXT + EscMenu.SAVE_EXT;
	save.readFromFile(file);
	
	//then get latest loaded scene
	var saveGo : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	var saveGame : SaveGame = saveGo.GetComponent(SaveGame);
	var scene : String = saveGame.getLastScene();
	
	
		
	//load new scene
	var loadGo : GameObject = GameObject.FindGameObjectWithTag("LoadScene");
	var load : LoadScene = loadGo.GetComponent(LoadScene);
	
	load.LoadScene(scene, this);
	
	
	      
}