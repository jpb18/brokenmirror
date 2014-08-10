#pragma strict

var messages : List.<String>;

public static final var INVASION : String = "Planet {0} has been attacked by {1}. Planet strenght reduced from {2} to {3} \n";
public static final var CONQUEST : String = "Planet {0} was conquered by {1}. {1} has placed a fleet guarding the planet. \n";

function addInvasion(target : PlanetInfo, attacker : FactionInfo, originalStrenght : int) {
	messages.Add(String.Format(INVASION, target.name, attacker.getName(), originalStrenght.ToString(), target.getStrenght()));
}

function addConquest(target : PlanetInfo, attacker : FactionInfo) {
	messages.Add(String.Format(CONQUEST, target.name, attacker.getName()));
}


function getMessages() : String {
	var message : String;

	for(var msg : String in messages) {
		message = message + msg;
	}

	return message;
}