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
	private var selected : int;
	private var fleet : GameObject[];
	private var images : Texture2D[];
	
	private var lastLineChange : float;
	public static final var TIME : float = 0.1f;
	
	function Set(parent : InventoryPanel) {
		this.parent = parent;
		Reset();
	}
	
	function SetFleet(player : GameObject, ships : GameObject[]) {
		this.fleet = new GameObject[ships.Length + 1];
		this.fleet[0] = player;
		for(var i : int = 0; i < ships.Length; i++) {
			this.fleet[i+1] = ships[i]; 
		}
		
		this.images = new Texture2D[this.fleet.Length];
		for(i = 0; i < this.fleet.Length; i++) {
			var text : ITextureable = this.fleet[i].GetComponent(typeof(ITextureable)) as ITextureable;
			this.images[i] = text.getStoreImage();
		}
		
	}
	
	function Draw(skin : GUISkin) : boolean {
	
		var buttonStyle : GUIStyle = skin.GetStyle("ShipInventoryButton");
		var upStyle : GUIStyle = skin.GetStyle("UpInventoryButton");
		var downStyle : GUIStyle = skin.GetStyle("DownInventoryButton");
	
		var changed : boolean = false;
		var count : int = fleet.Length + 1;
		var rect : Rect = parent.resizeRect(panel);
		//Statics.DrawDebugRect(rect, Color.red);
		GUILayout.BeginArea(rect);

			
			if(count <= maxShown) changed = DrawFixed(buttonStyle);
			else changed = DrawNonFixed(buttonStyle, upStyle, downStyle);			
			
			
		GUILayout.EndArea();
		
		return changed;
		
	}
	
	private function DrawFixed(style : GUIStyle) : boolean{
		var changed : boolean = false;
		var rect : Rect;
		//and now lets do the remaining ones
		for(var i : int = 0; i < maxShown; i++) {
			//calc rect
			rect = calculateRect(i);
			rect = parent.resizeRect(rect);
			if(i < fleet.Length) {
				if(DrawButton(rect, images[i], style)) {
					changed = true;
					selected = i;	
				}
			} else {
				DrawEmptyButton(rect, style);
			}
			
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
	
	private function DrawButton(rect : Rect, image : Texture2D, style : GUIStyle) : boolean {
	
		//Statics.DrawDebugRect(rect, Color.blue);
		if(GUI.Button(rect, image, style)) {
			return true;
		}
		return false;
	}
	
	private function DrawEmptyButton(rect : Rect, style : GUIStyle) {
		//Statics.DrawDebugRect(rect, Color.blue);
		GUI.Button(rect, "", style);
	}
	
	private function DrawNonFixed(shipStyle : GUIStyle, upStyle : GUIStyle, downStyle : GUIStyle) : boolean {
		var changed : boolean = false;
		//first lets get the starting ship
		var start : int = line * 2;
		
		//Here goes the up button (pointing up)
		var rect : Rect = parent.resizeRect(upButton);
		if(GUI.Button(rect, "", upStyle) && Time.time > lastLineChange + TIME) {
			lastLineChange = Time.time;
			line++;
		}
		
		var count : int = fleet.Length - start;		
		//now lets print them all
		for(var i : int = 0; i < maxShown; i++) {
			rect = calculateRect(i);
			rect = parent.resizeRect(rect);			
			if(i < count) {
				if(DrawButton(rect, images[i + start], shipStyle)) {
					//var teste : shipProperties = fleet[i + start].GetComponent(shipProperties);
					changed = true;
					selected = i + start;	
				}
			} else {
				DrawEmptyButton(rect, shipStyle);
			}
			//Debug.Log("Print button " + i + ";");
		}
		
		//and here goes the down button
		rect = parent.resizeRect(downButton);
		if(GUI.Button(rect, "", downStyle) && Time.time > lastLineChange + TIME) {
			lastLineChange = Time.time;
			line--;
		}
	
		return changed;
	}
	
	function getSelected() : GameObject {
		return fleet[selected];
	}
	
	function Reset() {
		line = 0;
		selected = 0;
		lastLineChange = 0;
	}


}