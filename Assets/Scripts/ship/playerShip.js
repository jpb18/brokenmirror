#pragma strict
//this script includes everything about the ship, in Broken Mirror 3
//Horizontal Axis control ship left-right direction, Vertical Axis control top-bottom direction, ShipSpeed Axis controls the speed of the ship.
//Health and collision control is directly connected
//The ship must have a "collider" associated to control collisions

//<--------------Properties------------------------------>
//This part exists so the npc scripts can make assumption
var isPlayer : boolean = true; //true means it's the player ship, false means it's an npc
var faction : int = 0; //0 means player faction, other factions to be considered
var shipName : String; //this var represents the ship name
var shipExplosion : Transform; //ship explosion type

//<------Red Alert----------------->
var isRedAlert : boolean = false; //checks if the ship is in red alert
var timeInterval : float = 0.5f; //trying to reduce the sensitivy of the Red Alert Button
var nextPress : float; //time when you can press the button again


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
var heatLimit : float; //maximum weapon temperature
private var curHeat : float; //current weapon temperature
private var isBeam : boolean = false; //checks if the beam is being emited
private var beam : GameObject; //beams game object
var shield_imp : GameObject; //phaser shield impact
var phaser_flare : GameObject; //phaser exit flare

//pulse
var multiPulse : boolean; //checks if the ship can fire more than one pulse per shot
var pulseShot : int; //represents the number of pulses each shot has
var pulseWait : float; //waiting time between pulses if multiPulse = true
var pulseRecharge : float = 1.0f; //interval in seconds between each pulse fire
private var nextPulse : float; //time when the next pulse can be fired
private var isFiringPulse : boolean; //checks if the brel is firing when in multiPulse

	
//torpedo
var torpMaxLoad : int; //maximum number of simultaneously loaded torpedoes
private var torpLoad : int; //current torpedo load count
var torpHold : float; //contains the maximum amount of torpedoes it can hold -- point sistem
var torpCount : int; //number of real torpedoes on hold
var torpRate : float; //interval between each torpedo launch, in seconds
private var isReloading : boolean; //checks if the torpedoes are reloading
var reloadTime : float; //stores the reload time

private var nextTorp : float; //time when the next torpedo can be fired


//special hability
var energy : float; //energy for the hability


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
}

class torpedo {
	var isPresent : boolean; //if the weapon is present
	var name : String; //name of the weapon
    var description : String; //a description of the weapon
    var torpSize : float; //size of a torpedo -- point sistem
    var damage : float; //strenght of the weapon
    var shieldMulti : float; //multiplies the strenght of the weapon against shields
    var hullMulti : float; //multiples the strenght of the weapon against hulls
    var torpedo : GameObject; //torpedo gameObject
    var tile : Texture2D; //torpedo tile texture -- menu
    var speed : float; //torpedo speed

}

class special {
	var isPresent : boolean; //if the weapon is present
	var name : String; //name of the special hability
	var description : String; //description
	var tile : Texture2D; //special tile texture -- menu
	var energyReq : float; //special hability energy requirement
	var minCool : float; //minimum cooldown time
	

}

var weapon1 : beam; //main weapons, force the use of a beam or pulse weapon
var weapon2 : torpedo; //secondary weapon, force the use of a torpedo weapon
var weapon3 : special; //Special Hability... FORCE IT!



//this function starts automatically everytime the script starts
function Start () {
	torpLoad = torpMaxLoad;
}

//this function is executed every frame
function FixedUpdate () {

    if(isPlayer == true) //if the ship in question is the player ship
    {
	     player_movement(); //executes movement function
	     select_target_player(); //executes selection function
	     red_alert_player(); //checks red alert status
	     player_fire(); //controls fire from players
	     
	     
    }
    else //else
    {

    }
	kinstr(); //executed kinetic strenght function
	checkHealth(); //checks the ship health
	

}

//Engage red alert -- player



