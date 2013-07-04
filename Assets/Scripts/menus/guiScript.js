#pragma strict


class CenterGUI {
	var width : int;
	var height : int;
}



class MovementGui {
	var height : int;
	var width : int;
	var style : GUISkin;
	
	var stopIcon : Texture2D;
	var upIcon : Texture2D;
	var downIcon : Texture2D;
	
	
	
	var buttonWidth : int = 48;
	var buttonHeight : int = 48;
	
	var buttonPadding : int = 2;
	
	var barBG : Texture2D;
	var barFG : Texture2D;
	
	var barWidth : int = 50;
	var barHeight : int = 206;
	
	var fgMode : ScaleMode;

}

class TacticalGui {
	var width : int;
	var height : int;

}

class TorpedoGui {
	var width : int;
	var height : int;
	
	//Background
	var bgImage : Texture2D;
	
	
	//Taskbar
	var taskImage : Texture2D;
	var taskX : int = 5;
	var taskY : int = 7;
	var taskWidth : int = 322;
	var taskHeight : int = 11;
	
	//Title Text
	var titleStyle : GUIStyle;
	var titleText : String = "Torpedo";
	var titleX : int;
	var titleY : int;
	var titleWidth : int;
	var titleHeight : int;
	
	//"Spread" Text
	var spreadStyle : GUIStyle;
	var spreadText = "Spread";
	var spreadX : int;
	var spreadY : int;
	var spreadWidth : int;
	var spreadHeight : int;
	
	//"Volley" Text
	var volleyStyle : GUIStyle;
	var volleyText = "Volley";
	var volleyX : int;
	var volleyY : int;
	var volleyWidth : int;
	var volleyHeight : int;
	
	//Buttons
	var style : GUISkin;
	var buttonWidth : int;
	var buttonHeight : int;
	
	//Button Spread "-"
	var minusSpreadX : int;
	var minusSpreadY : int;
	
	//Button Spread "+"
	var plusSpreadX : int;
	var plusSpreadY : int;
	
	//Button Volley "-"
	var minusVolleyX :int;
	var minusVolleyY : int;
	
	//Button Volley "+"
	var plusVolleyX :int;
	var plusVolleyY :int;
	
	//Displays
	var displayImg : Texture2D;
	var displayWidth : int = 28;
	var displayHeight : int = 28;
	
	//Display Spread
	var displaySpreadX : int;
	var displaySpreadY : int;
	var styleSpread : GUIStyle;
	
	//Display Volley
	var displayVolleyX : int;
	var displayVolleyY : int;
	var styleVolley : GUIStyle;
}

class HealthGui {
	var width : int;
	var height : int;
	
	var barWidth : int;
	var barHeight : int;
	
	var botPadding : int;
	
	var bgBar : Texture2D;
	var shieldBar : Texture2D;
	var hullBar : Texture2D;
	
	var scaleMode : ScaleMode;

}

class WeaponsGUI {
	var width : int;
	var height : int;
	
	var botPadding : int;
	
	var backImage : Texture2D;
	var shipImg : Texture2D;
	
	//ship img dimensions
	var shipWidth : int;
	var shipHeight : int;
	//ship img coordinates
	var shipCoodX : int;
	var shipCoodY : int;
	
	//buttons
	var buttonStyle : GUISkin;
	var btWidth : int;
	var btHeight : int;
	
	//button1
	var bt1X : int;
	var bt1Y : int;
	
	//button2
	var bt2X : int;
	var bt2Y : int;
	
	//button 3
	var bt3X : int;
	var bt3Y : int;
	
	//button 4
	var bt4X : int;
	var bt4Y : int;
	
	//button 5
	var bt5X : int;
	var bt5Y : int;
	
	//button 6
	var bt6X : int;
	var bt6Y : int;
	
	//button 7
	var bt7X : int;
	var bt7Y : int;
	
	//button 8
	var bt8X : int;
	var bt8Y : int;
	
	

}

