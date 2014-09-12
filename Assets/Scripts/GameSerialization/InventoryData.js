#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("InventoryData")
public class InventoryData {
	@XmlAttribute("latinum")
	var latinum : int;
	@XmlAttribute("size")
	var size : int;
	
	@XmlArray("Items")
	@XmlArrayItem("Item")
	var items : List.<String>;
	
	
	function InventoryData() {
		latinum = 0;
		size = 0;
		items = new List.<String>();
	}
	
	function InventoryData(inventory  : Inventory) {
		this.latinum = inventory.getLatinum();
		this.size = inventory.maxSize;
		items = new List.<String>();
		for(var item : GameObject in inventory.items) {
			items.Add(item.name);
		}
		
		
	}
	
	function getItems() : List.<GameObject> {
		var i : List.<GameObject> = new List.<GameObject>();
		
		for(var it : String in items) {
			i.Add(Resources.Load(it));
		}
		
		return i;
	}


}
