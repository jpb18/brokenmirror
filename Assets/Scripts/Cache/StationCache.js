import System.Collections.Generic;

public static var cache : StationCache;

private var stations : List.<GameObject>;

// Use this for initialization
function Start() {
	if(cache == null) {
		this.cache = this;
	}
	
	Reset();
	
}

function Reset() {
	this.stations = new List.<GameObject>();
}

function AddStation(station : GameObject) {
	if(!stations.Contains(station)) {
		this.stations.Add(station);
	}
}

function RemoveStation(station : GameObject) {
	if(stations.Contains(station)) {
		stations.Remove(station);
	}
}

function GetStations() : List.<GameObject> {
	return stations;
}