var centGUI : CenterGUI;
var MovGUI : MovementGui;
var tacGUI : TacticalGui;
var torpGUI : TorpedoGui;
var healthGUI : HealthGui;
var weaponGUI : WeaponsGUI;


//needed scripts
var shipProps : shipProperties;
var shipMov : shipMovement;
var shipWep : shipWeapons;
var shipHea : shipHealth;
var shipTar : shipTarget;


function Start () {

	//get necessary scripts
	shipProps = gameObject.GetComponent(shipProperties);
	shipMov = gameObject.GetComponent(shipMovement);
	shipWep = gameObject.GetComponent(shipWeapons);
	shipHea = gameObject.GetComponent(shipHealth);
	shipTar = gameObject.GetComponent(shipTarget);
	
	
	

}

function OnGUI () {
	

	//gets escape menu status
	var cam_go : GameObject = Camera.main.gameObject;
	var cam_sc : testReturn = cam_go.GetComponent(testReturn);
	var isPause : boolean = cam_sc.isPause;

	if(shipProps.playerProps.isPlayer && !isPause)
	{
		CenterGUI();
	
	}

	
}


function CenterGUI() {

	//Start by getting the x cood
	var XCood : int;
	XCood = (Screen.width/2) - (centGUI.width/2);
	
	//now get the y cood
	var YCood : int;
	YCood = Screen.height - centGUI.height;
	
	//now create area
	GUILayout.BeginArea(Rect(XCood, YCood, centGUI.width, centGUI.height));
		MovementGUI();
		TacticalGUI();
		WeaponsGUI();
	GUILayout.EndArea();

}

//this function build the movement gui section
function MovementGUI () {
	//Create Movement GUI Area
	GUILayout.BeginArea(Rect(0, centGUI.height - MovGUI.height, MovGUI.width, MovGUI.height));
		//Create button area	
		GUILayout.BeginVertical();
			//Stop Button
			GUILayout.BeginHorizontal();
				if(GUI.Button(Rect(0,25,MovGUI.buttonWidth, MovGUI.buttonHeight), MovGUI.stopIcon, MovGUI.style.button))
				{
					//here comes the button action
					shipMov.speedTarget = 0;
					shipMov.speedChanged = true;
					
				}
			GUILayout.EndHorizontal();
			//Up Button
			GUILayout.BeginHorizontal();
				//calculate diference from before
				var upHeight : int = 25 + MovGUI.buttonHeight + MovGUI.buttonPadding;
				if(GUI.Button(Rect(0,upHeight,MovGUI.buttonWidth, MovGUI.buttonHeight), MovGUI.upIcon, MovGUI.style.button))
				{
					//here cames the button action
					var lastUp : float = shipMov.keys.SpeedIncreaseKey;
					var updelay : float = shipMov.keys.KeyDelay;
					if(Time.time >= lastUp + updelay)
					{
						shipMov.keys.SpeedIncreaseKey = Time.time;
						//get movement max
						var uptarget : float = shipMov.speedTarget;
						var upmax : float = shipMov.movProps.maxStatus;
						if(uptarget < upmax)
						{
							//change speed
							var upstep : float = shipMov.speedStep;
							shipMov.speedTarget += upstep;
							shipMov.speedChanged = true;
							
						}
						
						
					}
					
					
				
				
				}
			GUILayout.EndHorizontal();
			//Down Button
			GUILayout.BeginHorizontal();
				//calculate diference from before
				var downHeight : int = upHeight + MovGUI.buttonHeight + MovGUI.buttonPadding;
				if(GUI.Button(Rect(0,downHeight,MovGUI.buttonWidth, MovGUI.buttonHeight), MovGUI.downIcon, MovGUI.style.button))
				{
					//here comes the button action
					var lastDown : float = shipMov.keys.SpeedDecreaseKey;
					var downdelay : float = shipMov.keys.KeyDelay;
					if(Time.time >= lastDown + downdelay)
					{
						shipMov.keys.SpeedDecreaseKey = Time.time;
						//get movement min
						var downtarget : float = shipMov.speedTarget;
						var downmin : float = shipMov.movProps.minStatus;
						if (uptarget > downmin)
						{
							//change speed
							var downstep : float = shipMov.speedStep;
							shipMov.speedTarget -= downstep;
							shipMov.speedChanged = true;
						}
						
					}
					
					
				}
			GUILayout.EndHorizontal();
		GUILayout.EndVertical();
		
		//Create graphic area
		GUILayout.BeginVertical();
		
			GUILayout.BeginHorizontal();
				//here goes the speed graphic code
				//first draw bg bar
				GUI.DrawTexture(Rect(25,0, MovGUI.barWidth, MovGUI.barHeight), MovGUI.barBG);
				
				//now the fg bar
				//but first lets get the speed values
				var curSpeed = Mathf.Sqrt(Mathf.Pow(shipMov.speedStatus, 2)); //get the module value
				var maxSpeed = shipMov.movProps.maxStatus;
				
				//now we convert the speed value to pixels
				var fgheight : int = ValueToPixels(maxSpeed, MovGUI.barHeight, curSpeed);
				
				//now we set the place where the bar shall be
				var yCood : int = MovGUI.barHeight - fgheight;
				
				//now we draw the bar
				GUI.DrawTexture(Rect(25, yCood, MovGUI.barWidth, fgheight), MovGUI.barFG, MovGUI.fgMode);
				
								
				
				
			GUILayout.EndHorizontal();;
		
		GUILayout.EndVertical();
		
		
	GUILayout.EndArea();
	
	

}

