//this script controls the weapon control of the phaser beams
#pragma strict
//This class contains the control vars of the phaser point
class Status {
	//this subclass controls the enemy factions
	class Faction {
		var faction : int; //this var represents the station faction
		var size : int;
		var enemyFactions : int[] = new int[size];
	}
	var factions : Faction; //creatin the faction class
	var target : GameObject; //this var represents the target ship
	var beam : GameObject; //this var represents the current beam in use
	var startEnergy : float; //this var represents the starting energy of the phaser point
	var curEnergy : float; //this var represents the current energy of the phaser point
	var rechargeRate : float; //this var represents the recharge rate of the energy
	var isFiring : boolean; //this var checks if the weapon is firing
	var firingBeam : GameObject; //this var contains the beam that's currently being fired
	var curImpact : GameObject; //this var contains the current shield impact
	var canFire : boolean; //this var controls if the weapon can fire or not
	var isLooking : boolean; //this var controls if the weapon is or not looking for a target
}

//This class contains the weapon information
class Beam {
	var isPresent : boolean; //if the weapon is present
    var isBeam : boolean; //true if its beam, false if its pulse
    var name : String; //name of the weapon
    var description : String; //a description of the weapon
    var damage : float; //strenght of the weapon
    var shieldMulti : float; //multiplies the strenght of the weapon against shields
    var hullMulti : float; //multiples the strenght of the weapon against hulls
    var beam : GameObject; //beam gameObject
    var pulse : GameObject; //pulse gameObject
    var energyCons : float; //beams energy consuption each second
    var shieldImp : GameObject; //this var contains the shield impact
    var lastImp : float; //checks the time the last shield impact has been generated
    var intervalImp : float = 0.3f; //the time period between each shield impact generation
    var range : float; //phaser range in unity units
}

var beam : Beam; //Creating the beam/pulse class
var status : Status; //Creating the status class

function Start () {
	
	
	//set the starting energy
	status.curEnergy = status.startEnergy;

}

function FixedUpdate () {
	
	FirePhaser();
	CheckEnergy();
	if(status.isLooking == false)
	{
		StartCoroutine(CheckTargetCoroutine(1));
	}
	

}

function CheckEnergy() {
	if (status.curEnergy <= 0 && status.canFire == true)
	{
		status.curEnergy = 0;
		status.canFire = false;
	}
	else if (status.curEnergy >= status.startEnergy && status.canFire == false)
	{
		status.curEnergy = status.startEnergy;
		status.canFire = true;
	}
	status.curEnergy += status.rechargeRate * Time.deltaTime;

}

function ConfirmFactionInfo() {
	//set the phaser faction information
	var go : GameObject = transform.parent.parent.transform.gameObject;
	var script : stationScript = go.GetComponent(stationScript);
	status.factions.faction = script.properties.faction.faction;
	status.factions.size = script.properties.faction.size;
	status.factions.enemyFactions = script.properties.faction.enemyFactions;
}

function FindClosestEnemy () : GameObject 
{
    // Find all game objects with tag Ship
    var gos : GameObject[];
    gos = GameObject.FindGameObjectsWithTag("Ship");
    var closest : GameObject; 
    var distance = Mathf.Infinity; 
    var position = transform.position;
    
    // Iterate through them and find the closest one
    
    
    if (gos != null)
    {
	    for (var go : GameObject in gos)  
	    {
	    	if (go.tag == "Ship")
	    	{
		    	var scr : playerShip = go.GetComponent(playerShip); //get ship control script
		    	if(CompareFaction(scr.faction.faction, status.factions.enemyFactions) && scr.isCloaked == false) //compares factions
		    	{
		      
			        var diff = (go.transform.position - position);
			        var curDistance = diff.sqrMagnitude; 
			        if (curDistance < distance) 
			        { 
			            closest = go; 
			            distance = curDistance; 
			        }
			        
		    	}
	    	}
	    	
	       
		}
		return closest; 
	}
	else
	{
		return null;
	}
	
}

//This function will be used to compare the values between a single int and a int array
function CompareFaction (targetValue : int, array : int[]) : boolean {

	var isTrue : boolean = false;
	for (var faction : int in array)
	{
		if (faction == targetValue)
		{
			isTrue = true;
			break;
		}
		
	
	}
	
	return isTrue;


}

