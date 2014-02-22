//this script controls the target selectin for the player;
#pragma strict

var target : GameObject;
var lastClick : float;
var clickInt : float = 0.2f;

var shipProps : shipProperties;
var general : GeneralInfo;
var shipWeps : shipWeapons;

var repeatClick : boolean = false;

//these vars are for bots
var nextSearch : float;
var searchTime : float = 4.0f;



function Start () {

	shipProps = gameObject.GetComponent(shipProperties);
	shipWeps = gameObject.GetComponent(shipWeapons);
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
	
	

}

function Update () {
	
	if(shipProps.playerProps.isPlayer == true)
	{
		ClickTarget();
		PressTarget();
		cancelTarget();
	}
	else
	{
		botFunction();
		BotRedAlert();
	}

	
	

}

function hasTarget() : boolean {
	return target;
}

function getTarget() : GameObject {
	return target;
}

function setTarget(target : GameObject) {
	this.target = target;
}

function BotRedAlert() {
	
	if(!target) {
		if(shipProps.combatStatus.isRedAlert)
		{
			gameObject.GetComponent(shipHealth).showShields();
		}
		shipProps.combatStatus.isRedAlert = false;
	
	}
	else
	{
		if(!shipProps.combatStatus.isRedAlert)
		{
			gameObject.GetComponent(shipHealth).showShields();
		}
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
	for(var x : int = 0; x < 8; x++)
	{
		var key : String = "Fire" + (x+1);
		if (Input.GetAxis(key) && target == null)
		{
			target = FindTarget(gameObject, shipProps);
		}
	}
	


}

function FindTarget(origin : GameObject, shipProps : shipProperties) : GameObject {


	var enemyList : int[] = general.factionInfo[shipProps.shipInfo.faction].hostileFactions;
	return Statics.FindTarget(origin, Mathf.Infinity, enemyList);

}


function botFunction() {
	if(target == null) {
		if(Time.time > nextSearch)
		{
		
			target = FindTarget(gameObject, shipProps);
			nextSearch = Time.time + Random.value * searchTime;
			
		}
	}
}

function cancelTarget() {

	if(Input.GetAxis("CancelLock")) {
		target = null;
	}

}
