import System.Collections.Generic;
//this class controls the scene loading
//its supposed to be placed ON THE PLANET

#pragma strict
var minRadius : float;
var maxRadius : float;
private var playerSpawn : Vector3;
private var playerDir : Quaternion;

var botMinRadius : float = 2.0f;
var botMaxRadius : float = 8.0f;

var playerShip : GameObject;
var playerFleet : List.<GameObject>;
var defenseFleet : List.<GameObject>;
var stationList : List.<GameObject>;

private var save_scr : SaveGame;
private var mapScr : MapInfo;
private var planet : PlanetInfo;
private var message : ShowMessage;
private var general : GeneralInfo;


private var isInvasion : boolean = false;
private var isInvaded : boolean = false;
var spawnEnemy : float = 60.0f; //seconds
var enemyInterval : float = 30.0f; //seconds
var maxProb : int;
var prob : int;
private var lastCheck : float;
private var spawnTime : float; //this is when the enemy fleet will spawn
private var toBeSpawned : List.<GameObject>;
private var factionToSpawn : int;
var invasionMessage1 : String = "Incoming fleet from ";
var invasionMessage2 : String = ". ETA: ";
var invasionMessage3 : String = " seconds.";
var arriveMessage : String = "Hostile fleet has arrived.";
var fleetSize : int;


function Start () {
	//set SaveGame start
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	save_scr = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(SaveGame);
	mapScr = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	planet = mapScr.findPlanet(Application.loadedLevelName);
	save_scr.start = this;

	playerStart();
	spawnDefenseFleet();
	spawnPlayerFleet();
	spawnStations();
	
	
	//set new message
	message.AddMessage(mapScr.buildSceneLoadMessage());
}


function Update () {

	if(!isInvasion && Time.time > lastCheck + enemyInterval) {
		if(genRandom(maxProb) <= prob) {
			setInvasion();
			
		} 
		lastCheck = Time.time;
	}
	
	if(isInvasion && !isInvaded && Time.time > spawnTime) {
		spawnInvasion();
			
	}
	

}

//this function spawns the planets defense fleet
function spawnDefenseFleet() {
	
	//first lets get the planet fleet
	
	
	var fleet : SaveShip[] = planet.getFleet();
	var ship : GameObject;
	//now lets spawn it!
	for(var x : int = 0; x < fleet.length; x++) {
		
		ship = fleet[x].getShip();
		ship.transform.position =  genSpawn(minRadius, maxRadius, transform.position);
		ship.transform.rotation = Random.rotation;
		defenseFleet.Add(ship);
		ship.GetComponent(ShipAI).setDefence();
		ship.name = save_scr.RemoveClone(ship.name);
		
		
	}
	

}


//this function spawns the player
function playerStart() {
	
	
	//get ship
	playerShip = save_scr.playerShip.getShip();
	//spawn game object looking at the planet
	playerShip.transform.position = genSpawn(minRadius, maxRadius, transform.position);
	playerShip.transform.rotation = Quaternion.identity;
	playerShip.transform.LookAt(transform.position);
	playerDir = playerShip.transform.rotation;
	
	//sanitize name
	playerShip.name = save_scr.RemoveClone(playerShip.name);
	

	
	//set camera
	var cam : GameObject = Camera.main.gameObject;
	var cam_scr = cam.GetComponent(MouseOrbit);
	cam_scr.target = playerShip.transform;
	
	
	

}

//spawn the player fleet
function spawnPlayerFleet() {
	//get fleet info from SaveGame
	
	
	var size : int = save_scr.playerFleet.getSize();
	var shipSpawn : Vector3 = Vector3.zero;
	var botShip : GameObject;
	for(var x : int = 0; x < size; x++) {
		shipSpawn = genSpawn(botMinRadius, botMaxRadius, playerSpawn);
		botShip = save_scr.playerFleet.getShip(x);
		botShip.transform.rotation = playerDir;
		botShip.transform.position = shipSpawn;
		botShip.name = save_scr.RemoveClone(botShip.name);
		botShip.GetComponent(ShipAI).setLeader(playerShip);
		playerFleet.Add(botShip);
		
	}

	

}


