#pragma strict


public class Context extends Object {

	private var context : ContextPanel;
	
	var itemSize : Vector2;
	var skin : GUISkin;
	
	private var lastOpen : float = 0f;
	private static final var TIME : float = 0.1f;
	
	private var inventory : Inventory;
	private var weapons : WeaponsPanel;
	
	function Set(inventory : Inventory, weapons : WeaponsPanel) {
		this.inventory = inventory;
		this.weapons = weapons;
	
	}
	
	
	function Open(object : Object, position : Vector2, ship : GameObject) {
		if(Time.time < lastOpen + TIME) {
			return;
		}
		
		lastOpen = Time.time;
		
		var count : int = 0;
		
		if(object instanceof GameObject) {
			var go : GameObject = object as GameObject;
			if(go.tag == "Phaser" || go.tag == "Disruptor") {
				count = PhaserContext.COUNT+1;
				var rect : Rect = GetRect(position, itemSize, count);
				context = new PhaserContext(rect, skin, go, lastOpen, ship, inventory, weapons);
				context.Open();
				Debug.Log("Context window is open.");
			}
		
		}
			
					
	}
	
	function Draw() {
		if(context == null || !context.IsOpen()) return; //if it doesn't exist or it isn't open, return...
		
		context.Draw(); //DRAW IT! :D
		
	}


	private function GetRect(position : Vector2, size : Vector2, count : int) {
		return new Rect(position.x, position.y, size.x, size.y * count);
	}

}
