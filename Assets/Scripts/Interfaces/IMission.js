
interface IMission {

	function hasStarted() : boolean;
	
	function hasFinished() : boolean;
	
	function start();
	
	function finish();
	
	function getName() : String;

	function getDescription() : String;

}
