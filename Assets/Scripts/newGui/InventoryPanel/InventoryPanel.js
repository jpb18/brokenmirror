#pragma strict


public class InventoryPanel extends FloatingWindow {


var backgroundRect : Rect;

var shipStatus : ShipStatus;
var mainDisplay : MainDisplay;
var categories : CategoriesPanel;
var items : AvailableItemsPanel;
var info : InfoPanel;
var fleetDisplay : FleetDisplay;

var skin : GUISkin;

//handle time
private static final var TIME : float = 0.1f;
private var lastPress : float;

//handle scripts
private var inventory : Inventory;
private var hold : CargoHold;
private var save : SaveGame;
private var health : IHealtheable;
private var move : IMovable;
private var strenght : IStrenghteable;
private var weapon : IWeaponable;
private var nameable : INameable;
private var classe : IClasseable;
private var sceneStart : SceneStart; 

//handle gameobject
private var player : GameObject;
private var fleet : GameObject[];
private var selected : GameObject;

function Start () {
	lastPress = 0;
	super.initFloat();
		
	var saveGo : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	save = saveGo.GetComponent.<SaveGame>();
	inventory  = saveGo.GetComponent.<Inventory>();
	hold = saveGo.GetComponent.<CargoHold>();
	
	//This would get a Null Pointer because the SceneStart object didn't existed yet...
	//var scene : GameObject = GameObject.FindGameObjectWithTag("SceneStart");
	//sceneStart = scene.GetComponent.<SceneStart>();
	
	
	shipStatus.Set(this);
	mainDisplay.Set(this);
	categories.Set(this);
	items.Set(this);
	info.Set(this);
	fleetDisplay.Set(this);
}

function Update() {
	if(super.hud.isShowingGui()) {
		var storedShip = save.getPlayerShip();	
		
		if(Input.GetAxis("Inventory") && lastPress + TIME <= Time.time) {
			lastPress = Time.time;
			super.toggle();
			if(super.on) this.resetStatus();
		}
	}
}

function OnGUI() {
	
	if(super.on && super.hud.isShowingGui()) {
		drawWindow();
	}
	items.clear();

}

function drawWindow() {
	super.position = GUI.Window(super.getId(), super.position, window, title, GUIStyle.none);	
}

function window() {

	GUI.DrawTexture(resizeRect(backgroundRect), super.background);
	shipStatus.draw(health, move, strenght, weapon, skin);
	mainDisplay.draw(nameable, classe, skin);
	categories.draw(skin);
	drawInventory();
	drawMouseOver();
	drawFleet();
	super.drag();
			
}

private function drawInventory() {
	
	if(categories.isInventory()) {
		var items : GameObject[] = inventory.getItems();
		this.items.draw(items, skin);
	} else if (categories.isCargo()) {
		var cargo : Cargo[] = hold.getCargoArray();
		this.items.draw(cargo, skin);
	}

}

private function drawMouseOver() {

	if(categories.isInventory()) {
		var obj : GameObject = this.items.getMouseOver();
		info.draw(obj, skin);
	} else if (categories.isCargo()) {
		var cargo : Cargo = this.items.getMouseOver();
		info.draw(cargo, skin);
	}

}

private function drawFleet() {

	if(fleetDisplay.Draw(player, fleet, skin)) {
		selected = fleetDisplay.getSelected();
		setShipData(selected);
	}

}

private function resetStatus() {
	categories.reset();
	fleetDisplay.Reset();
	fleet = sceneStart.playerFleet.ToArray();
	player = save.getPlayerShip();
	selected = player;
	setShipData(selected);
	fleetDisplay.SetSelected(player);
}

private function setShipData(ship : GameObject) {
	health = ship.GetComponent(typeof(IHealtheable)) as IHealtheable;
	move = ship.GetComponent(typeof(IMovable)) as IMovable;
	strenght = ship.GetComponent(typeof(IStrenghteable)) as IStrenghteable;
	weapon = ship.GetComponent(typeof(IWeaponable)) as IWeaponable;
	nameable = ship.GetComponent(typeof(INameable)) as INameable;
	classe = ship.GetComponent(typeof(IClasseable)) as IClasseable;
}

function setSceneStart(script : SceneStart) {
	this.sceneStart = script;
}

}
