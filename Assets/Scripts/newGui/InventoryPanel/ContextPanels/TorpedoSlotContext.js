#pragma strict

public class TorpedoSlotContext extends TorpedoContext {

	public static final var COUNT_S : int = 2;

	function TorpedoSlotContext(rect : Rect, skin : GUISkin, weapon : GameObject, open : float, ship : GameObject, inventory : Inventory, weapons : WeaponsPanel) {
		super(rect, COUNT_S, skin, weapon, open, ship, inventory, weapons);	
	}
	
	
	function Draw() {
		if(!super.on) return;
		
		super.CheckOutsideClosure();
		
		GUILayout.BeginArea(super.rect);
		
			if(GUILayout.Button("Unload")) {
				Unload();
				super.Close();
			}
			
			if(GUILayout.Button("Toggle")) {
				Toggle();
				super.Close();
			}
					
		GUILayout.EndArea();
		
	
	}
	
	private function Unload() {
	
	}

	private function Toggle() {
		var tmp : GameObject = super.torpedo1.torpedo;
		super.torpedo1.torpedo = super.torpedo2.torpedo;
		super.torpedo1.torpedo = tmp;
	
	}
	


}
