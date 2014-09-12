#pragma strict
import System.Xml.Serialization;

@XmlRoot("PlayerData")
public class PlayerData {
	@XmlAttribute("name")
	var name : String;
	@XmlAttribute("faction")
	var faction : int;
	
	var inventory : InventoryData;
	
	function PlayerData() {
		name = "";
		faction = 0;
	}
	
	function PlayerData(name : String, faction : int, inventory : Inventory) {
		this.name = name;
		this.faction = faction;
		this.inventory = new InventoryData(inventory);
	}	


}