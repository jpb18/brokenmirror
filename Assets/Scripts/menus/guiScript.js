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
var HealthModule : GuiAreas;
var WeaponModule : GuiAreas;
var TorpedoModule : Rect;

var TopGui : Rect;
var TargetModule : Rect;

//Gui Elements
var isExpanded : boolean = false; //checks if some elements on the target are expanded

//Skin
var HudSkin : GUISkin;

//global elements
var yellowOver : Texture;

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
	
	//Stop Button
	var stop_area : GuiAreas;
	var stop_img : Texture;
	
	//Map button
	var map_area : GuiAreas;
	var map_img : Texture;
	
	
}

class HealthGui {
	//bars
	//hull
	var hull_area : GuiAreas;
	var hull_fg_area : GuiAreas;
	var hull_bg : Texture;
	var hull_fg : Texture;
	
	//shield
	var shield_area : GuiAreas;
	var shield_fg_area : GuiAreas;
	var shield_bg : Texture;
	var shield_fg : Texture;

	//orbs
	var orbs_area : GuiAreas;
	var orbs_img : Texture;
	
	//orb values
	
	var shield_label_area : GuiAreas;
	var hull_label_area : GuiAreas;


}

class WeaponGui {
	//background
	var bg_area : GuiAreas;
	var bg_image : Texture;

	//weapon buttons
	var weap_area : Rect[];
	
	//Inventory button
	var inv_area : Rect;
	var inv_img : Texture;
	
	//Cargo button
	var cargo_area : Rect;
	var cargo_img : Texture;
	
	//Empty button
	var empty_texture : Texture;
	
	
	
}


class TorpedoGui {
	//Background
	var bg_area : Rect;
	var bg_image : Texture;
	
	//times three
	var area_3x : Rect;
	
	
	//times five
	var area_5x : Rect;
	
	
	//time eight
	var area_8x : Rect;
	

}

class TargetGui {
	//Main
	var main_area : Rect;
	//Background
	var bg_area : Rect;
	var bg_image : Texture;
	
	//orb placement
	var orb_area : Rect;
	
	//orb colors
	var orb_enemy_color : Texture;
	var orb_ally_color : Texture;
	var orb_owned_color : Texture;
	var orb_neutral_color : Texture;

	//labels
	var name_area : Rect;	
	var class_area : Rect;
	
	
	//health bars
	
	//shield
	var shield_area : Rect;
	var shield_img : Texture;
	
	//hull
	var hull_area : Rect;
	var hull_img : Texture;
	
	
	var expand : TargetExpand;

}


class TargetExpand {
	//expand area
	var exp_area : Rect;
	
	//expanding checks
	var isExpanded : boolean = false;
	var isMoving : boolean = false;
	
	//dispacement
	var displace : int;
	var time : float = 2.0f;
	
	//expand button
	var exp_bt_area : Rect;
	var hudSkin : GUISkin;
	
	//area to be expanded
	var toBeExpanded_Area : Rect;
	var bgImage : Texture;
	
	var scanButton : Rect;
	var hailButton : Rect;
	
	
	
	//pre: exp_img != null && exp_bt_area != null
	//this draws the button
	function DrawButton() : boolean {
		
		return GUI.Button(exp_bt_area, "", this.hudSkin.GetStyle("ExpandButton"));
			
	
	}
	
	//this draws the panel
	function DrawPanel(target : GameObject, player : GameObject, comm : CommDialogue) {
		GUILayout.BeginArea(toBeExpanded_Area);
			GUI.DrawTexture(Rect(0,0, toBeExpanded_Area.width, toBeExpanded_Area.height), bgImage, ScaleMode.ScaleToFit);
			
			GUI.Button(scanButton, "Scan", hudSkin.GetStyle("TacticalButton"));
			if(GUI.Button(hailButton, "Hail", hudSkin.GetStyle("TacticalButton"))) {
				if(target.tag == "Station") {
					target.GetComponent(StationInterface).openGUI();
				} else {
					comm.open(target, player);
				}
			}
		
		
		GUILayout.EndArea();
	
	
	}
	
	//this will check if it can expand
	function canExpand() : boolean {
		return !isExpanded && !isMoving;
	}
	
	function canRetract() : boolean {
		return isExpanded && !isMoving;
	}
	
