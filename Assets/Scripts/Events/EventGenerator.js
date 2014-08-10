#pragma strict

var probability : float;
var maximumCombat : int = 10;

private var map : MapInfo;
private var general : GeneralInfo;
private var scene : SceneTransfer;
private var carry : SceneTransferCarry;
private var r : System.Random;

function Start () {
	r = new System.Random();
	scene = gameObject.GetComponent(SceneTransfer);
	carry = GameObject.FindGameObjectWithTag("Transfer").GetComponent(SceneTransferCarry);
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
	map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	
	generateGalacticEvents(carry.getTime());
}



function generateGalacticEvents(days : int) { 
	for(var x : int = 0; x < days; x++) {
		if(probability >= Random.value) {
			var pick : int = r.Next(2);
			switch(pick) {
				case 1:
					generateInvasion();
					break;
				case 2:
					generateConstruction();
					break;
				default:
					Debug.Log("Invalid value");
			}	
		
		}
	}
}


private function generateInvasion() {
	
	var target : PlanetInfo = pickRandomPlanet();
	if(target) {
		var faction : FactionInfo = pickEnemyFaction(target);
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


private function generateConstruction() {
	Debug.Log("Not implemented");
}



private function pickRandomPlanet() : PlanetInfo {
	var max : int = map.getPlanetCount();
	var planetId : int = r.Next(0, max);
	var planet : PlanetInfo;
	var i : int = 0;
	do {
		i++;
	   planet = map.getPlanetByNumber(planetId);
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
	var enemyId : int = targetFaction.pickRandomEnemy();
	return general.getFactionInfo(enemyId);
}

private function getDestroyProbability(target : PlanetInfo) : float {
	return 1/target.getStrenght();
}



