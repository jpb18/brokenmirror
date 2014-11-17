#pragma strict

public class AvailableItemsPanel {

	var area : Rect;
	
	var itemArea : Rect[];
	
	var buttonWidth : float;
	var buttonHeight : float;
	
	var columns : float[];
	var rows : float[];
	
	public static final var COLUMNS : int = 3;
	public static final var ROWS : int = 3;
	public static final var ITEMS : int = 9;
	public static final var AREAS : int = 4;
	
	private var parent : InventoryPanel;
	private var mouseOver : GameObject;
	
	function Set(parent : InventoryPanel) {
		this.parent = parent;
		mouseOver = null;
	}

	function draw(items : GameObject[], skin : GUISkin) {
		var style : GUIStyle = skin.GetStyle("InventoryButton");
		//Statics.DrawDebugRect(parent.resizeRect(area), Color.red);
		GUILayout.BeginArea(parent.resizeRect(area));
			for(var i : int = 0; i < AREAS; i++) {
				//Statics.DrawDebugRect(parent.resizeRect(itemArea[i]), Color.blue);
				drawItemsArea(itemArea[i], items, i, style);
			}
			
		GUILayout.EndArea();
	}
	
	function getMouseOver() : GameObject {
		
		return mouseOver;
	}
	
	function clear() {
		mouseOver = null;
	}
	
	private function drawItemsArea(area : Rect, items : GameObject[], areaNum : int, style : GUIStyle) {
		var startValue : int = ITEMS * areaNum;
		if(startValue <= items.Length && items.Length > 0) {
			GUILayout.BeginArea(parent.resizeRect(area));
				for(var i : int = 0; i < ROWS; i++) {
					var rowValue : int = startValue + i * COLUMNS;
					for(var x : int = 0; x < COLUMNS; x++) {
						var val : int = rowValue + x;
						if(val < items.Length) {
							var imageable : IImageable = items[val].GetComponent(typeof(IImageable)) as IImageable;
							var texture : Texture2D = imageable.getImage();
							var rect : Rect = new Rect(columns[x], rows[i], buttonWidth, buttonHeight); 
							//Statics.DrawDebugRect(parent.resizeRect(rect), Color.green);
							var resizedRect : Rect = parent.resizeRect(rect);
							if(MyButton(resizedRect, texture)) {
								//TODO Whatever these buttons do...
								//Debug.Log("I was clicked!!!! :D");
							}
							
							if(resizedRect.Contains(Event.current.mousePosition)) {
								mouseOver = items[val];
							}
							
						}
					}
					
				}
			GUILayout.EndArea();
		}
	}
	
	private function MyButton(rect : Rect, texture : Texture) : boolean {
		
		var ret : boolean = GUI.Button(rect, "");
		GUI.DrawTexture(rect, texture, ScaleMode.StretchToFill);		
		return ret;
	}

}