	//this will expand the panel
	//pre canExpand()
	function expand() {
		isMoving = true;
		
		var i : float = 0;
		var rate : float = 1/time;
		var moveRate : float = displace/time;
		
		while(i < 1) {
			i += Time.deltaTime * rate;
			toBeExpanded_Area.x -= moveRate * Time.deltaTime;
			yield;
		
		}
				
		isMoving = false;	
		isExpanded = true;
	}
	
	//this will recoil the panel
	//pre canRetract()
	function retract() {
		isMoving = true;
		
		var i : float = 0;
		var rate : float = 1/time;
		var moveRate : float = displace/time;
		
		while(i < 1) {
			i += Time.deltaTime * rate;
			toBeExpanded_Area.x += moveRate * Time.deltaTime;
			yield;
		
		}
				
		isMoving = false;	
		isExpanded = false;
	
	}
	
	
	
	

}

class CommDialogue  {

	var isOpen : boolean;
	var target : GameObject;
	var player : GameObject;
	private var targetProps : shipProperties;
	
	var window : Rect; //window rect
	
	//background area
	var area : Rect;
	var bg_img : Texture;
		
	//buttons
	var trade_area : Rect;
	var board_area : Rect;
	var command_area : Rect;
	var close_area : Rect;
	
	//labels
	var name_label : Rect;
	var message_label : Rect;
	var icon_label : Rect;
	
	var skin : GUISkin;
	
	function DrawWindow() {
		if(isOpen && target){
			if(target.tag == "Ship") {
				window = GUI.Window(0, window, DrawDialogue, "", GUIStyle.none);
			} 
		}
	
	}
	
	
	function DrawDialogue(windowID : int) {
		GUILayout.BeginArea(area);
			GUI.DrawTexture(area, bg_img); //draw background
			
			//Draw the buttons			
			GUI.Button(trade_area, "Trade", this.skin.GetStyle("CommButton"));
			GUI.Button(board_area, "Board", this.skin.GetStyle("CommButton"));
			
			//Check if the ship is owned by the player. if so, draw the button
			if(targetProps.shipInfo.faction == 0) {
				if(GUI.Button(command_area, "Command", this.skin.GetStyle("CommButton"))) {
					
					swapShip(target, player);
					
				}
			} else {
				GUI.Button(command_area, "", this.skin.GetStyle("CommButton"));
			}
			
			if(GUI.Button(close_area, "X", this.skin.GetStyle("CloseComm"))) {
				close();
			}
			
			//Draw the ship icon
			GUI.DrawTexture(icon_label, getTexture());
			
			//Labels the ship name
			GUI.Label(name_label, getName(), skin.label);
			
			
			//Labels the message
			var message : String = "Hey Boss!\n This String here is just for testing the message box of the comm system!";
			GUI.Label(message_label, message, skin.GetStyle("MessageComm"));  
			
			
		GUILayout.EndArea();
		GUI.DragWindow();
	}
	
	//this gets the target icon texture
	private function getTexture() : Texture {
		var text : Texture;
	
		if(target.tag == "Ship") {
			text = targetProps.shipInfo.targetImg;
		}
		//add other targets here later on
		
		return text;
	
	}
	
	//this gets the target name
	private function getName() : String {
		var name : String;
		
		if(target.tag == "Ship") {
			name = targetProps.shipInfo.shipName;
		}
		
		return name;
	
	}
	
	function close() {
		isOpen = false;
		target = null;
		player = null;
		window.x = Screen.width/2 - window.width/2;
		window.y = Screen.height/2 - window.height/2;
	}
	
	function open(target : GameObject, player : GameObject) {
		close();
		isOpen = true;
		this.target = target;
		this.player = player;
		targetProps = target.GetComponent(shipProperties);
	}
	
	//this script swaps the ship
	//pre target != null && player != null
	function swapShip(target : GameObject, player : GameObject) {
		//set current ship as npc
		var playerProps : shipProperties = player.GetComponent(shipProperties);
		playerProps.setPlayer(false);
		
		//set new ship as player
		targetProps.setPlayer(true);
		
		//now change camera target
		var camScript : MouseOrbit = Camera.main.GetComponent(MouseOrbit);
		camScript.target = target.transform;
		
		//clear targeting information
		target.GetComponent(shipTarget).target = null;
		player.GetComponent(shipTarget).target = null;
		player.GetComponent(shipTarget).repeatClick = false;
		
		close();
		
	}
	
	


}

