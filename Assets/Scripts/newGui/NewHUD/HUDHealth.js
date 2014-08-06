#pragma strict

class HUDHealth extends HUDBottom {

	var hullForeground : Texture;
	var hullBackground : Texture;
	var hullRect : Rect;
	
	var shieldForeground : Texture;
	var shieldBackground : Texture;
	var shieldRect : Rect;
	var shieldForegroundRect : Rect;
	
	var orbsTexture : Texture;
	var orbsArea : Rect;
	var hullLabelRect : Rect;
	var shieldLabelRect : Rect;
	
	
	public static final var PERC : String = "%";
	
	function Start() {
		initHealth();
	}
	
	function initHealth() {
		super.initHud();
	}
	
	function OnGUI() {
		if(hud.isShowingGui()) {
			drawHealth();
		}
	}
	
	function drawHealth() {
		var rect : Rect = super.getPlacementRect();
		GUILayout.BeginArea(rect);
			drawHullBar();
			drawShieldBar();
			drawOrbs();
		GUILayout.EndArea();	
	}
	
	function drawHullBar() {
		var perc : int = getHullPercentage();
		var rect : Rect = resizeRect(hullRect);
		GUI.DrawTexture(rect, hullBackground);
		
		var tmp : Color = GUI.color;
		GUI.color = new Color(1,1,1, perc);
		
			GUI.DrawTexture(rect, hullForeground);
		
		GUI.color = tmp;
	}
	
	function drawShieldBar() {
		var perc : int = getShieldPercentage();
		
		GUI.DrawTexture(resizeRect(shieldRect), shieldBackground);
		
		var tmp : Color = GUI.color;
		GUI.color = new Color(1,1,1, perc);
		
			GUI.DrawTexture(resizeRect(shieldForegroundRect), shieldForeground);
		
		GUI.color = tmp;
	
	}
	
	function drawOrbs() {
		GUI.DrawTexture(orbsArea, orbsTexture);
		
		GUI.Label(resizeRect(hullLabelRect), getHullPercentage().ToString() + PERC, skin.label);
		GUI.Label(resizeRect(shieldLabelRect), getShieldPercentage().ToString() + PERC, skin.GetStyle("ShieldLabel"));
		
	}
	
	function getHullPercentage() : int {
		var maxHull : float = super.health.getMaxHull();
		var hull : float = super.health.getHull();
		return valueToPercentage(maxHull, hull);		
	}
	
	function getShieldPercentage() : int {
		var maxShield : float = super.health.getMaxShield();
		var shield : float = super.health.getShield();
		return valueToPercentage(maxShield, shield);
	}
	
	
	function valueToPercentage(MaxValue : float, CurValue : float) : float {

		if(MaxValue == 0) {
			return 0;
		}

		var perc : float;
		
		perc = (100*CurValue) / MaxValue;
		
		return perc;


	}
	
	

}