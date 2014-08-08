#pragma strict

class AlertWarning extends HUDElement {
	
	var isOn : boolean;
	var alert : AlertMode;
	var gravityLabel : Rect;
	var collisionLabel : Rect;
	var timePeriod : float;
	private var lastSetTime : float;
	
	private var alertStyle : GUIStyle;
	
	
	public static final var GRAVITY_ALERT : String = "Gravitational Pull Detected";
	public static final var COLLISION_ALERT : String = "Collision Iminent";
	public static final var STYLE : String = "AlertLabel"; 
	
	
	function Start() {
		
		initAlert();		
	}
	
	function initAlert() {
		
		alertStyle = skin.GetStyle(STYLE);
		super.initHud();
	}
	
	
	
	

	
	function checkTurbulence() {
		if(super.triggers.hasTurbulenceChanged()) {
			if(isOn) {
				setOff();
			} else {
				setGravity();
			}
		}
		
	}
	
	function Update() {
		if(super.hud.isShowingGui()) {
			checkPlayer();
			checkTurbulence();
		}
	}
	
	function OnGUI() {
		if(super.hud.isShowingGui()) {
			drawAlert();
		}
	}
	
	function drawAlert() {
		if(isOn) {
			GUILayout.BeginArea(getWarningPosition());
				var origin : Color = GUI.color;
				GUI.color = new Color(1,1,1, getAlpha());
				
				drawBackground();
				drawLabel();
			
				
				GUI.color = origin;
			GUILayout.EndArea();
		
		}
		
		
	}
	
	function getWarningPosition() : Rect {
		
		var position : Rect = resizeRect(super.getPosition());
		position = centerRect(position);
		return position;
	
	}
	
	function drawBackground() {
		var position : Rect = resizeRect(super.getPosition());
		var rect : Rect = new Rect(0,0, position.width, position.height);
		GUI.DrawTexture(rect, super.getBackground());
	
	}
	
	private function drawLabel() {
		var label : String = getLabel(); 
		var rect : Rect = getRect();
		
		GUI.Label(rect, label, alertStyle); 
	}
	
	private function getLabel() : String {
		switch(alert) {
			case AlertMode.COLLISION:
				return COLLISION_ALERT;
				//break;
			case AlertMode.GRAVITY:
				return GRAVITY_ALERT;
				//break;
			
		}
		
		return null;
	
	}
	
	private function getRect() : Rect {
		switch(alert) {
			case AlertMode.COLLISION:
				return super.resizeRect(collisionLabel);
				//break;
			case AlertMode.GRAVITY:
				return super.resizeRect(gravityLabel);
				//break;
			
		}
		
		return new Rect(0,0,0,0);
	}
	
	function getAlpha() : float {
		return (Mathf.Cos(getSetTime() * timePeriod)/2) + 0.5f;
	
	}
	
	function getSetTime() : float {
		return Time.time - lastSetTime;
	}
	
	function setGravity() {
		isOn = true;
		alert = AlertMode.GRAVITY;
		lastSetTime = Time.time;
	}
	
	function setCollision() {
		isOn = true;
		alert = AlertMode.COLLISION;
		lastSetTime = Time.time;
	}
	
	function setOff() {
		isOn = false;
	}
	
	
	function centerRect(rect : Rect) : Rect {
		var x : float = Screen.width/2 - rect.width/2;
		var y : float = Screen.height/2 - rect.height/2;
		return new Rect(x,y, rect.width, rect.height);
		  
	}
	

}