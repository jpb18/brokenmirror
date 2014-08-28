#pragma strict

class HUDElement extends GuiElement {

	
	protected var triggers : shipTriggers;
	protected var health : shipHealth;
	protected var weapons : shipWeapons;
	protected var props : shipProperties;
	protected var target : shipTarget;
	protected var upgrades : Upgrades;
	protected var movement : shipMovement;
	protected var reactor : ShipReactor;
	protected var player : GameObject;
	
	protected var save : SaveGame;
	protected var message : ShowMessage;
	protected var missions : Missions;
	protected var hud : HUDStatus;
	protected var map : MapInfo;
	
	public static final var SAVE_GAME : String = "SaveGame";
	public static final var GLOBAL_INFO : String = "GlobalInfo";
	public static final var SHOW_MESSAGE : String = "ShowMessage";
	public static final var MISSIONS : String = "Missions";
	public static final var MAP : String = "MapInfo";
	
	var skin : GUISkin;
	
	var isTest : boolean;
	
	function Start() {
		
		initHud();
	}
	
	function initHud() {
		super.init();
		save = GameObject.FindGameObjectWithTag(SAVE_GAME).GetComponent(SaveGame);		
		hud = GameObject.FindGameObjectWithTag(GLOBAL_INFO).GetComponent(HUDStatus);
		message = GameObject.FindGameObjectWithTag(SHOW_MESSAGE).GetComponent(ShowMessage);
		missions = GameObject.FindGameObjectWithTag(MISSIONS).GetComponent(Missions);
		map = GameObject.FindGameObjectWithTag(MAP).GetComponent(MapInfo);
		if(hud.isShowingGui()) {
			player = save.getPlayerShip();
			getPlayerScripts();
		}
	}
	
	function getPlayerScripts() {
		triggers = player.GetComponent(shipTriggers);
		health = player.GetComponent(shipHealth);
		weapons = player.GetComponent(shipWeapons);
		props = player.GetComponent(shipProperties);
		target = player.GetComponent(shipTarget);
		upgrades = player.GetComponent(Upgrades);
		movement = player.GetComponent(shipMovement);
		reactor = player.GetComponent(ShipReactor);
	}
	
	function checkPlayer() {
		var newGo : GameObject = save.getPlayerShip();
		if(player != newGo) {
			player = newGo;
			getPlayerScripts();
			
		}
		
	}
	
	function Update() {
		if(hud.isShowingGui()) checkPlayer();
	}
	
	function drawBackground() {
		var rect : Rect = super.getResizedPosition();
		rect.x = 0;
		rect.y = 0;
		GUI.DrawTexture(rect, super.getBackground());	
	}

}