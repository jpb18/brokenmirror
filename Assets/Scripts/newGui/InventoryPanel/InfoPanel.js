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

	function draw(object : Object, skin : GUISkin) {
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
	
	private function drawItem(object : Object, skin : GUISkin) {
		var nameStyle : GUIStyle = skin.GetStyle("NameInfoLabel");
		var descStyle : GUIStyle = skin.GetStyle("DescriptionInfoLabel");
		
		var resizedName : Rect = parent.resizeRect(name);
		var resizedDesc = parent.resizeRect(desc);
		
		if(object instanceof GameObject) {
			drawInventoryDescription(resizedName, resizedDesc, object, nameStyle, descStyle);
		} else if (object instanceof Cargo) {
			drawCargoDescription(resizedName, resizedDesc, object, nameStyle, descStyle);
		}
		  
	}
	
	private function drawInventoryDescription(nameRect : Rect, descRect : Rect, object : GameObject, nameStyle : GUIStyle, descStyle : GUIStyle) {
		var describable : IDescribable = object.GetComponent(typeof(IDescribable)) as IDescribable;
		var description = describable.getDetailsDescription();
		
		var nameable : INameable = object.GetComponent(typeof(INameable)) as INameable;
		var name = nameable.getName();
		
		
		GUI.Label(nameRect, name, nameStyle);
		GUI.Label(descRect, description, descStyle);
	
	}
	

	private function drawCargoDescription(nameRect : Rect, descRect : Rect , object : Cargo, nameStyle : GUIStyle, descStyle : GUIStyle) {
		GUI.Label(nameRect, object.getName(), nameStyle);
		GUI.Label(descRect, object.getDetailsDescription(), descStyle);
	}

}
