import System.Collections.Generic;
#pragma strict


@Tooltip("Items on inventory.")
var items : List.<GameObject>;
@Tooltip("Plans on inventory.")
var plans : List.<GameObject>;
@Tooltip("Maximum capacity of inventory.")
var maxSize : int = 30;
@Tooltip("Player's latinum.")
var latinum : int = 5000;
@Tooltip("Player's deuranium.")
var deuranium : int = 15000;


//var guiInventory : ResourcePanel;

private var control : HudControl;

function Start() {
	control = GameObject.FindGameObjectWithTag("GUI").GetComponent.<HudControl>();
}


function addItem(item : GameObject) {

		items.Add(item);
		
}

function removeItem(item : GameObject) {
	if(items.Contains(item)) {
		items.Remove(item);
	}

}



function isFull() : boolean {
	
	return items.Count >= maxSize;
	
}

function resize(addSlots : int) {

	maxSize += addSlots;

}

function canBuy(latinum : int) : boolean{

	return this.latinum >= latinum ;
}

function spend(latinum : int) {
	this.latinum -= latinum;
	control.SetLatinumLabel(this.latinum);
}

function addLatinum(latinum : int) {
	this.latinum += latinum;
	control.SetLatinumLabel(this.latinum);
}

function addDeuranium(deuranium : int) {
	this.deuranium += deuranium;
}

function getLatinum() : int {
	return this.latinum;
}

function addPlan(plan : GameObject) {
	if(!hasPlan(plan)) {
		plans.Add(plan);
	}
}

function hasPlan(plan : GameObject) {
	return plans.Contains(plan);
}


function hasColonizationTeams() : boolean {
	for(var go : GameObject in items) {
		if(go.tag == "Colonizer") {
			return true;
		}
	}
	return false;
}

function getColonizationTeam() : GameObject {
	var col : GameObject = getBiggerColonizationTeam();
	items.Remove(col);
	return col;
	
}

private function getBiggerColonizationTeam() : GameObject {
	var big : GameObject;
	var bigColonizer : IColonizer;
	for(var go : GameObject in items) {
		if(go.tag == "Colonizer") {
			if(!big) {
				big = go;
				bigColonizer = big.GetComponent(typeof(IColonizer)) as IColonizer;
			} else {
				var bigSize : float = bigColonizer.getPopulation();
				var newColonizer : IColonizer = go.GetComponent(typeof(IColonizer)) as IColonizer;
				var newSize : float = newColonizer.getPopulation();
				if(bigSize < newSize) {
					big = go;
					bigColonizer = newColonizer;
				}
			}
		}
	
	}
	return big;
}

function cheat() {
	latinum = int.MaxValue;
}

function setInventory(inventory : InventoryData) {
	maxSize = inventory.size;
	latinum = inventory.latinum;
	items = inventory.getItems();
}

function hasInvasionForce(population : float) : boolean {

	for(var go : GameObject in items) {
		if(go.tag == "Invasion") {
			var inv : IInvasion = go.GetComponent(typeof(IInvasion)) as IInvasion;
			if(inv.getPopulation() >= population) return true;
		}
	}
	
	return false;
	
}

function getInvasionForce() : GameObject {
	var inv : GameObject = getBiggerInvasionForce();
	items.Remove(inv);
	return inv;
}


private function getBiggerInvasionForce() : GameObject {

	var big : GameObject;
	var bigInvasion : IInvasion;
	for(var go : GameObject in items) {
		if(go.tag == "Invasion") {
			if(!big) {
				big = go;
				bigInvasion = big.GetComponent(typeof(IInvasion)) as IInvasion;
			} else {
				var bigSize : float = bigInvasion.getPopulation();
				var newInvasion : IInvasion = go.GetComponent(typeof(IInvasion)) as IInvasion;
				var newSize : float = newInvasion.getPopulation();
				if(bigSize < newSize) {
					big = go;
					bigInvasion = newInvasion;
				}
			}
		}
	
	}
	return big;

}

function getItems() : GameObject[] {
	return items.ToArray();
}
