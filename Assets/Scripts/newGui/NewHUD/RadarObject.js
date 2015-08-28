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
	private var nameable : INameable;
	private var classeable : IClasseable;
	private var playable : IPlayable;
	
	private var view : Vector3;
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
		playable = gameObject.GetComponent(typeof(IPlayable)) as IPlayable;
		nameable = gameObject.GetComponent(typeof(INameable)) as INameable;
		classeable = gameObject.GetComponent(typeof(IClasseable)) as IClasseable;
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
		this.enemySmallBackground = sensor.smallEnemyBackground;
		this.neutralSmallBackground = sensor.smallNeutralBackground;
		
		//and now sizes
		this.normalSize = sensor.bigSize;
		this.smallSize = sensor.smallSize;
		
		//initialize big as false
		this.big = false;
		
	}
	
	function OnGUI () {
		
		playerShip = getPlayer();
		player = isPlayer();
		
		//cache stuff		
		var mouse : Vector2 = Event.current.mousePosition;
		size = getSize();
		rect = getRect(size);
		widget = new Rect(0,0, rect.width, rect.height);

		//check if the mouse is inside the image rect when the player presses the left mouse button
		//also check if the time since the last press is has elapsed...				
		if(Input.GetMouseButtonDown(0) && Time.time >= this.nextClick && rect.Contains(mouse)) {
			this.nextClick = Time.time + TIME;
			big = !big;
		} 
		
		if(playerShip) {
			if(hud.isShowingGui() && isOnScreen() && !player) {
				drawObject();
			} else if (hud.isShowingGui() && !player) {
				//draw border icon
				this.DrawBorderIcon();
			}
		}
	}
	
	function Update() {
		pos = mainCam.WorldToScreenPoint(transform.position);
		view = mainCam.WorldToViewportPoint(transform.position);		
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
			GUI.Label(resizeRect(distanceRect), "Distance: " + getDistance(playerShip).ToString() + "KM", skin.GetStyle("MessageComm"));

	}
	
	
	function isOnScreen() : boolean {
		return view.z > 0 && view.x > 0 && view.x < 1 && view.y > 0 && this.view.y < 1 ;
	}

	function isPlayer() : boolean {
		return playable.isPlayer();
	}
	
	function getPlayer() : GameObject {
		return save.getPlayerShip();
	}
	
	function getName() : String {
		return nameable.getName();
	}
	
	function getClass() : String {
		return classeable.getClass();
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
	
	private function getRect(size : Vector2) : Rect {
		var r : Rect = new Rect();
		if(big) {
			r = new Rect(pos.x, convertBotToTop(pos.y) - size.y, size.x, size.y);
		} else {
			var half : float = size.y /2;
			r = new Rect(pos.x, convertBotToTop(pos.y) - half, size.x, size.y);
		}
		
		
		return resizeRect(r);
	}
	
	private function DrawBorderIcon() {
	
		var bMatrix : Matrix4x4 = GUI.matrix;
		var rect : Rect;		
		var x : int;
		var y : int;
		var texture : Texture = getTexture(true);
		var pivot : Vector2;
		
		if(view.x >= 1 && view.x > view.y) { //its at the right of the viewport
			//TODO this part needs a 180º texture rotation
			x = Screen.width - smallSize.x;
			y = (Screen.height * (1 - view.y)) - (smallSize.y/2);
			rect = new Rect(x, y, smallSize.x, smallSize.y);
			pivot = new Vector2(rect.xMin + rect.width * 0.5f, rect.yMin + rect.height * 0.5f);
			GUIUtility.RotateAroundPivot(180f, pivot);
			GUI.DrawTexture(rect, texture);
		} else if (view.y >= 1 && view.x < view.y) { //its above the viewport
			//this part needs a 90º texture rotation
			y = 0;
			x = (Screen.width * view.x) - (smallSize.x/2);
			rect = new Rect(x, y, smallSize.x, smallSize.y);
			pivot = new Vector2(rect.xMin + rect.width * 0.5f, rect.yMin + rect.height * 0.5f);
			GUIUtility.RotateAroundPivot(90f, pivot);			
			GUI.DrawTexture(rect, texture);
		} else if (view.x <= 0 && view.y > view.x) { //its at the left of the viewport
			//this doesn't need a texture rotation
			x = 0;
			y = (Screen.height * (1 - view.y)) - (smallSize.y/2);
			rect = new Rect(x, y, smallSize.x, smallSize.y);
			GUI.DrawTexture(rect, texture);
		} else if (view.y <= 0 && view.x > view.y) { //its at the bottom of the viewport
			//this part needs a -90º texture rotation
			y = Screen.height - smallSize.y;
			x = (Screen.width * view.x) - (smallSize.x/2);
			rect = new Rect(x, y, smallSize.x, smallSize.y);
			pivot = new Vector2(rect.xMin + rect.width * 0.5f, rect.yMin + rect.height * 0.5f);
			GUIUtility.RotateAroundPivot(270f, pivot);			
			GUI.DrawTexture(rect, texture);
		}
		
		
		GUI.matrix = bMatrix;
		
	}


}