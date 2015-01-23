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
	var burnoutTexture : Texture;
	var burnoutInterval : float = 3f;
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
	public static final var UP_TIP = "Accelerate\nThis increases the ships speed.";
	public static final var DOWN_TIP = "De-accelerate\nThis decreases the ships speed.";
	public static final var STOP_TIP = "Full Stop\nThis brings the ship to full stop.";
	public static final var MAP_TIP = "Map\nThis opens the map, which allows you to travel to other systems.";



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
			
			//Draw warning bar
			if(movement.ShowBurnoutWarning()) {
				var time : int = movement.GetLastBurnoutTime();
				var tmp : Color = GUI.color;
				var alpha : float = GetBurnoutAlpha(Time.time - time);
				GUI.color = new Color(1,1,1,alpha);
				GUI.DrawTexture(rect, this.burnoutTexture, ScaleMode.ScaleAndCrop);
				GUI.color = tmp;
			}
							
		}
	}
	
	private function GetBurnoutAlpha(time : float) : float {
		var val : float = Mathf.Sin(time/this.burnoutInterval);
		return Mathf.Abs(val);
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
		var rect : Rect = resizeRect(increaseRect);
		if(GUI.RepeatButton(rect, increaseTexture, skin.button)) {
			if(!movement.isAtMax()) {
				movement.increaseSpeed();
			}
		}
		
		if(rect.Contains(Event.current.mousePosition)) {
			SetMouseOver(rect, UP_TIP);
		}
		
	}
	
	private function drawDecreaseButton() {
		var rect : Rect = resizeRect(decreaseRect);
		if(GUI.RepeatButton(rect, decreaseTexture, skin.button)) {
			if(!movement.isAtMin()) {
				movement.decreaseSpeed();
			}
		}
		
		if(rect.Contains(Event.current.mousePosition)) {
			SetMouseOver(rect, DOWN_TIP);
		}
		
	}
	
	private function drawStopButton() {
		var rect : Rect = resizeRect(stopRect);
		if(GUI.Button(rect, stopTexture, skin.GetStyle(STOP_STYLE)))
		{
			if(!movement.isStop() && !movement.isChanging) {
			
				movement.fullStop();
			  
			} 
		}
		
		if(rect.Contains(Event.current.mousePosition)) {
			SetMouseOver(rect, STOP_TIP);
		}
		
	}
	
	private function drawMapButton() {
		var rect : Rect = resizeRect(mapRect);
		if(GUI.Button(rect, mapTexture, skin.button)) {
			
			map.swapStatus();
		
		}
		
		if(rect.Contains(Event.current.mousePosition)) {
			SetMouseOver(rect, MAP_TIP);
		}
		
	}


}
