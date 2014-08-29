interface IMissionable {

	function hasLeader() : boolean;
	
	function isMerchant() : boolean;
	
	function isDefence() : boolean;
	
	function setMerchant();
	
	function setLeader(leader : GameObject);
	
	function setDefence();
	
	function setFree();

}
