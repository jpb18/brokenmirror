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
private var music : PlaybackScript;
private var hud : HUDStatus;
private var load : LoadScene;

var invasion : boolean = true;
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

var merchantCount : int;
private var merchants : GameObject[];


function Start () {
	
	if(merchantCount == 0) {
		merchantCount = Random.value * 10;
	}

	//set SaveGame start
	music = GameObject.FindGameObjectWithTag("OST").GetComponent(PlaybackScript);
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	save_scr = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(SaveGame);
	mapScr = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	planet = mapScr.findPlanet(Application.loadedLevelName);
	hud = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
	load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
	save_scr.start = this;
	hud.show();

	playerStart();
	spawnDefenseFleet();
	spawnPlayerFleet();
	spawnStations();
	spawnMerchants();
	
	if(isPlayerEnemy()) {
		if(!music.getStatus(PlaybackStatus.HOSTILE)) music.setStatus(PlaybackStatus.HOSTILE);
	} else if (isPlayerAlly()) {
		if(!music.getStatus(PlaybackStatus.GOOD)) music.setStatus(PlaybackStatus.GOOD);
	} else {
		if(!music.getStatus(PlaybackStatus.NEUTRAL)) music.setStatus(PlaybackStatus.NEUTRAL);
	}
	
	//set new message
	message.AddMessage(mapScr.buildSceneLoadMessage());
	load.setOff();
	
	SetInventoryPanel();
	
}

protected function SetInventoryPanel() {
	//set inventory scene start component
	var go : GameObject = GameObject.FindGameObjectWithTag("GUI");
	var inv : InventoryPanel = go.GetComponent.<InventoryPanel>();
	inv.setSceneStart(this);
}

function Update () {

	checkInvasion();
	
	if(invasion && isInvasion && !isInvaded && Time.time > spawnTime) {
		spawnInvasion();
		
	}
	

}

function checkInvasion() {
	if(invasion && !isInvasion && Time.time > lastCheck + enemyInterval) {
		if(genRandom(maxProb) <= prob) {
			setInvasion();
				
		} 
		lastCheck = Time.time;
	}

}

//this function spawns the planets defense fleet
function spawnDefenseFleet() {
	
	//first lets get the planet fleet
	
	
	var fleet : List.<SaveShip> = planet.getFleet();
	var ship : GameObject;
	//now lets spawn it!
	for(var x : int = 0; x < fleet.Count; x++) {
		
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
	playerSpawn = genSpawn(minRadius, maxRadius, transform.position);
	playerShip.transform.position = playerSpawn;
	playerShip.transform.rotation = Quaternion.identity;
	playerShip.transform.LookAt(transform.position);
	playerDir = playerShip.transform.rotation;
	
	//sanitize name
	playerShip.name = save_scr.RemoveClone(playerShip.name);
	
	//just makign sure it has the right faction
	var fact : IFactionable = playerShip.GetComponent(typeof(IFactionable)) as IFactionable;
	fact.setFaction(0);
	
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

function getSpawnCoordinates() : Vector3 {
	return genSpawn(minRadius, maxRadius, transform.position);
}

//this method controls the invasion settings in the scene
function setInvasion() {
	
	var enemies : FactionInfo = getFaction();
	if(enemies.hasHostiles()) { //has enemies? if so, pick one

		factionToSpawn = enemies.pickRandomEnemy();
		toBeSpawned = setFleet(general.getFactionInfo(factionToSpawn).getFleet());
		spawnTime = Time.time + spawnEnemy;
		isInvasion = true;
		message.AddMessage(invasionMessage1 + general.getFactionInfo(factionToSpawn).getInfo().factionName + invasionMessage2 + spawnEnemy.ToString() + invasionMessage3);
	
	}

	if(!music.getStatus(PlaybackStatus.HOSTILE)) {
		music.setStatus(PlaybackStatus.HOSTILE);
	}

}


//this method will spawn an invasion fleet
function spawnInvasion () {
	if(toBeSpawned.Count > 0) {
		//first spawn the leader
		var leader : GameObject = spawnLeader(toBeSpawned);
		var faction : FactionInfo;	
		var props : shipProperties;
		var ai : ShipAI;
		var name : String;
		var s : GameObject;
		for(var ship : GameObject in toBeSpawned) {
			if(ship != leader) {
				s = Instantiate(ship, genSpawn(botMinRadius, botMaxRadius, leader.transform.position), leader.transform.rotation);
							
				//set properties
				props  = s.GetComponent(shipProperties);
				props.shipInfo.faction = factionToSpawn;
				faction  = general.getFactionInfo(factionToSpawn);
				name = faction.getRandomShipName();
				props.setPlayer(false);
				props.setName(name);
				
				
				//set leader
				ai = s.GetComponent(ShipAI);
				ai.leader = leader;
				
				//remove clone
				s.name = save_scr.RemoveClone(s.name);
			}
		
		}
		message.AddMessage(arriveMessage);
		isInvaded = true;
	} else {
		isInvasion = false;
	}

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
		var ship : GameObject = pickShip(fleetSetup);
		fleet.Add(ship);
	
	}
	
	return fleet;

}

function pickShip(fleet : List.<GameObject>) : GameObject {
	
	var ship : GameObject;
	var props : shipProperties;
	var prob : float;
	var num : int;
	do {
		num = Random.Range(0, fleet.Count);
		ship = fleet[num];
		props = ship.GetComponent(shipProperties);
		prob = 1/props.getStrenght();
		
	} while(prob < Random.value);
	
	return ship;
	
}

//this method gets the enemy list of the systems owner ship
function getFaction() : FactionInfo {
	return general.getFactionInfo(planet.faction);

}



function isPlayerEnemy() : boolean {
	
	var faction : FactionInfo = getFaction();
	
	
	return faction.isHostile(0);
}

function isPlayerAlly() : boolean {
	var faction : FactionInfo = getFaction();
	
	
	return faction.isAllied(0);
}

function cheat() {
	setInvasion();
}


function spawnMerchants() {
	
	merchants = new GameObject[merchantCount];
	for(var i : int = 0; i < merchantCount; i++) {
		merchants[i] = createMerchant();
	}

}

function createMerchant() : GameObject {
	var position : Vector3 = getSpawnCoordinates();
	var prefab : GameObject = general.getRandomMerchantShip();
	
	var ship : GameObject = Instantiate(prefab, position, new Quaternion());
	ship.transform.LookAt(transform.position);
	
	var mission : IMissionable = ship.GetComponent(typeof(IMissionable));
	mission.setMerchant();
	
	var faction : IFactionable = ship.GetComponent(typeof(IFactionable));
	var fac : int = general.getFactionIdByName("Non-Aligned");
	faction.setFaction(fac);
	
	return ship;
}

function LoadNewSquadShip(ship : GameObject) {
	playerFleet.Add(ship);
}
