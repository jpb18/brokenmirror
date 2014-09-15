#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("ShipData")
public class ShipData {
	@XmlAttribute("name")
	var name : String;
	@XmlAttribute("faction")
	var faction : int;
	var player : boolean;
	var alert : boolean;

	var hull : float;
	var shield : float;
	
	var phaser : String;
	var forwardTorpedo : String;
	var backwardTorpedo : String;
	var upgrades : List.<String>;
	var actives : List.<String>;
	
	var resource : String;
	var dilithium : int;
	
	function ShipData() {
		name = "";
		faction = 0;
		player = false;
		alert = false;
		hull = 0;
		shield = 0;
		phaser = "";
		forwardTorpedo = "";
		backwardTorpedo = "";
		upgrades = new List.<String>();
		actives = new List.<String>();
		resource = "";
		dilithium = 0;
	}
	
	function ShipData(ship : SaveShip) {
		this();
		name = ship.getName();
		faction = ship.getFaction();
		player = ship.isPlayer();
		alert = ship.isRedAlert();
		
		hull = ship.getHull();
		shield = ship.getShield();
		
		phaser = ship.getPhaser() != null ? ship.getPhaser().name : "null";
		forwardTorpedo = ship.getForwardTorpedo() != null ? ship.getForwardTorpedo().name : "null";
		backwardTorpedo = ship.getBackwardTorpedo() != null ? ship.getBackwardTorpedo().name : "null";
		var ups : List.<GameObject> = ship.getUpgrades();
		for(var up : GameObject in ups) {
			upgrades.Add(up.name);
		}						
		
		var acs : List.<GameObject> = ship.getActives();
		for(var ac : GameObject in acs) {
			actives.Add(ac.name);
		}
		
		dilithium = ship.getDilithium();
						
	}
	

}
