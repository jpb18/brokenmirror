#pragma strict
import System.Collections.Generic;

class PlanetPanel extends FloatingWindow {

	//stats
	private var planet : PlanetInfo;
	private var faction : FactionInfo;
	
	private var map : MapInfo;
	private var general : GeneralInfo;
	
	var ships : List.<GameObject>;
	var refuel : boolean;
	
	//GUI
	var itemBgTexture : Texture;
	var imgRect : Rect;
	
	var nameRect : Rect;
	var ownerRect : Rect;
	var strRect : Rect;
	
	var descRect : Rect;
	var itemRect : Rect;
	var costRect : Rect;
	
	var buttonSize : Vector2;
	var buttonPos : Vector2[];
		
	var scale : float = 1f;		
	
	function Start() {
		super.init();
		map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
		planet = map.getPlanetInCurrentScene();
		general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
		faction = general.getFactionInfo(planet.getFaction());
	}
	
	
	function drawImage() {}


}