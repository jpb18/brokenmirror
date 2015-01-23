#pragma strict

class HUDTorpedo extends HUDBottom {
	
	var area3x : Rect;
	var area5x : Rect;
	var area8x : Rect;
	
	var overlay : Texture;
	
	
	
	public static final var X3 : String = "x3";
	public static final var X5 : String = "x5";
	public static final var X8 : String = "x8";
	
	public static final var TIP = "Torpedo Volley {0}\nThis allows you to shoot {1} torpedoes at the same time.";
	
	public static final var TRANSPARENCY : float = 0.50f;
	
	
	function OnGUI() {
		if(hud.isShowingGui()) {
			drawTorpedo();
		}
	}
	
	function drawTorpedo() {
		GUILayout.BeginArea(super.getPlacementRect());
		
			super.drawBackground();
			drawButtons();
			
		GUILayout.EndArea();	
	}
	
	
	
	function drawButtons() {
	
		drawButton(area3x, X3, Volley.three);
		MouseOver(area3x, SetText(X3, 3));
		
		drawButton(area5x, X5, Volley.five);
		MouseOver(area5x, SetText(X5, 5));
		
		drawButton(area8x, X8, Volley.eight);
		MouseOver(area8x, SetText(X8, 8));
	
	}
	
	function MouseOver(rect : Rect, text : String) {
		if(rect.Contains(Event.current.mousePosition)) {
			SetMouseOver(rect, text);
		}
	}

	function SetText(t1 : String, num : int) : String {
		return String.Format(TIP, t1, num);
	}
	
	function drawButton(rect : Rect, text : String, volley : Volley) {
		if(GUI.Button(rect, text, skin.button)) {
			super.weapons.toggleVolley(volley);
		}
		
		if(super.weapons.torpVolley == volley) {
			GUI.color = new Color(1,1,1, TRANSPARENCY);	
		
			GUI.DrawTexture(rect, overlay);
			
			GUI.color = Color.white;
		}
		
	}


}