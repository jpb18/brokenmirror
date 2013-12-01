//this class controls the scene loading
//its supposed to be placed ON THE PLANET

#pragma strict
var minRadius : float;
var maxRadius : float;
var playerSpawn : Vector3;
var playerDir : Quaternion;

var botMinRadius : float = 2.0f;
var botMaxRadius : float = 8.0f;

var playerShip : GameObject;

function Start () {
	playerStart();
	spawnDefenseFleet();
	spawnPlayerFleet();
}

//this function spawns the planets defense fleet
function spawnDefenseFleet() {
	
	//first lets get the planet fleet
	var mapScr : MapInfo = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	var planet : PlanetInfo = mapScr.findPlanet(Application.loadedLevelName);
	
	var fleet : SaveShip[] = planet.getFleet();
	
	//now lets spawn it!
	for(var x : int = 0; x < fleet.length; x++) {
		
		Instantiate(fleet[x].getShip(), genSpawn(minRadius, maxRadius, transform.position), Random.rotation);
		
	}
	

}


//this function spawns the player
function playerStart() {
	
	//get player info from SaveGame
	var save_scr : SaveGame = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(SaveGame);
	//get ship
	playerShip = save_scr.playerShip.getShip();
	//spawn game object looking at the planet
	playerSpawn = genSpawn(minRadius, maxRadius, transform.position);
	playerShip = Instantiate(playerShip, playerSpawn , Quaternion.identity);
	playerShip.transform.LookAt(transform.position);
	playerDir = playerShip.transform.rotation;
	
	//sanitize name
	playerShip.name = save_scr.RemoveClone(playerShip.name);
	
	

	
	//set camera
	var cam : GameObject = Camera.main.gameObject;
	var cam_scr = cam.GetComponent(MouseOrbit);
	cam_scr.target = playerShip.transform;
	
	//set new message
	var show : ShowMessage = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	var map : MapInfo = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	show.AddMessage(map.buildSceneLoadMessage());
	

}

function spawnPlayerFleet() {
	//get fleet info from SaveGame
	
	var save_scr : SaveGame = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(SaveGame);
	var size : int = save_scr.playerFleet.getSize();
	var shipSpawn : Vector3 = Vector3.zero;
	var botShip : GameObject;
	for(var x : int = 0; x < size; x++) {
		shipSpawn = genSpawn(botMinRadius, botMaxRadius, playerSpawn);
		botShip = Instantiate(save_scr.playerFleet.getShip(x), shipSpawn, playerDir);
		botShip.name = save_scr.RemoveClone(botShip.name);
		botShip.GetComponent(ShipAI).setLeader(playerShip);
		
	}

	

}



//this method generates a random spawn point inside a sphere with the center in trans

static function genSpawn(min : float, max : float, trans : Vector3) : Vector3 {
	var res : Vector3 = new Vector3(0,0,0);

	do {
	
		res = trans + Random.insideUnitSphere * max;
	
	} while(Vector3.Distance(res, trans) < min);
	
	return res;	

}