function red_alert_player() {

	
	if(Input.GetAxis("RedAlert") && Time.time >= nextPress)
	{
		
		if(isRedAlert != true)
		{
			isRedAlert = true;
			
		}
		else
		{
			isRedAlert = false;
		}
		nextPress = Time.time + timeInterval;

	
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
	var vert = Input.GetAxis("Vertical") * agilityFrame;
	var horz = Input.GetAxis("Horizontal") * agilityFrame;
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
		if(shipGUI == false && planetGUI == false && stationGUI == false && isRedAlert == false)
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
	if(Input.GetAxis("Fire3"))
	{
		if (target != null)
			{
			
			}
			else
			{
			
			
			}
		
	}
		


}

function kinstr() {
	//here, we calculate the kinetic strenght using the equation E=mc^2
	//however we must check if the speed is null 
	if (curSpeed == 0)
	{
	kineticStr = health; //if the ship is in rest, than it's kinetic strenght is equal to its health
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
		kineticStr = health * (speed * speed); //now we apply the equation
		
		
	}
	
	if (kineticStr < health) //if the kinetic strenght is smaller than the ships health
		{
			kineticStr = health; //than make it equal to its health
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
	if (collision.gameObject.tag == "Ship" || collision.gameObject.tag == "Station") //Ship tags include starbases and other ships
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
	
	
	GUI.Label(Rect(0,0,20,100), isRedAlert.ToString());
	}

}

function FindClosestEnemy () : GameObject 
{
    // Find all game objects with tag Ship
    var gos : GameObject[];
    gos = GameObject.FindObjectsOfType(GameObject);
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
		    	if(scr.faction != faction) //compares factions
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
	    		if(scrStation.properties.faction != faction)
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
		if(Input.GetAxis("Fire1") && target != null && weapon1.isBeam == true && weapon1.isPresent == true && isForward == false)
		{
			var close_phaser : GameObject = CheckClosestWeapon("Phaser", transform);
			var shield_hit : GameObject = CheckClosestPoint("ShieldPhaserImp", close_phaser, target.gameObject);
						
			var line_rend : LineRenderer;
			if (target.tag == "Ship")
			{
			
						
						var script : playerShip = target.GetComponent(playerShip);
						
						if(isBeam == false)
						{
							//render the beam
							beam = Instantiate(weapon1.beam);
							line_rend = beam.GetComponent(LineRenderer);
							line_rend.SetPosition(0, close_phaser.transform.position);
							line_rend.SetPosition(1, shield_hit.transform.position);
							isBeam = true;
							
							//do damage
							
							if (script.isRedAlert == true && script.shields > 0)
							{
								script.shields -= weapon1.damage * weapon1.shieldMulti * Time.deltaTime;
								
								Instantiate(shield_imp, shield_hit.transform.position ,target.rotation);
								
							
							}
							else
							{
								script.health -= weapon1.damage * weapon1.hullMulti * Time.deltaTime;
								
							}
							
							
							
							
							
						}
						else
						{
							//orient the beam
							line_rend = beam.GetComponent(LineRenderer);
							line_rend.SetPosition(0, close_phaser.transform.position);
							line_rend.SetPosition(1, shield_hit.transform.position);
							//do damage
							
							if (script.isRedAlert == true && script.shields > 0)
							{
								
								script.shields -= weapon1.damage * weapon1.shieldMulti * Time.deltaTime;
								
								Instantiate(shield_imp, shield_hit.transform.position,target.rotation);
							
							}
							else
							{
								script.health -= weapon1.damage * weapon1.hullMulti * Time.deltaTime;
								
							}
						
						}
				
		
			
			}
			else if (target.tag == "Station")
			{
				
						var scriptStation : stationScript = target.GetComponent(stationScript);
						
						if(isBeam == false)
						{
							//render the beam
							beam = Instantiate(weapon1.beam);
							line_rend = beam.GetComponent(LineRenderer);
							line_rend.SetPosition(0, close_phaser.transform.position);
							line_rend.SetPosition(1, shield_hit.transform.position);
							isBeam = true;
							
							//do damage
							
							if (scriptStation.health.shield > 0)
							{
								scriptStation.health.shield -= weapon1.damage * weapon1.shieldMulti * Time.deltaTime;
								
								Instantiate(shield_imp, shield_hit.transform.position ,target.rotation);
								
							
							}
							else
							{
								scriptStation.health.health -= weapon1.damage * weapon1.hullMulti * Time.deltaTime;
								
							}
							
							
							
							
							
						}
						else
						{
							//orient the beam
							line_rend = beam.GetComponent(LineRenderer);
							line_rend.SetPosition(0, close_phaser.transform.position);
							line_rend.SetPosition(1, shield_hit.transform.position);
							//do damage
							
							if (scriptStation.health.shield > 0)
							{
								scriptStation.health.shield -= weapon1.damage * weapon1.shieldMulti * Time.deltaTime;
								
								Instantiate(shield_imp, shield_hit.transform.position ,target.rotation);
								
							
							}
							else
							{
								scriptStation.health.health -= weapon1.damage * weapon1.hullMulti * Time.deltaTime;
								
							}
						
						}
			}
		
		}
		//this part controls the firing of fixed pulsed weapons
		else if (Input.GetAxis("Fire1") && weapon1.isBeam == false && weapon1.isPresent == true && isForward == true && Time.time > nextPulse)
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
		}
	


}

//FIRE THE TORPEDOES! :D
function fire_player_torpedo() {

	if(Input.GetAxis("Fire2"))
		{
		
			if(target != null)
			{
			
				
					
				
				
				if (Time.time >= nextTorp)
				{
			
					
					var close_torp : GameObject = CheckClosestWeapon("TorpLaunch", transform);
					var torp : GameObject = Instantiate(weapon2.torpedo, close_torp.transform.position, transform.rotation);
					
					var script = torp.GetComponent(torpedoScript);
					
					
					script.target = target.transform;
					script.launched = transform;
					
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
				
				
			
			}
			
			
		
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

//this function is supposed
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
		
	  
	  	yield WaitForSeconds(wait); 
	}  
	nextPulse = Time.time + pulseRecharge;
	isFiringPulse = false;

}