#pragma strict


public class InventoryPanel extends FloatingWindow {


var backgroundRect : Rect;

var shipStatus : ShipStatus;


var skin : GUISkin;

//handle time
private static final var TIME : float = 0.1f;
private var lastPress : float;

//handle scripts
private var inventory : Inventory;
private var save : SaveGame;
private var health : IHealtheable;
private var move : IMovable;
private var strenght : IStrenghteable;

//handle gameobject
private var ship : GameObject;

function Start () {
	lastPress = 0;
	super.initFloat();
	
	var saveGo : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	save = saveGo.GetComponent.<SaveGame>();
	inventory  = saveGo.GetComponent.<Inventory>();
	
	shipStatus.Set(this);
	
}

function Update() {
	if(super.hud.isShowingGui()) {	
		if(ship == null || health == null) {
			ship = save.getPlayerShip();
			health = ship.GetComponent(typeof(IHealtheable)) as IHealtheable;
			move = ship.GetComponent(typeof(IMovable)) as IMovable;
			strenght = ship.GetComponent(typeof(IStrenghteable)) as IStrenghteable;
		}
		
		if(Input.GetAxis("Inventory") && lastPress + TIME <= Time.time) {
			lastPress = Time.time;
			super.toggle();
		}
	}
}

function OnGUI() {
	
	if(super.on && super.hud.isShowingGui()) {
		drawWindow();
	}
	

}

function drawWindow() {
	super.position = GUI.Window(super.getId(), super.position, window, title, GUIStyle.none);	
}

function window() {

	GUI.DrawTexture(resizeRect(backgroundRect), super.background);
	shipStatus.draw(health, move, strenght, skin);
	
	super.drag();
			
}







}