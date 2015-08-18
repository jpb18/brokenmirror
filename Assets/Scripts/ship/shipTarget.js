//this script controls the target selectin for the player;
#pragma strict

var target : GameObject;
var lastClick : float;
var clickInt : float = 0.2f;

private var shipProps : shipProperties;
private var general : GeneralInfo;
private var shipWeps : shipWeapons;
//private var gui : guiScript;
private var guiStatus : GUIStatus;
private var hudControl : HudControl;

var repeatClick : boolean = false;

//these vars are for bots
var nextSearch : float;
var searchTime : float = 4.0f;



function Start () {

	shipProps = gameObject.GetComponent(shipProperties);
	shipWeps = gameObject.GetComponent(shipWeapons);
	//gui = gameObject.GetComponent(guiScript);
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
	var guiGo = GameObject.FindGameObjectWithTag("GUI");
	guiStatus = guiGo.GetComponent.<GUIStatus>();
	hudControl =  guiGo.GetComponent.<HudControl>();
	

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

	checkTargetIsCloaked();
	

}

function hasTarget() : boolean {
	return target;
}

function getTarget() : GameObject {
	return target;
}

function setTarget(target : GameObject) {
	this.target = target;
	if(shipProps.isPlayer())hudControl.SetTarget(target);
}

function ForceTarget() {
	FindTarget(gameObject, shipProps);
	nextSearch = Time.time + Random.value * searchTime;
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
				var go : GameObject = hit.transform.gameObject;
				if(hit.transform.gameObject != target) //check if it's the first click
				{
					if(go != gameObject)
					{
						setTarget(go);
					}
				}
				else
				{
					if(go != gameObject)
					{
						repeatClick = true;
					}
				}
				
			}
			
			
			
			lastClick = Time.time;
			if(repeatClick) {
				controlDoubleClick(go);
				repeatClick = false;	
			}
	
	}


}

function controlDoubleClick(obj : GameObject) {
	if(!guiStatus.isAnyWindowUp())	{
		var hail : IHailable = obj.GetComponent(typeof(IHailable)) as IHailable;
		hail.openComm();
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


	var faction : FactionInfo = general.getFactionInfo(shipProps.shipInfo.faction);
	setTarget(Statics.FindTarget(origin, Mathf.Infinity));
	return target;

}


function botFunction() {
	if(target == null) {
		if(Time.time > nextSearch)
		{
			FindTarget(gameObject, shipProps);
			nextSearch = Time.time + Random.value * searchTime;
		}
	}
}

function cancelTarget() {

	if(Input.GetAxis("CancelLock")) {
		target = null;
		hudControl.HideTarget();
	}

}

function checkTargetIsCloaked() {
	if(target) {
		var cloak : ICloakable = target.GetComponent(typeof(ICloakable)) as ICloakable;
		
		if(cloak && cloak.isCloaked()) {
			var factionable : IFactionable = target.GetComponent(typeof(IFactionable)) as IFactionable;
			var faction : int = factionable.getFaction();
			if(!shipProps.isOwn(faction)) {
				target = null;
			}
		}
		
	}

}
