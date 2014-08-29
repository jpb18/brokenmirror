import System;

class FloatingWindow extends GuiElement {
	var on : boolean;
	protected var title : String;
	
	protected var hud : HUDStatus;
	public static final var GLOBAL_INFO : String = "GlobalInfo";
	
	function initFloat() {
		super.init();
		hud = GameObject.FindGameObjectWithTag(GLOBAL_INFO).GetComponent(HUDStatus);
	}	
	
	function draw() {
		if(on) {
			super.position = GUI.Window(super.getId(), super.position, window, title);	
		}
	}
	
	function window() {
		drag();	
	}
	
	function drag() {
		GUI.DragWindow();
	}
	
	
	
	function setOn() {
		centerOnScreen();
		on = true;
		
	}
	
	function setOff() {
		on = false;
	}
	
	function isOn() : boolean {
		return on;
	}
	
	function toggle() {
		on = !on;
	}
	

}