function TacticalGUI (){

	//get position of the area
	var XCood : int = MovGUI.width + 15;
	var YCood : int = centGUI.height - tacGUI.height;
	
	//Start by drawing area
	GUILayout.BeginArea(Rect(XCood, YCood, tacGUI.width, tacGUI.height));
		TorpedoGUI();
		HealthGUI();
	
	GUILayout.EndArea();
	


}

function TorpedoGUI () {
	//get position of the area
	var XCood : int = tacGUI.width - torpGUI.width;
	
	//Draw Area
	GUILayout.BeginArea(Rect(XCood, 0, torpGUI.width, torpGUI.height));
		//Load background
		GUI.DrawTexture(Rect(0,0,torpGUI.width, torpGUI.height), torpGUI.bgImage);
		
		//draw taskbar
		GUI.DrawTexture(Rect(torpGUI.taskX, torpGUI.taskY, torpGUI.taskWidth, torpGUI.taskHeight), torpGUI.taskImage);
		
		//write title
		GUI.Label(Rect(torpGUI.titleX, torpGUI.titleY, torpGUI.titleWidth, torpGUI.titleHeight), torpGUI.titleText, torpGUI.titleStyle);
		
		//Do Spread
		//write "Spread"
		GUI.Label(Rect(torpGUI.spreadX, torpGUI.spreadY, torpGUI.spreadWidth, torpGUI.spreadHeight), torpGUI.spreadText, torpGUI.spreadStyle);
		//minus button
		if(GUI.Button(Rect(torpGUI.minusSpreadX, torpGUI.minusSpreadY, torpGUI.buttonWidth, torpGUI.buttonHeight), "-", torpGUI.style.button)) {
			//put code here
			if(shipWep.torpSpread > 1)
			{
				shipWep.torpSpread -= 1;
			}
			
			
		}
		//plus button
		if(GUI.Button(Rect(torpGUI.plusSpreadX, torpGUI.plusSpreadY, torpGUI.buttonWidth, torpGUI.buttonHeight), "+", torpGUI.style.button)) {
			//put code here
			
			
			if(shipWep.torpVolley * shipWep.torpSpread < shipWep.torpLimit)
			{
				shipWep.torpSpread += 1;
			}
			
			
		}
		//spread display
		//place the display background
		GUI.DrawTexture(Rect(torpGUI.displaySpreadX, torpGUI.displaySpreadY, torpGUI.displayWidth, torpGUI.displayHeight), torpGUI.displayImg);
		
		//place the value
		GUI.Label(Rect(torpGUI.displaySpreadX, torpGUI.displaySpreadY, torpGUI.displayWidth, torpGUI.displayHeight), shipWep.torpSpread.ToString(), torpGUI.styleSpread);
	
		
		
		//Do volley	
		//write "Volley"
		GUI.Label(Rect(torpGUI.volleyX, torpGUI.volleyY, torpGUI.volleyWidth, torpGUI.volleyHeight), torpGUI.volleyText, torpGUI.volleyStyle);
		
		//minus button
		if(GUI.Button(Rect(torpGUI.minusVolleyX, torpGUI.minusVolleyY, torpGUI.buttonWidth, torpGUI.buttonHeight), "-", torpGUI.style.button)) {
			//put code here
			if(shipWep.torpVolley > 1)
			{
				shipWep.torpVolley -= 1;
			}
			
		}
		
		//plus button
		if(GUI.Button(Rect(torpGUI.plusVolleyX, torpGUI.plusVolleyY, torpGUI.buttonWidth, torpGUI.buttonHeight), "+", torpGUI.style.button)) {
			//put code here
			if(shipWep.torpVolley * shipWep.torpSpread < shipWep.torpLimit)
			{
				shipWep.torpVolley += 1;
			}
		}
		
		//volley display
		GUI.DrawTexture(Rect(torpGUI.displayVolleyX, torpGUI.displayVolleyY, torpGUI.displayWidth, torpGUI.displayHeight), torpGUI.displayImg);
		//Place the value
		GUI.Label(Rect(torpGUI.displayVolleyX, torpGUI.displayVolleyY, torpGUI.displayWidth, torpGUI.displayHeight), shipWep.torpVolley.ToString(), torpGUI.styleVolley);
	
	GUILayout.EndArea();


}

