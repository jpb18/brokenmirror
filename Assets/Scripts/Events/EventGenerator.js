#pragma strict

var probability : float;
var maximumCombat : int = 10;

var destroyProbability : float;

private var map : MapInfo;
private var general : GeneralInfo;
private var scene : SceneTransfer;
private var carry : SceneTransferCarry;


function Start () {

	scene = gameObject.GetComponent(SceneTransfer);
	carry = GameObject.FindGameObjectWithTag("Transfer").GetComponent(SceneTransferCarry);
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
	map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	
	generateGalacticEvents(carry.getTime());
}



function generateGalacticEvents(days : int) { 
	for(var x : int = 0; x < days; x++) {
		if(probability >= Random.value) {
			var pick : int = Random.Range(1, 3);
			switch(pick) {
				case 1:
					generateInvasion();
					break;
				case 2:
					generateConstruction();
					break;
				default:
					Debug.Log("Invalid value: " + pick);
			}	
		
		}
	}
}


private function generateInvasion() {
	
	var target : PlanetInfo = pickRandomPlanet();
	if(target) {
		var faction : FactionInfo = pickEnemyFaction(target);
		if(general.getFactionId(faction) != 0) {
			var str : int = target.getStrenght();
				
			var prob : float = getDestroyProbability(target);
			
			for(var x : int = 0; x < maximumCombat; x++) {
				if(prob >= Random.value) {
					if(target.hasDefenseFleet()) {
						target.destroyRandomShip();
					} else {
						target.destroyRandomStation();
					}
				}
			}
			
			if(target.getStrenght() == 0) {
				scene.addConquest(target, faction);
				
				target.conquer(general.getFactionId(faction), faction.invasionFleet);			
				
			} else {
				scene.addInvasion(target, faction, str);
			}
		}
	}	

}


private function generateConstruction() {
	Debug.Log("Not implemented");
}



private function pickRandomPlanet() : PlanetInfo {

	var max : int = map.getPlanetCount();
	
	var planet : PlanetInfo;
	var i : int = 0;
	do {
		do {
			var planetId : int = Random.Range(0, max - 1);
			i++;
		   planet = map.getPlanetByNumber(planetId);
	   } while (!planet.isColonized);
	} while(hasPlanetEnemiesExceptPlayer(planet) && i <= map.getPlanetCount());
	return planet;
}



private function hasPlanetEnemiesExceptPlayer(planet : PlanetInfo) : boolean {
	var id : int = planet.getFaction();
	var faction : FactionInfo = general.getFactionInfo(id);
	
	if(!faction.hasHostiles()) {
		return false;
	}
	
	var hostile : int = faction.getHostileCount();
	
	if(faction.isPlayerHostile()) {
		hostile--;
	}
	
	return hostile > 0;

}

private function pickEnemyFaction(target : PlanetInfo) : FactionInfo {
	
	var targetId : int = target.getFaction();
	var targetFaction : FactionInfo = general.getFactionInfo(targetId);
	do {
		var enemyId : int = targetFaction.pickRandomEnemy();
	} while (enemyId == 0 && targetFaction.getHostileCount() > 1);
	return general.getFactionInfo(enemyId);
}

private function getDestroyProbability(target : PlanetInfo) : float {
	var planetStrength : float = target.getStrenght();
	if(planetStrength == 0) {
		return 1;
	}
	return destroyProbability/planetStrength;
}



