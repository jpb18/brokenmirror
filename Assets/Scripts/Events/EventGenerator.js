#pragma strict

var probability : float;
var maximumCombat : int = 10;

var destroyProbability : float;
var aquisitionProbability : float = 1f;

var averagePopulationLoss : float = 1f;
var populationLossPeriod : float = 100f;

private var map : MapInfo;
private var general : GeneralInfo;
private var scene : SceneTransfer;
private var carry : SceneTransferCarry;
private var inventory : Inventory;
private var save : SaveGame;
private var stardate : Stardate;
//TODO: Add current date to messages

function Start () {

	scene = gameObject.GetComponent(SceneTransfer);
	carry = GameObject.FindGameObjectWithTag("Transfer").GetComponent(SceneTransferCarry);
	var saveGo : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	general = saveGo.GetComponent(GeneralInfo);
	inventory = saveGo.GetComponent(Inventory);
	stardate = saveGo.GetComponent(Stardate);
	save = saveGo.GetComponent(SaveGame);
	map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	
	var time : int = carry.getTime();
	
	calculatePlayerEmpireProfits(time);
	calculatePlayerEmpireMaintenanceCosts(time);
	calculateGalacticPopulationLoss(time);
	generateGalacticEvents(time);
	stardate.addDays(time);
	
}

function calculatePlayerEmpireProfits(time : int) {
	var profit : int = 0;
	var planets : List.<PlanetInfo> = map.getPlanetsByFaction(0);
	for(var planet : PlanetInfo in planets) {
		profit += planet.getProfit() * Random.value * time;
	}
	
	if(profit != 0) {
		scene.addEmpireProfit(profit);
		inventory.addLatinum(profit);
	}
	
}

function calculatePlayerEmpireMaintenanceCosts(time : int) {
	
	var costs : int = getPlayerShipMaintenance();
	var total : int = costs * time;
	
	if(total != 0) {
		scene.addMaintenanceCosts(total);
		inventory.spend(total);
	}

}

function calculateGalacticPopulationLoss(time : int) {

	
	var ratio : float = time/populationLossPeriod;
	var rnd : float;
	var population : float;
	for(var planet : PlanetInfo in map.planets) {
		if(planet.getStrenght() == 0 && planet.isColonized) {
			rnd = Random.Range(0.1f,1.9f);
			population = averagePopulationLoss * ratio * rnd;
			population = planet.killPopulation(population);
			if(planet.getPopulation() > 0) {
				scene.addPopulationRemoval(planet, population, stardate.getCurrentStardate());
			} else {
				scene.addPlanetDeserted(planet, stardate.getCurrentStardate());
			}
		} 
	
	}
	

}



private function getPlayerShipMaintenance() : int {
	var ships : List.<SaveShip> = map.getShipsByFaction(0);
	ships.AddRange(save.getPlayerFleet());
	var cost : int = 0;
	for(var ship : SaveShip in ships) {
		cost += ship.getMaintenance();
	}
	return cost;
	
} 


function generateGalacticEvents(days : int) { 
	var date : float;
	for(var x : int = 0; x < days; x++) {
		if(probability >= Random.value) {
			date = stardate.getFutureDate(x);
			var pick : int = Random.Range(1, 4);
			switch(pick) {
				case 1:
					generateInvasion(date);
					break;
				case 2:
					generateConstruction(date);
					break;
				case 3:
					generateShipAcquisition(date);
					break;
				default:
					Debug.Log("Invalid value: " + pick);
			}	
		
		}
	}
}


private function generateInvasion(date : float) {
	var i : int;
	var target : PlanetInfo;
	do{
		i++;

		target = pickRandomPlanet();
		
		if(i > map.getPlanetCount() * 2) {
			target = null;
			break;
		}
		
	} while(!hasPlanetEnemiesExceptPlayer(target));
	
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
				scene.addConquest(target, faction, date);
				
				target.conquer(general.getFactionId(faction), faction.invasionFleet);			
				
			} else {
				scene.addInvasion(target, faction, str, date);
			}
		}
	}	

}


private function generateConstruction(date : float) {
	Debug.Log("Not implemented");
}

private function generateShipAcquisition(date : float) {
	if(!map.isPlayerOverlord() && Random.value <= aquisitionProbability) {
		var planet : PlanetInfo;
		do {
			planet = pickRandomPlanet();
		} while (planet.faction == 0);
		var str : int = planet.getStrenght();
		var faction : int = planet.faction;
		var factionInfo : FactionInfo = general.getFactionInfo(faction);
		var fleet : List.<GameObject> = factionInfo.invasionFleet;
		if(fleet.Count > 0) {
			var ship : GameObject = planet.addRandomShip(fleet);
			var classeable : IClasseable = ship.GetComponent(typeof(IClasseable)) as IClasseable;
			scene.addShipAcquisition(planet, factionInfo, classeable.getClass(), str, date);
		}
	}
}


private function pickRandomPlanet() : PlanetInfo {

	var max : int = map.getPlanetCount();
	
	var planet : PlanetInfo;
	var i : int = 0;
	
		do {
			var planetId : int = Random.Range(0, max - 1);
			i++;
		   planet = map.getPlanetByNumber(planetId);
	   } while (!planet.isColonized);
	
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




