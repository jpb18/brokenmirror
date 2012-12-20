#pragma strict
//this script includes everything about the ship, in Broken Mirror 3
//Horizontal Axis control ship left-right direction, Vertical Axis control top-bottom direction, ShipSpeed Axis controls the speed of the ship.
//Health and collision control is directly connected
//The ship must have a "collider" associated to control collisions

//<--------------Properties------------------------------>
//This part exists so the npc scripts can make assumption
var isPlayer : boolean = true; //true means it's the player ship, false means it's an npc
var faction : Faction; //0 means player faction, other factions to be considered
var shipName : String; //this var represents the ship name
var shipExplosion : Transform; //ship explosion type

class Faction {
		var faction : int; //this var represents the station faction
		var size : int;
		var enemyFactions : int[] = new int[size];
}

//<------Red Alert----------------->
var isRedAlert : boolean = false; //checks if the ship is in red alert



//<---------------movement------------------------------>
//these are to be replaced through stored variables
var agility : float = 90.0; //Agility of the craft, soon to be controled through stored variables. In degrees per second.
var speed : float = 10.0; //Speed of the craft, soon to be controled through stored variables

//frame dependent vars
var amountToMove : float; //amount of the movement 
var agilityFrame : float; //amount of rotation

//control vars
var curSpeed : float; //this one checks the object current speed
var SpeedStatus : float; //this one controls the state of the speed control, between -1 and 1;
var isReturn : boolean = false; //this one controls if any co-routine is in action

//<----------------health------------------------------------>
//these are to be replaced through stored variables

var maxHealth : float = 100.0; //ships maximum health
var health : float = 100.0; //Ship health, soon to be controled through stored variables.
var maxShields : float = 100.0; //ships maximum shields
var shields : float = 100.0; //Ships shields, soon to be controled through stored variables.
var isShieldRecharge : boolean = true; //checks if the shield recharge is on or not...
var shieldRechargeRate : float; //the shield recharge rate per second
var lastShieldHit : float; //the last time the shield was hit
var hitRechargeInterval : float; //the minimum time period between a hit and starting a recharge

//<---------------Collisions---------------------------------->
//control vars

var kineticStr : float; //this var controls the kinetic strenght of an object, calculated using E=mc^2

//<----------------Ship Properties------------------------------>
var isSmall : boolean; //this caracteristic is used to discover if a ship can enter or not in the atmosphere of a planet

//<-----------------GUI----------------------------------------->
var isLeaving : boolean = false;
var isPlanet : boolean = false;


private var planetGUI : boolean = false; //opens the planet GUI
private var stationGUI : boolean = false; //opens the station GUI
private var shipGUI : boolean = false; //opens the ship GUI




//<------------Weapons------------------------------>
var target : Transform;
var isForward : boolean = false; //Checks if the ship in question is forward firing only...

//beam/pulse
var phaserOverheated : boolean = false;
var heatLimit : float; //maximum weapon temperature
var heatDissipation : float; //amount of heat it dissipates each second when inactive
var curHeat : float; //current weapon temperature
var isBeam : boolean = false; //checks if the beam is being emited
var beam : GameObject; //beams game object
var shield_imp : GameObject; //phaser shield impact
var lastImp : float;
var intervalImp : float = 0.3f;


//pulse
var multiPulse : boolean; //checks if the ship can fire more than one pulse per shot
var pulseShot : int; //represents the number of pulses each shot has
var pulseWait : float; //waiting time between pulses if multiPulse = true
var pulseRecharge : float = 1.0f; //interval in seconds between each pulse fire
var nextPulse : float; //time when the next pulse can be fired
var isFiringPulse : boolean; //checks if the brel is firing when in multiPulse

	
//torpedo
var torpMaxLoad : int; //maximum number of simultaneously loaded torpedoes
var torpLoad : int; //current torpedo load count
var torpHold : float; //contains the maximum amount of torpedoes it can hold -- point sistem
var torpCount : int; //number of real torpedoes on hold
var torpRate : float; //interval between each torpedo launch, in seconds
var isReloading : boolean; //checks if the torpedoes are reloading
var reloadTime : float; //stores the reload time
var nextTorp : float; //time when the next torpedo can be fired


//energy
var energy : float; //ships current energy
var capacLimit : float; //capacitators limit
var reactor : float; //amount of energy the reactor can supply to the ship
var hasLostPower : boolean = false; //checks if the ship has recently lost power
var restartPoint : float; // in decimals the power restart point

//special habilities
var isCloaked : boolean = false; //checks if the ship is or not cloaked


//weapon class