class RadarLabel {
	var own_bg : Texture2D;
	var ally_bg : Texture2D;
	var enemy_bg : Texture2D;
	var neutral_bg : Texture2D;
	
	var own_small : Texture2D;
	var ally_small : Texture2D;
	var enemy_small : Texture2D;
	var neutral_small : Texture2D;
	
	var size : Vector2;
	var label_name : Rect;
	var label_class : Rect;
	var label_dist : Rect;
	private var target : GameObject;
	private var name : String;
	private var className : String;
	
	var skin : GUISkin;
	
	public static final var KM : float = 1000.0f; 
	
	//this draws the label
	//pre: target != null && position.z > 0
	function Draw(position : Vector3, player : GameObject, general : GeneralInfo) {
		GUILayout.BeginArea(Rect(position.x, convertBotToTop(position.y) - size.y, size.x, size.y));
			GUI.DrawTexture(Rect(0,0, size.x, size.y), getTexture(player, general));
			
			
			GUI.Label(label_name, name, skin.GetStyle("MessageComm"));
			GUI.Label(label_class, className, skin.GetStyle("MessageComm"));
			GUI.Label(label_dist, "Distance: " + getDistance(player).ToString() + "KM", skin.GetStyle("MessageComm"));
		GUILayout.EndArea();
		
		
	}
	
	//this draws the label if the target its outside the screen
	//pre target != null && position.z <= 0
	function drawSmall(position : Vector3, player : GameObject, general : GeneralInfo) {
		
		
		
	}
	
	//this sets the label
	//pre: target != null
	function Set(target : GameObject) {
		this.target = target;
		if(target.tag == "Ship") {
			var shipProps : shipProperties = target.GetComponent(shipProperties);
			name = shipProps.shipInfo.shipName;
			className = shipProps.shipInfo.shipClass;
		} else if(target.tag == "Station") {
			var station : StationInterface = target.GetComponent(StationInterface);
			name = station.stName;
			className = station.stClass;
		
		}
	}
	
	
	private function convertBotToTop(y : int) : int {
		return Screen.height - y;
	}
	
	private function getFaction(obj : GameObject) : int {
		var faction : int;
		
		if(obj.tag == "Ship") {
			
			faction = obj.GetComponent(shipProperties).shipInfo.faction;
		
		} else if(obj.tag == "Station") {
			
			faction = obj.GetComponent(Station).faction;
		
		}
	
		return faction;
	}
	
	function getTexture(player : GameObject, general : GeneralInfo) : Texture2D {
		var texture : Texture2D;
		
	
		//get faction info
		var ownFac : int = getFaction(target);
		var plaFac : int = getFaction(player);
		
		var ownInfo : FactionInfo = general.getFactionInfo(ownFac);
		
		
		if(ownFac == plaFac) { //check if it owns
			texture = own_bg;		
		} else if(ownInfo.isAllied(plaFac)) { //check if its ally
			texture = ally_bg;
		} else if(ownInfo.isHostile(plaFac)) { //check if its enemy
			texture = enemy_bg;
		} else {
			texture = neutral_bg;	
		}
		
		
		return texture;
	
	}
	
	function getSmallTexture(player : GameObject, general : GeneralInfo) : Texture2D {
		var texture : Texture2D;
		
	
		//get faction info
		var ownFac : int = getFaction(target);
		var plaFac : int = getFaction(player);
		
		var ownInfo : FactionInfo = general.getFactionInfo(ownFac);
		
		
		if(ownFac == plaFac) { //check if it owns
			texture = own_small;		
		} else if(ownInfo.isAllied(plaFac)) { //check if its ally
			texture = ally_small;
		} else if(ownInfo.isHostile(plaFac)) { //check if its enemy
			texture = enemy_small;
		} else {
			texture = neutral_small;	
		}
		
		
		return texture;
	}
	
	function getDistance(player : GameObject) : int {
		
		return Vector3.Distance(target.transform.position, player.transform.position) * KM;
	
	}
	
	//this function will check if a certain element belongs in 1 array
	private function CheckArrayValue(desValue : int, array : int[]) : boolean {

		var belongs : boolean = false;
		
		for(var val : int in array) {
		
			if (desValue == val)
			{
				belongs = true;
			}
		
		}
		
		return belongs;

	}
	
	

}


class RedAlertGui {
	var image : Texture;
	var timePeriod : float;
	var areaRect : Rect;
	var imageRect : Rect;
	
