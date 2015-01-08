#pragma strict

class HUDWeapons extends HUDBottom {
	
	var weaponRects : Rect[];
	
	var inventoryRect : Rect;
	var inventoryTexture : Texture;
	
	var transportRect : Rect;
	var transportTexture : Texture;
	
	var emptyTexture : Texture;
	
	var overlay : Texture;
	
	public static final var ORBIT_ERROR = "Not in a planets orbit.";
	public static final var COLONIZE_ERROR = "You need a colonization team to colonize a planet.";
	public static final var COLONIZED = "Planet colonized.";
	public static final var INVASION_ERROR = "You need an invasion force to ocupy the planet.";
	public static final var INVASION_FAILED = "Your invasion force has been defeated.";
	public static final var INVADED = "Planet ocupied.";

	
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
		
		
		if(!phaser.isEnabled || !phaser.phaser) return;
		
		
		var texture : Texture = getPhaserTexture(phaser);
		if(GUI.Button(rect, texture, skin.button)) {
			firePhaser(phaser);
		}
						
	
		
		if(phaser.getNextShot(upgrades) > Time.time) {
			//Calculate size
			//Get total reload time and time remaining
			var totalReload : float = phaser.getCooldown(upgrades);
			var remainTime : float = phaser.getNextShot(upgrades) - Time.time;
			var percentage : float = remainTime/totalReload;
			if(percentage > 1) {
				percentage = 1;
			}
			drawOverlay(rect, percentage);
			
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
		
		if(torpedo.getNextShot() > Time.time) {
			//Calculate size
			//Get total reload time and time remaining
			var totalReload : float = torpedo.getCooldown(upgrades);
			var remainTime : float = torpedo.getNextShot() - Time.time;
			var percentage : float = remainTime/totalReload;
			if(percentage > 1) {
				percentage = 1;
			}
			drawOverlay(rect, percentage);
			
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
		
		
		var planet : GameObject = findSystemPlanet();
		
		var colonizable : IColonizable = planet.GetComponent(IColonizable) as IColonizable;
		var inventory : Inventory = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Inventory);
		var factionable : IFactionable = player.GetComponent(IFactionable) as IFactionable;
		var faction : int = factionable.getFaction();
					
		if(colonizable.canColonize()) {
			if(!inventory.hasColonizationTeams()) {
				message.AddMessage(COLONIZE_ERROR);
			} else {
				var team : GameObject = inventory.getColonizationTeam();
				colonizable.colonize(faction, team);
				message.AddMessage(COLONIZED);
			}
			return;
		} 
		
		var conquerable : IConquerable = planet.GetComponent(IConquerable) as IConquerable;
		var populable : IPopuleable = planet.GetComponent(IPopuleable) as IPopuleable;
		
		if(conquerable.canConquer(faction)) {
		
			if(!inventory.hasInvasionForce(populable.getPopulation())) {
				message.AddMessage(INVASION_ERROR);
			} else {
				var force : GameObject = inventory.getInvasionForce();
				var invade : IInvasion = force.GetComponent(IInvasion) as IInvasion;
				if(!invade.canInvade(populable.getPopulation())) {
					message.AddMessage(INVASION_FAILED);
				} else {
					invade.invade(conquerable, faction);
					message.AddMessage(INVADED);
				}				
				
			}
			return;		
			
		}
		
		
		missions.finishTradeMissionInSystem();		
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
	
	function drawOverlay(rect : Rect, perc : float) {
		//Get overlay height
			var overHeight : float = rect.height * perc;
			
			//get size diference
			var sizeDif : float = rect.height - overHeight;
		
			//transparency
			var overColor : Color = Color.white;
			overColor.a = 0.75;
			
			GUI.color = overColor;
		
			GUI.DrawTexture(Rect(rect.x, rect.y + sizeDif, rect.width, overHeight), overlay);
		
			GUI.color = Color.white;
	}
	

	
	


}

