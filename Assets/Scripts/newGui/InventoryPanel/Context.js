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
	
	
	function Open(object : Object, position : Vector2, ship : GameObject, slot : boolean) {
		if(Time.time < lastOpen + TIME) {
			return;
		}
		
		if(slot) {
			OpenSlot(object, position, ship);
		} else {
			OpenInventory(object, position, ship);
		}
					
	}
	
	function OpenInventory(object : Object, position : Vector2, ship : GameObject) {
		if(Time.time < lastOpen + TIME) {
			return;
		}
	
		lastOpen = Time.time;
		var count : int = 0;
		var rect : Rect;
		if(object instanceof GameObject) {
			var go : GameObject = object as GameObject;
			if(go.tag == "Phaser" || go.tag == "Disruptor") {
				count = PhaserContext.COUNT;
				rect = GetRect(position, itemSize, count);
				context = new PhaserContext(rect, skin, go, lastOpen, ship, inventory, weapons);
				context.Open();
				//Debug.Log("Context window is open.");
			} else if (go.tag == "Torpedoes") {
				count = TorpedoContext.COUNT;
				rect = GetRect(position, itemSize, count);
				context = new TorpedoContext(rect, skin, go, lastOpen, ship, inventory, weapons);
				context.Open();
			} else {
				Debug.LogWarning("Unimplemented Item type: name:" + go.name + " tag: " + go.tag);
			}
		
		} else {
			Debug.LogWarning("Unimplemented Object!");
		}
	}
	
	function OpenSlot(object : Object, position : Vector2, ship : GameObject) {
		if(Time.time < lastOpen + TIME) {
			return;
		}
	
		lastOpen = Time.time;
		var count : int = 0;
		var rect : Rect;
		
		if(object instanceof GameObject) {
			var go : GameObject = object as GameObject;
			if(go.tag == "Phaser" || go.tag == "Disruptor") {
				count = PhaserSlotContext.COUNT_S;
				rect = GetRect(position, itemSize, count);
				context = new PhaserSlotContext(rect, skin, go, lastOpen, ship, inventory, weapons);
				context.Open();
			} else {
				Debug.LogWarning("Unimplemented Item type: name:" + go.name + " tag: " + go.tag);
			}
			
		} else {
			Debug.LogWarning("Unimplemented Object!");
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
