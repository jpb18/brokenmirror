#pragma strict


public class WeaponsPanel extends Object {
	
	//panel position
	var rect : Rect;
	
	//display coordinates part
	var size : Vector2;
	var y : float;
	var x : float[];
	
	//private variables
	//ship
	private var ship : GameObject;
	//weapons
	private var weapon : IWeaponable;
	private var weapons : GameObject[];
	private var enabled : boolean[];
	//active upgrades
	private var upgrades : IUpgrades;
	private var actives : List.<Active>;
	//mouse over
	private var mouseOver : GameObject;
	//parent script
	private var parent : InventoryPanel;
	//hud skin
	private var skin : GUISkin;
	private var style : GUIStyle;
	
	private static final var ACTIVE_START : int = 3;
	private static final var ACTIVE_COUNT : int = 5;
	private static final var BUTTON_STYLE : String = "WeaponsInventoryButton";
	
	function Set(parent : InventoryPanel, inventory : Inventory, skin : GUISkin) {
		this.parent = parent;
		this.skin = skin;
		this.style = skin.GetStyle(BUTTON_STYLE);
	}
	
	function SetShip(ship : GameObject) {
		//setup ship
		this.ship = ship;
		
		//setup weapons
		weapon = ship.GetComponent(typeof(IWeaponable)) as IWeaponable;
		weapons = new GameObject[3];
		weapons[0] = weapon.getPhaser();
		weapons[1] = weapon.getForwardTorpedo();
		weapons[2] = weapon.getBackwardTorpedo();
		enabled = new boolean[3];
		enabled[0] = weapon.isPhaserEnabled();
		enabled[1] = weapon.isForwardTorpedoEnabled();
		enabled[2] = weapon.isBackwardTorpedoEnabled();
		
		//setup upgrades
		upgrades = ship.GetComponent(typeof(IUpgrades)) as IUpgrades;
		actives = upgrades.getActiveUpgradesList();
		
	}
	
	
	function Draw() {
		
		var rect : Rect = parent.resizeRect(this.rect);
		//Statics.DrawDebugRect(rect, Color.red);		
		GUILayout.BeginArea(rect);
			var mouse : Vector2 = Event.current.mousePosition;
			DrawWeapons(mouse);
			DrawUpgrades(mouse);		
		GUILayout.EndArea();
	}
	
	function getMouseOver() : GameObject {
		var tmp : GameObject = mouseOver;
		mouseOver = null;
		return tmp;
	}
	
	private function DrawWeapons(mouse : Vector2) {
		var rect : Rect;
		for(var i : int = 0; i < weapons.Length; i++) {
			rect = createButtonRect(i);
			rect = parent.resizeRect(rect);
			//Statics.DrawDebugRect(rect, Color.green);
			if(enabled[i]) {
				if(weapons[i]) {
					//Debug.Log(rect + " : " + mouse);
					if(rect.Contains(mouse)) {
						mouseOver = weapons[i];
					}
				
					if(DrawButton(weapons[i], rect, style)) {
						//TODO implements what happens when left clicked
					}
				} else  {
					DrawEmptyButton(rect, style);
				}
				
			}
		}
	
	}
	
	private function DrawUpgrades(mouse : Vector2) {
		var rect : Rect;	
		for(var i : int = 0; i < ACTIVE_COUNT; i++) {
			rect = createButtonRect(i + ACTIVE_START);
			rect = parent.resizeRect(rect);
			//Statics.DrawDebugRect(rect, Color.yellow);
			
			if(i >= actives.Count) {
				DrawEmptyButton(rect, style);
			} else {
			
				if(rect.Contains(mouse)) {
					mouseOver = actives[i];
				}
			
				if(DrawButton(actives[i], rect, style)) {
					//TODO implement what happens when left clicked
				}
			}		
		}
	}
	
	private function createButtonRect(i : int) : Rect {
		return new Rect(x[i], y, size.x, size.y);
	}
	
	private function DrawButton(item : GameObject, rect : Rect, style : GUIStyle) : boolean {
		var imageable : IImageable = item.GetComponent(typeof(IImageable)) as IImageable;
		var image : Texture2D = imageable.getImage();
		return GUI.Button(rect, image, style);
		
	}
	
	private function DrawEmptyButton(rect : Rect, style : GUIStyle) {
		GUI.Button(rect, "", style);
	}
	



}

