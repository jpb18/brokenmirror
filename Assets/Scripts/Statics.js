import System.Collections.Generic;
#pragma strict


///<summary>This searches for all ships in enemy list</summary>
///<param name="enemyList">List with all enemy faction ids</param>
///<param name="origin">object searching</param>
///<pre>enemyList != null && origin != null</pre>
static function findAllEnemyShips(faction : FactionInfo, origin : GameObject) : GameObject[] {
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
												
						if(faction.isHostile(ship_faction))
						{
							if(!ship_props.isEscapePod()) {
								enemies.Add(go);
							}
						}
					}
				}
			}
		}
	
	
	return enemies.ToArray();
	
	
}

static function findAllEnemyStations(faction : FactionInfo, origin : GameObject) : GameObject[] {
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
						var sfaction : int = props.faction;
												
						if(faction.isHostile(sfaction))
						{
							enemies.Add(go);
						}
					}
				}
			}
		}
	
	
	return enemies.ToArray();


}

static function findAllEnemyEscapePods(faction : FactionInfo, origin : GameObject) : GameObject[] {
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
												
						if(faction.isHostile(ship_faction))
						{
							if(ship_props.isEscapePod()) {
								enemies.Add(go);
							}
						}
					}
				}
			}
		}
	
	
	return enemies.ToArray();
}

///<summary>this method finds a suitable target for the game object that calls it</summary>
///<param name="origin">Object calling the function.</param>
///<param name="range">Maximum distance that the target must be from origin</param>
///<param name="faction">Faction info.</param>
///<returns>Finds the closest enemy from the origin ship. If there're enemy ships, it returns a ship. If not, checks from stations, and lastly for escape pods</returns>
static function FindTarget(origin : GameObject, range : float, faction : FactionInfo) : GameObject {

	var enemies : GameObject[] = findAllEnemyShips(faction, origin);
	
	if(enemies.Length > 0) {
		return getClosest(origin, enemies, range);		
	}
	
	enemies = findAllEnemyStations(faction, origin);
	
	if(enemies.Length > 0) {
		return getClosest(origin, enemies, range);
	}
	
	enemies = findAllEnemyEscapePods(faction, origin);
	
	if(enemies.Length > 0) {
		return getClosest(origin, enemies, range);
	}
	
	return null;
	
}

///<summary>Returns the closest gameobject from origin, within a certain range, from a GameObject array</summary>
///<param name="origin">Origin from the search</param>
///<param name="enemies">List of enemies</param>
///<param name="range">Maximum distance from origin</param>
///<returns>Closest gameObject within range from list</returns>
static function getClosest(origin : GameObject, enemies : GameObject[], range : float) : GameObject {
	var closest : Transform = enemies[0].transform;
	var closestPosition : Vector3 = closest.position;
	var enemy : Transform;
	var originPosition : Vector3 = origin.transform.position; 
	for(var x : int = 1; x < enemies.Length; x++) {
		enemy = enemies[x].transform;
		if(!enemy.parent && enemy != closest && enemies[x] != origin) {
			var enemyPosition : Vector3 = enemy.position;
			if(isRange(originPosition, enemyPosition, range)) {
				if(isCloser(originPosition, enemyPosition, closestPosition)) {
					closest = enemy;
					closestPosition = enemyPosition;
				}
			}
		}
		
	}
	return closest.gameObject;
}

///<summary>Checks if two points distance is lesser than distance 'range'</summary>
///<param name="origin">Point of origin</param>
///<param name="destiny">Point of destiny</param>
///<param name="range">Maximum distance </param>
///<returns>True if distance between origin and destiny is smaller than range</returns>
static function isRange(origin : Vector3, destiny : Vector3, range : float) : boolean {
	var distance : float = (origin - destiny).sqrMagnitude;
	return distance < range * range;
}

///<summary>Checks which if position 1 is closer to origin than position 2</summary>
///<param name="origin">Origin point</param>
///<param name="position1">Position 1</param>
///<param name="position2">Position 2</param>
///<returns>True if Position 1 is closer to origin than Position 2</returns>
static function isCloser(origin : Vector3, position1 : Vector3, position2 : Vector3) : boolean {
	var distance1 : float = (origin - position1).sqrMagnitude;
	var distance2 : float = (origin - position2).sqrMagnitude;
	return distance1 < distance2;
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

//pre: last 7 letter must be "(Clone)"
public static function RemoveClone(name : String) : String {

		//remove last 7 characters of name
		return name.Substring(0, name.Length - 7);

}

public static function DrawDebugRect(rect : Rect, color : Color) {
		var texture : Texture2D = new Texture2D(1,1);
		texture.SetPixel(0,0,color);
		texture.Apply();
		
		GUI.DrawTexture(rect, texture);
		

		
}
