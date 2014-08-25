#pragma strict

var on : boolean;
private var text : String;
private var time : float;
private var inventory : Inventory;

public static final var LATINUM = "maxlat";
public static final var FORCE_INVASION = "forceinvasion";
public static final var TIME : float = 0.2f;

// Use this for initialization
function Start () {
	inventory = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Inventory);
	text = "";
	time = 0f;
}

// Update is called once per frame
function Update () {
	if(Input.GetKeyDown(KeyCode.F6) && canBePressed()) {
		time = Time.time;
		on = !on;
	}
}

function OnGUI() {
	if(on) {
		text = GUI.TextField(new Rect(10, 10, 200, 25), text);
		var e : Event = Event.current;
		if(e.keyCode == KeyCode.Return) {
			if(text == LATINUM) {
				maxLat();
			} else if (text == FORCE_INVASION) {
				forceInvasion();
			}
			
			text = "";
			on = false;
			
		}
	}

}

function maxLat() {
	inventory.cheat();
}

function forceInvasion() {
	var start : GameObject = GameObject.FindGameObjectWithTag("SceneStart");
	var scene : SceneStart = start.GetComponent(SceneStart);
	scene.cheat();
	
}

function canBePressed() : boolean {
	return Time.time > time + TIME;
}