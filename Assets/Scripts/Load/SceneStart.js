//this class controls the scene loading
//its supposed to be placed ON THE PLANET

#pragma strict
var minRadius : float;
var maxRadius : float;

function Start () {
	playerStart();
	spawnDefenseFleet();
}

//this function spawns the planets defense fleet
function spawnDefenseFleet() {
	
	//first lets get the planet fleet
	var mapScr : MapInfo = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	var planet : PlanetInfo = mapScr.findPlanet(Application.loadedLevelName);
	
	var fleet : SaveShip[] = planet.getFleet();
	
	//now lets spawn it!
	for(var x : int = 0; x < fleet.length; x++) {
		
		Instantiate(fleet[x].getShip(), fixCoods(genSpawn(minRadius, maxRadius, transform)), Random.rotation);
		
	}
	

}


//this function spawns the player
function playerStart() {
	
	//get player info from SaveGame
	var save_scr : SaveGame = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(SaveGame);
	//get ship
	var playerShip : GameObject = save_scr.playerShip.getShip();
	//spawn game object looking at the planet
	playerShip = Instantiate(playerShip, fixCoods(genSpawn(minRadius, maxRadius, transform)), Quaternion.identity);
	playerShip.transform.LookAt(transform.position);
	
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




//this method fixes the coordinates so its relative to the game object

private function fixCoods(cood : Vector3) {
	return transform.position + cood;
}




//this method generates a random spawn point inside a sphere

static function genSpawn(min : float, max : float, trans : Transform) : Vector3 {
	var res : Vector3 = new Vector3(0,0,0);

	do {
	
		res = Random.insideUnitSphere * max;
	
	} while(Vector3.Distance(res, trans.position) < min);
	
	return res;	

}
