#pragma strict

public class TorpedoContext extends WeaponContext {

	protected var torpedo1 : Torpedo;
	protected var torpedo2 : Torpedo;
	
	public static final var COUNT : int = 3;
	
	function TorpedoContext(rect : Rect, skin : GUISkin, torpedo : GameObject, open : float, ship : GameObject, inventory : Inventory, weapons : WeaponsPanel) {
		this(rect, COUNT, skin, torpedo, open, ship, inventory, weapons);	
	}
	
	function TorpedoContext(rect : Rect, itemCount : int, skin : GUISkin, torpedo : GameObject, open : float, ship : GameObject, inventory : Inventory, weapons : WeaponsPanel) {
		super(rect, itemCount, skin, torpedo, open, ship, inventory, weapons);
		this.torpedo1 = super.weapons.torp1;
		this.torpedo2 = super.weapons.torp2;
	
	}
	
	function Draw() {
		if(!super.on) return;
		
		
		GUILayout.BeginArea(super.rect);
		
			//first check if the weapon slot is enabled
			if(torpedo1.isEnabled) {		
				if(GUILayout.Button("Load Forward")) { //if it's draw the button
					LoadWeapon(torpedo1);
					super.Close(); //and close
					 
				}
			}
			
			if(torpedo2.isEnabled) {
				if(GUILayout.Button("Load Backward")) {
					LoadWeapon(torpedo2);
					super.Close();
				}
			}
			
			if(GUILayout.Button("Eject")) {
				super.Eject();
				super.Close();
				
			}
					
		GUILayout.EndArea();
	
	}

	private function LoadWeapon(slot : Torpedo) {
	
		if(slot.torpedo) {
			super.inventory.addItem(slot.torpedo);
		}
		
		super.inventory.removeItem(super.weapon);
		
		slot.torpedo = super.weapon;
		
		super.weaponsPanel.UpdateWeapons();
	
	}


}
