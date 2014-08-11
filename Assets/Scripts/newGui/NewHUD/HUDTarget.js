#pragma strict

class HUDTarget extends HUDTop {

	var mainComponentRect : Rect;
	var mainComponentBackground : Texture;
		
	var orbEnemy : Texture;
	var orbAlly : Texture;
	var orbNeutral : Texture;
	var orbOwn : Texture;
	var orbRect : Rect;
	
	var nameRect : Rect;
	var classRect : Rect;
	
	var shieldTexture : Texture;
	var shieldRect : Rect;
	
	var hullTexture : Texture;
	var hullRect : Rect;
	
	
	var extendBackground : Texture;
	var extendRect : Rect;
	
	private var isExtended : boolean;
	private var isMoving : boolean;
	
	var displace : float;
	var time : float;
	
	var expandButtonRect : Rect;
	var toBeExtendedRect : Rect;
	
	var scanRect : Rect;
	var hailRect : Rect;
	


	function OnGUI() {
		if(hud.isShowingGui() && target.hasTarget()) {
			draw();
		}
	}
	
	function draw() {
		GUILayout.BeginArea(getPlacementRect());
		
			drawExpand();
			drawMain();
			
		
		GUILayout.EndArea();
	}
	
	function drawExpand() {
		GUILayout.BeginArea(resizeRect(extendRect));
			
			drawExtendedPanel();
			drawExtendButton();
			
		GUILayout.EndArea();
	}
	
	private function drawExtendedPanel() {
		GUILayout.BeginArea(resizeRect(toBeExtendedRect));
			drawExtendBackground();
			drawExtendButtons();
		GUILayout.EndArea();
		
	}
	
	private function drawExtendBackground() {
		GUI.DrawTexture(resizeRect(getPointZeroRect(toBeExtendedRect)), extendBackground);
	}
	
	private function drawExtendButtons() {
		GUI.Button(scanRect, "Scan", skin.GetStyle("TacticalButton"));
		if(GUI.Button(hailRect, "Hail", skin.GetStyle("TacticalButton"))) {
			var target : IHailable = getTargetHailable();
			target.openComm();
		}
	}
	
	private function getTargetHailable() : IHailable {
		var target : GameObject = super.target.getTarget();
		return target.GetComponent(typeof(IHailable)) as IHailable;
	}
	
	private function expand() {
		isMoving = true;
		
		var i : float = 0;
		var rate : float = 1/time;
		var moveRate : float = (displace * ratio)/time;
		
		while(i < 1) {
			i += Time.deltaTime * rate;
			toBeExtendedRect.x -= moveRate * Time.deltaTime;
			yield;
		
		}
				
		isMoving = false;	
		isExtended = true;
	}
	
	private function retract() {
		isMoving = true;
		
		var i : float = 0;
		var rate : float = 1/time;
		var moveRate : float = (displace * ratio)/time;
		
		while(i < 1) {
			i += Time.deltaTime * rate;
			toBeExtendedRect.x += moveRate * Time.deltaTime;
			yield;
		
		}
				
		isMoving = false;	
		isExtended = false;
	
	}
	
	function drawMain() {
		GUILayout.BeginArea(resizeRect(mainComponentRect));
			drawMainBackground();
			drawOrb();
			drawLabels();
			drawHealthBars();
			
		GUILayout.EndArea();
	}
	
	private function drawMainBackground() {

		GUI.DrawTexture(resizeRect(getPointZeroRect(mainComponentRect)), mainComponentBackground);
		
	}
	
	private function drawOrb() {
		var target : GameObject = target.getTarget();
		var faction : IFactionable = target.GetComponent(typeof(IFactionable)) as IFactionable;
		var orb : Texture = getOrb();
		GUI.DrawTexture(resizeRect(orbRect), orb);
		
		var image : Texture = getTargetImage();
		GUI.DrawTexture(resizeRect(orbRect), image);
	}
	
	private function getPointZeroRect(rect : Rect) {
	
		return new Rect(0,0, rect.width, rect.height);
	}
	
	private function getPlayerFaction() : int {
		var faction : IFactionable = super.player.GetComponent(typeof(IFactionable)) as IFactionable;
		return faction.getFaction();
	}
	
	private function getTargetFaction() : int {
		
		var faction : IFactionable = getTargetFactionable();
		return faction.getFaction();
	}
	
	private function getTargetFactionable() : IFactionable {
		var target : GameObject = super.target.getTarget();
		return target.GetComponent(typeof(IFactionable)) as IFactionable;
	}
	
	private function isOwn() : boolean{
		var player : int = getPlayerFaction();
		var target : int = getTargetFaction();
		return target == player;		
	}
	
	private function isHostile() : boolean {
		var faction : IFactionable = getTargetFactionable();
		return faction.isHostile(getPlayerFaction());
		  
	}
	
	private function isAllied() : boolean {
		var faction : IFactionable = getTargetFactionable();
		return faction.isAllied(getPlayerFaction());
	
	}
	
	private function getOrb() : Texture {
		var orb : Texture;
		
		if(isOwn()) {
			orb = orbOwn;
		} else if (isHostile()) {
			orb = orbEnemy;
		} else if (isAllied()) {
			orb = orbAlly;
		} else {
			orb = orbNeutral;
		}
		
		return orb;
	}
	
	private function getTargetImage() : Texture {
		
		var target : GameObject = super.target.getTarget();
		var text : ITextureable = target.GetComponent(typeof(ITextureable)) as ITextureable;
		return text.getTargetImage(); 	
	}
	
	
	private function drawLabels() {
		GUI.Label(resizeRect(nameRect), getTargetName(), skin.GetStyle("TargetLabel"));
		GUI.Label(resizeRect(classRect), getTargetClass(), skin.GetStyle("TargetLabel"));
	}
	
	private function getTargetNameable() : INameable {
		var target : GameObject = super.target.getTarget();
		return target.GetComponent(typeof(INameable)) as INameable;
	}
	
	private function getTargetClasseable() : INameable {
		var target : GameObject = super.target.getTarget();
		return target.GetComponent(typeof(IClasseable)) as INameable;
	}
	
	
	private function getTargetName() : String {
		var target : INameable = getTargetNameable();
		return target.getName();
	}
	
	private function getTargetClass() : String {
		var target : IClasseable = getTargetNameable();
		return target.getClass();
	}
	
	private function drawHealthBars() {
		GUI.DrawTexture(resizeRect(resizeHealthBar(shieldRect, getTargetShield())), shieldTexture);
		GUI.DrawTexture(resizeRect(resizeHealthBar(hullRect, getTargetHull())), hullTexture);
	}
	
	private function resizeHealthBar(rect : Rect, size : float) {
		return new Rect(rect.x, rect.y, rect.width * size, rect.height);
	}
	
	private function getTargetHealtheable() : IHealtheable {
		var target : GameObject = super.target.getTarget();
		return target.GetComponent(typeof(IHealtheable)) as IHealtheable;
	}
	
	private function getTargetHull() : float {
		var target : IHealtheable = getTargetHealtheable();
		return target.getHullPercentage();
	}
	
	private function getTargetShield() : float {
		var target : IHealtheable = getTargetHealtheable();
		return target.getShieldPercentage();
	}
	
	private function drawExtendButton() {
		if(GUI.Button(expandButtonRect, "", skin.GetStyle("ExpandButton"))) {
			if(!isMoving) {
				if(isExtended) {
					retract();
				} else {
					expand();
				}
			
			}
		}
	}

}