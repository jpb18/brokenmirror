#pragma strict

public class InfoPanel {
	
	var area : Rect;
	
	var none : Rect;
	var name : Rect;
	var desc : Rect;
	
	private var parent : InventoryPanel;
	
	public static final var NONE : String = "Mouse Over an icon to see its description.";

	function Set(parent : InventoryPanel) {
		this.parent = parent;
	}

	function draw(object : GameObject, skin : GUISkin) {
		var resized : Rect = parent.resizeRect(area);
		//Statics.DrawDebugRect(resized, Color.red);
		GUILayout.BeginArea(resized);
		if(object == null) {
			drawNone(skin);
		} else {
			drawItem(object, skin);
		}
		GUILayout.EndArea();
	
	}
	
	private function drawNone(skin : GUISkin) {
		var style : GUIStyle = skin.GetStyle("NoInfoLabel");
		var resized : Rect = parent.resizeRect(none);
		//Statics.DrawDebugRect(resized, Color.blue);
		GUI.Label(resized, NONE, style);
	}
	
	private function drawItem(object : GameObject, skin : GUISkin) {
		var nameStyle : GUIStyle = skin.GetStyle("NameInfoLabel");
		var descStyle : GUIStyle = skin.GetStyle("DescriptionInfoLabel");
		
		var resized : Rect = parent.resizeRect(name);
		GUI.Label(resized, fetchName(object), nameStyle);
		
		resized = parent.resizeRect(desc);
		GUI.Label(resized, fetchDescription(object), descStyle);
		
		  
	}

	private function fetchDescription(object : GameObject) : String {
		var describable : IDescribable = object.GetComponent(typeof(IDescribable)) as IDescribable;
		return describable.getDetailsDescription();
	}
	
	private function fetchName(object : GameObject) : String {
		var nameable : INameable = object.GetComponent(typeof(INameable)) as INameable;
		return nameable.getName();
	}

}
