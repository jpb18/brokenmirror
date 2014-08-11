#pragma strict

var messages : List.<String>;

public static final var INVASION : String = "{0} has been attacked by {1}.";
public static final var STR_REDUCED : String = "Planet strength reduced from {0} to {1}.";
public static final var CONQUEST : String = "{0} was conquered by {1}. {1} has placed a fleet guarding the planet. \n";
public static final var AQUISITION : String = "{0} acquired a {1} at {2}. Planet strength increased from {3} to {4}.\n";

function addInvasion(target : PlanetInfo, attacker : FactionInfo, originalStrenght : int) {
	var message : String = String.Format(INVASION, target.name, attacker.getName());
	var str : int = target.getStrenght();
	if(str != originalStrenght) {
		message = message + " " + String.Format(STR_REDUCED, originalStrenght, str);
	}
	messages.Add(message + "\n");
}

function addConquest(target : PlanetInfo, attacker : FactionInfo) {
	messages.Add(String.Format(CONQUEST, target.name, attacker.getName()));
}

function addShipAcquisition(planet : PlanetInfo, faction : FactionInfo, shipClass : String, originalStrength : int) {
	var message : String = String.Format(AQUISITION, faction.factionName, shipClass, planet.name, originalStrength, planet.getStrenght());
	messages.Add(message);
}


function getMessages() : String {
	var message : String;

	for(var msg : String in messages) {
		message = message + msg;
	}

	return message;
}