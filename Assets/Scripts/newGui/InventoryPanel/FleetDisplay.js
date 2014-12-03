#pragma strict


public class FleetDisplay {

	var panel : Rect;
	var upButton : Rect;
	var downButton : Rect;
	
	var button : Vector2;
	var y : float[];
	var x : float[];
	
	var maxShown : int;
	var line : int = 0;
	
	private var parent : InventoryPanel;
	private var selected : GameObject;
	
	function Set(parent : InventoryPanel) {
		this.parent = parent;
		Reset();
	}
	
	function SetSelected(player : GameObject) {
		this.selected = player;
	}
	
	function Draw(player : GameObject, fleet : GameObject[], skin : GUISkin) : boolean {
	
		var buttonStyle : GUIStyle = skin.GetStyle("ShipInventoryButton");
	
		var changed : boolean = false;
		var count : int = fleet.Length + 1;
		var rect : Rect = parent.resizeRect(panel);
		//Statics.DrawDebugRect(rect, Color.red);
		GUILayout.BeginArea(rect);
			rect = parent.resizeRect(upButton);
			//Statics.DrawDebugRect(rect, Color.green);
			
			if(count <= maxShown) changed = DrawFixed(player, fleet, buttonStyle);
			else changed = DrawNonFixed();			
			
			rect = parent.resizeRect(downButton);
			//Statics.DrawDebugRect(rect, Color.yellow);
		GUILayout.EndArea();
		
		return changed;
		
	}
	
	private function DrawFixed(player : GameObject, fleet : GameObject[], style : GUIStyle) : boolean{
		var changed : boolean = false;
		//lets draw the player button first
		var rect : Rect = new Rect(x[0], y[0], button.x, button.y);
		rect = parent.resizeRect(rect);
		if(DrawButton(rect, player, style)) changed = true;
		
		//and now lets do the remaining ones
		for(var i : int = 0; i < maxShown - 1; i++) {
			//calc rect
			rect = calculateRect(i+1);
			rect = parent.resizeRect(rect);
			if(i < fleet.Length)
				if(DrawButton(rect, fleet[i], style)) changed = true;
			else
				DrawEmptyButton(rect, style);
			
		}
		
		return changed;
		
	}
	
	private function calculateRect(element : int) {
		var line : int = element/2;
		var column : int = element % 2;
		var x : float = x[column];
		var y : float = y[line];
		var rect : Rect = new Rect(x, y, button.x, button.y);
		return rect;
	}
	
	private function DrawButton(rect : Rect, ship : GameObject, style : GUIStyle) : boolean {
		var texturable : ITextureable = ship.GetComponent(typeof(ITextureable)) as ITextureable;
		var image : Texture = texturable.getStoreImage();
		//Statics.DrawDebugRect(rect, Color.blue);
		if(GUI.Button(rect, image, style)) {
			selected = ship;
			return true;
		}
		return false;
	}
	
	private function DrawEmptyButton(rect : Rect, style : GUIStyle) {
		//Statics.DrawDebugRect(rect, Color.blue);
		GUI.Button(rect, "", style);
	}
	
	private function DrawNonFixed() : boolean {
		return false;
	}
	
	function getSelected() : GameObject {
		return selected;
	}
	
	function Reset() {
		line = 0;
		selected = null;
	}


}