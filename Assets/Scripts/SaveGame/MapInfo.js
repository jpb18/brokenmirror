#pragma strict

class PlanetInfo { //this class stores all planet information necessary for the map
	var isEnabled : boolean;
	var name : String;
	var faction : int;
	var scene : String;
	var description : String;
	var image : Texture2D;
	var cood : PlanetCood;
	var defenseForce : SaveShip[];
	var hasPlayerVisit : boolean = false;
	var isColonized : boolean = false;
	
	class PlanetCood {
		
		var x : int;
		var y : int;
	
	}

}

class GuiComponent {

	var image : Texture2D;
	var position : Rect;
	var text : String;

}

class MapButtons {
	var buttonRect : Rect;
	var ally : Texture2D;
	var enemy : Texture2D;
	var neutral : Texture2D;
	var own : Texture2D;
	var empty : Texture2D;
	var never : Texture2D;
	
	
}

class MapGui { //this class stores all information related with the map GUI
	var map_bg : GuiComponent; //the background information
	var close_bt : GuiComponent; //closing button
	
	var skin : GUISkin;

}

var planets : PlanetInfo[];
var map : MapGui;
var isMap : boolean = false;


function Start () {

}

function Update () {
	

}

function OnGUI () {
	
	
	//now we check the isMap value
	
	if(isMap) { //if its true, prepare to draw the map
		//calls the DrawMap function
		drawMap();	
		
	}
	
	
	
	
}

//this function draws the map
function drawMap () {

	//calculate Rect
	var areaX : int = (Screen.width - map.map_bg.position.width)/2;
	var areaY : int = (Screen.height - map.map_bg.position.height)/2;
	var areaWidth : int = map.map_bg.position.width;
	var areaHeight : int = map.map_bg.position.height;
	var areaRect : Rect = new Rect(areaX, areaY, areaWidth, areaHeight);
	//Set area
	GUILayout.BeginArea(areaRect);

		GUI.DrawTexture(map.map_bg.position, map.map_bg.image);//Draw the background
		
		//draw the buttons
		
	
		//create close button
		var padX : int = 2;
		var padY : int = 3;
		var buttonX : int = areaWidth - map.close_bt.position.width - padX;
		var buttonY : int = areaHeight - map.close_bt.position.height - padY;
		var buttonWidth : int = map.close_bt.position.width;
		var buttonHeight : int = map.close_bt.position.height;
		
		var buttonRect : Rect = new Rect(buttonX, buttonY, buttonWidth, buttonHeight);
		if(GUI.Button(buttonRect, map.close_bt.text, map.skin.GetStyle("CloseMap"))) {
			swapStatus();
		}

	//End area
	GUILayout.EndArea();
	

}

/**
*This function creates the planet buttons on the star map
*planet represents the planet information
*button represents the button set being used
*mapRect contains the area dimensions
*faction contains the player faction information
*this should output several buttons on the GUI
*/

function CreatePlanetButton(planet : PlanetInfo, buttons : MapButtons, mapRect : Rect, factionInfo : FactionInfo, faction : int) {
	var useTexture : Texture2D;
	
	//first check if planet has been visited by player
	if(!planet.hasPlayerVisit) {
		useTexture = buttons.never;
	}
	else if(!planet.isColonized) { //check if the player is colonized
		useTexture = buttons.empty;
	}
	else if(CheckArrayValue(planet.faction, factionInfo.hostileFactions)){ //if planet is enemy
		useTexture = buttons.enemy;
	}
	else if(CheckArrayValue(planet.faction, factionInfo.alliedFactions)) { //if planet is ally
		useTexture = buttons.ally;
	}
	else if(faction == planet.faction) { //if it belongs to your faction
		useTexture = buttons.own;
	}
	else { //if its neutral
		useTexture = buttons.neutral;
	}
	
	//prepare the Rect
	var CoodX : int = (mapRect.width/2 + planet.cood.x) - (buttons.buttonRect.width/2);
	var CoodY : int = (mapRect.height/2 + planet.cood.y) - (buttons.buttonRect.height/2);
	
	var butRect : Rect = new Rect(CoodX, CoodY, buttons.buttonRect.width, buttons.buttonRect.height);
	
	//now its the button
	if(GUI.Button(butRect, useTexture, map.skin.GetStyle("ButtonMap"))) {
	
		goWarp(planet.scene);
	
	}
	
	

}

function CheckArrayValue(desValue : int, array : int[]) : boolean {

	var belongs : boolean = false;
	
	for(var val : int in array) {
	
		if (desValue == val)
		{
			belongs = true;
		}
	
	}
	
	return belongs;

}

function swapStatus() {
	isMap = !isMap;
}

/**
*This function changes scene, and eventualy will play the warp animation,
*It accepts the destiny String as an argument
*/

function goWarp(destiny : String) {

	//play anymation (future)
	
	//load new scene
	//save game first
	var save_obj : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	var save_scr : SaveGame = save_obj.GetComponent(SaveGame);
	save_scr.Save();
	//load level
	Application.LoadLevel(destiny);

}