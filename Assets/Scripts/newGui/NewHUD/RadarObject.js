#pragma strict
class RadarObject extends GuiElement {

	var size : Vector2;

	var ownBackground : Texture;
	var enemyBackground : Texture;
	var allyBackground : Texture;
	var neutralBackground : Texture;
	
	var nameRect : Rect;
	var classRect : Rect;
	var distanceRect : Rect;
	
	var skin : GUISkin;
	
	private var hud : HUDStatus;
	private var save : SaveGame;
	private var props : shipProperties;
	private var general : GeneralInfo;
	private var mainCam : Camera;
	
	public static final var SAVE_GAME : String = "SaveGame";
	public static final var GLOBAL_INFO : String = "GlobalInfo";
	public static final var KM : float = 1000.0f; 


	// Use this for initialization
	function Start () {
		init();
		save = GameObject.FindGameObjectWithTag(SAVE_GAME).GetComponent(SaveGame);		
		hud = GameObject.FindGameObjectWithTag(GLOBAL_INFO).GetComponent(HUDStatus);
		general = GameObject.FindGameObjectWithTag(SAVE_GAME).GetComponent(GeneralInfo);
		props = gameObject.GetComponent(shipProperties);
		mainCam = Camera.main;
	}
	
	function OnGUI () {
		var player : GameObject = getPlayer();
		if(player) {
			if(hud.isShowingGui() && isOnScreen() && !isPlayer()) {
				drawObject();
			}
		}
	}
	
	function drawObject () {
		var pos : Vector3 = mainCam.WorldToScreenPoint(transform.position);
		GUILayout.BeginArea(resizeRect(new Rect(pos.x, convertBotToTop(pos.y) - size.y, size.x, size.y)));
			GUI.DrawTexture(resizeRect(new Rect(0,0, size.x, size.y)), getTexture());
			
			
			GUI.Label(resizeRect(nameRect), getName(), skin.GetStyle("MessageComm"));
			GUI.Label(resizeRect(classRect), getClass(), skin.GetStyle("MessageComm"));
			GUI.Label(resizeRect(distanceRect), "Distance: " + getDistance(getPlayer()).ToString() + "KM", skin.GetStyle("MessageComm"));
		GUILayout.EndArea();
		
	}
	
	function isOnScreen() : boolean {
		var pos : Vector3 = mainCam.WorldToScreenPoint(transform.position);
		return pos.z > 0;
	}

	function isPlayer() : boolean {
		return props.getPlayer();
	}
	
	function getPlayer() : GameObject {
		return save.getPlayerShip();
	}
	
	function getName() : String {
		return props.getName();
	}
	
	function getClass() : String {
		return props.getClass();
	}
	
	function convertBotToTop(y : int) : int {
		return Screen.height - y;
	}
	
	function getTexture() : Texture {
		var player : GameObject = getPlayer();
		var texture : Texture2D;
		
	
		//get faction info
		var ownFac : int = getFaction(gameObject);
		var plaFac : int = getFaction(getPlayer());
		
		var ownInfo : FactionInfo = general.getFactionInfo(ownFac);
		
		
		if(ownFac == plaFac) { //check if it owns
			texture = ownBackground;		
		} else if(ownInfo.isAllied(plaFac)) { //check if its ally
			texture = allyBackground;
		} else if(ownInfo.isHostile(plaFac)) { //check if its enemy
			texture = enemyBackground;
		} else {
			texture = neutralBackground;	
		}
		
		
		return texture;
	
	}
	
	private function getFaction(obj : GameObject) : int {
		var fact : IFactionable = obj.GetComponent(typeof(IFactionable));
		return fact.getFaction();
	}
	
	function getDistance(player : GameObject) : int {
		
		return Vector3.Distance(transform.position, player.transform.position) * KM;
	
	}

}