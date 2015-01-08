#pragma strict

public class PhaserSlotContext extends PhaserContext {

	public static final var COUNT_S : int = 1;

	function PhaserSlotContext(rect : Rect, skin : GUISkin, weapon : GameObject, open : float, ship : GameObject, inventory : Inventory, weapons : WeaponsPanel) {
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
					
		GUILayout.EndArea();
		
	
	}
	
	function Unload() {
		
		super.inventory.addItem(super.weapon);
		
		super.phaser.phaser = null;
		
		super.weaponsPanel.UpdateWeapons();
	
	}



}