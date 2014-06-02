#pragma strict

class ReputationPanel extends GuiElement {

	var globalLabel : Rect;
	var localLabel : Rect;
	
	var skin : GUISkin;
	
	private var style : GUIStyle;
	private var map : MapInfo;
	private var status : HUDStatus;
	
	function Start() {
		map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
		status = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus); //gets hud status component
		style = skin.GetStyle("ReputationLabel");
	}
	
	function OnGUI() {
	
		if(status.isShowingGui()) {
			GUILayout.BeginArea(convertPosition());
		
				drawBackground();
				
				GUI.Label(globalLabel, map.getGalacticReputation().ToString(), style);
				GUI.Label(localLabel, map.getCurrentReputation().ToString(), style);
		
			GUILayout.EndArea();
		}
			
	}
	
	function convertPosition() : Rect {
		var newPos : Rect = super.position;
		newPos.x = Screen.width - super.position.x;
		return newPos;
	}	
	
	function drawBackground() {
		if(super.background) {
			var rect : Rect = super.position;
			rect.x = 0;
			rect.y = 0;
			GUI.DrawTexture(rect, super.background);		
		}
	}

}