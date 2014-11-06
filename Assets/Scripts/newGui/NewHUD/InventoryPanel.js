#pragma strict


public class InventoryPanel extends FloatingWindow {

var backgroundRect : Rect;

private static final var TIME : float = 0.1f;
private var lastPress : float;

function Start () {
	lastPress = 0;
	super.initFloat();
	
}

function Update() {
	if(Input.GetAxis("Inventory") && lastPress + TIME <= Time.time) {
		lastPress = Time.time;
		super.toggle();
	}

}

function OnGUI() {
	
	if(super.on && super.hud.isShowingGui()) {
		drawWindow();
	}
	

}

function drawWindow() {
	super.position = GUI.Window(super.getId(), super.position, window, title, GUIStyle.none);	
}

function window() {

	GUI.DrawTexture(resizeRect(backgroundRect), super.background);
	
	
	super.drag();
			
}







}