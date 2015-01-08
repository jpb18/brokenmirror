#pragma strict

public class WeaponContext extends ContextPanel {

	protected var weapon : GameObject;
	protected var ship : GameObject;
	protected var inventory : Inventory;
	
	
	protected var weapons : shipWeapons;
	protected var weaponsPanel : WeaponsPanel;

	function WeaponContext(rect : Rect, itemCount : int, skin : GUISkin, weapon : GameObject, open : float, ship : GameObject, inventory : Inventory, weapons : WeaponsPanel) {
		super(rect, itemCount, skin, open);
		this.weapon = weapon;
		this.ship = ship;
		this.inventory = inventory;
		this.weaponsPanel = weapons;
		this.weapons = ship.GetComponent.<shipWeapons>();
		
	}
	
	protected function Eject() {
	
		inventory.removeItem(weapon);
	
	}

}
