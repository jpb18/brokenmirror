
interface IWeaponable {

	function getPhaser() : GameObject;
	
	function getForwardTorpedo() : GameObject;
	
	function getBackwardTorpedo() : GameObject;
	
	function setPhaser(phaser : GameObject) : boolean;
	
	function setForwardTorpedo(torpedo : GameObject) : boolean;
	
	function setBackwardTorpedo(torpedo : GameObject) : boolean;
	
	function isPhaserEnabled() : boolean;
	
	function isForwardTorpedoEnabled() : boolean;
	
	function isBackwardTorpedoEnabled() : boolean;
}
