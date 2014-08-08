#pragma strict


class GuiElement extends MonoBehaviour {
	//@Tooltip ("Element position on screen.")
	var position : Rect;
	protected var original : Rect;
	
	//@Tooltip ("Background texture. If it's null, it won't draw.")
	var background : Texture;
	
	 var id : int;
	 
	 var ratio : float = 1f;
	
	function Start() {
		init();
	}
	
	function init() {
		id = GUIUtility.GetControlID(FocusType.Passive);
		original = position;
	}
	
	function OnGUI() {
		draw();
	}
	
	function draw() {
		if(background) {
			
			GUI.DrawTexture(getResizedPosition(), background);
		}
	}
	
	function drawBackground() {
	
		GUI.DrawTexture(getResizedPosition(), background);
	}	
	
	function getPosition() : Rect {
		return position;
	}
	
	function getResizedPosition() : Rect {
		return resizeRect(original);
	}
	
	function getBackground() : Texture {
		return background;
	}
	
	function hasBackground() : boolean {
		return background != null;
	}
	
	function getId() : int {
		return id;
	}
	
	
	function centerOnScreen() {
		var x : int = Screen.width/2 - position.width/2;
		var y : int = Screen.height/2 - position.height/2;
		position.x = x;
		position.y = y;		
	}	
	
	function resizeRect(rect : Rect) : Rect {
		
		return new Rect(Mathf.Floor(rect.x * ratio), Mathf.Floor(rect.y * ratio), Mathf.Floor(rect.width * ratio), Mathf.Floor(rect.height * ratio));
	
	}
	
	
}
