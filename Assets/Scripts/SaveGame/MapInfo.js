import System.Collections.Generic;
#pragma strict

class PlanetInfo { //this class stores all planet information necessary for the map
	var isEnabled : boolean;
	var name : String;
	var faction : int;
	var scene : String;
	var description : String;
	var image : Texture;
	var cood : PlanetCood;
	var defenseFleet : List.<SaveShip>;
	var stations : List.<SaveStation>;
	
	var reputation : int;
	var dilithium : boolean;
	
	var hasPlayerVisit : boolean = false;
	var isColonized : boolean = false;
	
	function PlanetInfo(stream : StreamReader) {
		readFromFile(stream);
	}
	
	class PlanetCood {
		
		var x : int;
		var y : int;
		
		function PlanetCood(stream : StreamReader) {
			readFromFile(stream);
		}
		
		function serialize() : String {
			return x + "\n" + y + "\n";
		}
		
		function readFromFile(stream : StreamReader) {
			x = int.Parse(stream.ReadLine());
			y = int.Parse(stream.ReadLine());
		}
	
	}
	
	
	function getImage() : Texture {
		return image;
	}
	
	//this method return the defense fleet present on the planet
	function getFleet() : List.<SaveShip> {
	
		return defenseFleet;
	
	}
	
	//this method checks if this scene is the wished scene
	function isScene(scene : String) : boolean {
	
		return scene.Equals(this.scene);
	 
	} 
	
	function getReputation() : int {
		
		return reputation;
		
	}
	
	function getFaction() : int {
		return faction;
	}
	
	function addReputation(amount : int) {
		reputation += amount;
	}
	
	function getStrenght() : int {
		var str : int = 0;
		
		for(var ship : SaveShip in defenseFleet) {
			str += ship.getStrenght();
		}
		
		for(var station : SaveStation in stations) {
			str += station.getStrenght();
		}
		
		
		return str;
	}
	
	
	
	function hasDilithium() : boolean {
		return dilithium;
	}
	
	
	function serialize() : String {
		var serie : String = "";
		
		serie = serie + isEnabled + "\n";
		serie = serie + name + "\n";
		serie = serie + faction + "\n";
		serie = serie + scene + "\n";
		serie = serie + description + "\n";
		//TODO : Planet images
		serie = serie + cood.serialize();
		serie = serie + defenseFleet.Count + "\n";
		for(var ship : SaveShip in defenseFleet) {
			serie = serie + ship.serialize();
		}
		serie = serie + stations.Count + "\n";
		for(var station : SaveStation in stations) {
			serie = serie + station.serialize();
		}
		serie = serie + reputation + "\n";
		serie = serie + hasPlayerVisit + "\n";
		serie = serie + isColonized + "\n";
		serie = serie + image.name + "\n";
		return serie;
	}
	
	function readFromFile(stream : StreamReader) {
		isEnabled = boolean.Parse(stream.ReadLine());
		name = stream.ReadLine();
		faction = int.Parse(stream.ReadLine());
		scene = stream.ReadLine();
		description = stream.ReadLine();
		//TODO : Planet Images
		cood = new PlanetCood(stream);
		defenseFleet = getSaveShipList(stream);
		stations = getSaveStationList(stream);
		reputation = int.Parse(stream.ReadLine());
		hasPlayerVisit = boolean.Parse(stream.ReadLine());
		isColonized = boolean.Parse(stream.ReadLine());
		image = Resources.Load(stream.ReadLine()) as Texture2D;
		
	}
	
	private function getSaveShipList(stream : StreamReader) : List.<SaveShip> {
		var count : int = int.Parse(stream.ReadLine());
		var list : List.<SaveShip> = new List.<SaveShip>();
		for(var x : int = 0; x < count; x++) {
			var ship : SaveShip = new SaveShip();
			ship.readFromFile(stream);
			list.Add(ship);
		}
		return list;
	}
	