class beam {
	var isPresent : boolean; //if the weapon is present
    var isBeam : boolean; //true if its beam, false if its pulse
    var name : String; //name of the weapon
    var description : String; //a description of the weapon
    var damage : float; //strenght of the weapon
    var shieldMulti : float; //multiplies the strenght of the weapon against shields
    var hullMulti : float; //multiples the strenght of the weapon against hulls
    var beam : GameObject; //beam gameObject
    var pulse : GameObject; //pulse gameObject
    var tile : Texture2D; //beam tile texture -- menu
    var heat : float; //represents the amount of heat that generates each second/shot
    var energyCons : float; //represents the weapon energy consuption each second/shot
    var range : float; //range in unity units
}

class torpedo {
	var isPresent : boolean; //if the weapon is present
	var name : String; //name of the weapon
    var torpedo : GameObject; //torpedo gameObject
    var energyCons : float; //represents the weapon energy consuption each shot
    var range : float; //range in unity units

}

enum Type {
		none,
		cloak,
		emp,
		thaleron
	}

class special {
	var isPresent : boolean; //if the weapon is present
	var name : String; //name of the special hability
	var description : String; //description
	var tile : Texture2D; //special tile texture -- menu
	var energyReq : float; //special hability energy requirement
	var minCool : float; //minimum cooldown time
	
	var type = Type.none;

}

class NextPress {
	var interval : float = 0.2f;
	var nextRedAlert : float;
	var nextSelect : float;
	var nextCloak : float;

}

//this class contains variables so that the script makes assumption for the nps (Non-Player Ships)
class botInfo {
	class botManeuverInfo {
		var isFacing : boolean = false;
		var changeStat : boolean = false;
		var isManeuvering : boolean = false;
		var manueverAngle : Vector3; //contains the normal maneuver angle
		var minTurnDist : float = 5; //minimum turning distance
		var maxTurnDist : float = 20; //maximum turning distance
	}
	
	
	class botSpeedInfo {
		var isSpeeding : boolean = false;
		
	}
	
	
	var speed : botSpeedInfo;
	var maneuvering : botManeuverInfo;

}

var weapon1 : beam; //main weapons, force the use of a beam or pulse weapon
var weapon2 : torpedo; //secondary weapon, force the use of a torpedo weapon
var weapon3 : special; //Special Hability... FORCE IT!
var nextPress : NextPress; //controls the mouse button clicks
var	bot : botInfo; //contains all revelant informations for the bots


//this function starts automatically everytime the script starts
function Start () {
	torpLoad = torpMaxLoad;
	energy = capacLimit;
	curHeat = 0;
}

//this function is executed every frame
function FixedUpdate () {

    if(isPlayer == true) //if the ship in question is the player ship
    {
    	if(hasLostPower == false)
    	{
		     player_movement(); //executes movement function
		     select_target_player(); //executes selection function
		     red_alert_player(); //checks red alert status
		     player_fire(); //controls fire from players
	    }
	     
	     
    }
    else //else
    {
    	if(hasLostPower == false)
    	{
    		bot_fire(); //controls the bot weapons
    		select_target_bot(); //selects a target for the bot and puts it in and out of red alert
    		bot_movement(); //controls the nps movement
    	}

    }
	kinstr(); //executed kinetic strenght function
	checkHealth(); //checks the ship health
	CheckTemperature(); //checks the weapons energy and temperature info...
	EnergyManagement(); //managing the ships energy
	ShieldRecharge(); //controls the shield recharge

}

//Engage red alert -- player



function red_alert_player() {

	
	if(Input.GetAxis("RedAlert") && Time.time >= nextPress.nextRedAlert)
	{
		
		if(isRedAlert != true)
		{
			isRedAlert = true;
			
		}
		else
		{
			isRedAlert = false;
		}
		nextPress.nextRedAlert = Time.time + nextPress.interval;

	
	}

}

//check health and shields
function checkHealth() {
	//hp
	if (health <= 0)
	{
		
		Destroy(gameObject);
		Instantiate(shipExplosion, transform.position, transform.rotation);
		
	}
	
	
	
	
	
	


}


//this function controls the ship movement -- player
function player_movement() {

	
	agilityFrame = agility * Time.deltaTime;
	
	//Movement
	//obtain movement variables
	var vert : float;
	var horz : float;
	
	if (isForward == true && isRedAlert == true && !Input.GetAxis("canRot"))
	{
		vert = Input.GetAxis("Mouse Y") * agility * Time.deltaTime;
		horz = Input.GetAxis("Mouse X") * agility * Time.deltaTime;
	}
	else
	{
		vert = Input.GetAxis("Vertical") * agilityFrame;
		horz = Input.GetAxis("Horizontal") * agilityFrame;
	}
	var rot = Input.GetAxis("Rotate") * agilityFrame;
		
	transform.Rotate(vert,horz,rot);
	
	
	
	//obtain speed variables
	amountToMove = speed * Time.deltaTime;
	
	//make sure that wheel status is not bigger than 1 or smaller than -1
	if (SpeedStatus <= 1 && SpeedStatus >= -1)
	{
		SpeedStatus += Input.GetAxis("ShipSpeed");
	}
	if(SpeedStatus > 1)
	{
		SpeedStatus = 1;
	}
	if(SpeedStatus < -1)
	{
		SpeedStatus = -1;
	}
	
	//stop if certain button is pressed
	if(Input.GetButton("FullStop"))
	{
		SpeedStatus = 0;
	}
	//multiply the wheelStatus with the amountToMove
	var fwd : float = SpeedStatus *  amountToMove;
	
	
	//give speed to the ship
	rigidbody.velocity = transform.forward * fwd;
	
	//place current velocity into control variable
	curSpeed = Vector3.Dot(transform.forward, rigidbody.velocity);
	
	
	
	

}

