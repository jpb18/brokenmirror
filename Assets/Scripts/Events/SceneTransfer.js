#pragma strict

var messages : List.<String>;

public static final var INVASION : String = "Planet {0} has been attacked by {1}.";
public static final var STR_REDUCED : String = "Planet strength reduced from {0} to {1}.";
public static final var CONQUEST : String = "Planet {0} was conquered by {1}. {1} has placed a fleet guarding the planet. \n";

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


function getMessages() : String {
	var message : String;

	for(var msg : String in messages) {
		message = message + msg;
	}

	return message;
}