//this script controls the torpedo firing for starbases
#pragma strict

class TorpStatus {
	//this subclass controls the enemy factions
	class Faction {
		var faction : int; //this var represents the station faction
		var size : int;
		var enemyFactions : int[] = new int[size];
	}
	var factions : Faction; //creatin the faction class
	var target : GameObject; //this var represents the target ship
	var cdTime : float; //this var contains the cooldown time
	var lastShot : float; //this var contains the last shot fired time
	var isLooking : boolean; //this ver controls if the targeting coroutine is on

}

var weapon : torpedo;
var status : TorpStatus;



// Use this for initialization
function Start () {
}

// Update is called once per frame
function FixedUpdate () {
	
	if(status.isLooking == false)
	{
		StartCoroutine(CheckTargetCoroutine(1));
	}
	fire_torpedo();
	
	
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

function fire_torpedo() {

	if(Time.time >= status.lastShot + status.cdTime && status.target != null && Vector3.Distance(transform.position, status.target.transform.position) <= weapon.range && weapon.isPresent == true)
	{
		var torp : GameObject = Instantiate(weapon.torpedo, transform.position, transform.rotation);
		
		var script = torp.GetComponent(torpedoScript);
		
		
		script.target = status.target.transform;
		script.launched = transform.parent.parent.transform;
		
		status.lastShot = Time.time;
	}
		
		


}

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