function FirePhaser() {
	var distance1 : float = Vector3.Distance(status.target.transform.position, transform.position);
	var distance2 : float = Vector3.Distance(transform.parent.parent.transform.position, status.target.transform.position);
	if (status.target != null && beam.isBeam == true && beam.isPresent == true && status.canFire == true && distance1 <= beam.range && distance1 < distance2 )
	{				
		var shield_hit : GameObject = CheckClosestPoint("ShieldPhaserImp", gameObject, status.target);
		var line_rend : LineRenderer;
		
		var script : playerShip = status.target.GetComponent(playerShip);
		if(status.isFiring == false)
		{
			script.lastShieldHit = Time.time;

			//render the beam
			status.firingBeam = Instantiate(beam.beam);
			status.firingBeam.transform.parent = transform;
			line_rend = status.firingBeam.GetComponent(LineRenderer);
			line_rend.SetPosition(0, transform.position);
			
			status.isFiring = true;
			
			//do damage
			
			if (script.isRedAlert == true && script.shields > 0)
			{
				line_rend.SetPosition(1, shield_hit.transform.position);
				script.shields -= beam.damage * beam.shieldMulti * Time.deltaTime;
				if(Time.time >= beam.intervalImp + beam.lastImp)
				{
					Instantiate(beam.shieldImp, shield_hit.transform.position, status.target.transform.rotation);
					beam.lastImp = Time.time;
				}
				
			
			}
			else
			{
				line_rend.SetPosition(1, status.target.transform.position);
				script.health -= beam.damage * beam.hullMulti * Time.deltaTime;
				
			}
			
			
			
			
			
		}
		else
		{
			script.lastShieldHit = Time.time;

			//orient the beam
			line_rend = status.firingBeam.GetComponent(LineRenderer);
			line_rend.SetPosition(0, transform.position);
			
			//do damage
			
			if (script.isRedAlert == true && script.shields > 0)
			{
				line_rend.SetPosition(1, shield_hit.transform.position);
				script.shields -= beam.damage * beam.shieldMulti * Time.deltaTime;
				if(Time.time >= beam.intervalImp + beam.lastImp)
				{
					Instantiate(beam.shieldImp, shield_hit.transform.position, status.target.transform.rotation);
					beam.lastImp = Time.time;
				}
				
				
			}
			else
			{
				line_rend.SetPosition(1, status.target.transform.position);
				script.health -= beam.damage * beam.hullMulti * Time.deltaTime;
				
			}
		
		}
		
		status.curEnergy -= beam.energyCons * Time.deltaTime;
		
		

	}
	else
	{
		status.isFiring = false;
		Destroy(status.firingBeam);
		status.firingBeam = null;
	}


}

function CheckClosestPoint (tag : String, close_phaser : GameObject, parent : GameObject)
{
	var closest : GameObject;
	for (var go : GameObject in GameObject.FindGameObjectsWithTag(tag))
	{ 
		if (closest != null)
		{
			if (go.transform.parent.parent.gameObject == parent)
			{
			
				var distance1 = Vector3.Distance(go.transform.position, close_phaser.transform.position);
				var distance2 = Vector3.Distance(closest.transform.position, close_phaser.transform.position);
				
				if (distance1 < distance2)
				{
					closest = go;
				}
			
			
			
			}
		
		}
		else
		{
			if(go.transform.parent.parent.gameObject == parent)
			{
				closest = go;
			}
		}
	
	
	}
	
	return closest;

}

function CheckTargetCloak() {

	var go : GameObject = status.target;
	if (go.tag == "Ship")
	{
		var scr_ship : playerShip = go.GetComponent(playerShip);
		if (scr_ship.isCloaked == true)
		{
			status.target == null;
		}
	}
	else if (go.tag == "Station")
	{
		var scr_station : stationScript = go.GetComponent(stationScript);
		if(scr_station.properties.isCloaked == true)
		{
			status.target == null;
		}
	}

}

function CheckTargetCoroutine(time : float)
{
	ConfirmFactionInfo();
	status.isLooking = true;
	status.target = FindClosestEnemy();
	
	yield WaitForSeconds(time);
	status.isLooking = false;

}