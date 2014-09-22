#pragma strict

var stardate : int;

public static final var START_DATE : int = 568449;
public static final var DIV : float = 10.0f;


function getCurrentStardate() : float {
	return (START_DATE + stardate)/DIV;
}

function addDays(days : int) {
	stardate += days;
}

function setStardate(day : int) {
	stardate = day;
}

function getFutureDate(days : int) : float {
	return getCurrentStardate() + days/DIV;
}

static function calculateStardate(days : int) : float {
	return (START_DATE + days)/DIV;
}
