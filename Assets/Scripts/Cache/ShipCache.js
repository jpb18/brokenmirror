import System.Collections.Generic;

public static var cache : ShipCache;

private var ships : List.<GameObject>[];
private var general : GeneralInfo;

// Use this for initialization
function Start () {
	if(this.cache == null) {
		cache = this;
		
	}
	
	Reset();

}

function AddShip(ship : GameObject) {
	var faction : int = GetShipFaction(ship);
	var list : List.<GameObject> = ships[faction];
	if(!list.Contains(ship)) {
		list.Add(ship);
	}
}

function RemoveShip(ship : GameObject) {
	var faction : int = GetShipFaction(ship);
	var list : List.<GameObject> = ships[faction];
	if(list.Contains(ship)) {
		list.Remove(ship);
	}
}

function GetFactionShips(faction : int) : List.<GameObject> {
	return ships[faction];
}

function GetHostileShips(faction : int) : List.<GameObject> {
	var info : FactionInfo = general.getFactionInfo(faction);
	var hostiles : List.<int> = info.hostileFactions;
	var enemies : List.<GameObject> = new List.<GameObject>();
	
	for(var enemy : int in hostiles) {
		enemies.AddRange(ships[enemy]);	
	}
	
	return enemies;
}

function GetHostileShips(ship : GameObject) : List.<GameObject> {
	var faction : int = GetShipFaction(ship);
	return GetHostileShips(faction);
}

private function GetShipFaction(ship : GameObject) : int {
	var faction : IFactionable = ship.GetComponent(typeof(IFactionable)) as IFactionable;
	return faction.getFaction();
}

function Reset() {
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent.<GeneralInfo>();
	ships = new List.<GameObject>[general.factionInfo.Count];
	
	for(var x : int = 0; x < ships.Length; x++) {
		ships[x] = new List.<GameObject>();
	}
	
}

