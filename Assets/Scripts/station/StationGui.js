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
	
	var close_bt : Rect;
	
	function setWindow(health : Health, info : StationInterface) {
		this.health = health;
		this.info = info;
	}
		
	function draw() {
		
		area = GUI.Window(0, area, window, "Window", GUIStyle.none);
		
	}
	
	function window(windowID :int ){
		GUILayout.BeginArea(Rect(0,0,area.width, area.height));
			si.draw(health, info, skin);
			ss.draw(info, skin);
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
	
	
	
	private function drawClose(skin : GUISkin) : boolean {
	
		if(GUI.Button(close_bt, "x", skin.GetStyle("StationClose"))) {
			setOff();
		}
	
	}
	
}

enum StoreMode {
	ships,
	items,
	upgrades,
	plans
}

class StationStore {
	var area : Rect;
	var bg_image : Texture;
	
	var ship_button : Rect;
	var items_button : Rect;
	var upgrade_button : Rect;
	var plans_button : Rect;
	
	var store_buttons : Rect[];
	
	var name_label : Rect;
	var desc_label : Rect;
	
	var mode : StoreMode;
	
	function draw(info : StationInterface, skin : GUISkin) {
		GUILayout.BeginArea(area);
			//Draw background
			GUI.DrawTexture(Rect(0,0, area.width, area.height), bg_image);
			
			//Draw Option Buttons
			optionsButton(skin);		
			
			//Draw Store Buttons
			var store : List.<GameObject> = info.getStore(mode);
			storeButtons(store, skin);
			mouseOver(store, skin);
		
		GUILayout.EndArea();
	}
	
	
	private function optionsButton(skin : GUISkin) {
		if(GUI.Button(ship_button, "Ships", skin.GetStyle("StationOptions"))) {
			mode = StoreMode.ships;
		}
		if(GUI.Button(items_button, "Items", skin.GetStyle("StationOptions"))) {
		 	mode = StoreMode.items;
		}
		if(GUI.Button(upgrade_button, "Upgrades", skin.GetStyle("StationOptions"))) {
			mode = StoreMode.upgrades;
		}
		if(GUI.Button(plans_button, "Plans", skin.GetStyle("StationOptions"))) {
			mode = StoreMode.plans;
		}
	}
	
	private function storeButtons(store : List.<GameObject>, skin : GUISkin) {
		
		
		
		for(var i :int = 0; i < store.Count; i++) {
		
			storeButton(store[i], store_buttons[i], skin);
		
		}
	
	}
	
	private function storeButton(item : GameObject, rect : Rect, skin : GUISkin) {
			
		
		GUI.Button(rect, getImage(item), skin.GetStyle("StoreButton"));
		
	
	}
	
	private function getImage(item : GameObject) : Texture {
	
		var text : Texture;
		
		if(item.tag == "Ship") {
				text = item.GetComponent(shipProperties).getStoreImage();	
		} else if(item.tag == "Torpedoes" || item.tag == "Phaser") {
				text = item.GetComponent(weaponScript).getImage();
		}
		
		
		
		return text;
	
	}
	
	
	private function hasMouseOver(size : int) : boolean {
		var has : boolean = false;
		
		var i : int = 0;
		while(i < size && !has) {
			has = store_buttons[i].Contains(Event.current.mousePosition);
			i++;
		}
		
		return has;
	
	}
	
	private function getMouseOver(size : int) : int {
	
		var i : int = 0;
		var has : boolean = false;
		while(i < size && !has) {
			if(store_buttons[i].Contains(Event.current.mousePosition)) {
				has = true;
			} else {
			i++;
			}
		}
		
		return i;
	
	}
	
	private function getName(item : GameObject) : String {
	
		var name : String = "";
		
		if(item.tag == "Ship") {
			name = item.GetComponent(shipProperties).getClass();
		} else if (item.tag == "Torpedoes" || item.tag == "Phaser") {
			name = item.GetComponent(weaponScript). getName();		
		}
		
		return name;
	
	}
	
	private function getDescription(item : GameObject) : String {
		var desc : String = "";
		
		if(item.tag == "Ship") {
			desc = item.GetComponent(shipProperties).getDescription();
		} else if (item.tag == "Torpedoes" || item.tag == "Phaser") {
			desc = item.GetComponent(weaponScript). getDescription();		
		}
		
		return desc;
	
	}
	
	private function mouseOver(store : List.<GameObject>, skin : GUISkin) {
	
		if(hasMouseOver(store.Count)) {
			var num : int = getMouseOver(store.Count);
			GUI.Label(name_label, getName(store[num]), skin.GetStyle("StationLabel"));
			GUI.Label(desc_label, getDescription(store[num]), skin.GetStyle("StationLabel"));
		
		}
	
	}

}


class StationInfo {
	
	var area : Rect;
	var bg_image : Texture;
	var area_name : Rect;
	var area_class : Rect;
	var hp_image : Texture;
	var sh_image : Texture;
	var hp_area : Rect;
	var sh_area : Rect;
	
	///<summary>Draws the Station Info area</summary>
	///<param name='health'>Reference to the Station Health component</param>
	///<param name='info'>Reference to the Station Interface component</param>
	///<param name='skin'>GUISkin to be used</param>
	function draw(health : Health, info : StationInterface, skin : GUISkin) {
		//create area
		GUILayout.BeginArea(area);
			//draw background
			GUI.DrawTexture(Rect(0,0, area.width, area.height), bg_image);
			//write labels
			GUI.Label(area_name, info.stName, skin.GetStyle("StationLabel"));			
			GUI.Label(area_class, info.stClass, skin.GetStyle("StationLabel"));
			//draw bars
			GUI.DrawTexture(Rect(hp_area.x, hp_area.y, getWidth(health.maxHull, health.hull, hp_area.width), hp_area.height), hp_image);
			GUI.DrawTexture(Rect(sh_area.x, sh_area.y, getWidth(health.maxShield, health.shield, sh_area.width), sh_area.height), sh_image);
		GUILayout.EndArea();
	
	}
	
	
	private function getWidth(maxVal : float, val : float, width : int) : int {
		return (val * width)/maxVal;
	}
	

}

enum InteractionsMode {
	missions,
	trade,
	sell,
	repairs

}

class StationInt {

	var bg_image : Texture;
	var area : Rect;
	
	var bt_missions : Rect;
	var bt_trade : Rect;
	var bt_sell : Rect;
	var bt_repais : Rect;
	
	var mode : InteractionsMode;
	
	
	function draw(info : StationInterface, skin : GUISkin) {
	
		GUILayout.BeginArea(area);
			//draw background
			GUI.DrawTexture(Rect(0,0, area.width, area.height), bg_image);
			//draw buttons
			drawButtons(skin);
	
		GUILayout.EndArea();
	}
	
	private function drawButtons(skin : GUISkin) {
		
		if(GUI.Button(bt_missions, "Missions", skin.GetStyle("StationOptions"))) {
			mode = InteractionsMode.missions;
		}
		
		if(GUI.Button(bt_trade, "Trade", skin.GetStyle("StationOptions"))) {
			mode = InteractionsMode.trade;
		}
		
		if(GUI.Button(bt_sell, "Sell", skin.GetStyle("StationOptions"))) {
			mode = InteractionsMode.sell;
		}
		
		if(GUI.Button(bt_repais, "Repairs", skin.GetStyle("StationOptions"))) {
			mode = InteractionsMode.repairs;
		}
		
	}
	
	

}

