
public interface IPassive extends IUpgrade{

	//Weapons
	function getWeaponRechargeBonus() : float;
	
	function getDamageBonus() : float;
	
	//Shield
	function getShieldRechargeBonus() : float;
	
	
	//Hull
	function getHullStrenghtBonus() : float;

	//Speed
	function getSpeedIncreaseBonus() : float;
	
	//Agility
	function getAgilityTurnBonus() : float;
	
	
}