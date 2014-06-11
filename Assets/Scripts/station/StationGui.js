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
	
	function setWindow(health : Health, info : StationInterface, inv : Inventory) {
		this.health = health;
		this.info = info;
		this.inv = inv;
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
	
	var mode : StoreMode = StoreMode.ships;
	
	function draw(info : StationInterface, skin : GUISkin, inv : Inventory) {
		GUILayout.BeginArea(area);
			//Draw background
			GUI.DrawTexture(Rect(0,0, area.width, area.height), bg_image);
			
			//Draw Option Buttons
			optionsButton(skin);		
			
			//Draw Store Buttons
			var store : List.<GameObject> = info.getStore(mode);
			storeButtons(store, skin, inv, info);
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
	
	private function storeButtons(store : List.<GameObject>, skin : GUISkin, inv : Inventory, info : StationInterface) {
		
		
		
		for(var i :int = 0; i < store.Count; i++) {
		
			storeButton(store[i], store_buttons[i], skin, inv, info);
		
		}
	
	}
	
	private function storeButton(item : GameObject, rect : Rect, skin : GUISkin, inv : Inventory, info : StationInterface) {
			
		
		if(GUI.Button(rect, getImage(item), skin.GetStyle("StoreButton"))) {
		
			buttonAction(inv, item, info);
		
		}
		
	
	}
	
	private function buttonAction(inv : Inventory, item : GameObject, info : StationInterface) {
	
		switch(mode) {
		
			case StoreMode.items:
				buyItem(inv, item, info);
				break;
			case StoreMode.ships:
				buyShip(inv, item, info);
				break;
		
		}
	
	}
	
	private function buyItem(inv : Inventory, item : GameObject, info : StationInterface) {
		var message : ShowMessage = info.getMessage();
		if(inv.isFull()) {
			
			message.AddMessage("Inventory is full.");
		} else if (!inv.canBuy(getPrice(item))) {
			
			message.AddMessage("Not enough credits.");
		} else {
			var cargo : Cargo = new Cargo(item, 1, getPrice(item));
			inv.addItem(cargo);
			inv.spend(getPrice(item));
		}
	}
	
	private function buyShip(inv : Inventory, item : GameObject, info : StationInterface) {
		if (!inv.canBuy(getPrice(item))) {
			var message : ShowMessage = info.getMessage();
			message.AddMessage("Not enough credits.");
		} else {
			inv.spend(getPrice(item));
			
			var newShip : GameObject = GameObject.Instantiate(item, info.genSpawnPos(), Quaternion.identity);
			newShip.transform.LookAt(info.getPosition());
			
			var props : shipProperties = newShip.GetComponent(shipProperties);
			props.setFaction(0);
			props.setPlayer(false);
		}
		
	
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
	
	
	private function getPrice(item : GameObject) : int {
		var price : int = 0;
		
		if(item.tag == "Ship") {
			price = item.GetComponent(shipProperties).getPrice();
		} else if (item.tag == "Torpedoes" || item.tag == "Phaser") {
			price = item.GetComponent(weaponScript). getPrice();		
		}
		
		return price;
	}
	
	private function mouseOver(store : List.<GameObject>, skin : GUISkin) {
	
		if(hasMouseOver(store.Count)) {
			var num : int = getMouseOver(store.Count);
			var obj : GameObject = store[num];
			GUI.Label(name_label, getName(obj) + " - " + getPrice(obj).ToString() + " cr", skin.GetStyle("StationLabel"));
			GUI.Label(desc_label, getDescription(obj), skin.GetStyle("StationLabel"));
		
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