	function drawRedAlert(isRedAlert : boolean) {
		if(isRedAlert) {
			GUI.color = new Color(1,1,1, getTransparency());
			
			GUI.DrawTexture(imageRect, image);
			
			GUI.color = Color.white;
			
		}
	}
	
	private function getTransparency() : float {
	
		return (Mathf.Cos(Time.time * timePeriod)/2) + 0.5f;
	
	}
	

}

//fixed
var Helm : HelmGui;
var health : HealthGui;
var Weapon : WeaponGui;
var Torpedo : TorpedoGui;
var Target : TargetGui;

//windows
var commWindow : CommDialogue;

//labels
var radarLabel : RadarLabel;

//redAlert
var redAlert : RedAlertGui;

//External Scripts
var triggers : shipTriggers;
var shipProps : shipProperties;
var shipMov : shipMovement;
var shipHea : shipHealth;
var shipWeap : shipWeapons;
var shipTar : shipTarget;
var mapInfo : MapInfo;
var loadScene : LoadScene;
var general : GeneralInfo;
var hud : HUDStatus;
var message : ShowMessage;
var missions : Missions;

//main camara
var mainCam : Camera;
var camScript : MouseOrbit;


function Start () {
	message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	missions = GameObject.FindGameObjectWithTag("Missions").GetComponent(Missions);
	triggers = gameObject.GetComponent(shipTriggers);
	general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
	shipProps = gameObject.GetComponent(shipProperties);
	shipMov = gameObject.GetComponent(shipMovement);
	shipHea = gameObject.GetComponent(shipHealth);
	shipWeap = gameObject.GetComponent(shipWeapons);
	shipTar = gameObject.GetComponent(shipTarget);
	mapInfo = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
	loadScene = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
	hud = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
	
	//reset loadScene status
	loadScene.show = false;
	
	//set radar label
	radarLabel.Set(gameObject);
	
	//get main camera
	mainCam = Camera.main;
	camScript = mainCam.GetComponent(MouseOrbit);

}

function OnGUI () {

	if(hud.isShowingGui())	guiFunction();
	

}

function guiFunction() {
	//fixed gui stuff
	if(shipProps.playerProps.isPlayer)
	{
		BotGUI();
		TopGUI();
	
	} 
	
	//windows
	commWindow.DrawWindow();
	
	//non player labels
	if(!shipProps.playerProps.isPlayer) 
	{
		if(camScript.target) {
			var player : GameObject = camScript.target.gameObject;
		
		
			var pos : Vector3 = mainCam.WorldToScreenPoint(transform.position);
			if(pos.z > 0) {
				radarLabel.Draw(pos, player, general);
			}
		}
		
	}
}

//Bottom GUI
function BotGUI () {

	GUILayout.BeginArea(Rect(Screen.width/2 - BotGui.x/2, Screen.height - BotGui.y, BotGui.width, BotGui.height));
	
		helmModule();
		healthModule();
		weaponModule();
		torpedoModule();
	
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
		//get movement info
		var speedInc : float = shipProps.movement.acceleration;
		
		//Increase button
		if(GUI.RepeatButton(Rect(Helm.inc_but_area.x, Helm.inc_but_area.y, Helm.inc_but_area.width, Helm.inc_but_area.height), Helm.inc_but_img, HudSkin.button)) {
			
			
			if(curSpeed < maxSpeed) {
				shipMov.speedStatus += Time.deltaTime * speedInc;
			
			}
		
		}
		
		//Decrease button
		if(GUI.RepeatButton(Rect(Helm.dec_but_area.x, Helm.dec_but_area.y, Helm.dec_but_area.width, Helm.dec_but_area.height), Helm.dec_but_img, HudSkin.button))
		{
		
			if(curSpeed > minSpeed) {
				shipMov.speedStatus -= Time.deltaTime * speedInc;
			
			}
		
		}
		
		//Stop button
		if(GUI.Button(Rect(Helm.stop_area.x, Helm.stop_area.y, Helm.stop_area.width, Helm.stop_area.height), Helm.stop_img, HudSkin.GetStyle("StopButton")))
		{
			if(curSpeed != 0 && !shipMov.isChanging) {
			
				StartCoroutine(shipMov.FullStop(curSpeed, speedInc));
			  
			} 
		}
		
		
		//Map button
		if(GUI.Button(Rect(Helm.map_area.x, Helm.map_area.y, Helm.map_area.width, Helm.map_area.height), Helm.map_img, HudSkin.button)) {
			
			mapInfo.swapStatus();
		
		}
		
		
	
	GUILayout.EndArea();

}

