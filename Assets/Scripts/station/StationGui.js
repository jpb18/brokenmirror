import System.Collections.Generic;
#pragma strict

class StationGui {
	
	var on : boolean = false;
	var area : Rect;
	var si : StationInfo;
	var ss : StationStore;
	var sit : StationInt;
	
	var skin : GUISkin;
	private var health : Health;
	private var info : StationInterface;
	private var inv : Inventory;
	
	
	var close_bt : Rect;
	
	function setWindow(health : Health, info : StationInterface, inv : Inventory, missions : Missions, generator : MissionGenerator, tradeDialogue : TradeMissionDialogue) {
	
		this.health = health;
		this.info = info;
		this.inv = inv;
		sit.setMission(generator, missions);
		sit.setTrade(tradeDialogue);
	}
		
	function draw() {
		
		area = GUI.Window(0, area, window, "Window", GUIStyle.none);
		
	}
	
	function window(windowID :int ){
		GUILayout.BeginArea(Rect(0,0,area.width, area.height));
			si.draw(health, info, skin);
			ss.draw(info, skin, inv);
			sit.draw(info, skin);
			drawClose(skin);
		GUILayout.EndArea();
		
		GUI.DragWindow (Rect (0,0,area.width, 20));
		
	}
	
	function isOn() : boolean {
		return on;
	}
	
	function setOn() {
		on = true;
	}
	
	function setOff() {
		on = false;
	}
	
	
	
	private function drawClose(skin : GUISkin) {
	
		if(GUI.Button(close_bt, "x", skin.GetStyle("StationClose"))) {
			setOff();
		}
	
	}
	
}







