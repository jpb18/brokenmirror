import System.Collections.Generic;
interface IUpgrades {

	function getActiveUpgradesList() : List.<Active>;
		
	///<summary>This one removes an active upgrade</summary>
	///<param name="upgrade">active upgrade to be removed</param>
	///<returns>true if sucessfull, false if otherwise</returns>
	function removeActiveUpgrades(upgrade : Active) : boolean;
	
	///<summary>This one sets a new active upgrade into the ship</summary>
	///<param name="upgrade">active upgrade gameobject to be set</param>
	///<returns>true if sucessfull, false if otherwise</returns>
	function setActiveUpgrade(upgrade : GameObject) : boolean;

}
