#pragma strict

var on : boolean = false;

var skin : GUISkin;

var area : Rect;
var rightArea : Rect;
var leftArea : Rect;

var charNameLabel : Rect;
var charNameText: Rect;
private var charNameString : String;

var customFactionLabel : Rect;
var customFactionText : Rect;
private var customFactionString : String;

var shipNameLabel : Rect;
var shipNameText : Rect;
private var shipNameString : String;

var speciesLabel : Rect;
var speciesArea : Rect;
var selectedRace : Race;


var startingFactionLabel : Rect;

var shipClassLabel : Rect;

var horLine : Texture;
var verLine : Texture;
var line1 : Rect;
var line2 : Rect;
var line3 : Rect;

var playerNameLabel : Rect;
var shipLabel : Rect;
var empireLabel : Rect;

var empireLogoRect : Rect;
var empireLogo : Texture;

var navLabelRect : Rect;
var tacLabelRect : Rect;
var engLabelRect : Rect;
var sciLabelRect : Rect;
var comLabelRect : Rect;

var navPointsRect : Rect;
var tacPointsRect : Rect;
var engPointsRect : Rect;
var sciPointsRect : Rect;
var comPointsRect : Rect;

var continueRect : Rect;
var returnRect : Rect;

var ship : GameObject;

var creditsGO : GameObject;

private var menu : MenuScript;
private var general : GeneralInfo;
private var save : SaveGame;
private var tmp : GUISkin;
private var baseWidth : float;

public static final var BASE_HEIGHT = 1440f;
public static final var BASE_WIDTH_19 = 2550f;
public static final var BASE_WIDTH_4 = 1920f;
public static final var CREATE_TITLE = "Create Profile";
public static final var CHARACTER = "Character Name:";
public static final var FACTION = "Custom Faction:";
public static final var SHIP = "Ship Name:";
public static final var SPECIES_LABEL = "Species";
public static final var FACTION_LABEL = "Starting Faction";
public static final var SHIP_LABEL = "Ship Class";
public static final var NAVIGATION = "Navigation";
public static final var TACTICAL = "Tactical";
public static final var ENGINEERING = "Engineering";
public static final var SCIENCE = "Science";
public static final var COMMAND = "Command\nRating";

public static final var POINTS = "{0}/100";

function Start () {
	menu = Camera.main.gameObject.GetComponent(MenuScript);
	var go : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	general = go.GetComponent(GeneralInfo);
	save = go.GetComponent(SaveGame);
	reset();
	

	
}

function reset() {
	charNameString = "";
	customFactionString = "";
	shipNameString = "";
}

function Update () {


}

function OnGUI() {
	if(Camera.main.aspect > 1) {
		baseWidth = BASE_WIDTH_19;
	} else {
		baseWidth = BASE_WIDTH_4;
	}

	tmp = GUI.skin;
	var h : float = Screen.height/BASE_HEIGHT;
	var w : float = Screen.width/baseWidth;
	var ratio : float = w < h ? w : h;	
	GUIUtility.ScaleAroundPivot(new Vector2(ratio,ratio), new Vector2() );

	GUI.skin = skin;
	if(on) {
		
		Draw();
	}
	
	GUI.skin = tmp;
	GUIUtility.ScaleAroundPivot( new Vector2(1,1), new Vector2());
	


}

private function Draw() {
	
	
	GUILayout.BeginArea(InvertXY(area));
		DrawLeft();
		DrawRight();
	GUILayout.EndArea();

}

private function DrawLeft() {
	var area : Rect = leftArea;
	GUILayout.BeginArea(area);
		GUI.Box(new Rect(0,0, area.width, area.height), "");
	  	
	  	GUI.Label(playerNameLabel, charNameString, skin.GetStyle("NameLabel1"));
		GUI.Label(shipLabel, "ISS " + shipNameString, skin.GetStyle("NameLabel2"));
		GUI.Label(empireLabel, customFactionString, skin.GetStyle("NameLabel1"));	   
	  	
	  	GUI.DrawTexture(empireLogoRect, empireLogo);
	  	
	  	GUI.Label(navLabelRect, NAVIGATION, skin.GetStyle("SkillLabel"));
	  	GUI.Label(tacLabelRect, TACTICAL, skin.GetStyle("SkillLabel"));
	  	GUI.Label(engLabelRect, ENGINEERING, skin.GetStyle("SkillLabel"));
	  	GUI.Label(sciLabelRect, SCIENCE, skin.GetStyle("SkillLabel"));
	  	GUI.Label(comLabelRect, COMMAND, skin.GetStyle("SkillLabel"));
	  	
	  	GUI.Label(navPointsRect, String.Format(POINTS, 15), skin.GetStyle("SkillPoints"));
	  	GUI.Label(tacPointsRect, String.Format(POINTS, 15), skin.GetStyle("SkillPoints"));
	  	GUI.Label(engPointsRect, String.Format(POINTS, 15), skin.GetStyle("SkillPoints"));
	  	GUI.Label(sciPointsRect, String.Format(POINTS, 15), skin.GetStyle("SkillPoints"));
	  	
	  	GUI.Label(comPointsRect, "15", skin.GetStyle("CommandPoints"));
	  	
	  	GUI.DrawTexture(line3, verLine);
	  	
	GUILayout.EndArea();
}