//spawn the stations
function spawnStations() {
	//get stations
	var stations : List.<SaveStation> = planet.stations;
	var station : GameObject;
	
	//lets spawn them!
	for(var stat : SaveStation in stations) {
		station = stat.getStation();
		station = Instantiate(station, station.transform.position, station.transform.rotation);
		station.name = save_scr.RemoveClone(station.name);
		stationList.Add(station);
	
	}
	


}

//this method generates a random number between 0 and max
//pre: max > 0
static function genRandom(max : int) : int {
	return Random.value * max;
}

//this method generates a random spawn point inside a sphere with the center in trans

static function genSpawn(min : float, max : float, trans : Vector3) : Vector3 {
	var res : Vector3 = new Vector3(0,0,0);

	do {
	
		res = trans + Random.insideUnitSphere * max;
	
	} while((res - trans).sqrMagnitude < min * min);
	
	return res;	

}

//this method controls the invasion settings in the scene
function setInvasion() {
	
	var enemies : int[] = getEnemies();
	if(enemies.Length > 0) { //has enemies? if so, pick one
		var num : int = 0;
		num  = genRandom(enemies.Length - 2);
		factionToSpawn = num + 1;
		toBeSpawned = setFleet(general.getFactionInfo(factionToSpawn).invasionFleet);
		spawnTime = Time.time + spawnEnemy;
		isInvasion = true;
		message.AddMessage(invasionMessage1 + general.getFactionInfo(factionToSpawn).getInfo().factionName + invasionMessage2 + spawnEnemy.ToString() + invasionMessage3);
	
	}



}


//this method will spawn an invasion fleet
function spawnInvasion () {

	//first spawn the leader
	var leader : GameObject = spawnLeader(toBeSpawned);
	
	
	
	for(var ship : GameObject in toBeSpawned) {
		if(ship != leader) {
			var s : GameObject = Instantiate(ship, genSpawn(botMinRadius, botMaxRadius, leader.transform.position), leader.transform.rotation);
						
			//set properties
			var props : shipProperties = s.GetComponent(shipProperties);
			props.shipInfo.faction = factionToSpawn;
			props.playerProps.isPlayer = false;
			
			//set leader
			var ai : ShipAI = s.GetComponent(ShipAI);
			ai.leader = leader;
			
			//remove clone
			s.name = save_scr.RemoveClone(s.name);
		}
	
	}
	message.AddMessage(arriveMessage);
	isInvaded = true;

}


function spawnLeader(fleet : List.<GameObject>) : GameObject {
	var leader : GameObject = fleet[0];
	
	for(var x : int = 1; x < fleet.Count; x++) {
		var curStr : float = leader.GetComponent(shipProperties).shipProps.shipStrenght;
		var nxStr : float = fleet[x].GetComponent(shipProperties).shipProps.shipStrenght;
		
		if(curStr < nxStr) {
			leader = fleet[x];
		
		}
			
	}
	
	leader = Instantiate(leader, genSpawn(minRadius, maxRadius, transform.position), Quaternion.identity);
	leader.transform.LookAt(transform.position);
	
	//set properties
	var props : shipProperties = leader.GetComponent(shipProperties);
	props.shipInfo.faction = factionToSpawn;
	props.playerProps.isPlayer = false;
	//remove clone
	leader.name = save_scr.RemoveClone(leader.name);
	
	
	return leader;
}


//this method sets an invading fleet
function setFleet(fleetSetup : List.<GameObject>) : List.<GameObject> {
	var fleet : List.<GameObject> = new List.<GameObject>();
	
	for(var x : int = 0; x < fleetSize; x++) {
		var num : int = genRandom(fleetSetup.Count - 1);
		fleet.Add(fleetSetup[num]);
	
	}
	
	return fleet;

}

//this method gets the enemy list of the systems owner ship
function getEnemies() : int[] {
	return general.getFactionInfo(planet.faction).hostileFactions;

}

