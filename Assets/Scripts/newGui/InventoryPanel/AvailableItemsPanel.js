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
	private var mouseOver : Object;
	private var rightClick : Object;
	
	function Set(parent : InventoryPanel) {
		this.parent = parent;
		mouseOver = null;
	}
	


	function draw(items : Object[], skin : GUISkin) {
		//Statics.DrawDebugRect(parent.resizeRect(area), Color.red);
		GUILayout.BeginArea(parent.resizeRect(area));
			for(var i : int = 0; i < AREAS; i++) {
				//Statics.DrawDebugRect(parent.resizeRect(itemArea[i]), Color.blue);
				drawItemsArea(itemArea[i], items, i, skin);
			}
			
		GUILayout.EndArea();
	}
	
	function getMouseOver() : Object {
		
		return mouseOver;
	}
	
	function GetRightClick() : Object {
		var tmp : Object = this.rightClick;
		this.rightClick = null;
		return tmp;
	}
	
	function clear() {
		mouseOver = null;
	}
	
	private function drawItemsArea(area : Rect, items : Object[], areaNum : int, skin : GUISkin) {
		var startValue : int = ITEMS * areaNum;
		if(startValue <= items.Length && items.Length > 0) {
			GUILayout.BeginArea(parent.resizeRect(area));
				for(var i : int = 0; i < ROWS; i++) {
					var rowValue : int = startValue + i * COLUMNS;
					for(var x : int = 0; x < COLUMNS; x++) {
						var val : int = rowValue + x;
						if(val < items.Length) {
							//calculate rect
							var rect : Rect = new Rect(columns[x], rows[i], buttonWidth, buttonHeight); 
							var resizedRect : Rect = parent.resizeRect(rect);
							var obj : Object = items[val];
							
							if(obj instanceof GameObject) {
								drawInventoryButton(resizedRect, obj as GameObject);
							} else if (obj instanceof Cargo) {
								drawCargoButton(resizedRect, obj as Cargo, skin);
							}
							
							
							if(resizedRect.Contains(Event.current.mousePosition)) {
								mouseOver = obj;
								
								if(Input.GetMouseButtonDown(1)) { //process left click
									//Debug.Log("RIGHT CLICK! :D");
									rightClick = obj;
								}
								
							}
							
						}
					}
					
				}
			GUILayout.EndArea();
		}
	}
	//pre: obj instanceof GameObject && obj != null
	private function drawInventoryButton(rect : Rect, obj : GameObject) {
		var imageable : IImageable = obj.GetComponent(typeof(IImageable)) as IImageable;
		var texture : Texture2D = imageable.getImage();
		if(MyButton(rect, texture)) {
			//TODO Whatever these buttons do...
			//Debug.Log("I was clicked!!!! :D");
		}
	}
	
	private function drawCargoButton(rect : Rect, obj : Cargo, skin : GUISkin) {
		
		var cargo : GameObject = obj.getCargo();
		var imageable : IImageable = cargo.GetComponent(typeof(IImageable)) as IImageable;
		var texture : Texture2D = imageable.getImage();
		if(MyButton(rect, texture)) {
			//TODO Whatever these buttons do...
		}
		
		var style : GUIStyle = 	skin.GetStyle("CargoNumberLabel");
		GUI.Label(rect, obj.getSize().ToString(), style);
		
	}
	
	private function MyButton(rect : Rect, texture : Texture) : boolean {
		
		var ret : boolean = GUI.Button(rect, "");
		GUI.DrawTexture(rect, texture, ScaleMode.StretchToFill);		
		return ret;
	}

}
