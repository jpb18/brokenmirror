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

var planets : PlanetInfo[];

function Start () {

}

function Update () {

}

function OnGUI () {
	//check if the map is up on the player ship
	//first get the save game script to access the FindPlayerShip function
	var saveScr : SaveGame = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(SaveGame);
	var playerShip : GameObject = saveScr.FindPlayerShip(); //new we get said ship
	var playerGui : guiScript = playerShip.GetComponent(guiScript); //new we get the gui script from said ship
	var isMap : boolean = playerGui.isMap; //now get the value
	
	//now we check the isMap value
	
	if(isMap) { //if its true, prepare to draw the map
	
	
	}
	
	
	
	
}

