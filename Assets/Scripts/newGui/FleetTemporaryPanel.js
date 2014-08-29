#pragma strict

class FleetTemporaryPanel extends FloatingWindow {

var formationRect : Rect;
var formationBackgroundRect : Rect;
var formationLabelRect : Rect;
var formationComboRect : Rect;

var fleetRect : Rect;

var fleetView : ViewProps;
var itemPos : Vector2;
var itemHeight : int;
var itemWidth : int;

var shipRect : Rect;
var shipBackgroundRect : Rect;
var textureRect : Rect;
var nameRect : Rect;
var classRect : Rect;
var shipFormationRect : Rect;
var missionRect : Rect;
var changeLabelRect : Rect;
var changeTextRect : Rect;
var changeButtonRect : Rect;
var squadButtonRect : Rect;
var defenceButtonRect : Rect;
var merchantButtonRect : Rect;

private var changeText : String;

private var formationContent : GUIContent[];
private var formationCombo : ComboBox;
private var listStyle : GUIStyle;
private var lastValue : int;

private var selectedShip : GameObject;

private var lastPress : float;
public static final var TIME : float = 0.1f;
public static final var LOOSE = "Loose";
public static final var STANDARD = "Standard";
public static final var CLOSE = "Close";
public static final var DEFENCE = "Defence";
public static final var ESCORT = "Escort";
public static final var MERCHANT = "Merchant";
public static final var FREE = "Unassigned";

private var save : SaveGame;
private var map : MapInfo;

function Start () {
	initFleet();
}

function initFleet() {
	save = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(SaveGame);
	map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	
	changeText = "";
	lastPress = 0;
	super.initFloat();
	super.centerOnScreen();
					
	formationContent = new GUIContent[3];
	formationContent[0] = new GUIContent(LOOSE);
	formationContent[1] = new GUIContent(STANDARD);
	formationContent[2] = new GUIContent(CLOSE);
	
	listStyle = new GUIStyle();
	listStyle.normal.textColor = Color.white; 
	listStyle.onHover.background = new Texture2D(2,2);
	listStyle.hover.background = new Texture2D(2, 2);
	listStyle.padding.left = 0;
	listStyle.padding.right = 0;
	listStyle.padding.top = 0;
	listStyle.padding.bottom = 4;
	
	formationCombo = new ComboBox(formationComboRect, formationContent[1], formationContent, "button", "box", listStyle);
	lastValue = 1;
}

function Update () {
	if(Input.GetAxis("Fleet") && canPress()) {
		setPress();
		toggle();
	}

}

function OnGUI() {
	if(super.hud.isShowingGui() && super.on) {
		drawWindow();;
	}
}

function drawWindow() {
		super.position = GUI.Window(super.getId(), super.position, window, title, GUIStyle.none);	
}
	
function window() {

		drawShipList();
		drawShipPanel();
		drawFormation();
		//keep this at end
		drag();
	}

function drawFormation() {
	GUILayout.BeginArea(formationRect);
		checkFormationChange();
		GUI.Box(formationBackgroundRect,"");
		GUI.Label(formationLabelRect, "Formation: ");
		formationCombo.Show();
	GUILayout.EndArea();
}

function checkFormationChange() {
	var fleet : List.<GameObject> = getPlayerShips();
	var newIndex : int = formationCombo.SelectedItemIndex;
	if(newIndex != lastValue) {
		save.setFleetFormation(getFormationType(newIndex), fleet);
		lastValue = newIndex;
	}

}

function getFormationType(index : int) : Formation {
	switch(index) {
		case 2 :
			return Formation.close;
		case 1 :
			return Formation.standard;
		case 0 :
			return Formation.loose;
		default :
			return Formation.invalid;
			
	}

} 

function drawShipList() {
	GUILayout.BeginArea(fleetRect);
		var ships : List.<GameObject> = getPlayerShips();

		drawScrollView(ships);

	GUILayout.EndArea();
}

function drawScrollView(ships : List.<GameObject>) {
	var size : int = 10;
	if(ships.Count > 10) {
		size = ships.Count;
	}

	fleetView.scrollPosition = GUI.BeginScrollView (fleetView.getOutsideRect(itemPos.x, itemPos.y), fleetView.scrollPosition, fleetView.getInRect(size, itemHeight), true, true);
		
		for(var x : int = 0; x < ships.Count; x++) {
			drawScrollButton(x, ships[x]);
						
		}
		
	GUI.EndScrollView();

}

function drawScrollButton(num : int, ship : GameObject) {
	var text : Texture = getShipTexture(ship);
	var name : String = getShipName(ship);
	var content : GUIContent = new GUIContent(name, text);
	var rect : Rect = getItemRect(num);
	if(GUI.Button(rect, content)) {
		selectShip(ship);
	}
		
}

function selectShip(ship : GameObject) {
	selectedShip = ship;
}

function getItemRect(num : int) : Rect {
	var n : int = num + 1;
	var rect : Rect = new Rect(itemPos.x, itemPos.y + (itemHeight * n), itemWidth, itemHeight);
	return rect;
}

function getShipTexture(ship : GameObject) : Texture {
	var textureable : ITextureable = ship.GetComponent(typeof(ITextureable)) as ITextureable;
	return textureable.getStoreImage();
}

function getShipName(ship : GameObject) : String {
	var name : INameable = ship.GetComponent(typeof(INameable)) as INameable;
	return name.getName();
}

function getShipClass(ship : GameObject) : String {
	var classeable : IClasseable = ship.GetComponent(typeof(IClasseable)) as IClasseable;
	return classeable.getClass();
}

function getPlayerShips() : List.<GameObject> {
	var list : List.<GameObject> = new List.<GameObject>();
	
	var ships : GameObject[] = GameObject.FindGameObjectsWithTag("Ship");
	var factionable : IFactionable;	
	var play : IPlayable;
	for(var i : int = 0; i < ships.Length; i++) {
		factionable = ships[i].GetComponent(typeof(IFactionable)) as IFactionable;
		play = ships[i].GetComponent(typeof(IPlayable)) as IPlayable;
		if(factionable.isOwn(0) && !play.isPlayer()) {
			list.Add(ships[i]);
		}
		
 	}
	
	
	return list;

}

function drawShipPanel() {
	GUILayout.BeginArea(shipRect);
		GUI.Box(shipBackgroundRect, "");
		if(selectedShip) {
			var texture : Texture = getShipTexture(selectedShip);
			var name : String = getShipName(selectedShip);
			var classe : String = getShipClass(selectedShip);
			var formation : String = getShipFormation(selectedShip);
			var mission : String = getShipMission(selectedShip);
			
			GUI.DrawTexture(textureRect, texture);
			GUI.Label(nameRect, name);
			GUI.Label(classRect, classe);
			GUI.Label(shipFormationRect, "Formation: " + formation);
			GUI.Label(missionRect, "Mission: " + mission);
			
			
			drawChangeName();
			
			if(GUI.Button(squadButtonRect, "Squad")) {
				setSquad(selectedShip);
			}
			
			if(GUI.Button(defenceButtonRect, "Defence")) {
				setDefence(selectedShip);
			}
			
			if(GUI.Button(merchantButtonRect, "Merchant")) {
				setMerchant(selectedShip);
			}
		
		}

	GUILayout.EndArea();
}

function drawChangeName() {
	GUI.Label(changeLabelRect, "Change ship name:");
	changeText = GUI.TextField(changeTextRect, changeText);
	if(GUI.Button(changeButtonRect, "Change")) {
		changeShipName(selectedShip, changeText);		
		changeText = "";
	}

}

function setSquad(ship : GameObject) {
	save.takeShipCommand(ship);
}

function setDefence(ship : GameObject) {
	var mission : IMissionable = ship.GetComponent(typeof(IMissionable)) as IMissionable;
	mission.setDefence();
	map.setShipAsDefence(ship);

}

function setMerchant(ship : GameObject) {
	var mission : IMissionable = ship.GetComponent(typeof(IMissionable)) as IMissionable;
	mission.setMerchant();
}


function changeShipName(ship : GameObject, name : String) {
	var nameable : INameable = ship.GetComponent(typeof(INameable)) as INameable;
	nameable.setName(name);
}

function getShipFormation(ship : GameObject) : String {
	var form : IFormeable = ship.GetComponent(typeof(IFormeable)) as IFormeable;
	var formation : Formation = form.getFormation();
	
	switch(formation) {
		case (Formation.close):
			return CLOSE;
		case (Formation.standard):
			return STANDARD;
		case (Formation.loose):
			return LOOSE;
		default:
			return null;
	}
	
}

function getShipMission(ship : GameObject) : String {
	var missionable : IMissionable = ship.GetComponent(typeof(IMissionable)) as IMissionable;
	if(missionable.hasLeader()) {
		return ESCORT;
	} else if(missionable.isDefence()) {
		return DEFENCE;
	} else if (missionable.isMerchant()) {
		return MERCHANT;
	}
	return FREE;
}


private function canPress() : boolean {
	return Time.time > lastPress + TIME;
}

private function setPress() {
	lastPress = Time.time;
}

}