#pragma strict

class PlanetInfo { //this class stores all planet information necessary for the map
	var isEnabled : boolean;
	var name : String;
	var scene : String;
	var description : String;
	var image : Texture2D;
	var cood : PlanetCood;
	var defenseForce : SaveShip[];
	
	class PlanetCood {
		
		var x : int;
		var y : int;
	
	}

}

class GuiComponent {

	var image : Texture2D;
	var position : Rect;

}

class MapGui { //this class stores all information related with the map GUI
	var map_bg : GuiComponent; //the background information

}

var planets : PlanetInfo[];
var map : MapGui;
var isMap : boolean = false;


function Start () {

}

function Update () {
	//in case Map Input is pressed
	if(Input.GetAxis("Map")) {
		swapStatus();
	}

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
	var AreaRect : Rect = new Rect(areaX, areaY, areaWidth, areaHeight);
	//Set area
	GUILayout.BeginArea(AreaRect);

		GUI.DrawTexture(map.map_bg.position, map.map_bg.image);//Draw the background

	//End area
	GUILayout.EndArea();
	

}

function swapStatus() {
	isMap = !isMap;
}