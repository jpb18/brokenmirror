#pragma strict

class HUDWeapons extends HUDBottom {
	
	var weaponRects : Rect[];
	
	var inventoryRect : Rect;
	var inventoryTexture : Texture;
	
	var transportRect : Rect;
	var transportTexture : Texture;
	
	var emptyTexture : Texture;
	
	public static final var ORBIT_ERROR = "Not in a planets orbit.";
	public static final var COLONIZE_ERROR = "You need a colonization team to colonize a planet.";
	public static final var COLONIZED = "Planet colonized.";

	
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
			drawUpgradeButtons();
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
	
	function drawUpgradeButtons() {
		var upgradesList : List.<Active> = upgrades.getActiveUpgradesList();
		for(var x : int = 0; x < upgradesList.Count; x++) {
			drawUpgradeButton(upgradesList[x], weaponRects[x+3]);
		}		
	}
	
	function drawUpgradeButton(up : Active, rect : Rect) {
		var upgrade : GameObject = up.getUpgrade();
		var active : IActive = upgrade.GetComponent(typeof(IActive)) as IActive;
		var texture : Texture = active.getImage();
		if(GUI.Button(rect, texture, skin.button)) {
			setUpgrade(up);
		}
		
		
	}
	
	private function setUpgrade(up : Active) {
		if(up.canUse()) {
			if(!up.isActive()) {
				up.use(player);
				
			} else {
				if(up.isDisabable()) {
					up.disable(player);
				}
			}
			
		}
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
				transport();
			}
		
		}
	}
	
	function transport() {
		missions.finishTradeMissionInSystem();
		
		var planet : GameObject = findSystemPlanet();
		
		var colonizable : IColonizable = planet.GetComponent(IColonizable) as IColonizable;
		var inventory : Inventory = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Inventory);
		
					
		if(colonizable.canColonize()) {
			if(!inventory.hasColonizationTeams()) {
				message.AddMessage(COLONIZE_ERROR);
			} else {
				var team : GameObject = inventory.getColonizationTeam();
				var factionable : IFactionable = player.GetComponent(IFactionable) as IFactionable;
				var faction : int = factionable.getFaction();
				colonizable.colonize(faction, team);
				message.AddMessage(COLONIZED);
			}
		} 
			
	}
	
	private function findSystemPlanet() : GameObject {
		var planets : GameObject[] = GameObject.FindGameObjectsWithTag("Planet");
		
		for(var x : int = 0; x < planets.Length; x++) {
			var panel : PlanetPanel = planets[x].GetComponent(PlanetPanel);
			if(panel) {
				return planets[x];
			}
		}
		return null;
	
	}


}

