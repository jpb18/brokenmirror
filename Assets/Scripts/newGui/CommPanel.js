#pragma strict

class CommPanel extends FloatingWindow implements IHailable {

	var tradeRect : Rect;
	var boardRect : Rect;
	var commandRect : Rect;
	var closeRect : Rect;
	
	var nameLabelRect : Rect;
	var messageLabelRect : Rect;
	var iconRect : Rect;
	
	var skin : GUISkin;
	
	
	private var save : SaveGame;
	private var props : shipProperties;
	private var scene : SceneStart;
	
	public static final var SAVE_GAME : String = "SaveGame";

	public static final var MESSAGE : String = "Hey Boss!\n This String here is just for testing the message box of the comm system!";

	// Use this for initialization
	function Start () {
		super.initFloat();
		save = GameObject.FindGameObjectWithTag(SAVE_GAME).GetComponent(SaveGame);		
		hud = GameObject.FindGameObjectWithTag(GLOBAL_INFO).GetComponent(HUDStatus);
		props = gameObject.GetComponent(shipProperties);
		scene = GameObject.FindGameObjectWithTag("SceneStart").GetComponent.<SceneStart>();
	}
	
	function OnGUI() {
		if(hud.isShowingGui()) {
			draw();
		}
	}
	
	function draw() {
		if(on) {
			position = GUI.Window(id, position, window, "", GUIStyle.none);
		}
	}
	
	function window(window : int) {
		GUILayout.BeginArea(getResizedPosition());
			drawBackground();
			drawButtons();
			drawShipIcon();
			drawLabels();
		GUILayout.EndArea();
		GUI.DragWindow();
	}
	
		
	function drawButtons() {
		GUI.Button(resizeRect(tradeRect), "Trade", skin.GetStyle("CommButton"));
		drawBoardButton();
		drawCommandButton();
		drawCloseButton();
	}
	
	function drawCommandButton() {
		if(isPlayerFaction()) {
			if(GUI.Button(resizeRect(commandRect), "Command",skin.GetStyle("CommButton"))) {
					save.takeShipCommand(gameObject);
					scene.LoadNewSquadShip(gameObject);
			}
		} else {
			GUI.Button(resizeRect(commandRect), "",skin.GetStyle("CommButton"));
		}
	}
	
	function drawBoardButton() {
		if(GUI.Button(resizeRect(boardRect), "Board", skin.GetStyle("CommButton"))) {
			if(isPlayerFaction()) {
				swapShip(gameObject, getPlayer());
			} else {
				//do hostile boarding
			}
		}
	}
	
	
	
	function drawCloseButton() {
		if(GUI.Button(closeRect, "X", this.skin.GetStyle("CloseComm"))) {
				closeComm();
		}
	}
	
	function drawShipIcon() {
		GUI.DrawTexture(iconRect, getTexture());
		
	}
	
	function drawLabels() {
		GUI.Label(resizeRect(nameLabelRect), getName(), skin.GetStyle("MessageComm"));
		GUI.Label(resizeRect(messageLabelRect), MESSAGE, skin.GetStyle("MessageComm"));
	}
	
	function isPlayerFaction() : boolean {
		return props.getFaction() == 0;
	}
	
	function isPlayer() : boolean {
		return props.getPlayer();
	}
	
	function getPlayer() : GameObject {
		return save.getPlayerShip();
	}
	
	function getTexture() : Texture {
		return props.getTargetImage();	
	}
	
	function getName() : String {
		return props.getName();
	}

	function openComm() {
		if(!isPlayer()) {
			on = true;
			centerOnScreen();
		}
	}
	
	function closeComm() {
		on = false;
		centerOnScreen();
	}
	
	

	
	//this script swaps the ship
	//pre target != null && player != null
	function swapShip(target : GameObject, player : GameObject) {
		//set current ship as npc
		var playerProps : shipProperties = player.GetComponent(shipProperties);
		playerProps.setPlayer(false);
		
		//set new ship as player
		
		props.setPlayer(true);
		
		//now change camera target
		var camScript : MouseOrbit = Camera.main.GetComponent(MouseOrbit);
		camScript.target = target.transform;
		
		//clear targeting information
		target.GetComponent(shipTarget).target = null;
		player.GetComponent(shipTarget).target = null;
		player.GetComponent(shipTarget).repeatClick = false;
		
		closeComm();
		
	}

}
