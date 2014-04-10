import System.Collections.Generic;
#pragma strict


///<summary>This searches for all ships in enemy list</summary>
///<param name="enemyList">List with all enemy faction ids</param>
///<param name="origin">object searching</param>
///<pre>enemyList != null && origin != null</pre>
static function findAllEnemyShips(enemyList : int[], origin : GameObject) : GameObject[] {
	var gameObjs : GameObject[] = GameObject.FindGameObjectsWithTag("Ship");
	var enemies : List.<GameObject> = new List.<GameObject>();
	
	for(var go : GameObject in gameObjs) {
		
			
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
							enemies.Add(go);
						}
					}
				}
			}
		}
	
	
	return enemies.ToArray();
	
	
}

static function findAllEnemyStations(enemyList : int[], origin : GameObject) : GameObject[] {
	var gameObjs : GameObject[] = GameObject.FindGameObjectsWithTag("Station");
	var enemies : List.<GameObject> = new List.<GameObject>();
	
	for(var go : GameObject in gameObjs) {
		
			
			if (go.transform.parent == null) //check if it's parent GO
			{
				if(go != origin) //check if GO is diferent than origin
				{
					if (go.tag == "Station") //check if GO is a ship 
					{
					
						//Get ships properties script and faction
						var props : Station = go.GetComponent(Station);
						var faction : int = props.faction;
												
						if(isEnemy(faction, enemyList))
						{
							enemies.Add(go);
						}
					}
				}
			}
		}
	
	
	return enemies.ToArray();


}

//this method finds a suitable target for the game object that calls it
static function FindTarget(origin : GameObject, range : float, enemyList : int[]) : GameObject {

	var gameObjs : GameObject[] = findAllEnemyShips(enemyList, origin);
	var closest : GameObject;
	var originPosition : Vector3 = origin.transform.position;
	if(gameObjs.Length > 0) {
		for(var go : GameObject in gameObjs) {
			
			if((originPosition - go.transform.position).sqrMagnitude <= range * range) {
				
				if (go.transform.parent == null) //check if it's parent GO
				{
					if(go != origin) //check if GO is diferent than origin
					{
						if (go.tag == "Ship") //check if GO is a ship 
						{
						
													
							if(closest == null) //if there's no go in closest
							{
								closest = go;
							}
							else //if there is
							{
								//check if the new go is closer than the older one
								if ((originPosition - closest.transform.position).sqrMagnitude >= (origin.transform.position - go.transform.position).sqrMagnitude)
								{
									closest = go;
								}
							}
							
											
						}
						
					}
				}
			
			}
		} 
		}else {
		
			gameObjs = findAllEnemyStations(enemyList, origin);
			
			if(gameObjs.Length > 0) {
		for(var go : GameObject in gameObjs) {
			
			if((originPosition - go.transform.position).sqrMagnitude <= range * range) {
				
				if (go.transform.parent == null) //check if it's parent GO
				{
					if(go != origin) //check if GO is diferent than origin
					{
						if (go.tag == "Station") //check if GO is a ship 
						{
						
							
													
							
							if(closest == null) //if there's no go in closest
							{
								closest = go;
							}
							else //if there is
							{
								//check if the new go is closer than the older one
								if ((originPosition - closest.transform.position).sqrMagnitude >= (origin.transform.position - go.transform.position).sqrMagnitude)
								{
									closest = go;
								}
							}
							
											
						}
						
					}
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


//this function gets all the owned ships nearby the player ship
static function getNearbyOwnedShips(own : Vector3, range : float, faction : int) : GameObject[] {
	var ships : GameObject[] = GameObject.FindGameObjectsWithTag("Ship");
	var returnList : List.<GameObject> = new List.<GameObject>();
	
	for(var ship : GameObject in ships) { //loop through all elements
		if((ship.transform.position - own).sqrMagnitude < range * range) { //if its in range
			var fac : int = ship.GetComponent(shipProperties).getFaction();
			if(faction == fac) { //if it belongs to the same faction
				returnList.Add(ship);
			}
			
		}
	}
	
	return returnList.ToArray();

} 