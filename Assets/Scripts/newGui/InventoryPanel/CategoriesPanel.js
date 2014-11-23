#pragma strict

public class CategoriesPanel {

	var area : Rect;
	var inventory : Rect;
	var cargo : Rect;
	var missions : Rect;
	var status : Rect;
	
	var category : Category;

	private var parent : InventoryPanel;
	
	function Set(parent : InventoryPanel) {
		this.parent = parent;
	}
	
	function draw(skin : GUISkin) {
		
		GUILayout.BeginArea(parent.resizeRect(area));
		
			var style : GUIStyle = skin.GetStyle("CategoryButton");		
			drawButton(parent.resizeRect(inventory), "Inventory", Category.INVENTORY, style);
			drawButton(parent.resizeRect(cargo), "Cargo", Category.CARGO, style);
			drawButton(parent.resizeRect(missions), "Missions", Category.MISSIONS, style);
			drawButton(parent.resizeRect(status), "Status Report", Category.STATUS, style);
		
		GUILayout.EndArea();
	}
	
	function isInventory() : boolean {
		return category == Category.INVENTORY;
	}
	
	function isCargo() : boolean {
		return category == Category.CARGO;
	}
	
	function isMissions() : boolean {
		return category == Category.MISSIONS;
	}
	
	function isStatus() : boolean {
		return category == Category.STATUS;
	}
	
	function reset() {
		category = Category.INVENTORY;
	}

	private function drawButton(rect : Rect, text : String, option : Category, style : GUIStyle) {
		
		if(GUI.Button(rect, text, style)) {
			category = option;
		}
		
	}
	
	private enum Category {
		INVENTORY,
		CARGO,
		MISSIONS,
		STATUS

	}
	
	

}