function select_target_player() {
	if(Input.GetAxis("Select")) //Check if the "Select" Axis was used
	{
		//check if any GUI is on, and if Red Alert mode is not activated
		if(shipGUI == false && planetGUI == false && stationGUI == false && isRedAlert == false && Time.time >= nextPress.nextSelect)
		{
			//vars needed for this
			var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
			var hit: RaycastHit;
			

			if(Physics.Raycast(ray, hit)) //check if it hits something
			{
				if(hit.transform != target) //check if it's the first click
				{
					if(hit.transform != transform)
					{
						target = hit.transform; //store the target
					}
				}
				else
				{
					if(hit.transform.tag == "Planet") //if a planet is clicked
					{
						planetGUI = true; //open the planet gui
					}
					
					if(hit.transform.tag == "Station") //if a station is clicked
					{
						stationGUI = true; //open the station gui
					}
					
					if(hit.transform.tag == "Ship") //if a ship is clicked
					{
						shipGUI = true; //open the ship gui
					}
				}
				
			}
			else //if not, deselects
			{
				target = null; //clean selected variable
			}
			nextPress.nextSelect = Time.time + nextPress.interval;
		}
	}
	
	if (isRedAlert == true)//if red alert in on
	{
		if (target == null) //and there's no target
		{
			
			var find : GameObject = FindClosestEnemy();
			
			if (find != null)
			{
				target = find.transform;
			}
			else
			{
				target = null;
			}
			
			
		
		}
	}
	
	
}

//this function controls the firing
function player_fire() {
	//check if the torpedoes are ready to fire
	if(isReloading == true && Time.time >= nextTorp)
	{
		torpLoad = torpMaxLoad;
		isReloading = false;
	}

	if (isRedAlert == true)
	{
		//if the player presses, fire the phasers
		fire_phaser_player();
		
		//if player presses the fire torpedoes
		fire_player_torpedo();
		
		
	
	
	 }
	
	
	
	//if player presses, activates special weapon
	if(Input.GetAxis("Fire3") && Time.time >= nextPress.nextCloak + nextPress.interval)
	{
		nextPress.nextCloak = Time.time;
		if ( weapon3.isPresent == true)
		{
			if(weapon3.type == Type.cloak)
			{
				if(isCloaked == false)
				{
					isCloaked = true;
				}
				else
				{
					isCloaked = false;
				}
			
			}
			
		}
		
	}
		


}

function kinstr() {
	//here, we calculate the kinetic strenght using the equation E=mc^2
	//however we must check if the speed is null 
	if (curSpeed == 0)
	{
	kineticStr = health + shields; //if the ship is in rest, than it's kinetic strenght is equal to its health
	}
	else
	{
		var speed : float;
		//now we must check if the speed is negative in order to invert it, else keep it that way
		if (curSpeed < 0)
		{
			speed = -curSpeed;
		}
		if (curSpeed > 0)
		{
			speed = curSpeed;
		}
		kineticStr = (shields + health) * (speed * speed); //now we apply the equation
		
		
	}
	
	if (kineticStr < health + shields) //if the kinetic strenght is smaller than the ships health
		{
			kineticStr = health + shields; //than make it equal to its health
		}
	
}

