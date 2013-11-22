import System.Collections.Generic;
#pragma strict

//this method finds a suitable target for the game object that calls it
static function FindTarget(origin : GameObject, range : float, enemyList : int[]) : GameObject {

	var gameObjs : GameObject[] = FindObjectsOfType(GameObject);
	var closest : GameObject;
	
	for(var go : GameObject in gameObjs) {
	
		if(Vector3.Distance(origin.transform.position, go.transform.position) <= range) {
			
			if (go.transform.parent == null) //check if it's parent GO
			{
				if(go != origin) //check if GO is diferent than origin
				{
					if (go.tag == "Ship") //check if GO is a ship 
					{
					
						//Get ships properties script and faction
						var ship_props : shipProperties = go.GetComponent(shipProperties);
						var ship_faction : int = ship_props.shipInfo.faction;
												
						if(isEnemy(ship_faction, enemyList))
						{
							if(closest == null) //if there's no go in closest
							{
								closest = go;
							}
							else //if there is
							{
								//check if the new go is closer than the older one
								if (Vector3.Distance(origin.transform.position, closest.transform.position) >= Vector3.Distance(origin.transform.position, go.transform.position))
								{
									closest = go;
								}
							}
						}
										
					}
					else if (go.tag == "Station")
					{
					
						//put station targeting code here
					
					}
				}
			}
		
		}
	
	}

	return closest;
}


//this method checks if the faction is in the enemy list
static function isEnemy(faction : int, enemyList : int[]) : boolean {
	var enemy : boolean = false;
	var x : int = 0;
	while(x < enemyList.Length && !enemy) {
		if(faction == enemyList[x]) {
			enemy = true;
		}
		
		x++;
	}
	return enemy;

}

//this method resizes an array
//this overflow is for the WeaponPoints class
//pre: size > 0
static function resizeArray(array : WeaponPoints[], size : int) : WeaponPoints[] {

	var tmp : Array = new Array(size);
	
	for(var x : int = 0; x < array.Length; x++) {
	
		tmp.Add(array[x]);
	
	}
	
	
	return tmp.ToBuiltin(WeaponPoints) as WeaponPoints[];


}

//this function returns the speed of target object
//pre target != null
static function getSpeed(target : GameObject) : float {

	return target.rigidbody.velocity.z;

}

//this function checks if the own ship is slower than the target ship
//pre target != null && own != null
static function isSlower(target : GameObject, own : GameObject) : boolean {

	return getSpeed(own) < getSpeed(target);

}

//this function checks if the own ship is faster than the target ship
static function isFaster(target : GameObject, own : GameObject) : boolean {
	return getSpeed(own) > getSpeed(target);
}