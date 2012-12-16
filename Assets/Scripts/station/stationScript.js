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
	var shieldRechargeRate : float; //the shield recharge rate per second
	var lastShieldHit : float; //the last time the shield was hit
	var hitRechargeInterval : float; //the minimum time period between a hit and starting a recharge
	

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
	ShieldRecharge();
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

//this function pressesses the shield recharge
function ShieldRecharge() {

	if (health.lastShieldHit + health.hitRechargeInterval <= Time.time && health.shield < health.maxShield)
	{
		health.shield += health.shieldRechargeRate * Time.deltaTime;
	}
	
	

}

//Collision
function OnCollisionEnter(collision : Collision) {

	if (collision.gameObject.tag == "Ship") 
	{
		//get the other "ship" kinetic strenght
		
		var go = GameObject.Find(collision.gameObject.name); //obtain the game object
		var script = go.GetComponent(playerShip); //obtain the other control script
		var othKS = script.kineticStr; //obtain the oponents kinetic strenght
		
		
		
		//compare the kinetic strenght with shields first.
		if (health.shield > 0 && othKS > 0) //see if shields exist first and if there's any kinetic strenght
		{
			if (health.shield > othKS) //if the shields are stronger than the Kinetic Strenght of the other ship
			{
				health.shield = health.shield - othKS; //subtract kinetic strenght to shields
				othKS = 0; //neutralize kinetic strenght
			}
			else 
			{
				othKS = othKS - health.shield; //subtract shields to kinetic strenght
				health.shield = 0; //neutralize shields						
			}
		}
		
		if (health.health > 0 && othKS > 0) //check if there's any health and kinetic strenght left (just as a precaution)
		{
			if (health.health > othKS) //see if there's more health than incoming kinetic strenght
			{
				health.health = health.health - othKS; //subtract the kinetic strenght to health
				othKS = 0; //neutralize kinetic strenght
			}
			else //here we don't need to subtract, since it's final
			{
				health.health = 0; //neutralize health
			}
		}
		
		
		
		
		
		
		
	}

}