#pragma strict
import System.Collections.Generic;

var merchantFleet : GameObject[];
var merchantShips : List.<SaveShip>;

private var spawnedShips : List.<SaveShip>;

function Start () {
	spawnedShips = new List.<SaveShip>();
}

function Update () {

}

function AddShip(ship : SaveShip) {
	if(!merchantShips.Contains(ship)) {
		merchantShips.Add(ship);
	}
}

function RemoveShip(ship : SaveShip) {
	if(merchantShips.Contains(ship)) {
		merchantShips.Remove(ship);
	}
}

function ChooseRandomShip() : SaveShip {
	var i = 0;
	var ret : SaveShip = null;
	do {
		i++;
		ret = merchantShips[Random.Range(0, this.merchantShips.Count-1)];
		if(i > merchantShips.Count * 2) return null;
	} while (spawnedShips.Contains(ret));
	spawnedShips.Add(ret);
	return ret;

}

function ChooseRandomShip(faction : int) : SaveShip {
	var i = 0;
	var ret : SaveShip = null;
	do {
		i++;
		ret = merchantShips[Random.Range(0, this.merchantShips.Count-1)];
		if(i > merchantShips.Count * 2) return null;	
	} while (spawnedShips.Contains(ret) || ret.getFaction() != faction);
	spawnedShips.Add(ret);
	return ret;	
}



function GetRandomMerchantShip() : GameObject {
	return merchantFleet[Random.value * (merchantFleet.Length -1)];
}

function HasTradeShips() : boolean {
	return merchantShips.Count > 0;
}

function ResetChosen() {
	this.spawnedShips.Clear();
}