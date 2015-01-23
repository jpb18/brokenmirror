#pragma strict

public static class Tooltip {
	
	public var width : float = 150f;
	public var height : float = 50f;
	
	public function DrawTooltip(rect : Rect, image : Texture, text : String, style : GUIStyle) {
	
		var content : GUIContent = new GUIContent(text, image);
		GUI.Box(GetRect(rect), content, style);		
	
	}
	
	public function DrawTooltip(rect : Rect, text : String, style : GUIStyle) {
		var content : GUIContent = new GUIContent(text);
		GUI.Box(GetRect(rect), content, style);
	}
	
	private function GetRect(rect : Rect) : Rect {
		
		var x : float = 0;
		
		if(rect.x < Screen.width/2) {
			x = rect.x + rect.width;
		} else {
			x = rect.x - width;
		}
		
		var y : float = 0;
		
		if(rect.y < Screen.height/2) {
			y = rect.y + rect.height;
		} else {
			y = rect.y - height;
		}
		
		return new Rect(x, y, width, height);
	
	}


}