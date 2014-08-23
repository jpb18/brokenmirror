#pragma strict

var on : boolean;
private var text : String;
private var time : float;
private var inventory : Inventory;

public static final var LATINUM = "maxlat";
public static final var TIME : float = 0.2f;

// Use this for initialization
function Start () {
	inventory = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Inventory);
}

// Update is called once per frame
function Update () {
	if(Input.GetKeyDown(KeyCode.F6)) {
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
				inventory.cheat();
			}
			
			text = "";
			on = false;
			
		}
	}

}

function canBePressed() : boolean {
	return Time.time > time + TIME;
}