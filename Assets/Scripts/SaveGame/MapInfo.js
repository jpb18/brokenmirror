import System.Collections.Generic;
#pragma strict



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
	var popLabel : Rect;
	
	//skin
	var skin : GUISkin;
	
	public static final var POPULATION : String = "Population: {0:0.00} Billion";
	
	
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
			
			
			
			GUI.Label(faction_label, getFaction(planet), factionStyle); //Show planet faction
			
			
			
			GUI.Label(race_label, getRace(planet), factionStyle);// Show planet master race
			
			//Draw strenght label
			var strenght : int = planet.getStrenght();
			GUI.Label(strLabel, "Strength: " + strenght.ToString(), factionStyle);
			//Draw Population label
			GUI.Label(popLabel, String.Format(POPULATION, planet.getPopulation()), factionStyle);
			
			
		
		GUILayout.EndArea();
	
	
	}
	
	function getFaction(planet : PlanetInfo) : String {
		if(planet.isColonized) {
			
			var facInfo : FactionInfo = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo).factionInfo[planet.faction];
			return facInfo.factionName;
		} else {
			return "Unclaimed";
		}
	
	}
	
	function getRace(planet : PlanetInfo) : String {
		if(planet.isColonized) {
			var facInfo : FactionInfo = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo).factionInfo[planet.faction];
			return facInfo.factionRace.ToString();
		} else {
			return "Unpopulated";
		}
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
	
	
	var indicator : PulseIndicator;
	
	function DrawIndicator(location : Vector3, map : Rect) {
		indicator.Draw(location, map);
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
private var stardate : Stardate;
private var carry : SceneTransferCarry;

public static var LIGHT_YEAR : float = 2.9f;


function Start() {

	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	hud = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
	carry = GameObject.FindGameObjectWithTag("Transfer").GetComponent(SceneTransferCarry);
	var saveGo : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	save = saveGo.GetComponent(SaveGame);
	stardate = saveGo.GetComponent(Stardate);

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
	
	if(isCurrentPlanet(planet)) {
		drawHere(planet, mapRect);
	}
	
	
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

function drawHere(planet : PlanetInfo, map : Rect) {
	var pos : Vector2 = planet.cood.getVector();
	this.map.DrawIndicator(pos, map);
}

function isCurrentPlanet(planet : PlanetInfo) : boolean {
	var curScene : String = Application.loadedLevelName;
	return planet.scene == curScene;
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
	//fade.setFadeOff();
	//load new scene
	//show splash screen
	var go : GameObject = GameObject.FindGameObjectWithTag("LoadScene");
	var scr : LoadScene = go.GetComponent(LoadScene);
	//scr.showScreen();
	
	//calculate dilithium costs
	var origin : PlanetInfo = findPlanet(Application.loadedLevelName);
	var dest : PlanetInfo = findPlanet(destiny);
	var distance : int = getDistance(origin, dest);
	
	//apply them
	var fuel : ShipFuel = playerShip.GetComponent(ShipFuel);
	var consume : int = fuel.consume(distance);
	
	//calculate travel time;
	var time : int = getTime(origin, dest);
	carry.setCarry(time, consume, destiny);

	
	//message.AddMessage("Current Stardate: " + stardate.getCurrentStardate());
	
	//save game first
 	save.Save(destiny);
	
	
	
	scr.LoadScene();
	
}

//This function calculates the button position
function prepButRect(mapRect : Rect, planet : PlanetInfo, buttons : MapButtons) : Rect {
		var CoodX : int = (mapRect.width/2 + planet.cood.x) - (buttons.buttonRect.width/2);
		var CoodY : int = (mapRect.height/2 + planet.cood.y) - (buttons.buttonRect.height/2);
	
		var butRect : Rect = new Rect(CoodX, CoodY, buttons.buttonRect.width, buttons.buttonRect.height);
		return butRect;

}

function prepHereRect(mapRect : Rect, planet : PlanetInfo, rect : Rect) : Rect {
		var CoodX : int = (mapRect.width/2 + planet.cood.x) - (rect.width/2);
		var CoodY : int = (mapRect.height/2 + planet.cood.y) - (rect.height/2);
	
		var butRect : Rect = new Rect(CoodX, CoodY, rect.width, rect.height);
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

function getDistance(origin : PlanetInfo, destiny : PlanetInfo) : float{
	var a : Vector2 = new Vector2();
	if(origin) {
		a = new Vector2(origin.cood.x, origin.cood.y);
	}
	var b : Vector2 = new Vector2(destiny.cood.x, destiny.cood.y);
	return Vector2.Distance(a, b) * LIGHT_YEAR;

}

function getTime(origin : PlanetInfo, destiny : PlanetInfo) : float {
	var distance : float = getDistance(origin , destiny);
	var speed : float = calculateWarpSpeed(getPlayerWarpFactor());
	return distance/speed;

}

function calculateWarpSpeed(w : int) : float {
	var velocity : float;
	
	velocity = 1 * Mathf.Pow(w, 3.3333 + f(w));
	
	return velocity/365;
}

function getPlayerWarpFactor() : int {
	var player : GameObject = save.getPlayerShip();
	var props : shipProperties = player.GetComponent(shipProperties);
	return props.getWarpSpeed();
}

private function f(w : int) : float  {
	if(w > 9 && w <= 10) {
		return -0.5 * Mathf.Log10(10 - w);
	} else {
		return 0;
	}
	
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



function isPlayerOverlord() : boolean {
	for(var planet : PlanetInfo in planets) {
		if(planet.faction != 0) {
			return false;
		}
	}
	return true;

}

function getShipsByFaction(faction : int) : List.<SaveShip> {
	var list : List.<SaveShip> = new List.<SaveShip>();
	
	for(var planet : PlanetInfo in planets) {
		list.AddRange(planet.getDefenseShipsByFaction(faction));
	}
	
	return list;
	
}

function getPlanetsByFaction(faction : int) : List.<PlanetInfo> {
	var list : List.<PlanetInfo> = new List.<PlanetInfo>();
	for(var planet : PlanetInfo in planets) {
		if(planet.getFaction() == 0) {
			list.Add(planet);
		}
	}
	return list;
}

function setShipAsDefence(ship : GameObject) {
	var planet : PlanetInfo = getPlanetInCurrentScene();
	planet.addDefenseShip(ship);
}

function setMap(planets : List.<PlanetData>) {
	this.planets = new List.<PlanetInfo>();
	for(var planet : PlanetData in planets) {
		this.planets.Add(new PlanetInfo(planet));
	}
	
}

function setConstruction(construction : Construction) {

	var planet : PlanetInfo = getPlanetInCurrentScene();
	planet.addConstruction(construction);
	

}

function removeShipFromDefense(planet : String, ship : GameObject) {
	var p: PlanetInfo = findPlanet(planet);
	p.removeDefenseShip(ship);
}

function isMapOn() : boolean {
	return isMap;
}
