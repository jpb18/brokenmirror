#pragma strict

class HUDElement extends GuiElement {

	protected var hud : HUDStatus;
	protected var triggers : shipTriggers;
	protected var health : shipHealth;
	protected var save : SaveGame;
	protected var player : GameObject;
	
	public static final var SAVE_GAME : String = "SaveGame";
	public static final var GLOBAL_INFO : String = "GlobalInfo";
	
	function Start() {
		
		initHud();
	}
	
	function initHud() {
		super.init();
		save = GameObject.FindGameObjectWithTag(SAVE_GAME).GetComponent(SaveGame);		
		hud = GameObject.FindGameObjectWithTag(GLOBAL_INFO).GetComponent(HUDStatus);
		if(hud.isShowingGui()) {
			player = save.getPlayerShip();
			getPlayerScripts();
		}
	}
	
	function getPlayerScripts() {
		triggers = player.GetComponent(shipTriggers);
		health = player.GetComponent(shipHealth);
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

}