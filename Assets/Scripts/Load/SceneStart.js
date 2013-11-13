//this class controls the scene loading
//its supposed to be placed ON THE PLANET

#pragma strict
var minRadius : float;
var maxRadius : float;







function Start () {
	playerStart();
}

//this function spawns the planets defense force
function spawnDefenseFleet() {


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
