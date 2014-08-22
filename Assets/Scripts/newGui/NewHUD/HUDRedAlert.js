#pragma strict

class HUDRedAlert extends HUDTop {

	
	var timePeriod : float;

	function OnGUI() {
		if(hud.isShowingGui()) {
			draw();
		}
	
	}
	
	function draw() {
		GUILayout.BeginArea(getPlacementRect());
			drawRedAlert();			
		GUILayout.EndArea();
	}
	
	function drawRedAlert() {
		if(props && props.getRedAlert()) {
			GUI.color = new Color(1,1,1, getTransparency());
			
			drawBackground();
			
			GUI.color = Color.white;
			
		}
	}
	
	private function getTransparency() : float {
	
		return (Mathf.Cos(Time.time * timePeriod)/2) + 0.5f;
	
	}

	

}