	private function getSaveStationList(stream : StreamReader) : List.<SaveStation> {
		var count : int = int.Parse(stream.ReadLine());
		var list : List.<SaveStation> = new List.<SaveStation>();
		for(var x : int = 0; x < count; x++) {
			var station : SaveStation = new SaveStation(stream);
			list.Add(station);
		}
		return list;
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

class OverRect {
	var position : Rect;
	var bg_image : Texture2D;
	
	//labels
	var planet_label : Rect;
	var faction_label : Rect;
	var race_label : Rect;
	var strLabel : Rect;
	
	//skin
	var skin : GUISkin;
	

	
	
	function Draw(button : Rect, planet : PlanetInfo) {
	
		var factionStyle : GUIStyle = skin.GetStyle("FactionOver");
		
		//construct texture rect
		var CoodX : int = button.x;
		var CoodY : int = button.y - position.height;
		var overRect : Rect = new Rect(CoodX, CoodY, position.width, position.height);
		
		//prepare to draw
		GUILayout.BeginArea(overRect);
			GUI.DrawTexture(Rect(0,0, position.width, position.height), bg_image);
			
			GUI.Label(planet_label, planet.name, skin.GetStyle("PlanetOver")); //Show planet name
			
			//Get faction info
			var facInfo : FactionInfo = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo).factionInfo[planet.faction];
			var facName : String = facInfo.factionName;
			
			GUI.Label(faction_label, facName, factionStyle); //Show planet faction
			
			var facRace : String = facInfo.factionRace;
			
			GUI.Label(race_label, facRace, factionStyle);// Show planet master race
			
			//Draw strenght label
			var strenght : int = planet.getStrenght();
			GUI.Label(strLabel, "Strength: " + strenght.ToString(), factionStyle);
			
			
		
		GUILayout.EndArea();
	
	
	}

}

class MapGui { //this class stores all information related with the map GUI
	var map_bg : GuiComponent; //the background information
	var close_bt : GuiComponent; //closing button
	
	//map buttons
	var buttons : MapButtons;
	
	//mouse over
	var mouseOver : OverRect;
	
	
	var skin : GUISkin;

}

class SaveStation extends System.Object{
	//basic info
	var name : String;
	var faction : int;
	var position : Vector3;
	
	//commerce
	var items : List.<GameObject>;
	var ships : List.<GameObject>;
	var	plans : List.<GameObject>;
	var upgrades : List.<GameObject>;
	
	//prefab
	var prefab : GameObject;
	
	function SaveStation(stream : StreamReader) {
		readFromFile(stream);
	}
	
	//this function sets the station information
	//pre station.tag == "Station"
	function setStation(station : GameObject) {
		//set position
		position = station.transform.position;
		
		//set name, weapons, ships and stations
		var statI : StationInterface = station.GetComponent(StationInterface);
		name = statI.stName;
		items = statI.items;
		ships = statI.ships;
		plans = statI.plans;
		upgrades = statI.upgrades;
		
		//set faction
		var statS : Station = station.GetComponent(Station);
		faction = statS.faction;
		
		//set prefab
		prefab = Resources.Load(station.name) as GameObject;
	
	}
	
	//this function returns a station
	function getStation() : GameObject {
		var station : GameObject = GameObject.Instantiate(prefab, this.position, new Quaternion());
		
		//set position
		station.transform.position = position;
		
		//set name, weapons, ships and stations
		var statI : StationInterface = station.GetComponent(StationInterface);
		statI.stName = name;
		statI.items = items;
		statI.ships = ships;
		statI.plans = plans;
		statI.upgrades = upgrades;
		
		//set faction
		var statS : Station = station.GetComponent(Station);
		statS.faction = faction;
		
		return station;
	}
	
	function serialize() : String {
		var serie : String = name + "\n";
		
		serie = serie + faction + "\n";
		serie = serie + serializeVector3(position);
		
		
		//items
		serie = serie + serializeGoList(items);
		
		//ships
		serie = serie + serializeGoList(ships);
		
		//plans
		serie = serie + serializeGoList(plans);
		
		//upgrades
		serie = serie + serializeGoList(upgrades);
		
		serie = serie + prefab.name + "\n";
		
		return serie;
		
	}
	
	private function serializeVector3(vector : Vector3) {
		return vector.x + "\n" + vector.y + "\n" + vector.z + "\n";
	}
	
	private function serializeGoList(list : List.<GameObject>) {
		var serie : String = list.Count + "\n";
		for(var item : GameObject in list) {
			serie = serie + item.name + "\n";
		}
		return serie;
	}
	
	function readFromFile(stream : StreamReader) {
		name = stream.ReadLine();
		faction = int.Parse(stream.ReadLine());
		position = readVector3(stream);
		items = readGoList(stream);
		ships = readGoList(stream);
		plans = readGoList(stream);
		upgrades = readGoList(stream);
		prefab = Resources.Load(stream.ReadLine()) as GameObject;
		
	}
	
	private function readVector3(stream : StreamReader) : Vector3 {
		var x : float = float.Parse(stream.ReadLine());
		var y : float = float.Parse(stream.ReadLine());
		var z : float = float.Parse(stream.ReadLine());
		return new Vector3(x, y, z);
	}
	
	private function readGoList(stream : StreamReader) : List.<GameObject> {
		var count : int = int.Parse(stream.ReadLine());
		var list : List.<GameObject> = new List.<GameObject>();
		for(var x : int = 0; x < count; x++) {
			var name : String = stream.ReadLine();
			var go : GameObject = Resources.Load(name) as GameObject;
			list.Add(go);
		}
		return list;
	
	}
	
