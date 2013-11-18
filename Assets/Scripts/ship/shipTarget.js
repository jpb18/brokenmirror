//this script controls the target selectin for the player;
#pragma strict

var target : GameObject;
var lastClick : float;
var clickInt : float = 0.2f;

var shipProps : shipProperties;

var shipWeps : shipWeapons;

var repeatClick : boolean = false;



function Start () {

	shipProps = gameObject.GetComponent(shipProperties);
	shipWeps = gameObject.GetComponent(shipWeapons);

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
		BotRedAlert();
	}
	
	

}

function getTarget() : GameObject {
	return target;
}

function setTarget(target : GameObject) {
	this.target = target;
}

function BotRedAlert() {

	if(!target) {
		
		shipProps.combatStatus.isRedAlert = false;
	
	}
	else
	{
		shipProps.combatStatus.isRedAlert = true;
	}

}

function ClickTarget() {
	if (Input.GetAxis("Select") && Time.time >= lastClick + clickInt)
	{
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit: RaycastHit;
		
			if(Physics.Raycast(ray, hit)) //check if it hits something
			{
				if(hit.transform.gameObject != target) //check if it's the first click
				{
					if(hit.transform.gameObject != gameObject)
					{
						target = hit.transform.gameObject; //store the target
					}
				}
				else
				{
					if(hit.transform.gameObject != gameObject)
					{
						repeatClick = true;
					}
				}
				
			}
			
			
			
			lastClick = Time.time;
	
	}


}

function PressTarget() {
	for(var x : int = 0; x < shipWeps.weapon.Length; x++)
	{
		if (Input.GetAxis(shipWeps.weaponKey[x]) && target == null)
		{
			target = FindTarget(gameObject, shipProps);
		}
	}
	


}

function FindTarget(origin : GameObject, shipProps : shipProperties) : GameObject {


	var enemyList : int[] = shipProps.shipInfo.hostileFactions;
	return Statics.FindTarget(origin, Mathf.Infinity, enemyList);

}


function botFunction() {

	if(target == null)
	{
	
		target = FindTarget(gameObject, shipProps);
		
	}
	
}


