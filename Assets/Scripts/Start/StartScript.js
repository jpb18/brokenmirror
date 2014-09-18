#pragma strict

var save : SaveGame;

function Start () {
	save = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(SaveGame);
	
	var ship : GameObject = save.getPlayerShip();
	var name : String = save.getPlayerShipName();
	
	var props : shipProperties = ship.GetComponent(shipProperties);
	props.setName(name);
	
	
	
}

