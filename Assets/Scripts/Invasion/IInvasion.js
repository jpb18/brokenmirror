
interface IInvasion {

	function canInvade(population : float) : boolean;

	function invade(planet : IConquerable, faction : int);
	
	function getPopulation() : float;
}
