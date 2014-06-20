import System.Collections.Generic;
#pragma strict

class StationInfo {
	
	var area : Rect;
	var bg_image : Texture;
	var area_name : Rect;
	var area_class : Rect;
	var hp_image : Texture;
	var sh_image : Texture;
	var hp_area : Rect;
	var sh_area : Rect;
	
	///<summary>Draws the Station Info area</summary>
	///<param name='health'>Reference to the Station Health component</param>
	///<param name='info'>Reference to the Station Interface component</param>
	///<param name='skin'>GUISkin to be used</param>
	function draw(health : Health, info : StationInterface, skin : GUISkin) {
		//create area
		GUILayout.BeginArea(area);
			//draw background
			GUI.DrawTexture(Rect(0,0, area.width, area.height), bg_image);
			//write labels
			GUI.Label(area_name, info.stName, skin.GetStyle("StationLabel"));			
			GUI.Label(area_class, info.stClass, skin.GetStyle("StationLabel"));
			//draw bars
			GUI.DrawTexture(Rect(hp_area.x, hp_area.y, getWidth(health.maxHull, health.hull, hp_area.width), hp_area.height), hp_image);
			GUI.DrawTexture(Rect(sh_area.x, sh_area.y, getWidth(health.maxShield, health.shield, sh_area.width), sh_area.height), sh_image);
		GUILayout.EndArea();
	
	}
	
	
	private function getWidth(maxVal : float, val : float, width : int) : int {
		return (val * width)/maxVal;
	}
	

}
