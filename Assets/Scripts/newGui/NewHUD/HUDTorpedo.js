#pragma strict

class HUDTorpedo extends HUDBottom {
	
	var area3x : Rect;
	var area5x : Rect;
	var area8x : Rect;
	
	var overlay : Texture;
	
	
	
	public static final var X3 : String = "x3";
	public static final var X5 : String = "x5";
	public static final var X8 : String = "x8";
	
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
		
		drawButton(area5x, X5, Volley.five);
		
		drawButton(area8x, X8, Volley.eight);
	
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