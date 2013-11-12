//this class controls the scene loading
//its supposed to be placed ON THE PLANET

#pragma strict
var spawnCood : Vector3; //Player spawn coordinates
var warpStop : Vector3; //Spot where the ship goes full stop






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
	playerShip = Instantiate(playerShip, fixCoods(spawnCood), Quaternion.identity);
	playerShip.transform.LookAt(transform.position);
	
	//sanitize name
	playerShip.name = save_scr.RemoveClone(playerShip.name);
	
	
	//set warp stop point
	var shipMov : shipMovement = playerShip.GetComponent(shipMovement);
	shipMov.start = this;
	
	//set camera
	var cam : GameObject = Camera.main.gameObject;
	var cam_scr = cam.GetComponent(MouseOrbit);
	cam_scr.target = playerShip.transform;
	

}




//this method fixes the coordinates so its relative to the game object

private function fixCoods(cood : Vector3) {
	return transform.position + cood;
}

public function getSpawn() {

	return fixCoods(spawnCood);

}

public function getWarp() {
	return fixCoods(warpStop);
}