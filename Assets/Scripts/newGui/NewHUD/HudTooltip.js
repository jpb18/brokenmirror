#pragma strict

public class HudTooltip extends HUDElement {

	var on : boolean;
	var object : GameObject;
	var rect : Rect;
	var type : MouseOverType;
	var itemStyle : GUIStyle;
	var textStyle : GUIStyle;
	
	private var image : Texture;
	private var text : String;
	
	function OnEnable() {
		on = false;
	}
		
	function Set(rect : Rect, object : Object) {
		this.on = true;
		this.type = MouseOverType.ITEM;
		this.rect = rect;
		if(this.object == object) return;
		
		this.object = object;
		
		
		var image : IImageable = this.object.GetComponent(typeof(IImageable)) as IImageable;
		var desc : IDescribable = this.object.GetComponent(typeof(IDescribable)) as IDescribable;
		var name : INameable = this.object.GetComponent(typeof(INameable)) as INameable;
		
		this.image = image.getImage();
		this.text = name.getName() + "\n" + desc.getDescription();
	}
	
	function Set(rect : Rect, text : String) {
		this.on = true;
		this.type = MouseOverType.TEXT;
		this.rect = rect;
		this.text = text;
	}	
	
	function OnGUI() {
		if(on && hud.isShowingGui()) {
			
			if(type == MouseOverType.ITEM) {
				DrawItem();
			} else if (type == MouseOverType.TEXT) {
				DrawText();
			}
			
			on = false;
		}		
	}
	
	private function DrawItem() {

		Tooltip.DrawTooltip(rect, image, text, itemStyle);
			
	}
	
	private function DrawText() {
		Tooltip.DrawTooltip(rect, text, textStyle);	
	}

}