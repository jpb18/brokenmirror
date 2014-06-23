#pragma strict


class GuiElement extends MonoBehaviour {
	//@Tooltip ("Element position on screen.")
	var position : Rect;
	//@Tooltip ("Background texture. If it's null, it won't draw.")
	var background : Texture;
	
	 var id : int;
	
	function Start() {
		id = GUIUtility.GetControlID(FocusType.Passive);
	}
	
	function OnGUI() {
		draw();
	}
	
	function draw() {
		if(background) {
			GUI.DrawTexture(position, background);
		}
	}
		
	
	function getPosition() : Rect {
		return position;
	}
	
	function getBackground() : Texture {
		return background;
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
	
	
}
