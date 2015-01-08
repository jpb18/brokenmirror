#pragma strict

public class PhaserContext extends WeaponContext {

	protected var phaser : Phaser;

	public static final var COUNT : int = 2;

	function PhaserContext(rect : Rect, skin : GUISkin, phaser : GameObject, open : float, ship : GameObject, inventory : Inventory, weapons : WeaponsPanel) {
		this(rect, COUNT, skin, phaser, open, ship, inventory, weapons);
				
	}
	
	function PhaserContext(rect : Rect, itemCount : int, skin : GUISkin, phaser : GameObject, open : float, ship : GameObject, inventory : Inventory, weapons : WeaponsPanel) {
		super(rect, itemCount, skin, phaser, open, ship, inventory, weapons);
		
		this.phaser = super.weapons.phaser;
		
	}
	
	

	function Draw() {
		//first check if its on
		if(!super.on) return;
	
		super.CheckOutsideClosure();
	
		//first draw area
		//Statics.DrawDebugRect(super.rect, Color.red);
		GUILayout.BeginArea(super.rect);
		
			//first check if the weapon slot is enabled
			if(phaser.isEnabled) {		
				if(GUILayout.Button("Load into slot")) { //if it's draw the button
					LoadWeapon(); //load the weapon into slot
					super.Close(); //and close
					 
				}
			}
			
			if(GUILayout.Button("Eject")) {
				super.Eject();
				super.Close();
				
			}
					
		GUILayout.EndArea();
		
		
			
					
	}
	
	private function LoadWeapon() {
		//first check if there's a phaser equiped
		//if there's put it into the inventory
		if(phaser.phaser) {
			super.inventory.addItem(phaser.phaser);
			//Debug.Log("Placed " + phaser.phaser.name + " in inventory");
		}
		
		//now we remove the weapon we're going to add from the inventory...
		super.inventory.removeItem(super.weapon);
		//Debug.Log("Removed " + super.weapon.name + " from inventory");
		
		//and now we place it into the slot
		phaser.phaser = super.weapon;
		//Debug.Log("Placed " + super.weapon.name + " in weapon slot");
		
		super.weaponsPanel.UpdateWeapons();
	
	}
	

}