private function DrawRight() {
	var area : Rect = Resize(rightArea);
	GUILayout.BeginArea(area);
		GUI.Box(new Rect(0,0, area.width, area.height), CREATE_TITLE);
		
		GUI.DrawTexture(Resize(line1), horLine);
		
		GUI.Label(Resize(charNameLabel), CHARACTER);
		GUI.Label(Resize(customFactionLabel), FACTION);
		GUI.Label(Resize(shipNameLabel), SHIP);
		
		GUI.DrawTexture(Resize(line2), horLine);
		
		charNameString = GUI.TextField(Resize(charNameText), charNameString);
		customFactionString = GUI.TextField(Resize(customFactionText), customFactionString);
		shipNameString = GUI.TextField(Resize(shipNameText), shipNameString);
		

		GUI.Label(Resize(speciesLabel), SPECIES_LABEL, skin.GetStyle("MidLabel"));
		
		drawSpeciesButtons();
		
		GUI.Label(Resize(startingFactionLabel), FACTION_LABEL, skin.GetStyle("MidLabel"));
		GUI.Label(Resize(shipClassLabel), SHIP_LABEL, skin.GetStyle("MidLabel"));
		
		if(GUI.Button(Resize(InvertXY(rightArea, continueRect)), "Continue")) {
			setNewGame();
		}
		
		if(GUI.Button(Resize(InvertY(rightArea, returnRect)), "Back")) {
			SetOff();
			reset();
		}
		
	GUILayout.EndArea();
}

private function drawSpeciesButtons() {
	GUILayout.BeginArea(Resize(speciesArea));
	GUILayout.BeginHorizontal();
		for(var r : Race in Enum.GetValues(typeof(Race))) {
			if(r == selectedRace) {
				GUI.color = Color.yellow;
			}
			if(GUILayout.Button(r.ToString(), skin.GetStyle("RaceButton"))) {
				selectedRace = r;
			}
			GUI.color = Color.white;		
		}
	
	GUILayout.EndHorizontal();
	GUILayout.EndArea();
}


private function GetScale() : float {
	return 1f;
	var height : float = Screen.height;
	return height/BASE_HEIGHT;
}

private function InvertXY(parent : Rect, rect : Rect) : Rect {
	var y : float = parent.height - rect.height - rect.y;
	var x : float = parent.width - rect.width - rect.x;
	return new Rect(x, y, rect.width, rect.height);
}

private function InvertY(parent : Rect, rect : Rect) : Rect {
	var y : float = parent.height - rect.height - rect.y;
	return new Rect(rect.x, y, rect.width, rect.height);
}

private function InvertXY(rect : Rect) : Rect {
	var y : float = BASE_HEIGHT - rect.height - rect.y;
	var x : float = baseWidth - rect.width - rect.x;
	return new Rect(x, y, rect.width, rect.height);
}

private function Resize(rect : Rect) : Rect {
	var scale : float = GetScale();
	return new Rect(rect.x * scale, rect.y * scale, rect.width * scale, rect.height * scale);
}

function SetOn() {
	on = true;
	ship.SetActive(true);
	if(creditsGO) {
		creditsGO.SetActive(false);
	}
}

function SetOff() {
	reset();
	on = false;
	menu.Show();
	ship.SetActive(false);
	if(creditsGO) {
		creditsGO.SetActive(true);
	}
}

function setNewGame() {
	general.setPlayerName(charNameString);
	general.setPlayerFactionName(customFactionString);
	general.setPlayerFactionPrefix("ISS");
	general.setPlayerRace(selectedRace);
	save.setPlayerShipName(shipNameString);
	
	Application.LoadLevel("Intro");
	
}
