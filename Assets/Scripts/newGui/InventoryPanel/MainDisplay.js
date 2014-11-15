#pragma strict


public class MainDisplay {

	var areaRect : Rect;
	var shipNameRect : Rect;
	var shipClassRect : Rect;
	
	private var parent : InventoryPanel;
	
	function Set(parent : InventoryPanel) {
		this.parent = parent;
	}
	
	function draw(name : INameable, classe : IClasseable, skin : GUISkin) {

		GUILayout.BeginArea(parent.resizeRect(areaRect));
		var style : GUIStyle = skin.GetStyle("DisplayLabel");
		GUI.Label(parent.resizeRect(shipNameRect), name.getName(), style);
		GUI.Label(parent.resizeRect(shipClassRect), classe.getClass(), style);
		GUILayout.EndArea();
	
	}
	
	

	

}