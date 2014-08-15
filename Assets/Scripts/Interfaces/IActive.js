

public interface IActive extends IUpgrade{
	
	function use(target : GameObject);
	
	function disable(target : GameObject);
	
	function getCooldown() : float;
	
	function getDuration() : float;
	
	function isDisabable() : boolean;
	
	
}

public interface Active {
	
	function use(target : GameObject);
	
	function canUse() : boolean;
	
	function disable(target : GameObject);
	
	function isDisabable() : boolean;
	
	function isActive() : boolean;
	
	function getUpgrade() : GameObject;

}