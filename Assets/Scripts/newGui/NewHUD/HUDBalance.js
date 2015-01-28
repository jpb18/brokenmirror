#pragma strict

class HUDBalance extends HUDBottom {

	var BarTexture : Texture;
	var HandleTexture : Texture;
	
	var barDimensions : Vector2; //maximum bar dimensions (meaning, adjusted to BAR_MODIFIER)
	var weaponsPosition : Vector2;
	var shieldPosition : Vector2;
	var speedPosition : Vector2;
	var handleDimensions : Vector2; //handle dimensions
	
	public static final var BAR_MODIFIER : float = 1.5f;
	public static final var BUTTON : int = 0;

	function OnGUI () {
		if(hud.isShowingGui()) {
			drawBalance();
		}
	}
	
	private function drawBalance() {
		var rect : Rect = getPlacementRect();
		rect = resizeRect(rect);
		GUILayout.BeginArea(rect);
			drawBackground(rect);
			drawWeaponsBar();
			drawDefenseBar();
			drawSpeedBar();
		GUILayout.EndArea();
	}
	
	private function drawBackground(rect : Rect) {
		var pos : Rect = new Rect(0,0,rect.width, rect.height);
		GUI.DrawTexture(pos, background);		
	}
	
	///<summary>This draw the bar that allows the player to control the weapon energy levels.</summary>
	private function drawWeaponsBar() {
		var weaponValue : float = balance.weapons;
		var drawRect : Rect = BuildBarRect(barDimensions, weaponsPosition, weaponValue);
		var resizedDrawRect : Rect = super.resizeRect(drawRect);
		var areaRect : Rect = BuildRect(weaponsPosition, barDimensions);
		areaRect = super.resizeRect(areaRect);
		
		var handleRect : Rect = BuildHandleRect(drawRect);
		handleRect = super.resizeRect(handleRect);
		//Statics.DrawDebugRect(areaRect, Color.red);
		var newValue : float = DrawBar(resizedDrawRect, areaRect, handleRect, weaponValue);
		if(newValue != weaponValue) {
			balance.weapons = newValue;
		}				
	}
	
	///<summary>This draw the bar that allows the player to control the shields energy levels.</summary>
	private function drawDefenseBar() {
		var defenseValue : float = balance.defense;
		var drawRect : Rect = BuildBarRect(barDimensions, shieldPosition, defenseValue);
		var resizedDrawRect : Rect = super.resizeRect(drawRect);
		var areaRect : Rect = BuildRect(shieldPosition, barDimensions);
		areaRect = super.resizeRect(areaRect);
		
		var handleRect : Rect = BuildHandleRect(drawRect);
		handleRect = super.resizeRect(handleRect);
		//Statics.DrawDebugRect(areaRect, Color.red);
		var newValue : float = DrawBar(resizedDrawRect, areaRect, handleRect, defenseValue);
		if(newValue != defenseValue)
			balance.defense = newValue;
		
	}
	
	///<summary>This draw the bar that allows the player to control the engines energy levels.</summary>
	private function drawSpeedBar() {
		var speedValue : float = balance.speed;
		var drawRect : Rect = BuildBarRect(barDimensions, speedPosition, speedValue);
		var resizedDrawRect : Rect = super.resizeRect(drawRect);
		var areaRect : Rect = BuildRect(speedPosition, barDimensions);
		areaRect = super.resizeRect(areaRect);
		
		var handleRect : Rect = BuildHandleRect(drawRect);
		handleRect = super.resizeRect(handleRect);
		//Statics.DrawDebugRect(areaRect, Color.green);
		var newValue : float = DrawBar(resizedDrawRect, areaRect, handleRect, speedValue);
		if(newValue != speedValue)
			balance.speed = newValue;
		
	}
	
	///<summary>This Draws the power bar</summary>
	///<param name="drawRect">The rect which will be used to draw the bar.</param>
	///<param name="areaRect">The rect that describes the area</param>
	///<param name="curValue">The Bar current value.</param>
	///<returns>The bar new value</returns>
	private function DrawBar(drawRect : Rect, areaRect : Rect, handleRect : Rect, curValue : float) : float {
		//first draw bar texture
		GUI.DrawTexture(drawRect, this.BarTexture, ScaleMode.ScaleAndCrop);
		
		GUI.DrawTexture(handleRect, this.HandleTexture);
		
		//now lets calculate what happens if the player clicks on the control
		if(Input.GetMouseButton(BUTTON)) {
			var event : Event = Event.current;
			if(areaRect.Contains(event.mousePosition)) { //and the mouse is inside the area
				var y : float = event.mousePosition.y;
				var val : float = NormalizeValue(areaRect.height, y);
				val = val * BAR_MODIFIER;
				if(curValue != val) return val;	
			}
		}
		return curValue;		
	}
	
	///<summary>This makes a Rect for the bar, with its coordinates based on the curValue variable</summary>
	///<param name="dimension">The bar dimension, set for a curValue of BAR_MODIFIER</param>
	///<param name="position">The rect position.</param>
	///<param name="curValue">The value which will define the final Rect</param>
	///<returns>Adjusted rect</returns>
	private function BuildBarRect(dimension : Vector2, position : Vector2, curValue : float) : Rect {
		var uDim : Vector2 = GetUnitaryBarDimensions(dimension);
		var bottom : float = position.y + dimension.y;
		var height : float = uDim.y * curValue;
		var y : float = bottom - height;
		var rect : Rect = new Rect(position.x, y, dimension.x, height);
		return rect;
	}
	
	///<summary>This transforms the maximum dimension of the bar into unitary vector2</summary>
	///<param name="dimensions">The bar dimensions, set for BAR_MODIFIER</param>
	///<returns>Transformed vector</returns>
	private function GetUnitaryBarDimensions(dimensions : Vector2) : Vector2 {
		var y : float = dimensions.y/BAR_MODIFIER;
		return new Vector2(dimensions.x, y);
	}
	
	///<summary>Normalizes value between 0 and 1</summary>
	///<param name="height">Height of the control</param>
	///<param name="val">Target value</param>
	///<returns>Normalized value</returns>
	private function NormalizeValue(height : float, val : float) : float {
		var pos : float = height - val;
		return pos/height;
	}
	
	///<summary>This transform the y value (adjusted for BAR_MODIFIER) into a unitary value</summary>
	///<param name="y">The original value, to be adjusted.</param>
	///<returns>Adjusted value</returns>
	private function GetUnitaryBarValue(y : float) : float {
		return y/BAR_MODIFIER;
	}
	
	///<summary>This makes a rect from one position and one dimension Vector2</summary>
	///<param name="position">The position vector</param>
	///<param name="dimension">The dimension vector</param>
	///<returns>The generated vector</returns>
	private function BuildRect(position : Vector2, dimension : Vector2) : Rect {
		return new Rect(position.x, position.y, dimension.x, dimension.y);
	}
	
	///<summary>This generates the handle rect</summary>
	///<param name="barRect">The rect of the bar where the handle will be attached</param>
	///<returns>Handle Rect</returns>
	private function BuildHandleRect(barRect : Rect) : Rect {
		var dif : float = handleDimensions.x - barRect.width;
		var x : float = barRect.x - dif/2;
		var y : float = barRect.y - handleDimensions.y/2; 
		return new Rect(x, y, handleDimensions.x, handleDimensions.y);
	} 	 	 	 	
				
}