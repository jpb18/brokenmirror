#pragma strict
import System.Collections.Generic;
var shipsInside : List.<GameObject>;

function OnTriggerEnter(hit : Collider) {
	if(hit.tag == "Ship") {
		var go : GameObject = hit.gameObject;
		addShip(go);
	}

}

function OnTriggerExit(hit : Collider) {
	if(hit.tag == "Ship") {
		var go : GameObject = hit.gameObject;
		removeShip(go);
	}
}

function addShip(go : GameObject) {
	if(!shipsInside.Contains(go))
		shipsInside.Add(go);
}

function removeShip(go : GameObject) {
	if(shipsInside.Contains(go))
		shipsInside.Remove(go);
}