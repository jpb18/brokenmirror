import System.Collections.Generic;
#pragma strict

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
			
			inv.addItem(item);
			inv.spend(getPrice(item));
		}
	}
	
	private function buyShip(inv : Inventory, item : GameObject, info : StationInterface) {
		if (!inv.canBuy(getPrice(item))) {
			var message : ShowMessage = info.getMessage();
			message.AddMessage("Not enough latinum.");
		} else {
			inv.spend(getPrice(item));
			
			var newShip : GameObject = GameObject.Instantiate(item, info.genSpawnPos(), Quaternion.identity);
			newShip.transform.LookAt(info.getPosition());
			newShip.name = Statics.RemoveClone(newShip.name);
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
		} else if (item.tag == "Upgrade") {
				text = item.GetComponent(Upgrade).getImage();
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
		} else if (item.tag == "Upgrade") {
			name = item.GetComponent(Upgrade).getName();
		}
		
		return name;
	
		
	}
	
	private function getDescription(item : GameObject) : String {
		var desc : String = "";
		
		if(item.tag == "Ship") {
			desc = item.GetComponent(shipProperties).getDescription();
		} else if (item.tag == "Torpedoes" || item.tag == "Phaser") {
			desc = item.GetComponent(weaponScript). getDescription();		
		} else if (item.tag == "Upgrade") {
			desc = item.GetComponent(Upgrade).getDescription();
		}
		
		return desc;
	
	}
	
	
	private function getPrice(item : GameObject) : int {
		var price : int = 0;
		
		if(item.tag == "Ship") {
			price = item.GetComponent(shipProperties).getPrice();
		} else if (item.tag == "Torpedoes" || item.tag == "Phaser") {
			price = item.GetComponent(weaponScript). getPrice();		
		} else if (item.tag == "Upgrade") {
			price = item.GetComponent(Upgrade).getCost();
		}
		
		return price;
	}
	
	private function mouseOver(store : List.<GameObject>, skin : GUISkin) {
	
		if(hasMouseOver(store.Count)) {
			var num : int = getMouseOver(store.Count);
			var obj : GameObject = store[num];
			GUI.Label(name_label, getName(obj) + " - " + getPrice(obj).ToString() + " GPL", skin.GetStyle("StationLabel"));
			GUI.Label(desc_label, getDescription(obj), skin.GetStyle("StationLabel"));
		
		}
	
	}

}