//Shows health

function healthModule() {

	GUILayout.BeginArea(Rect(HealthModule.x, HealthModule.y, HealthModule.width, HealthModule.height));
	
		//calculations
		//get hull values
		var maxHull : float = shipHea.shipHealth.maxHealth;
		var curHull : float = shipHea.shipHealth.health;
		var percHull : float = ValueToPercentage(maxHull, curHull);
		
		
		//get shield values
		var maxShield : float = shipHea.shipHealth.maxShields;
		var curShield : float = shipHea.shipHealth.shields;
		var percShield : float = ValueToPercentage(maxShield, curShield);
	
	
		//Health Bars
		//Hull Background
		GUI.DrawTexture(Rect(health.hull_area.x, health.hull_area.y, health.hull_area.width, health.hull_area.height), health.hull_bg);
		
		//Calculate foreground transparency
		var hullColor : Color = Color.white;
		var hullAlpha : float = percHull/100;
		hullColor.a = hullAlpha;
					
		GUI.color = hullColor; //sets transparency
		
		//Hull Foreground
		GUI.DrawTexture(Rect(health.hull_fg_area.x, health.hull_fg_area.y, health.hull_fg_area.width, health.hull_fg_area.height), health.hull_fg);
		
		GUI.color = Color.white; //sets back to default
	
		//Shield Backgroound
		GUI.DrawTexture(Rect(health.shield_area.x, health.shield_area.y, health.shield_area.width, health.shield_area.height), health.shield_bg);  
		
		//Calculate foreground transparency
		var shieldColor : Color = Color.white;
		var shieldAlpha : float = percShield/100;
		shieldColor.a = shieldAlpha;
		
		GUI.color = shieldColor; //sets transparent
		
		//Shield Foreground
		GUI.DrawTexture(Rect(health.shield_fg_area.x, health.shield_fg_area.y, health.shield_fg_area.width, health.shield_fg_area.height), health.shield_fg);
		
		GUI.color = Color.white; //sets default back
		
		//Health Orbs
		//Draw Background
		GUI.DrawTexture(Rect(health.orbs_area.x, health.orbs_area.y, health.orbs_area.width, health.orbs_area.height), health.orbs_img);
		
		
	
		//Write hull value
		GUI.Label(Rect(health.hull_label_area.x, health.hull_label_area.y, health.hull_label_area.width, health.hull_label_area.height), Mathf.RoundToInt(percHull).ToString() + "%", HudSkin.label);
	
		//Write shield value
		GUI.Label(Rect(health.shield_label_area.x, health.shield_label_area.y, health.shield_label_area.width, health.shield_label_area.height), Mathf.RoundToInt(percShield).ToString() + "%", HudSkin.GetStyle("ShieldLabel"));
	
	GUILayout.EndArea();


}

//Shows weapon gui module

function weaponModule() {

	GUILayout.BeginArea(Rect(WeaponModule.x, WeaponModule.y, WeaponModule.width, WeaponModule.height));
	
		//Draw Background
		GUI.DrawTexture(Rect(Weapon.bg_area.x, Weapon.bg_area.y, Weapon.bg_area.width, Weapon.bg_area.height), Weapon.bg_image);
	
		//Draw Button background
		
		for(var y : int = 0; y < 8; y++) {
		
			GUI.DrawTexture(Weapon.weap_area[y], Weapon.empty_texture);
		
		}
		
		//Draw buttons
		//first button - phaser
		CreateWeapButton(shipWeap.phaser, HudSkin, Weapon.weap_area[0]);
		
		//second button - torpedo 1
		CreateWeapButton(shipWeap.torp1, HudSkin, Weapon.weap_area[1]);
		
		//third button - torpedo 2
		CreateWeapButton(shipWeap.torp2, HudSkin, Weapon.weap_area[2]);
		
		
		
	
		
		//Draw inventory button and check if its pressed
		if(GUI.Button(Weapon.inv_area, Weapon.inv_img, HudSkin.button)) {
		
			//Open inventory window
		
		}
		
		//Draw beam down button and check if its pressed
		if(GUI.Button(Weapon.cargo_area, Weapon.cargo_img, HudSkin.button)) {
		
			//first lets see if we're inside orbit range
			if(!triggers.isOrbit()) {
				message.AddMessage("Not in a planets orbit.");
			} else {
				missions.finishTradeMissionInSystem();
			}
		
		}
		
		
		
	
	
	GUILayout.EndArea();

}

