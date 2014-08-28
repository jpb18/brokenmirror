class HUDPower extends HUDBottom {
	
	var backgroundRect : Rect;
	var backgroundTexture : Texture;
	
	var energyBarRect : Rect;
	var energyBarTexture : Texture;
	
	var alertColor : Color = Color.red;
	private var tmpColor : Color;
	private var red : boolean;
	private var lastChange : float;
	public static final var ALERT : int = 10;
	public static final var TIME : float = 0.5f;
	
	function Start() {
		initPower();
		
	}
	
	function initPower() {
		super.initHud();
		tmpColor = GUI.color;
		lastChange = 0;
	}
	

	function OnGUI() {
		if(super.hud.isShowingGui()){
			drawEnergy();
		}
	

	}
	
	function drawEnergy() {
		GUILayout.BeginArea(super.getPlacementRect());
			drawBar();
		GUILayout.EndArea();
		
	}
	
	function drawBar() {
		var percentage : int = super.reactor.getPercentage();
		
		if(percentage < ALERT) {
			toggleColor();
		} else {
			red = false;
		}
		
		if(red) {
			GUI.color = alertColor;
		} else {
			GUI.color = tmpColor;
		}
		
		drawBarBackground();
		drawBarForeground(percentage);
		GUI.color = tmpColor;
		
	}
	
	function drawBarBackground() {
		GUI.DrawTexture(resizeRect(backgroundRect), backgroundTexture);
	}
	
	function drawBarForeground(percentage : int) {
		var rect : Rect = getResizedRect(energyBarRect, 100, percentage);
		GUI.DrawTexture(rect, energyBarTexture)	;
	}
	
	private function toggleColor() {
		if(Time.time > lastChange + TIME) {
			lastChange = Time.time;
			red = !red;
		}
	}


}

