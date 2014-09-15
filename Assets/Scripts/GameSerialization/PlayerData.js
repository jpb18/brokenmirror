#pragma strict
import System.Xml.Serialization;

@XmlRoot("PlayerData")
public class PlayerData {
	@XmlAttribute("name")
	var name : String;
	@XmlAttribute("faction")
	var faction : int;
	
	var inventory : InventoryData;
	var cargo : CargoData;
	var ship : ShipData;
	
	function PlayerData() {
		name = "";
		faction = 0;
		inventory = new InventoryData();
		cargo = new CargoData();
		ship = new ShipData();
	}
	
	function PlayerData(name : String, faction : int, inventory : Inventory, hold : CargoHold, save : SaveGame) {
		this.name = name;
		this.faction = faction;
		this.inventory = new InventoryData(inventory);
		this.cargo = new CargoData(hold);
		this.ship = new ShipData(save.playerShip);
	}	


}