//torpedo module

function torpedoModule() {
	GUILayout.BeginArea(TorpedoModule);
	
		//Draw Background image
		GUI.DrawTexture(Torpedo.bg_area, Torpedo.bg_image);
		
		//set overlay transparency at 0.75
		var overColor : Color = Color.white;
		overColor.a = 0.75;	
	
		
		//Draw 3x modifier button
		if(GUI.Button(Torpedo.area_3x, "x3", HudSkin.button)) {
			if(shipWeap.torpVolley != Volley.three) {
				shipWeap.torpVolley = Volley.three;
			} else {
				shipWeap.torpVolley = Volley.one;
			}
		
		}
		
		//if its selected, draw a overlay over it
		if(shipWeap.torpVolley == Volley.three) {
		
			GUI.color = overColor;	
		
			GUI.DrawTexture(Torpedo.area_3x, yellowOver);
			
			GUI.color = Color.white;
		
		}
		
		
		
	
		//5x modifier button
		if(GUI.Button(Torpedo.area_5x, "x5", HudSkin.button)) {
			if(shipWeap.torpVolley != Volley.five) {
				shipWeap.torpVolley = Volley.five;
			} else {
				shipWeap.torpVolley = Volley.one;
			}
		}
		
		//if its selected, draw a overlay over it
		if(shipWeap.torpVolley == Volley.five) {
		
			GUI.color = overColor;	
		
			GUI.DrawTexture(Torpedo.area_5x, yellowOver);
			
			GUI.color = Color.white;
		
		}
		
		//8x modifier button
		if(GUI.Button(Torpedo.area_8x, "x8", HudSkin.button)) {
			
			if(shipWeap.torpVolley != Volley.eight) {
				shipWeap.torpVolley = Volley.eight;
			} else {
				shipWeap.torpVolley = Volley.one;
			}
		}
		
		//if its selected, draw a overlay over it
		if(shipWeap.torpVolley == Volley.eight) {
		
			GUI.color = overColor;	
		
			GUI.DrawTexture(Torpedo.area_8x, yellowOver);
			
			GUI.color = Color.white;
		
		}
		
	
	GUILayout.EndArea();


}


//Draws the superior part of the HUD
function TopGUI() {

	GUILayout.BeginArea(Rect(Screen.width/2 - TopGui.x/2, TopGui.y, TopGui.width, TopGui.height));
	
		redAlertModule();
		targetModule();	
	
	GUILayout.EndArea();


}

function redAlertModule() {

	GUILayout.BeginArea(redAlert.areaRect);
	
		redAlert.drawRedAlert(shipProps.getRedAlert());
	
	GUILayout.EndArea();
	

}


