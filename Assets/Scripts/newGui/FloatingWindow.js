import System;

class FloatingWindow extends GuiElement {
	var on : boolean;
	private var title : String;
	
	
	
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
	

}