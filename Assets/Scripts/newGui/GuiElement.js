#pragma strict


class GuiElement extends MonoBehaviour {
	//@Tooltip ("Element position on screen.")
	var position : Rect;
	//@Tooltip ("Background texture. If it's null, it won't draw.")
	var background : Texture;
	
	
	
	
	
	
	
	function getPosition() : Rect {
		return position;
	}
	
	function getBackground() : Texture {
		return background;
	}
	
	
	
			
	
	
}
