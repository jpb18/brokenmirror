//this script is responsible for the generation of a asteroid field, based on preset variable, for Broken Mirror III

var space : field;

class field extends System.Object {
	
	//asteroids
	var isAst : boolean;
	var radiusAst : float;
	var numAst : int;
	var asteroid : GameObject[];
	
	
}



function Start () {
	
	

	//create asteroid field.
	//first check if exists or not
	if (space.isAst == true)
	{
		
		for (var x : int = 0; x < space.numAst; x++) //repeat this cicle for each asteroid in existence
		{
			var Cood = Random.insideUnitSphere * space.radiusAst; //create a set of coordinates for the asteroid
			
			var selAst : int = Random.Range(0 , space.asteroid.Length); //select one asteroid randomly
			
			Instantiate(space.asteroid[selAst], Cood, Random.rotation); //make the asteroid appear
		
		}
	}

}