function HealthGUI () {
	//Get position of the area
	var XCood : int = tacGUI.width - healthGUI.width;
	var YCood : int = tacGUI.height - healthGUI.height - healthGUI.botPadding;
	
	GUILayout.BeginArea(Rect(XCood, YCood, healthGUI.width, healthGUI.height));
	
		//Draw background bar for shield
		GUI.DrawTexture(Rect(0, 0, healthGUI.barWidth, healthGUI.barHeight), healthGUI.bgBar);
		
		//get shield status
		var maxShield : float = shipHea.shipHealth.maxShields;
		var curShield : float = shipHea.shipHealth.shields;
		
		//get desired bar width
		var shieldWidth : int = ValueToPixels(maxShield, healthGUI.barWidth, curShield);
		
		//Draw shield bar
		GUI.DrawTexture(Rect(0,0, shieldWidth, healthGUI.barHeight), healthGUI.shieldBar, healthGUI.scaleMode);
		
		
		//Draw background bar for hull
		GUI.DrawTexture(Rect(0, healthGUI.barHeight, healthGUI.barWidth, healthGUI.barHeight), healthGUI.bgBar);
		
		//get hull status
		var maxHull : float = shipHea.shipHealth.maxHealth;
		var curHull : float = shipHea.shipHealth.health;
		
		//get desired bar width
		var hullWidth : int = ValueToPixels(maxHull, healthGUI.barWidth, curHull);
		
		//Draw Hull bar
		GUI.DrawTexture(Rect(0, healthGUI.barHeight, hullWidth, healthGUI.barHeight), healthGUI.hullBar, healthGUI.scaleMode);
		
		
		
	
	GUILayout.EndArea();
	


}

