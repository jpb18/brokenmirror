#pragma strict

class GuiAreas {
	var width : int;
	var height : int;
	var x : int;
	var y : int;
	
}

//Areas
var BotGui : GuiAreas;
var HelmModule : GuiAreas;

//Gui Elements


//Skin
var HudSkin : GUISkin;

//helm
class HelmGui {
	//Main background
	var bgTexture : Texture;
	var bg_width : int;
	var bg_height : int;
	
	//Backward Indicator
	var bw_speed_bg : Texture;
	var bw_speed_fg : Texture;
	var bw_speed_area : GuiAreas;
	
	//Backward Shadow
	var bw_shadow : Texture;
	var bw_shadow_area : GuiAreas;
			
	//Forward Indicator
	var fwd_speed_bg : Texture;
	var fwd_speed_fg : Texture;
	var fwd_speed_area : GuiAreas;
	
	//Buttons
	//Increase Button
	var inc_but_area : GuiAreas;
	var inc_but_img : Texture;
	
	//Decrease button
	var dec_but_area : GuiAreas;
	var dec_but_img : Texture;
	
	

}

var Helm : HelmGui;



//External Scripts
var shipProps : shipProperties;
var shipMov : shipMovement;




function Start () {

	shipProps = gameObject.GetComponent(shipProperties);
	shipMov = gameObject.GetComponent(shipMovement);

}

function OnGUI () {

	if(shipProps.playerProps.isPlayer)
	{
		BotGUI();
	
	}
	
		

}

//Bottom GUI
function BotGUI () {

	GUILayout.BeginArea(Rect(Screen.width/2 - BotGui.x/2, Screen.height - BotGui.y, BotGui.width, BotGui.height));
	
		helmModule();
	
	
	GUILayout.EndArea();


}

//Helm Module

function helmModule () {

	GUILayout.BeginArea(Rect(HelmModule.x, HelmModule.y, HelmModule.width, HelmModule.height));
	
		GUI.DrawTexture(Rect(0,0, Helm.bg_width, Helm.bg_height), Helm.bgTexture); //background image
		
		//forward speed background		
		GUI.DrawTexture(Rect(Helm.fwd_speed_area.x, Helm.fwd_speed_area.y, Helm.fwd_speed_area.width, Helm.fwd_speed_area.height), Helm.fwd_speed_bg);
		
		//forward speed foreground
		//get current speed and max speed
		var curSpeed : float = shipMov.speedStatus;
		var maxSpeed : float = shipMov.movProps.maxStatus;
		
		
		var fwbarSize : int;
		if(curSpeed > 0)
		{
			fwbarSize = GetBarSize(Helm.fwd_speed_area.width, maxSpeed, curSpeed);
		}
		else
		{
			fwbarSize = 0;
		}
		
		//Draw speed bar
		GUI.DrawTexture(Rect(Helm.fwd_speed_area.x, Helm.fwd_speed_area.y, fwbarSize, Helm.fwd_speed_area.height), Helm.fwd_speed_fg, ScaleMode.ScaleAndCrop);
		
		//Backward Speed Shadow
		GUI.DrawTexture(Rect(Helm.bw_shadow_area.x, Helm.bw_shadow_area.y, Helm.bw_shadow_area.width, Helm.bw_shadow_area.height), Helm.bw_shadow);
		
		//backward speed background
		GUI.DrawTexture(Rect(Helm.bw_speed_area.x, Helm.bw_speed_area.y, Helm.bw_speed_area.width, Helm.bw_speed_area.height), Helm.bw_speed_bg);
		
		//backward speed fooreground
		//get min speed
		var minSpeed : float = shipMov.movProps.minStatus;
		
		
		var bwbarSize : int;
		if(curSpeed < 0)
		{
			bwbarSize = GetBarSize(Helm.bw_speed_area.width, minSpeed, curSpeed);
		}
		else
		{
			bwbarSize = 0;
		}
		
		//Draw speed bar
		
		GUI.DrawTexture(Rect(Helm.bw_speed_area.x, Helm.bw_speed_area.y, bwbarSize, Helm.bw_speed_area.height), Helm.bw_speed_fg, ScaleMode.ScaleAndCrop);
	
		//Draw buttons
		
	
	GUILayout.EndArea();

}


//this function returns the size of a bar in pixels
function GetBarSize (FullSize : int, MaxValue : float, CurValue : float) : int {

	var newSize : int;
	
	newSize = (FullSize * CurValue)/MaxValue;
	
	return newSize;
	

}