//Draws the targetting module of the HUD
function targetModule() {

	if(shipTar.target) //checks first if the ship has a target to show
	{

		GUILayout.BeginArea(TargetModule);
			
			//Expand Area
			
			GUILayout.BeginArea(Target.expand.exp_area);
			
			
				//Draw panel		
				Target.expand.DrawPanel(shipTar.target, gameObject, commWindow); 
															
				//Expand button
				if(Target.expand.DrawButton()) {
					if(Target.expand.canExpand()) {
						StartCoroutine(Target.expand.expand());
					} else if(Target.expand.canRetract()) {
						StartCoroutine(Target.expand.retract());
					}
				
				}
			
			GUILayout.EndArea();
			//Main Component
			GUILayout.BeginArea(Target.main_area);
				//Lets start by the background
				GUI.DrawTexture(Target.bg_area, Target.bg_image);
				
				//Now the orb part
				//get the player ship faction and faction information
				var playerFaction : FactionInfo = general.getFactionInfo(shipProps.shipInfo.faction);
				
				//obtain the target faction
				var tarFaction : int;
				
				if(shipTar.target.tag == "Ship") {
					
					var targetScript : shipProperties = shipTar.target.GetComponent(shipProperties);
					tarFaction = targetScript.shipInfo.faction;						
				
				} else if (shipTar.target.tag == "Station") {
					
					var station : Station = shipTar.target.GetComponent(Station);
					tarFaction = station.faction;
				
				}
				
				//Now lets select the orb in question
				var orbTexture : Texture;
				if(shipProps.shipInfo.faction == tarFaction) //check if it has the same faction
				{
					orbTexture = Target.orb_owned_color; //give owned color
				}
				else if (playerFaction.isAllied(tarFaction)) //check if it's an ally
				{
					orbTexture = Target.orb_ally_color; //give allied color
				}
				else if (playerFaction.isHostile(tarFaction)) //check if it's an enemy
				{
					orbTexture = Target.orb_enemy_color; //give enemy color
				}
				else //if none of the above
				{
					orbTexture = Target.orb_neutral_color; //give neutral color
				}
				
				
				//Draw the texture
				GUI.DrawTexture(Target.orb_area, orbTexture);
				
				//Now Draw the ship image
				//First get it from the targeted object
				var tarImage : Texture;
				var shipClass : String; //get these for the future
 				var shipName : String;
				
				if(shipTar.target.tag == "Ship") { //if it's a ship
									
					
					tarImage = targetScript.shipInfo.targetImg; //get image
					shipClass = targetScript.shipInfo.shipClass; //get class
					shipName = targetScript.shipInfo.shipName; //get name
				
				} else if(shipTar.target.tag == "Station") {
					var stationI : StationInterface = shipTar.target.GetComponent(StationInterface);
					tarImage = stationI.image;
					shipClass = stationI.stClass;
					shipName = stationI.stName;
				}
				
				//Now draw the texture
				GUI.DrawTexture(Target.orb_area, tarImage);
				
				//And now, it's time for writing those labels
				GUI.Label(Target.name_area, shipName, HudSkin.GetStyle("TargetLabel"));
				GUI.Label(Target.class_area, shipClass, HudSkin.GetStyle("TargetLabel"));
				
				//And now the health bars of the target
				//lets start by getting the target status
				
				var hull : float;
				var maxHull : float;
				var shield : float;
				var maxShield : float;
				
				if(shipTar.target.tag == "Ship") { //if its a ship
				
					var healthTarget : shipHealth = shipTar.target.GetComponent(shipHealth); //get the target health script
					hull = healthTarget.shipHealth.health; //get hull values
					maxHull = healthTarget.shipHealth.maxHealth; //get max hull
					shield = healthTarget.shipHealth.shields; // get shields
					maxShield = healthTarget.shipHealth.maxShields; //get max shields
				
				} else if (shipTar.target.tag == "Station") {
					var stationH : Health = shipTar.target.GetComponent(Health);
					hull = stationH.hull;
					maxHull = stationH.maxHull;
					shield = stationH.shield;
					maxShield = stationH.maxShield;
					
				}
				
				//lets get the width of those bars
				var shieldWidth : int = GetBarSize(Target.shield_area.width, maxShield, shield);
				var hullWidth : int = GetBarSize(Target.hull_area.width, maxHull, hull);
				//Now lets draw them
				//start by shield
				GUI.DrawTexture(Rect(Target.shield_area.x, Target.shield_area.y, shieldWidth, Target.shield_area.height), Target.shield_img);
				GUI.DrawTexture(Rect(Target.hull_area.x, Target.hull_area.y, hullWidth, Target.hull_area.height), Target.hull_img);
				
				
				
			
			GUILayout.EndArea();
		
		GUILayout.EndArea();
	
	}


}


//this function automates the button creation process for the weapons
//Weapon contains the weapon slot information
//Skin contains the GUI aspect information
//Area contains the coordinates and size of the button
//Phaser Overflow
function CreateWeapButton(Weapon : Phaser, Skin : GUISkin, Area : Rect) {
	//Start
	
	//check if weapon is not enabled or is not empty
	if(Weapon.isEnabled && Weapon.phaser) {
	
		//Get weapon image
		var weapon_scr : weaponScript = Weapon.phaser.GetComponent(weaponScript); //Get weapon script
		var weapon_img : Texture = weapon_scr.guiInfo.image; //Get weapon GUI Image
		
		
		//Draw button with Area, weapon_img and Skin and check if said button is pressed 
		if(GUI.Button(Area, weapon_img, Skin.button) && shipProps.combatStatus.isRedAlert) {
		
			
				if(shipTar.target) { //check if there's a target
					if(Weapon.canFire(shipTar.target)) {//check if weapon can fire
						Weapon.fire(shipTar.target, shipWeap.volleyNum(), shipWeap); //Set isFiring as true
					}
				
				} else { //if there isn't, find one and set isFiring as true after
				
					shipTar.target = shipTar.FindTarget(gameObject, shipProps); //Find target 
					
					if(Weapon.canFire(shipTar.target)) {//check if weapon can fire
						Weapon.fire(shipTar.target, shipWeap.volleyNum(), shipWeap); //Set isFiring as true
					}
				
				}
			
			
		
		}
		
		//If weapon is reloading, draw overlay
		if(Time.time < Weapon.getNextShot()) {
			
			//Calculate size
			//Get total reload time and time remaining
			var totalReload : float = Weapon.getCooldown();
			var remainTime : float = Weapon.getNextShot() - Time.time;
			
			//Get overlay height
			var overHeight : int = GetBarSize(Area.height, totalReload, remainTime);
			
			//get size diference
			var sizeDif : int = Area.height - overHeight;
		
			//transparency
			var overColor : Color = Color.white;
			overColor.a = 0.75;
			
			GUI.color = overColor;
		
			GUI.DrawTexture(Rect(Area.x, Area.y + sizeDif, Area.width, overHeight), yellowOver);
		
			GUI.color = Color.white;
		}
		
		
	
	} 
	
	//End
}


