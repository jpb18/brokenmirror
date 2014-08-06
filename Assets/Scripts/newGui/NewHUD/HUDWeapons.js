#pragma strict

class HUDWeapons extends HUDBottom {
	
	var weaponRects : Rect[];
	
	var inventoryRect : Rect;
	var inventoryTexture : Texture;
	
	var transportRect : Rect;
	var transportTexture : Texture;
	
	var emptyTexture : Texture;
	
	public static final var ORBIT_ERROR = "Not in a planets orbit.";

	// Use this for initialization
	function Start () {
		initWeapons();
	}

	function initWeapons() {
		super.initHud();
	}
	
	function OnGUI() {
		if(hud.isShowingGui()) {
			drawWeapons();
		}
	}
	
	function drawWeapons() {
		GUILayout.BeginArea(super.getPlacementRect());
		
			super.drawBackground();
			drawButtonBackground();
			drawWeaponButtons();
			drawInventoryButton();
			drawTransportButton();
		
		GUILayout.EndArea();
	}
	
	function drawButtonBackground() {
		for(var x : int = 0; x < weaponRects.Length; x++) {
			GUI.DrawTexture(resizeRect(weaponRects[x]), emptyTexture);
		}
	}
	
	function drawWeaponButtons() {
		drawWeaponButton(weapons.phaser, resizeRect(weaponRects[0]));
		drawWeaponButton(weapons.torp1, resizeRect(weaponRects[1]));
		drawWeaponButton(weapons.torp2, resizeRect(weaponRects[2]));
		
		
	}
	
	function drawWeaponButton(phaser : Phaser, rect : Rect) {
		if(phaser.isEnabled && phaser.phaser) {
				var texture : Texture = getPhaserTexture(phaser);
				if(GUI.Button(rect, texture, skin.button)) {
					firePhaser(phaser);
				}
						
		}
	}
	
	function getPhaserTexture(phaser : Phaser) : Texture {
		//Get weapon image
		var weapon_scr : weaponScript = phaser.phaser.GetComponent(weaponScript); //Get weapon script
		var weapon_img : Texture = weapon_scr.guiInfo.image; //Get weapon GUI Image
		return weapon_img;
	}
	
	private function firePhaser(phaser : Phaser) {
		if(props.getRedAlert()) {
			var go : GameObject;
			if(target.hasTarget()) {
				go = target.getTarget();	
			} else {
				go = target.FindTarget(player, props);
			} 
			orderPhaserFire(go, phaser);
		}
	
	}
	
	private function orderPhaserFire(go : GameObject, phaser : Phaser) {
		if(phaser.canFire(go, upgrades)) {
			phaser.fire(go, weapons.volleyNum(), weapons, upgrades);
		}	
	}

	
	function drawWeaponButton(torpedo : Torpedo, rect : Rect) {
		if(torpedo.isEnabled && torpedo.torpedo) {
				var texture : Texture = getTorpedoTexture(torpedo);
				if(GUI.Button(rect, texture, skin.button)) {
					fireTorpedo(torpedo);
				}
						
		}
	}
	
	function getTorpedoTexture(torpedo : Torpedo) : Texture {
		//Get weapon image
		var weapon_scr : weaponScript = torpedo.torpedo.GetComponent(weaponScript); //Get weapon script
		var weapon_img : Texture = weapon_scr.guiInfo.image; //Get weapon GUI Image
		return weapon_img;
	}
	
	private function fireTorpedo(torpedo : Torpedo) {
		if(props.getRedAlert()) {
			var go : GameObject;
			if(target.hasTarget()) {
				go = target.getTarget();
													
				
			} else {
				go = target.FindTarget(player, props);
				
				
				
			} 
			orderTorpedoFire(go, torpedo);		
		}
	}
	
	private function orderTorpedoFire(target : GameObject, torpedo : Torpedo) {
		if(torpedo.canFire(target)) {//check if weapon can fire
			StartCoroutine(torpedo.fire(target, weapons.volleyNum(),  upgrades)); //Set isFiring as true
		}
	}
	
	function drawInventoryButton() {
		if(GUI.Button(resizeRect(inventoryRect), inventoryTexture, skin.button)) {
			//open inventory
		}
	}
	
	function drawTransportButton() {
		//Draw beam down button and check if its pressed
		if(GUI.Button(resizeRect(transportRect), transportTexture, skin.button)) {
		
			//first lets see if we're inside orbit range
			if(!triggers.isOrbit()) {
				message.AddMessage(ORBIT_ERROR);
			} else {
				missions.finishTradeMissionInSystem();
			}
		
		}
	}


}