//this happens everytime our ship hits something
function OnCollisionEnter(collision : Collision) {
	//if the ship collides with a object tagged as a planet, kill the ship already.
	if (collision.gameObject.tag == "Planet")
	{
		health = 0;
	
	}
	
	//if the ship collides with another ship, campare the kinetic strenght with the health and shields, than act accordingly
	if (collision.gameObject.tag == "Ship") 
	{
		//get the other "ship" kinetic strenght
		
		var go = GameObject.Find(collision.gameObject.name); //obtain the game object
		var script = go.GetComponent(playerShip); //obtain the other control script
		var othKS = script.kineticStr; //obtain the oponents kinetic strenght
		
		
		
		//compare the kinetic strenght with shields first.
		if (shields > 0 && othKS > 0) //see if shields exist first and if there's any kinetic strenght
		{
			if (shields > othKS) //if the shields are stronger than the Kinetic Strenght of the other ship
			{
				shields = shields - othKS; //subtract kinetic strenght to shields
				othKS = 0; //neutralize kinetic strenght
			}
			else 
			{
				othKS = othKS - shields; //subtract shields to kinetic strenght
				shields = 0; //neutralize shields						
			}
		}
		
		if (health > 0 && othKS > 0) //check if there's any health and kinetic strenght left (just as a precaution)
		{
			if (health > othKS) //see if there's more health than incoming kinetic strenght
			{
				health = health - othKS; //subtract the kinetic strenght to health
				othKS = 0; //neutralize kinetic strenght
			}
			else //here we don't need to subtract, since it's final
			{
				health = 0; //neutralize health
			}
		}
		
		
		
		
		
		SpeedStatus = SpeedStatus / 2; //reduce speed by half
		
	}
	
	//if the ship collides with a station
	if (collision.gameObject.tag == "Station")
	{
	
		//get the station kinetic strenght (health + shields)
		var stat_go = collision.gameObject;
		var stat_scr : stationScript = stat_go.GetComponent(stationScript);
		var kin : float = stat_scr.health.health + stat_scr.health.shield;
		
		//compare the kinetic strenght with shields first.
		if (shields > 0 && kin > 0) //see if shields exist first and if there's any kinetic strenght
		{
			if (shields > kin) //if the shields are stronger than the Kinetic Strenght of the other ship
			{
				shields = shields - kin; //subtract kinetic strenght to shields
				kin = 0; //neutralize kinetic strenght
			}
			else 
			{
				kin = kin - shields; //subtract shields to kinetic strenght
				shields = 0; //neutralize shields						
			}
		}
		
		if (health > 0 && kin > 0) //check if there's any health and kinetic strenght left (just as a precaution)
		{
			if (health > kin) //see if there's more health than incoming kinetic strenght
			{
				health = health - kin; //subtract the kinetic strenght to health
				kin = 0; //neutralize kinetic strenght
			}
			else //here we don't need to subtract, since it's final
			{
				health = 0; //neutralize health
			}
		}
		
		
	
	}
	
	//if the ship collides with an asteroid, check if the shields are up, then act accordingly
	if (collision.gameObject.tag == "Asteroid")
	{
		var mass : float = collision.rigidbody.mass; //obtain asteroid mass
		var astscript = collision.gameObject.GetComponent(asteroids); //get the asteroid script
		var dmgRatio : float = astscript.dmgRatio; //get the damage ratio
		var damage : float = mass * dmgRatio; //calculate damage
	
		//check if the shields are up first
		if (shields > 0)
		{
			if (shields > damage) //check if you hame more shields than the damage that's going to be inflicted
			{
				shields -= damage; //subtract the damage to shields
			}
			else //in case you don't have enough shields
			{
				damage -= shields; //subtract the shield strenght to the damage
				shields = 0; //neutralize shields
				
			}
		}
		
		if (shields < 1) //if shields are lesser than 1 point, it will hit the hull
		{
			
			health -= damage; //subtract the damage to health
			
			
			
		
		}
	
	
	}
	
}


function OnTriggerEnter(collision : Collider) {
	

}

function OnTriggerExit(collision : Collider) {
	
}


function OnGUI () {
	
	if(isPlayer == true)
	{
	//Object selection
	if (target != null && target.transform != transform) //if there's an object selected
	{
		var go : GameObject;
		var name : String;
		var target_hp : float;
		var target_max_hp : float;
		var target_shield : float;
		var target_max_shield : float;
		
		if(target.tag == "Ship")
		{
			//obtain script
			go = target.gameObject;
			var ship_script : playerShip = go.GetComponent(playerShip);
			name = ship_script.shipName; //obtain ship name
			target_hp = ship_script.health;
			target_max_hp = ship_script.maxHealth;
			target_shield = ship_script.shields;
			target_max_shield = ship_script.maxShields;
		}
		else if(target.tag == "Station")
		{
			//obtain script
			go = target.gameObject;
			var stat_script : stationScript = go.GetComponent(stationScript);
			name = stat_script.properties.name; //obtain ship name
			target_hp = stat_script.health.health;
			target_max_hp = stat_script.health.maxHealth;
			target_shield = stat_script.health.shield;
			target_max_shield = stat_script.health.maxShield;
		}
		
		GUI.Label(Rect(Screen.width/2 - 100/2, 10, 100, 25), name); //print it's name in the screen...
		
		
			
		
		GUI.Label(Rect(Screen.width/2 - 100/2, 35, 100, 25), target_hp.ToString() + "/" + target_max_hp.ToString());
			
		//check if the target has shields and then show the shield info...
		
		
		if (target_shield > 0)
		{
				GUI.Label(Rect(Screen.width/2 - 100/2, 55, 100, 25), target_shield.ToString() + "/" + target_max_shield.ToString());
		}
		
		
		}
	
	
	
	
	
	//if it selects other ship, shows the ship menu
	if (shipGUI == true)
	{
	var obj = target.gameObject;
	var scr = obj.GetComponent(playerShip);
	
	var target_faction = scr.faction;
	var target_name = scr.shipName;
	
		if (target_faction == faction)
		{
			GUILayout.BeginArea(Rect(Screen.width/2 - Screen.width/4, Screen.height/2, Screen.width/2, Screen.height/2));
			
			GUILayout.BeginVertical("Ship Menu");
							//ask the question
							GUILayout.Label("Communications: " + target_name);
							GUILayout.BeginHorizontal();
								if(GUILayout.Button("Change Ships")) //if player wants to change ships
								{
									//change ships
									isPlayer = false;
									scr.isPlayer = true;
									var cam_scr = Camera.main.GetComponent(MouseOrbit);
									cam_scr.target = target;
									shipGUI = false;
																	
									
								}
								if(GUILayout.Button("Leave"))
								{
									shipGUI = false;
								
								}
								
							GUILayout.EndHorizontal();
							
			GUILayout.EndVertical();
			
			GUILayout.EndArea();
		}
	}
	
	
	GUI.Label(Rect(0,0,100,20), isRedAlert.ToString());
	GUI.Label(Rect(Screen.width - 100, 0, 100, 20), isCloaked.ToString());
	
	}

}

