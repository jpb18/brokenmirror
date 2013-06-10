//this script controls the target selectin for the player;
#pragma strict

var target : GameObject;
var lastClick : float;
var clickInt : float = 0.2f;

var shipProps : shipProperties;


function Start () {

	shipProps = gameObject.GetComponent(shipProperties);

}

function Update () {

	if(shipProps.playerProps.isPlayer == true)
	{
		ClickTarget();
		PressTarget();
	}
	else
	{
		botFunction();
	}

}

function ClickTarget() {
	if (Input.GetAxis("Select") && Time.time >= lastClick + clickInt)
	{
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit: RaycastHit;
		
			if(Physics.Raycast(ray, hit)) //check if it hits something
			{
				if(hit.transform != target) //check if it's the first click
				{
					if(hit.transform != transform)
					{
						target = hit.transform.gameObject; //store the target
					}
				}
				else
				{
					
				}
				
			}
			else //if not, deselects
			{
				target = null; //clean selected variable
			}
			
			lastClick = Time.time;
	
	}


}

function PressTarget() {

	if (Input.GetAxis("Fire1") && target == null)
	{
		target = FindTarget(gameObject, shipProps);
	}
	if (Input.GetAxis("Fire2") && target == null)
	{
		target = FindTarget(gameObject, shipProps);
	}
	if (Input.GetAxis("Fire3") && target == null)
	{
		target = FindTarget(gameObject, shipProps);
	}
	if (Input.GetAxis("Fire4") && target == null)
	{
		target = FindTarget(gameObject, shipProps);
	}
	if (Input.GetAxis("Fire5") && target == null)
	{
		target = FindTarget(gameObject, shipProps);
	}
	if (Input.GetAxis("Fire6") && target == null)
	{
		target = FindTarget(gameObject, shipProps);
	}
	if (Input.GetAxis("Fire7") && target == null)
	{
		target = FindTarget(gameObject, shipProps);
	}
	if (Input.GetAxis("Fire8") && target == null)
	{
		target = FindTarget(gameObject, shipProps);
	}


}

function FindTarget(origin : GameObject, shipProps : shipProperties) : GameObject {

	var gameObjs : GameObject[] = FindObjectsOfType(GameObject); //Collect all game objects
	var closest : GameObject;

	for (var go : GameObject in gameObjs) //loop through all
	{
		if (go.transform.parent == null) //check if it's parent GO
		{
			if(go != origin) //check if GO is diferent than origin
			{
				if (go.tag == "Ship") //check if GO is a ship 
				{
				
					//Get ships properties script and faction
					var ship_props : shipProperties = go.GetComponent(shipProperties);
					var ship_faction : int = ship_props.shipInfo.faction;
					//check if it belongs to the hostile faction
					var isHostile : boolean = false;
					for(var faction : int in shipProps.shipInfo.hostileFactions)
					{
						if (ship_faction == faction)
						{
							isHostile = true;
						}
					
					}
					
					if(isHostile)
					{
						if(closest == null) //if there's no go in closest
						{
							closest = go;
						}
						else //if there is
						{
							//check if the new go is closer than the older one
							if (Vector3.Distance(origin.transform.position, closest.transform.position) >= Vector3.Distance(origin.transform.position, go.transform.position))
							{
								closest = go;
							}
						}
					}
									
				}
				else if (go.tag == "Station")
				{
				
					//put station targeting code here
				
				}
			}
		}
	}
	
	return closest;

}


function botFunction() {

	if(target == null)
	{
	
		target = FindTarget(gameObject, shipProps);
		Debug.Log("Found target");
	}
	
}