	function getStrenght() : int {
		var station : Station = prefab.GetComponent(Station);
		return station.getStrenght();
	}

}



var planets : List.<PlanetInfo>;
var map : MapGui;
var isMap : boolean = false;

//set warp speed
var warpTime : float = 3.0f;
var warpInc : float = 750.0f;
var warpWait : float = 1.0f;;

private var areaRect : Rect;

private var message : ShowMessage;
private var hud : HUDStatus;
private var save : SaveGame;

public static var LIGHT_YEAR : float = 2.9f;


function Start() {

	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	hud = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
	save = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(SaveGame);

}

function OnGUI () {
		
	if(hud.isShowingGui()) guiFunction();
	
}

function guiFunction() {
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
	areaRect = new Rect(areaX, areaY, areaWidth, areaHeight);
	//Set area
	GUILayout.BeginArea(areaRect);

		GUI.DrawTexture(map.map_bg.position, map.map_bg.image);//Draw the background
		
		//draw the buttons
		
		//get the player ship
		var playerShip : GameObject = SaveGame.FindPlayerShip();
		var faction : int = playerShip.GetComponent(shipProperties).shipInfo.faction; //and the faction
		
		//update faction info
		//get script
		var save_go : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
		var gen_scr : GeneralInfo = save_go.GetComponent(GeneralInfo);
		
		//now get faction info
		var factionInfo : FactionInfo = gen_scr.factionInfo[faction];
		
		
		
		//print the buttons		
		for(var x : int = 0; x < planets.Count; x++) {
		
		
			CreatePlanetButton(planets[x], map.buttons, map.map_bg.position, factionInfo, faction);
		}
		
		//prepare the mouseovers
		for(x = 0; x < planets.Count; x++) {
		
			var butRect : Rect = prepButRect(map.map_bg.position, planets[x], map.buttons);
			DrawMouseOver(butRect, map.mouseOver, planets[x]);
			
		}
		
		
	
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
	else if(factionInfo.isHostile(planet.faction)){ //if planet is enemy
		useTexture = buttons.enemy;
	}
	else if(factionInfo.isAllied(planet.faction)) { //if planet is ally
		useTexture = buttons.ally;
	}
	else if(faction == planet.faction) { //if it belongs to your faction
		useTexture = buttons.own;
	}
	else { //if its neutral
		useTexture = buttons.neutral;
	}
	
	//prepare the Rect
	var butRect : Rect = prepButRect(mapRect, planet, buttons);
	
	//now its the button
	if(GUI.Button(butRect, useTexture, map.skin.GetStyle("ButtonMap"))) {
		
	
	
		if(planet.isScene(Application.loadedLevelName)){
			message.AddMessage("Already in the system.");
		} else { 
		
			if (!canWarp(planet)) {
				message.AddMessage("Not enough fuel.");
			} else {
				goWarp(planet.scene);
			}
		}
	
	}
	
	//var globalRect : Rect = new Rect(CoodX + areaRect.x, CoodY + areaRect.y, buttons.buttonRect.width, buttons.buttonRect.height);
	
		

}

private function canWarp(destiny : PlanetInfo) : boolean {
	
	var origin : PlanetInfo = findPlanet(Application.loadedLevelName);
	var player : GameObject = save.getPlayerShip();
	var fuel : ShipFuel = player.GetComponent(ShipFuel);
	return fuel.hasEnough(getDistance(origin, destiny));

}

/**
*This function draws a box when the mouse is over the button
*
*/
function DrawMouseOver(button : Rect, mouseover : OverRect, planet : PlanetInfo) {
	//check if the mouse is over the button
	if(button.Contains(Event.current.mousePosition)) {
		mouseover.Draw(button, planet);
		
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
*This function changes scene, and will play the warp animation,
*It accepts the destiny String as an argument
*/

function goWarp(destiny : String) {
	//map off
	swapStatus();
	
	
	
	//find player ship
	
	var playerShip : GameObject = save.getPlayerShip();
	
	//set particle system
	var warpParticles : GameObject[] = GameObject.FindGameObjectsWithTag("Warp");
	var warp : GameObject;
	for(var particle : GameObject in warpParticles) {
		if(particle.transform.parent.gameObject == playerShip) {
			warp = particle;
		}
	}
	
	if(warp) {
		var particles : ParticleSystem = warp.GetComponent(ParticleSystem);
		particles.Play();
	} else {
		Debug.LogWarning("Check Warp Particle system in " + playerShip.name);
	}
	
	//play warp anymation
	//play sound first (future) and wait 1.0 seconds
	
	//fade camera out
	var cam : Camera = Camera.main;
	var fade : FadeInOut = cam.GetComponent(FadeInOut);
	fade.fadeOut();
	
	//disableAllColliders(playerShip); //first disableAllColliders
	WaitForSeconds(warpWait);
	
	var warpDur : float = Time.time + warpTime;
	var mov : shipMovement = playerShip.GetComponent(shipMovement);
	mov.setWarp();
	while(Time.time < warpDur) {
		
		playerShip.rigidbody.velocity += playerShip.transform.forward * warpInc * Time.deltaTime;
		
		yield;
	
	}
	
	//unload fade
	fade.setFadeOff();
	//load new scene
	//show splash screen
	var go : GameObject = GameObject.FindGameObjectWithTag("LoadScene");
	var scr : LoadScene = go.GetComponent(LoadScene);
	scr.showScreen();
	
	//calculate dilithium costs
	var origin : PlanetInfo = findPlanet(Application.loadedLevelName);
	var dest : PlanetInfo = findPlanet(destiny);
	var distance : int = getDistance(origin, dest);
	
	//apply them
	var fuel : ShipFuel = playerShip.GetComponent(ShipFuel);
	fuel.consume(distance);
	
	//save game first
 	save.Save(destiny);
	
	
	
	scr.LoadScene(destiny);
	
}

//This function calculates the button position
function prepButRect(mapRect : Rect, planet : PlanetInfo, buttons : MapButtons) : Rect {
		var CoodX : int = (mapRect.width/2 + planet.cood.x) - (buttons.buttonRect.width/2);
		var CoodY : int = (mapRect.height/2 + planet.cood.y) - (buttons.buttonRect.height/2);
	
		var butRect : Rect = new Rect(CoodX, CoodY, buttons.buttonRect.width, buttons.buttonRect.height);
		return butRect;

}

function getPlanetInCurrentScene() : PlanetInfo {
	var scene : String = Application.loadedLevelName;
	return findPlanet(scene);
}


//this function finds a planet
function findPlanet(scene : String) : PlanetInfo {

	var planet :  PlanetInfo;
	
	var x : int = 0;
	while(x < planets.Count && planet == null) {
		if(planets[x].isScene(scene)) {
			
			planet = planets[x];
		
		}
		
		x++;
	
	}
	
	return planet;
	

}

function buildSceneLoadMessage() : String {
	var curScene : String = Application.loadedLevelName;
	var planet : PlanetInfo = findPlanet(curScene);
	var message : String = "You've arrived at " + planet.name + ".";	
	return message;

}

function getGalacticReputation() : int {
	
	var sum : int = 0;
	for(var planet : PlanetInfo in planets) {
		sum += planet.getReputation();
	}
	return sum / planets.Count;
	
	
}

function getCurrentReputation() : int {
	var curScene : String = Application.loadedLevelName;
	var planet : PlanetInfo = findPlanet(curScene);
	if(planet) {
		return planet.getReputation(); 
	} else {
		return 0;
	}
}

function getDistance(origin : PlanetInfo, destiny : PlanetInfo) : int{
	var a : Vector2 = new Vector2();
	if(origin) {
		a = new Vector2(origin.cood.x, origin.cood.y);
	}
	var b : Vector2 = new Vector2(destiny.cood.x, destiny.cood.y);
	return Vector2.Distance(a, b) * LIGHT_YEAR;

}

function getPlanetCount() : int {
	return planets.Count;
}

function getPlanetByNumber(num : int) : PlanetInfo {
	return planets[num];
}

function getPlanetBySceneName(scene : String) : PlanetInfo {
	for(var planet : PlanetInfo in planets) {
		if(planet.isScene(scene)) {
			return planet;
		}
	}
	return null;
}

function addReputationToEmpire(faction : int, amount : int) {
	for(var planet : PlanetInfo in planets) {
		if(planet.getFaction() == faction) {
			planet.addReputation(amount);
		}
	}

}

function serialize() : String {
	var serie : String = planets.Count + "\n";
	
	for(var planet : PlanetInfo in planets) {
		serie = serie + planet.serialize();
	}
	
	return serie; 
	  
}

function readFromFile(stream : StreamReader) {
	planets = getPlanetsList(stream);
}

private function getPlanetsList(stream : StreamReader) : List.<PlanetInfo> {
	var count : int = int.Parse(stream.ReadLine());
	var list : List.<PlanetInfo> = new List.<PlanetInfo>();
	for(var x : int = 0; x < count; x++) {
		var planet : PlanetInfo = new PlanetInfo(stream);
		list.Add(planet);
	}
	return list;
	
}