function FindClosestEnemy () : GameObject 
{

	
    // Find all game objects with tag Ship and Station
    var gos1 = new Array(GameObject.FindGameObjectsWithTag("Ship"));
    var gos2 = new Array(GameObject.FindGameObjectsWithTag("Station"));
    
    //Concat both arrays
    gos1 = gos1.Concat(gos2);
    
    var gos : GameObject[] = gos1.ToBuiltin(GameObject);
    
    
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
		    	if(CompareFaction(scr.faction.faction, faction.enemyFactions) && scr.isCloaked == false) //compares factions
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
	    	else if (go.tag == "Station")
	    	{
	    		var scrStation : stationScript = go.GetComponent(stationScript);
	    		if(CompareFaction(scrStation.properties.faction.faction, faction.enemyFactions) && scrStation.properties.isCloaked == false)
	    		{
	    		
	    			var diffStation = (go.transform.position - position);
	    			var curDistanceStation = diff.sqrMagnitude;
	    			if (curDistanceStation < distance)
	    			{
	    				closest = go;
	    				distance = curDistanceStation;
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

//this function controls the phaser beams or pulse phaser for the player
function fire_phaser_player() {
		
		//this controls the firing of 360º beam weapons
		if(Input.GetAxis("Fire1") && target != null && weapon1.isBeam == true && weapon1.isPresent == true && isForward == false && phaserOverheated == false && Vector3.Distance(transform.position, target.position) <= weapon1.range && hasLostPower == false && isCloaked == false)
		{
			phaser_fire_360();
		
		}
		//this part controls the firing of fixed pulsed weapons
		else if (Input.GetAxis("Fire1") && weapon1.isBeam == false && weapon1.isPresent == true && isForward == true && Time.time > nextPulse && phaserOverheated == false && hasLostPower == false && isCloaked == false)
		{
			if (multiPulse == false)
			{
				for (var cannon : GameObject in GameObject.FindGameObjectsWithTag("Phaser"))
				{
					if(cannon.transform.parent.parent.transform == transform)
					{
						var inst : GameObject = Instantiate(weapon1.pulse, cannon.transform.position, transform.rotation);
						var scr : pulseScript = inst.GetComponent(pulseScript);
						scr.launched = transform;
						nextPulse = Time.time + pulseRecharge;
						
					}
				
				}
				curHeat += weapon1.heat;
				energy -= weapon1.energyCons;
			}
			else
			{
				
				if(isFiringPulse == false)
				{
					var useCannons = new Array();
					for (var cannon : GameObject in GameObject.FindGameObjectsWithTag("Phaser"))
					{
						if(cannon.transform.parent.parent.transform == transform)
						{
							
							useCannons.Add(cannon);
							
							
							
						}
					
					}
					
					var cannons = useCannons.ToBuiltin(GameObject);
					

					
					isFiringPulse = true;
					StartCoroutine(pulseRapidFire(pulseWait, pulseRecharge, pulseShot, cannons));
				}
				
				
				
			}
			
			
		
		}
		else
		{
			isBeam = false;
			Destroy(beam);
			beam = null;
			curHeat -= heatDissipation * Time.deltaTime;
		}
	


}

//FIRE THE TORPEDOES! :D
function fire_player_torpedo() {

	if(Input.GetAxis("Fire2") && target != null && hasLostPower == false && Time.time >= nextTorp && Vector3.Distance(transform.position, target.position) <= weapon2.range && isCloaked == false)
		{
		
				fire_torpedo();
			
		}



}

//Checks the closest weapon of a certain type to a target
function CheckClosestWeapon  (weaponTag : String, parent : Transform) : GameObject
{
	var closest : GameObject;
	for (var weapon_go : GameObject in GameObject.FindGameObjectsWithTag(weaponTag))
	{
	
		if (closest != null)
		{
			if (weapon_go.transform.parent.parent.transform == parent)
			{
			
				var distance1 = Vector3.Distance(weapon_go.transform.position, target.position);
				var distance2 = Vector3.Distance(closest.transform.position, target.position);
				
				if (distance1 < distance2)
				{
					closest = weapon_go;
				}
			
			
			
			}
		
		
		}
		else
		{
			if (weapon_go.transform.parent.parent.transform == parent)
			{	
				closest = weapon_go;
			}
		
		}
	}
	return closest;



}

//checks the closest point to a phaser array
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

//this function is supposed to give the ability to fire a stream of several pulse with each click
function pulseRapidFire (wait : float, reload : float, shots : int, cannons : GameObject[]) {
	
	
	
	for (var x : int = 0; x < shots; x++)
	{
		for (var cannon : GameObject in cannons)
		{
			var inst : GameObject = Instantiate(weapon1.pulse, cannon.transform.position, transform.rotation);
			var scr : pulseScript = inst.GetComponent(pulseScript);
			scr.launched = transform;
			nextPulse = Time.time + pulseRecharge;
			
		}
		
	  	curHeat += weapon1.heat;
	  	energy -= weapon1.energyCons;
	  	yield WaitForSeconds(wait); 
	}  
	nextPulse = Time.time + pulseRecharge;
	isFiringPulse = false;

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

function CheckTemperature() {

	if(curHeat >= heatLimit && phaserOverheated == false)
	{
		curHeat = heatLimit;
		phaserOverheated = true;
	}
	else if (curHeat <= 0 && phaserOverheated == true)
	{
		curHeat = 0;
		phaserOverheated = false;
	}
	
	
	

}

function EnergyManagement () {

	if (energy < capacLimit)
	{
		energy += reactor * Time.deltaTime;
	}
	else
	{
		energy = capacLimit;
	}
	
	if (energy <= 0)
	{
		energy = 0;
		
		
		hasLostPower = true;
		
	}
	
	if (hasLostPower == true)
	{
		isShieldRecharge = false;
	}
	
	
	if (hasLostPower == true && energy >= capacLimit * restartPoint)
	{
		hasLostPower = false;
		isShieldRecharge = true;
		shields = 0;
	}

}

function ShieldRecharge () {

	if (hasLostPower == false && lastShieldHit + hitRechargeInterval >= Time.time && shields < maxShields && isShieldRecharge == true)
	{
		shields += shieldRechargeRate * Time.deltaTime;
	}


}


//bot firing control
function bot_fire() {
	//Check if the torpedoes are ready to fire
	if(isReloading == true && Time.time >= nextTorp)
	{
		torpLoad = torpMaxLoad;
		isReloading = false;
	}
	
	//firing 360º phaser beam
	if (isRedAlert == true && target != null && weapon1.isBeam == true && weapon1.isPresent == true && isForward == false && phaserOverheated == false  && Vector3.Distance(transform.position, target.position) <= weapon1.range && hasLostPower == false && isCloaked == false)
	{
		
		phaser_fire_360();
	}
	else
	{
		isBeam = false;
		Destroy(beam);
		beam = null;
		curHeat -= heatDissipation * Time.deltaTime;
	}
	
	
	//torpedo firing
	if (isRedAlert == true && target != null && weapon2.isPresent == true  && Time.time >= nextTorp && hasLostPower == false && Vector3.Distance(transform.position, target.position) <= weapon2.range && isCloaked == false)
	{
		fire_torpedo();
	}

}

function phaser_fire_360() {
			var close_phaser : GameObject = CheckClosestWeapon("Phaser", transform);
			var shield_hit : GameObject = CheckClosestPoint("ShieldPhaserImp", close_phaser, target.gameObject);
						
			var line_rend : LineRenderer;
			if (target.tag == "Ship")
			{
			
						
						var script : playerShip = target.GetComponent(playerShip);
						
						if(isBeam == false)
						{
							script.lastShieldHit = Time.time;

							//render the beam
							beam = Instantiate(weapon1.beam);
							beam.transform.parent = transform;
							line_rend = beam.GetComponent(LineRenderer);
							line_rend.SetPosition(0, close_phaser.transform.position);
							
							isBeam = true;
							
							//do damage
							
							if (script.isRedAlert == true && script.shields > 0)
							{
								line_rend.SetPosition(1, shield_hit.transform.position);
								script.shields -= weapon1.damage * weapon1.shieldMulti * Time.deltaTime;
								if(Time.time >= lastImp + intervalImp)
								{
									Instantiate(shield_imp, shield_hit.transform.position ,target.rotation);
									lastImp = Time.time;
								}
								
							
							}
							else
							{
								line_rend.SetPosition(1, target.transform.position);
								script.health -= weapon1.damage * weapon1.hullMulti * Time.deltaTime;
								
							}
							
							
							
							
							
						}
						else
						{
							script.lastShieldHit = Time.time;

							//orient the beam
							line_rend = beam.GetComponent(LineRenderer);
							line_rend.SetPosition(0, close_phaser.transform.position);
							
							//do damage
							
							if (script.isRedAlert == true && script.shields > 0)
							{
								line_rend.SetPosition(1, shield_hit.transform.position);
								script.shields -= weapon1.damage * weapon1.shieldMulti * Time.deltaTime;
								
								if(Time.time >= lastImp + intervalImp)
								{
									Instantiate(shield_imp, shield_hit.transform.position ,target.rotation);
									lastImp = Time.time;
								}
							
							}
							else
							{
								line_rend.SetPosition(1, target.transform.position);
								script.health -= weapon1.damage * weapon1.hullMulti * Time.deltaTime;
								
							}
						
						}
				
		
			
			}
			else if (target.tag == "Station")
			{
				
						var scriptStation : stationScript = target.GetComponent(stationScript);
						
						if(isBeam == false)
						{
							scriptStation.health.lastShieldHit = Time.time;
							//render the beam
							beam = Instantiate(weapon1.beam);
							beam.transform.parent = transform;
							line_rend = beam.GetComponent(LineRenderer);
							line_rend.SetPosition(0, close_phaser.transform.position);
							
							isBeam = true;
							
							//do damage
							
							if (scriptStation.health.shield > 0)
							{
								line_rend.SetPosition(1, shield_hit.transform.position);
								scriptStation.health.shield -= weapon1.damage * weapon1.shieldMulti * Time.deltaTime;
								
								if(Time.time >= lastImp + intervalImp)
								{
									Instantiate(shield_imp, shield_hit.transform.position ,target.rotation);
									lastImp = Time.time;
								}
								
							
							}
							else
							{
								line_rend.SetPosition(1, target.transform.position);
								scriptStation.health.health -= weapon1.damage * weapon1.hullMulti * Time.deltaTime;
								
							}
							
							
							
							
							
						}
						else
						{
							scriptStation.health.lastShieldHit = Time.time;
							//orient the beam
							line_rend = beam.GetComponent(LineRenderer);
							line_rend.SetPosition(0, close_phaser.transform.position);
							
							//do damage
							
							if (scriptStation.health.shield > 0)
							{
								line_rend.SetPosition(1, shield_hit.transform.position);
								scriptStation.health.shield -= weapon1.damage * weapon1.shieldMulti * Time.deltaTime;
								
								if(Time.time >= lastImp + intervalImp)
								{
									Instantiate(shield_imp, shield_hit.transform.position ,target.rotation);
									lastImp = Time.time;
								}
							
							}
							else
							{
								line_rend.SetPosition(1, target.transform.position);
								scriptStation.health.health -= weapon1.damage * weapon1.hullMulti * Time.deltaTime;
								
							}
						
						}
			}
			
			curHeat += weapon1.heat * Time.deltaTime;
			energy -= weapon1.energyCons * Time.deltaTime;	


}

function select_target_bot() {

	if(target == null)
	{
		target = FindClosestEnemy().transform;
		if (target != null && isRedAlert == false)
		{
			isRedAlert = true;
		}
		else
		{
			isRedAlert = false;
		}
	}

}

function fire_torpedo() {
	
		var close_torp : GameObject = CheckClosestWeapon("TorpLaunch", transform);
		var torp : GameObject = Instantiate(weapon2.torpedo, close_torp.transform.position, transform.rotation);
		
		var script = torp.GetComponent(torpedoScript);
		
		
		script.target = target.transform;
		script.launched = transform;
		
		energy -= weapon2.energyCons;
		
		torpLoad -= 1;
		if (torpLoad > 0)
		{
			nextTorp = Time.time + torpRate;
		}
		else
		{
		
			nextTorp = Time.time + reloadTime;
			isReloading = true;
		}

}

//this function will check if the target is cloaked
function CheckTargetCloak() {

	var go : GameObject = target.gameObject;
	if (go.tag == "Ship")
	{
		var scr_ship : playerShip = go.GetComponent(playerShip);
		if (scr_ship.isCloaked == true)
		{
			target == null;
		}
	}
	else if (go.tag == "Station")
	{
		var scr_station : stationScript = go.GetComponent(stationScript);
		if(scr_station.properties.isCloaked == true)
		{
			target == null;
		}
	}

}

//this function controls the bot movement
function bot_movement() {
	amountToMove = speed * Time.deltaTime;
	rigidbody.velocity = transform.forward * SpeedStatus * amountToMove;
	curSpeed = Vector3.Dot(transform.forward, rigidbody.velocity);
	
	if (isRedAlert == true && target != null)
	{
		combat_movement();
	}
	else
	{
	
	}



}

function combat_movement() {

	if(SpeedStatus <= 1)
	{
		if(bot.speed.isSpeeding == false)
		{
			
			StartCoroutine(bot_increase_speed(1));
			
		}
	}
	//Debug.Log(Vector3.Distance(transform.position, target.position).ToString());
	
	var distance1 : float = Vector3.Distance(target.position, transform.position); 
	if(distance1 >= bot.maneuvering.minTurnDist)
	{
		if (bot.maneuvering.isFacing == false && distance1 >= bot.maneuvering.maxTurnDist)
		{
			bot.maneuvering.changeStat = true;
		}
		if (transform.rotation != Quaternion.LookRotation(target.position - transform.position) && bot.maneuvering.isManeuvering == false)
		{
			
			StartCoroutine(LookAtTarget());
		}
	}
	else
	{
		if (bot.maneuvering.isFacing == true && distance1 <= bot.maneuvering.minTurnDist)
		{
			bot.maneuvering.changeStat = true;
		}
		else if (transform.rotation == Quaternion.LookRotation(target.position - transform.position) && bot.maneuvering.isManeuvering == false)
		{
			StartCoroutine(LookFromTarget());
		}
		
		
	}



}

//this function controls the bot speed increase
function bot_increase_speed(targetSpeed : float) {
	bot.speed.isSpeeding = true;
	var startSpeed : float = SpeedStatus;
	var i : float = startSpeed;
	var rate : float = Time.deltaTime;
	
	
	
	while (i < 1)
	{
		i += rate;
		
		SpeedStatus = Mathf.Lerp(startSpeed, targetSpeed, i);
		yield;
	}
	
	bot.speed.isSpeeding = false;

}

//this function controls the bot speed decrease
function bot_decrease_speed(targetSpeed : float) {
	bot.speed.isSpeeding = true;
	var startSpeed : float = SpeedStatus;
	var i : float = startSpeed;
	var rate : float = Time.deltaTime;
	
	while (i > targetSpeed)
	{
		i-= rate;
		SpeedStatus = Mathf.Lerp(targetSpeed, startSpeed, i);
		yield;
	}
	bot.speed.isSpeeding = false;
	
}

//this functions makes the ship to try to keep its nose on the target
function LookAtTarget () {
	bot.maneuvering.isManeuvering = true;
	var StartTarget : Transform = target;
	var i : float = 0;
	var targetPoint : Vector3 = StartTarget.position;
	var targetRotation = Quaternion.LookRotation(targetPoint - transform.position);
	var time : float = agility/((targetRotation.x + targetRotation.y + targetRotation.z)/3);
	var rate : float = 1/time;
	
	while (i < 1)
	{
		targetPoint = StartTarget.position;
		targetRotation = Quaternion.LookRotation(targetPoint - transform.position);
		if (StartTarget != target)
		{
			bot.maneuvering.isManeuvering = false;
			break;
		}
		
		if (bot.maneuvering.changeStat == true)
		{
			bot.maneuvering.changeStat = false;
			bot.maneuvering.isManeuvering = false;
			break;
		}
	
		i += rate * Time.deltaTime;
		transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, i);
		yield;
	
	}
	

	bot.maneuvering.isManeuvering = false;


}

function LookFromTarget() {
	bot.maneuvering.isManeuvering = true;
	var StartTarget : Transform = target;
	var v : float = 0;
	var targetPoint : Vector3 = StartTarget.position;
	var targetRotation = Quaternion.LookRotation(targetPoint - transform.position);
	var time : float = agility/((targetRotation.x + targetRotation.y + targetRotation.z)/3);
	var rate : float = 1/time;
	
	if (targetRotation.x > 0)
	{
		targetRotation.x += bot.maneuvering.manueverAngle.x;
	
	}
	else
	{
		targetRotation.x -= bot.maneuvering.manueverAngle.x;
	}
	
	if (targetRotation.y > 0)
	{
		targetRotation.y += bot.maneuvering.manueverAngle.y;
	}
	else
	{
		targetRotation.y -= bot.maneuvering.manueverAngle.y;
	}
	
	if(targetRotation.z > 0)
	{
		targetRotation.z += bot.maneuvering.manueverAngle.z;
	}
	else
	{
		targetRotation.z -= bot.maneuvering.manueverAngle.z;
	}
	
	while (v < 1)
	{
		
		if (StartTarget != target)
		{
			bot.maneuvering.isManeuvering = false;
			break;
		}
		
		if (bot.maneuvering.changeStat == true)
		{
			bot.maneuvering.changeStat = false;
			bot.maneuvering.isManeuvering = false;
			break;
		}
	
		v += rate * Time.deltaTime;
		Debug.Log(v.ToString());
		transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, v);
		yield;
	
	}
	

	bot.maneuvering.isManeuvering = false;

}