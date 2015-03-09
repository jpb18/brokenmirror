#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("SkillSet")
public class SkillSet {
	
	@XmlAttribute("navigation")
	var navigation : int; //speed and agility upgrade
	@XmlAttribute("tactical")
	var tactical : int; //weapons damage and recharge upgrade
	@XmlAttribute("engineering")
	var engineering : int; //shielding and reactor upgrade
	@XmlAttribute("science")
	var science : int; //increases the scan efficiency
	@XmlAttribute("command")
	var command : int; //what to do here?
	
	
	function SkillSet() {
		this(0,0,0,0,0);
	}
	
	function SkillSet(navigtion : int, tactical : int, engineering : int, science : int, command : int) {
		this.navigation = navigation;
		this.tactical = tactical;
		this.engineering = engineering;
		this.science = science;
		this.command = command;
	}
	
	function ToArray() {
		var arr : int[] = new int[5];
		arr[0] = navigation;
		arr[1] = tactical;
		arr[2] = engineering;
		arr[3] = science;
		arr[4] = command;
		return arr;
	}
	
}
