#pragma strict
import System.Collections.Generic;

class PlanetPanel extends FloatingWindow {

	//stats
	private var planet : PlanetInfo;
	private var faction : FactionInfo;
	
	private var map : MapInfo;
	private var general : GeneralInfo;
	
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
	
	var skin : GUISkin;
		
	public static var DILITHIUM_COST : int = 3;
	
	function Start() {
		super.init();
		map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
		planet = map.getPlanetInCurrentScene();
		general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
		faction = general.getFactionInfo(planet.getFaction());
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
		//keep this at end
		drag();
	}
	
	function drawBackground() {
		if(hasBackground()) {
			GUI.DrawTexture(resizeRect(getBackgroundPosition()), background);
		}
	}
	
	function drawImage() {
	
	}
	
	function drawDilithium() {
		//if(planet.hasDilithium()) {
			if(GUI.Button(resizeRect(dilithiumRect), dilImage, skin.GetStyle("PlanetButton"))) {
				Debug.Log("here");
			}
		//}
	}

	private function getBackgroundPosition() : Rect {
		return new Rect(0,0, super.original.width, super.original.height);
	}
	
	function resizeParent() {
		var r : Rect = resizeRect(original);
		super.position.width = r.width;
		super.position.height = r.height;
	}

}