//this function automates the button creation process for the weapons
//Weapon contains the weapon slot information
//Skin contains the GUI aspect information
//Area contains the coordinates and size of the button
//Torpedo Overflow
function CreateWeapButton(Weapon : Torpedo, Skin : GUISkin, Area : Rect) {
	//Start
	
	//check if weapon is not enabled or is not empty
	if(Weapon.isEnabled && Weapon.torpedo) {
	
		//Get weapon image
		var weapon_scr : weaponScript = Weapon.torpedo.GetComponent(weaponScript); //Get weapon script
		var weapon_img : Texture = weapon_scr.guiInfo.image; //Get weapon GUI Image
		
		
		//Draw button with Area, weapon_img and Skin and check if said button is pressed 
		if(GUI.Button(Area, weapon_img, Skin.button) && shipProps.combatStatus.isRedAlert) {
		
			
				if(shipTar.target) { //check if there's a target
					if(Weapon.canFire(shipTar.target)) {//check if weapon can fire
						StartCoroutine(Weapon.fire(shipTar.target, shipWeap.volleyNum())); //Set isFiring as true
					}
				
				} else { //if there isn't, find one and set isFiring as true after
				
					shipTar.target = shipTar.FindTarget(gameObject, shipProps); //Find target 
					
					if(Weapon.canFire(shipTar.target)) {//check if weapon can fire
						StartCoroutine(Weapon.fire(shipTar.target, shipWeap.volleyNum())); //Set isFiring as true
					}
				
				}
			
			
		
		}
		
		//If weapon is reloading, draw overlay
		if(Time.time < Weapon.getNextShot()) {
			
			//Calculate size
			//Get total reload time and time remaining
			var totalReload : float = Weapon.getCooldown();
			var remainTime : float = Weapon.getNextShot() - Time.time;
			
			//Get overlay height
			var overHeight : int = GetBarSize(Area.height, totalReload, remainTime);
			
			//get size diference
			var sizeDif : int = Area.height - overHeight;
		
			//transparency
			var overColor : Color = Color.white;
			overColor.a = 0.75;
			
			GUI.color = overColor;
		
			GUI.DrawTexture(Rect(Area.x, Area.y + sizeDif, Area.width, overHeight), yellowOver);
		
			GUI.color = Color.white;
		}
		
		
	
	} 
	
	//End
}

//this function returns the size of a bar in pixels
function GetBarSize (FullSize : int, MaxValue : float, CurValue : float) : int {

	if(MaxValue == 0) {
		return 0;
	}

	var newSize : int;
	
	newSize = (FullSize * CurValue)/MaxValue;
	
	return newSize;
	

}

function ValueToPercentage(MaxValue : float, CurValue : float) : float {

	if(MaxValue == 0) {
		return 0;
	}

	var perc : float;
	
	perc = (100*CurValue) / MaxValue;
	
	return perc;


}

//this function will check if a certain element belongs in 1 array
function CheckArrayValue(desValue : int, array : int[]) : boolean {

	var belongs : boolean = false;
	
	for(var val : int in array) {
	
		if (desValue == val)
		{
			belongs = true;
		}
	
	}
	
	return belongs;

}

function openComm(target : GameObject) {
	if(!commWindow.isOpen){
		commWindow.open(target, gameObject);
		}
}
