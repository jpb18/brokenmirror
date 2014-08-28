#pragma strict

var messages : List.<String>;

public static final var MAINTENANCE : String = "Your empire maintenance has cost you {0} GPL.\n";
public static final var PROFIT : String = "Your empire has generated an income of {0} GPL.\n";
public static final var INVASION : String = "Stardate {0:0.0}: {1} has been attacked by {2}.";
public static final var STR_REDUCED : String = "Planet strength reduced from {0} to {1}.";
public static final var CONQUEST : String = "Stardate {0:0.0}: {1} was conquered by {2}. {2} has placed a fleet guarding the planet. \n";
public static final var AQUISITION : String = "Stardate {0:0.0}: {1} acquired a {2} at {3}. Planet strength increased from {4} to {5}.\n";

function addInvasion(target : PlanetInfo, attacker : FactionInfo, originalStrenght : int, date : float) {
	var message : String = String.Format(INVASION, date, target.name, attacker.getName());
	var str : int = target.getStrenght();
	if(str != originalStrenght) {
		message = message + " " + String.Format(STR_REDUCED, originalStrenght, str);
	}
	messages.Add(message + "\n");
}

function addConquest(target : PlanetInfo, attacker : FactionInfo, date : float) {
	messages.Add(String.Format(CONQUEST, date, target.name, attacker.getName()));
}

function addShipAcquisition(planet : PlanetInfo, faction : FactionInfo, shipClass : String, originalStrength : int, date : float) {
	var message : String = String.Format(AQUISITION, date, faction.factionName, shipClass, planet.name, originalStrength, planet.getStrenght());
	messages.Add(message);
}


function getMessages() : String {
	var message : String;

	for(var msg : String in messages) {
		message = message + msg;
	}

	return message;
}

function addMaintenanceCosts(costs : int) {
	var message : String = String.Format(MAINTENANCE, costs);
	messages.Add(message);
}

function addEmpireProfit(profit : int) {
	var message : String = String.Format(PROFIT, profit);
	messages.Add(message);
}