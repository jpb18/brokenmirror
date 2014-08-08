
interface IFactionable {

	function getFaction() : int;
	
	function isHostile(faction : int) : boolean;
	
	function isAllied(faction : int) : boolean;
	
	function isNeutral(faction : int) : boolean;
	
	function isOwn(faction : int) : boolean;

}
