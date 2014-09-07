#pragma strict

class PulseIndicator {
	var texture : Texture;
	var rect : Rect;
	
	var pulseInterval : float;
	var rotationRate : float;
	private var rotation : float;
	
	function Draw(location : Vector2, map : Rect) {
		var tmp : Color = GUI.color;
		var tmpMatrix : Matrix4x4 = GUI.matrix;
		
		GUI.color = new Color(1,1,1,getAlpha());
		var r : Rect = calculateRectPosition(location, map);
		
		GUIUtility.RotateAroundPivot(rotation, getPivot(location, map));
		GUI.DrawTexture(r, texture);
		
		
		GUI.color = tmp;
		GUI.matrix = tmpMatrix;
		Rotation();
	}
	
	
	private function getAlpha() : float {
		return (Mathf.Cos(Time.time * 1/pulseInterval)/2) + 0.5;
	}
	
	private function calculateRectPosition(location : Vector2, map : Rect) : Rect {
		var CoodX : int = (map.width/2 + location.x) - (rect.width/2);
		var CoodY : int = (map.height/2 + location.y) - (rect.height/2);
	
		var butRect : Rect = new Rect(CoodX, CoodY, rect.width, rect.height);
		return butRect;
	}
	
	private function getPivot(location : Vector2, map : Rect) : Vector2 {
		return new Vector2(map.width/2 + location.x, map.height/2 + location.y);
	}
	
	private function Rotation()  {
		rotation += rotationRate * Time.deltaTime;
	}
	
}