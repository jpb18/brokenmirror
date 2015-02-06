
public class SkillSet {

	var navigation : int; //speed and agility upgrade
	var tactical : int; //weapons damage and recharge upgrade
	var engineering : int; //shielding and reactor upgrade
	var science : int; //increases the scan efficiency
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
	
}
