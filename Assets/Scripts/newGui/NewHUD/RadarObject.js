#pragma strict
class RadarObject extends GuiElement {

	var normalSize : Vector2;
	var smallSize : Vector2;

	var ownBackground : Texture;
	var enemyBackground : Texture;
	var allyBackground : Texture;
	var neutralBackground : Texture;
	
	var ownSmallBackground : Texture;
	var enemySmallBackground : Texture;
	var allySmallBackground : Texture;
	var neutralSmallBackground : Texture;
	
	var nameRect : Rect;
	var classRect : Rect;
	var distanceRect : Rect;
	
	var big : boolean;
	
	var skin : GUISkin;
	
	private var hud : HUDStatus;
	private var save : SaveGame;
	private var props : shipProperties;
	private var general : GeneralInfo;
	private var mainCam : Camera;
	private var sensor : SensorTextureCache;
	
	
	private var pos : Vector3;
	private var size : Vector2;
	private var rect : Rect;
	private var widget : Rect;
	private var player : boolean;
	private var playerShip : GameObject;
	
	private var nextClick : float;
	private static final var TIME : float = 0.2f;
	
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
		
		//load the textures
		var gui : GameObject = GameObject.FindGameObjectWithTag("GUI");
		sensor = gui.GetComponent.<SensorTextureCache>();
		
		//big ones
		this.ownBackground = sensor.bigOwnBackground;
		this.allyBackground = sensor.bigAlliedBackground;
		this.enemyBackground = sensor.bigEnemyBackground;
		this.neutralBackground = sensor.bigNeutralBackground;
		
		//small ones
		this.ownSmallBackground = sensor.smallOwnBackground;
		this.allySmallBackground = sensor.smallAlliedBackground;
		this.enemyBackground = sensor.smallEnemyBackground;
		this.neutralSmallBackground = sensor.smallNeutralBackground;
		
		//and now sizes
		this.normalSize = sensor.bigSize;
		this.smallSize = sensor.smallSize;
		
		//initialize big as false
		this.big = false;
		
	}
	
	function OnGUI () {
		
		if(playerShip) {
			if(hud.isShowingGui() && isOnScreen() && !player) {
				drawObject();
			}
		}
	}
	
	function Update() {
		playerShip = getPlayer();
		player = isPlayer();
		if(player) return;
		
		//get sizes
		this.normalSize = sensor.bigSize;
		this.smallSize = sensor.smallSize;
		
		//cache stuff		
		var mouse : Vector3 = Input.mousePosition;
		mouse = new Vector3(mouse.x, Screen.height - mouse.y,0); 					
		size = getSize();
		pos = mainCam.WorldToScreenPoint(transform.position);
		rect = resizeRect(new Rect(pos.x, convertBotToTop(pos.y) - size.y, size.x, size.y));
		widget = new Rect(0,0, rect.width, rect.height);

		//check if the mouse is inside the image rect when the player presses the left mouse button
		//also check if the time since the last press is has elapsed...				
		if(Input.GetMouseButtonDown(0) && Time.time >= this.nextClick && rect.Contains(mouse)) {
			this.nextClick = Time.time + TIME;
			big = !big;
		} 
		
		
	}
	
	function drawObject () {
					
		GUILayout.BeginArea(rect);
		
			if(big) {
				drawLargeObject();
			} else {
				drawSmallObject();
			}
		

		GUILayout.EndArea();
		
	}
	
	function drawSmallObject() {
			//draw texture
			GUI.DrawTexture(widget, getTexture(true));
	}
	
	function drawLargeObject() {
			//draw texture
			GUI.DrawTexture(widget, getTexture(false));
			//draw labels			
			GUI.Label(resizeRect(nameRect), getName(), skin.GetStyle("MessageComm"));
			GUI.Label(resizeRect(classRect), getClass(), skin.GetStyle("MessageComm"));
			GUI.Label(resizeRect(distanceRect), "Distance: " + getDistance(getPlayer()).ToString() + "KM", skin.GetStyle("MessageComm"));

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
	
	function getTexture(small : boolean) : Texture {
		var player : GameObject = getPlayer();
		var texture : Texture2D;
		
	
		//get faction info
		var ownFac : int = getFaction(gameObject);
		var plaFac : int = getFaction(playerShip);
		
		var ownInfo : FactionInfo = general.getFactionInfo(ownFac);
		
		
		if(ownFac == plaFac) { //check if it owns
			texture = small ? ownSmallBackground : ownBackground;		
		} else if(ownInfo.isAllied(plaFac)) { //check if its ally
			texture = small ? allySmallBackground : allyBackground;
		} else if(ownInfo.isHostile(plaFac)) { //check if its enemy
			texture = small ? enemySmallBackground : enemyBackground;
		} else {
			texture = small ? neutralSmallBackground : neutralBackground;	
		}
		
		
		return texture;
	
	}
	
	
	
	
	private function getFaction(obj : GameObject) : int {
		var fact : IFactionable = obj.GetComponent(typeof(IFactionable)) as IFactionable;
		return fact.getFaction();
	}
	
	function getDistance(player : GameObject) : int {
		
		return Vector3.Distance(transform.position, player.transform.position) * KM;
	
	}
	
	private function getSize() : Vector2 {
		return big ? normalSize : smallSize;
	}

}