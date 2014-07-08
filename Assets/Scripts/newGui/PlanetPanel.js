#pragma strict
import System.Collections.Generic;

class PlanetPanel extends FloatingWindow {

	//stats
	private var planet : PlanetInfo;
	private var faction : FactionInfo;
	
	private var map : MapInfo;
	private var general : GeneralInfo;
	private var save : SaveGame;
	private var inventory : Inventory;
	private var message : ShowMessage;
	
	var ships : List.<GameObject>;
	
	//GUI
	var imgRect : Rect;
	
	var nameRect : Rect;
	var ownerRect : Rect;
	var strRect : Rect;
	
	var descRect : Rect;
	var itemRect : Rect;
	var costRect : Rect;
	
	var buttonSize : Vector2;
	var buttonPos : Vector2[];
	
	var dilithiumRect : Rect;
	var dilImage : Texture2D;
	
	var deuraniumRect : Rect;	
	var deuImage : Texture2D;
	
	var close : Rect;
	
	var skin : GUISkin;
		
	public static var DILITHIUM_COST : int = 3;
	
	function Start() {
		super.init();
		map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
		planet = map.getPlanetInCurrentScene();
		var SaveGO : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
		general = SaveGO.GetComponent(GeneralInfo);
		save = SaveGO.GetComponent(SaveGame);
		inventory = SaveGO.GetComponent(Inventory);
		faction = general.getFactionInfo(planet.getFaction());
		message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	}
	
	function OnGUI() {
		
		
		if(super.on) {
			drawWindow();
		}
		
	}
	
	function drawWindow() {
		super.position = GUI.Window(super.getId(), super.position, window, title, GUIStyle.none);	
	}
	
	function window() {
		resizeParent();
		drawBackground();
		drawImage();
		drawDilithium();
		drawClose();
		drawStatsLabels();
		drawDescription();
		drawName();
		drawFaction();
		drawStrenght();
		//keep this at end
		drag();
	}
	
	function drawBackground() {
		if(hasBackground()) {
			GUI.DrawTexture(resizeRect(getBackgroundPosition()), background);
		}
	}
	
	function drawImage() {
		var text : Texture = planet.getImage();
		if(text) {
			GUI.DrawTexture(resizeRect(imgRect), text, ScaleMode.ScaleToFit);
		}
	}
	
	function drawDilithium() {
		//if(planet.hasDilithium()) {
			if(GUI.Button(resizeRect(dilithiumRect), dilImage, skin.GetStyle("PlanetButton"))) {
				buyDilithium();
			}
		//}
	}
	
	function buyDilithium() {
		var player : GameObject = save.getPlayerShip();
		var fuel : ShipFuel = player.GetComponent(ShipFuel);
		var lack : int = getDilithiumNeed(player);
		var cost : int = getDilithiumCost(player);
		
		
		if(fuel.isFull()) {
			message.AddMessage("Tanks are full.");
		}
		else if(!inventory.canBuy(cost)) {
			message.AddMessage("Not enough latinum.");
		} else {
			inventory.spend(cost);
			fuel.addFuel(lack);			
			message.AddMessage("Tanks are filled.");
		}
		  
	
	}
	
	function getDilithiumCost(player : GameObject) {
		
		var cost : int = DILITHIUM_COST * getDilithiumNeed(player);
		return cost;
	}
	
	function getDilithiumNeed(player : GameObject) {
		var fuel : ShipFuel = player.GetComponent(ShipFuel);
		var contains : int = fuel.getCurrentLoad();
		var capacity : int = fuel.getCapacity();
		var lack : int = capacity - contains;
		return lack;
	}
	
	private function getBackgroundPosition() : Rect {
		return new Rect(0,0, super.original.width, super.original.height);
	}
	
	function resizeParent() {
		var r : Rect = resizeRect(original);
		super.position.width = r.width;
		super.position.height = r.height;
	}
	
	function getPlanetInfo() : PlanetInfo {
		return planet;
	}
	
	function drawClose() {
		if(GUI.Button(resizeRect(close), "X", skin.GetStyle("PlanetClose"))) {
			setOff();
		}
	}
	
	function drawStats(name : String, cost : String) {
		GUI.Label(resizeRect(itemRect), name, skin.GetStyle("PlanetLabel"));
		GUI.Label(resizeRect(costRect), cost + " GPL", skin.GetStyle("PlanetLabel"));
	}
	
	function isInRect(rect : Rect) : boolean {
		return rect.Contains(Event.current.mousePosition);
	}
	
	function drawStatsLabels() {
		drawDilithiumStats();
	}
	
	function drawDilithiumStats() {
		if(isInRect(resizeRect(dilithiumRect))) {
			drawStats("Dilithium", getDilithiumCost(save.getPlayerShip()).ToString());
		}
	}
	
	
	function drawDescription() {
		var desc : String = planet.description;
		GUI.Label(resizeRect(descRect), desc, skin.GetStyle("PlanetLabel"));
	}
	
	function drawName() {
		var name : String = planet.name;
		GUI.Label(resizeRect(nameRect), name, skin.label);
	}
	
	function drawFaction() {
		var faction : String = faction.getName();
		GUI.Label(resizeRect(ownerRect), faction, skin.label);
	}
	
	function drawStrenght() {
		var strenght : String = planet.getStrenght().ToString();
		GUI.Label(resizeRect(strRect), strenght, skin.label);
	}

}