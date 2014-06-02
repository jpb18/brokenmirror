#pragma strict

class ResourcePanel extends GuiElement implements IDrawable {
	
	//@Tooltip ("Dilithium icon.")
	var dilIcon : Icon;
	//@Tooltip ("Latinum icon.")
	var latIcon : Icon;
	
	//@Tooltip ("Dilithium label position.")
	var dilLabel : Rect;
	//@Tooltip ("Latinum label position.")
	var latLabel : Rect;
	
	var skin : GUISkin;		
	private var style : GUIStyle;
	
	private var inv : Inventory; //inventory goes here
	//private var load : LoadScene;
	private var status : HUDStatus;
	
	function Start() {
		//load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
		inv = gameObject.GetComponent(Inventory); //gets inventory component
		status = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus); //gets hud status component
		style = skin.GetStyle("ResourceLabel");
	}
	
	function OnGUI() {
		draw();
	}

	function draw() {
		if(status.isShowingGui()) {
			GUILayout.BeginArea(convertPosition());
				//Draw background
				drawBackground();
				
				//Draw icons
				dilIcon.draw();
				latIcon.draw();
				
				//Draw labels
				var dilithium : String= inv.getDilithium().ToString();
				GUI.Label(dilLabel, dilithium, style);
				var latinum : String = inv.getLatinum().ToString();
				GUI.Label(latLabel, latinum, style);
			GUILayout.EndArea();
		}
	}
	
	function drawBackground() {
		if(super.background) {
			var rect : Rect = super.position;
			rect.x = 0;
			rect.y = 0;
			GUI.DrawTexture(rect, super.background);		
		}
	}
	
	function convertPosition() : Rect {
		var newPos : Rect = super.position;
		newPos.x = Screen.width - super.position.x;
		return newPos;
	}	



}


