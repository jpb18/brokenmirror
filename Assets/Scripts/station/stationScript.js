//this script controls the station operation
#pragma strict

//this class contains all info about the station rotation
class Rotation {
	var itRotates : boolean = false; //this checks if the station rotates in it's Y axis
	var rotSpeed : float; //if it rotates, this is the speed in degrees per second
	enum axis { //create an enumeration for the editor, based on axis
		X,
		Y,
		Z
	}
	var axisRot = axis.Y; //difining the rotation axis
}

//this class contains all info about the stations health
class Health {
	var maxHealth : float; //here the max health of the station is stored
	var health : float; //here the current health of the station is stored
	var maxShield : float; //here the max shield strenght of the station is stored
	var shield : float; //here the current shield strenght of the station is stored
	var explosion : GameObject; //here the explosion of the station is stored
	

}

//this class contains all player-usefull information about the station
class Properties {
		//this subclass controls the enemy factions

	class Faction {
		var faction : int; //this var represents the station faction
		var size : int;
		var enemyFactions : int[] = new int[size];
	}
	var faction : Faction; //creating the faction class
	var name : String; //this var contains the station name
	var className : String; //this var contains the class name
	var description : String; //this var contains the station description
	var costProj : int; //this var contains the project cost in Credits
	var matCost : Materials; //this car contains the station cost in raw materials
	
	//this class contains the materials needed for something
	class Materials {
		var duranium : int; //duranium cost
	
	}
	

}


var rotation : Rotation; //creating rotation class
var health : Health; //creating the health class
var properties : Properties; //creating the properties class

function Start () {

}

function FixedUpdate() {
	Rotation();
	CheckHealth();
}

//this function processes the station rotation
function Rotation() {
	if (rotation.itRotates == true)
	{
		if(rotation.axisRot == rotation.axis.Y)
		{
			transform.Rotate(Vector3(0, rotation.rotSpeed * Time.deltaTime, 0));
		}
		else if (rotation.axisRot == rotation.axis.X)
		{
			transform.Rotate(Vector3(rotation.rotSpeed * Time.deltaTime, 0, 0));
		}
		else if (rotation.axisRot == rotation.axis.Z)
		{
			transform.Rotate(Vector3(0,0, rotation.rotSpeed * Time.deltaTime));
		}
	}
	
}

//this function processes the stations health
function CheckHealth() {

	if(health.health <= 0)
	{
		Instantiate(health.explosion, transform.position, transform.rotation);
		Destroy(gameObject);
	}


}