function WeaponsGUI () {

	//Start by calculation the area coordinates
	var CoodX : int = centGUI.width - weaponGUI.width;
	var CoodY : int = centGUI.height - weaponGUI.height;
	
	GUILayout.BeginArea(Rect(CoodX, 0, weaponGUI.width, weaponGUI.height));
	
		//Draw Background
		GUI.DrawTexture(Rect(0,0, weaponGUI.width, weaponGUI.height), weaponGUI.backImage);
		
		//Draw ship texture
		GUI.DrawTexture(Rect(weaponGUI.shipCoodX,weaponGUI.shipCoodY, weaponGUI.shipWidth , weaponGUI.shipHeight ), weaponGUI.shipImg);
		
		//Draw Buttons
		//Draw button 1
		var weapon1 : WeaponSlot = shipWep.weapon1; //get weapon
		WeaponButton(weapon1, weaponGUI.btWidth, weaponGUI.btHeight, weaponGUI.bt1X, weaponGUI.bt1Y, weaponGUI.buttonStyle.button);
		
		//Draw button 2
		var weapon2 : WeaponSlot = shipWep.weapon2; //get weapon
		WeaponButton(weapon2, weaponGUI.btWidth, weaponGUI.btHeight, weaponGUI.bt2X, weaponGUI.bt2Y, weaponGUI.buttonStyle.button);
		
		//Draw button 3
		var weapon3 : WeaponSlot = shipWep.weapon3; //get weapon
		WeaponButton(weapon3, weaponGUI.btWidth, weaponGUI.btHeight, weaponGUI.bt3X, weaponGUI.bt3Y, weaponGUI.buttonStyle.button);
		
		//Draw button 4
		var weapon4 : WeaponSlot = shipWep.weapon4; //get weapon
		WeaponButton(weapon4, weaponGUI.btWidth, weaponGUI.btHeight, weaponGUI.bt4X, weaponGUI.bt4Y, weaponGUI.buttonStyle.button);
		
		//Draw button 5
		var weapon5 : WeaponSlot = shipWep.weapon5; //get weapon
		WeaponButton(weapon5, weaponGUI.btWidth, weaponGUI.btHeight, weaponGUI.bt5X, weaponGUI.bt5Y, weaponGUI.buttonStyle.button);
		
		//Draw button 6
		var weapon6 : WeaponSlot = shipWep.weapon6; //get weapon
		WeaponButton(weapon6, weaponGUI.btWidth, weaponGUI.btHeight, weaponGUI.bt6X, weaponGUI.bt6Y, weaponGUI.buttonStyle.button);
		
		//Draw button 7
		var weapon7 : WeaponSlot = shipWep.weapon7; //get weapon
		WeaponButton(weapon7, weaponGUI.btWidth, weaponGUI.btHeight, weaponGUI.bt7X, weaponGUI.bt7Y, weaponGUI.buttonStyle.button);
		
		//Draw button 8
		var weapon8 : WeaponSlot = shipWep.weapon8; //get weapon
		WeaponButton(weapon8, weaponGUI.btWidth, weaponGUI.btHeight, weaponGUI.bt8X, weaponGUI.bt8Y, weaponGUI.buttonStyle.button);
		
	GUILayout.EndArea();


}

function WeaponButton (weapon : WeaponSlot, width : int, height : int, XCood : int, YCood : int, style : GUIStyle) {

		var weapon_go : GameObject = weapon.weapon_go;
		if(weapon_go)
		{
			var weaSc : weaponScript = weapon_go.GetComponent(weaponScript); //get weapon script
			var weaText : Texture2D = weaSc.guiInfo.image; //get weapon texture
						
			if(GUI.Button(Rect(XCood, YCood, width, height), weaText, style))
			{
				if(!shipTar.target)
				{
					shipTar.target = shipTar.FindTarget(gameObject, shipProps);
				}
			
				if(weapon.isEnabled == true && weapon.isRange == true && weapon.isAngle)
				{
					
					weapon.isFiring = true;
					
				}
				
				
			
			}
		}


}

function ValueToPixels(baseValue : float, basePixels : int, desiredValue : float) : int {
	
	var result : int;
	result = (basePixels * desiredValue)/baseValue;
	
	return result;


}
