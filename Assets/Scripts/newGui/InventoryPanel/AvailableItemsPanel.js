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
	
	function Set(parent : InventoryPanel) {
		this.parent = parent;
	}

	function draw(items : GameObject[], skin : GUISkin) {
		var style : GUIStyle = skin.GetStyle("InventoryButton");
		//Statics.DrawDebugRect(parent.resizeRect(area), Color.red);
		GUILayout.BeginArea(parent.resizeRect(area));
			for(var i : int = 0; i < AREAS; i++) {
				Statics.DrawDebugRect(itemArea[i], Color.blue);
				drawItemsArea(itemArea[i], items, i, style);
			}
			
		GUILayout.EndArea();
	}
	
	private function drawItemsArea(area : Rect, items : GameObject[], areaNum : int, style : GUIStyle) {
		var startValue : int = ITEMS * areaNum;
		if(startValue >= items.Length && items.Length > 0) {
			GUILayout.BeginArea(parent.resizeRect(area));
				for(var i : int = 0; i < ROWS; i++) {
					var rowValue : int = startValue + i * COLUMNS;
					for(var x : int = 0; x < COLUMNS; x++) {
						var val : int = rowValue + x;
						if(items[val]) {
							var imageable : IImageable = items[val].GetComponent(typeof(IImageable)) as IImageable;
							var texture : Texture2D = imageable.getImage();
							var rect : Rect = new Rect(columns[x], rows[i], buttonWidth, buttonHeight); 
							Statics.DrawDebugRect(parent.resizeRect(rect), Color.green);
							if(GUI.Button(parent.resizeRect(rect), texture, style)) {
								//TODO Whatever these buttons do...
							}
						}
					}
					
				}
			GUILayout.EndArea();
		}
	}
	


}
