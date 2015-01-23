#pragma strict

class HUDBalance extends HUDBottom {

	var BarTexture : Texture;
	var HandleTexture : Texture;

	function OnGUI () {
		if(hud.isShowingGui()) {
			drawBalance();
		}
	}
	
	private function drawBalance() {
		var rect : Rect = getPlacementRect();
		rect = resizeRect(rect);
		GUILayout.BeginArea(rect);
			drawBackground(rect);
		
		GUILayout.EndArea();
	}
	
	private function drawBackground(rect : Rect) {
		var pos : Rect = new Rect(0,0,rect.width, rect.height);
		GUI.DrawTexture(pos, background);		
	}
	
	private function drawWeaponsBar() {
	
	}
	
	private function drawDefenseBar() {
	
	}
	
	private function drawSpeedBar() {
	
	}
}