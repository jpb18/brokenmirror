#pragma strict

class HUDHelm extends HUDBottom {
	
	var backwardBackground : Texture;
	var backwardForeground : Texture;
	var backwardRect : Rect;
	
	var backwardShadow : Texture;
	var backwardShadowRect : Rect;
	
	var forwardBackground : Texture;
	var forwardForeground : Texture;
	var warpTexture : Texture;
	var forwardRect : Rect;
	
	var increaseTexture : Texture;
	var increaseRect : Rect;
	
	var decreaseTexture : Texture;
	var decreaseRect : Rect;
	
	var stopTexture : Texture;
	var stopRect : Rect;
	
	var mapTexture : Texture;
	var mapRect : Rect;
	
	public static final var STOP_STYLE = "StopButton";	

	// Use this for initialization
	function Start () {
		initHelm();
	}

	function initHelm() {
		initHud();
	}

	function OnGUI () {
		if(hud.isShowingGui()) {
			drawHelm();
		}
	}
	
	function drawHelm() {
		GUILayout.BeginArea(getPlacementRect());
			drawBackground();
			drawForwardBar();
			drawBackwardBar();
			drawButtons();
		GUILayout.EndArea();
	}
	
	function drawForwardBar() {
		GUI.DrawTexture(resizeRect(forwardRect), forwardBackground);
		
		var curSpeed : float = movement.speedStatus;
		var maxSpeed : float = movement.movProps.maxStatus;
		
		drawForwardSpeedBar(curSpeed, maxSpeed);
		
	
	}
	
	private function drawForwardSpeedBar(curSpeed : float, maxSpeed : float) {
		
		if(curSpeed > 0)
		{
			var rect : Rect = getResizedRect(forwardRect, maxSpeed, curSpeed);
			
			//Draw speed bar
			if(!movement.isSystemWarp()) {
				GUI.DrawTexture(rect, forwardForeground, ScaleMode.ScaleAndCrop);
			} else {
				GUI.DrawTexture(rect, warpTexture, ScaleMode.ScaleAndCrop);
			}
			
		}
		
		
		
	}
	
	private function getResizedRect(rect : Rect, maxValue : float, curValue : float) {
		var width : int = GetBarSize(rect.width, maxValue, curValue);
		return resizeRect(new Rect(rect.x, rect.y, width, rect.height));
	}
	
	//this function returns the size of a bar in pixels
	private function GetBarSize (FullSize : int, MaxValue : float, CurValue : float) : int {

		if(MaxValue == 0) {
			return 0;
		}

		var newSize : int;
		
		newSize = (FullSize * CurValue)/MaxValue;
		
		return newSize;
		

	}
	
	function drawBackwardBar() {
		drawShadow();
		
		GUI.DrawTexture(resizeRect(backwardRect), backwardBackground);
		
		var curSpeed : float = movement.speedStatus;
		var minSpeed : float = movement.movProps.minStatus;
		
		drawBackwardSpeedBar(curSpeed, minSpeed);
		
	}
	
	private function drawShadow() {
		GUI.DrawTexture(resizeRect(backwardShadowRect), backwardShadow);
	}
	
	private function drawBackwardSpeedBar(curSpeed : float, minSpeed : float) {
				
		if(curSpeed < 0)
		{
			var rect : Rect = getResizedRect(backwardRect, minSpeed, curSpeed);
			GUI.DrawTexture(rect , backwardForeground, ScaleMode.ScaleAndCrop);
		}
		
			
	}
	
	function drawButtons() {
		drawIncreaseButton();
		drawDecreaseButton();
		drawStopButton();
		drawMapButton();
	}
	
	private function drawIncreaseButton() {
		if(GUI.RepeatButton(resizeRect(increaseRect), increaseTexture, skin.button)) {
			if(!movement.isAtMax()) {
				movement.increaseSpeed();
			}
		}
	}
	
	private function drawDecreaseButton() {
		if(GUI.RepeatButton(resizeRect(decreaseRect), decreaseTexture, skin.button)) {
			if(!movement.isAtMin()) {
				movement.decreaseSpeed();
			}
		}
	}
	
	private function drawStopButton() {
		if(GUI.Button(resizeRect(stopRect), stopTexture, skin.GetStyle(STOP_STYLE)))
		{
			if(!movement.isStop() && !movement.isChanging) {
			
				movement.fullStop();
			  
			} 
		}
	}
	
	private function drawMapButton() {
		if(GUI.Button(resizeRect(mapRect), mapTexture, skin.button)) {
			
			map.swapStatus();
		
		}
	}


}
