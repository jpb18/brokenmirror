#pragma strict
import System.Collections.Generic;

class PlanetPanel extends FloatingWindow implements IFactionable, IHealtheable, ITextureable, IHailable, INameable {

	//stats
	private var planet : PlanetInfo;
	private var faction : FactionInfo;
	
	private var map : MapInfo;
	private var general : GeneralInfo;
	private var save : SaveGame;
	private var inventory : Inventory;
	private var message : ShowMessage;
	
	var ships : List.<GameObject>;
	
	//GUI
	var imgRect : Rect;
	
	var nameRect : Rect;
	var ownerRect : Rect;
	var strRect : Rect;
	
	var descRect : Rect;
	var itemRect : Rect;
	var costRect : Rect;
	
	var buttonSize : Vector2;
	var buttonPos : Vector2[];
	
	var dilithiumRect : Rect;
	var dilImage : Texture2D;
	
	var deuraniumRect : Rect;	
	var deuImage : Texture2D;
	
	var close : Rect;
	
	var skin : GUISkin;
		
	public static final var DILITHIUM_COST : int = 3;
	public static final var SPAWN_RADIUS : int = 5;
	public static final var CLASS : String = "Planet";
	public static final var HEALTH : float = 1f;
	
	function Start() {
		init();
		map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
		planet = map.getPlanetInCurrentScene();
		var SaveGO : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
		general = SaveGO.GetComponent(GeneralInfo);
		save = SaveGO.GetComponent(SaveGame);
		inventory = SaveGO.GetComponent(Inventory);
		faction = general.getFactionInfo(planet.getFaction());
		message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	}
	
	function OnGUI() {
		
		if(super.on) {
			drawWindow();
		}
		
	}
	
	function drawWindow() {
		super.position = GUI.Window(super.getId(), super.position, window, title, GUIStyle.none);	
	}
	
	function window() {
		
		drawBackground();
		drawImage();
		drawDilithium();
		drawClose();
		drawStatsLabels();
		drawDescription();
		drawName();
		drawFaction();
		drawStrenght();
		drawStoreButtons();
		//keep this at end
		drag();
	}
	
	function drawBackground() {
		if(hasBackground()) {
			GUI.DrawTexture(getBackgroundPosition(), background);
		}
	}
	
	function drawImage() {
		var text : Texture = planet.getImage();
		if(text) {
			GUI.DrawTexture(resizeRect(imgRect), text, ScaleMode.ScaleToFit);
		}
	}
	
	function drawDilithium() {
		if(planet.hasDilithium()) {
			if(GUI.Button(resizeRect(dilithiumRect), dilImage, skin.GetStyle("PlanetButton"))) {
				buyDilithium();
			}
		}
	}
	
	function buyDilithium() {
		var player : GameObject = save.getPlayerShip();
		var fuel : ShipFuel = player.GetComponent(ShipFuel);
		var lack : int = getDilithiumNeed(player);
		var cost : int = getDilithiumCost(player);
		
		
		if(fuel.isFull()) {
			message.AddMessage("Tanks are full.");
		}
		else if(!inventory.canBuy(cost)) {
			message.AddMessage("Not enough latinum.");
		} else {
			inventory.spend(cost);
			fuel.addFuel(lack);			
			message.AddMessage("Tanks are filled.");
		}
		  
	
	}
	
	function getDilithiumCost(player : GameObject) {
		
		var cost : int = DILITHIUM_COST * getDilithiumNeed(player);
		return cost;
	}
	
	function getDilithiumNeed(player : GameObject) {
		var fuel : ShipFuel = player.GetComponent(ShipFuel);
		var contains : int = fuel.getCurrentLoad();
		var capacity : int = fuel.getCapacity();
		var lack : int = capacity - contains;
		return lack;
	}
	
	private function getBackgroundPosition() : Rect {
		var rect : Rect = getResizedPosition();
		return new Rect(0,0, rect.width, rect.height);
	}
	

	
	function getPlanetInfo() : PlanetInfo {
		return planet;
	}
	
	function drawClose() {
		if(GUI.Button(resizeRect(close), "X", skin.GetStyle("PlanetClose"))) {
			setOff();
		}
	}
	
	function drawStats(name : String, cost : String) {
		GUI.Label(resizeRect(itemRect), name, skin.GetStyle("PlanetLabel"));
		GUI.Label(resizeRect(costRect), cost + " GPL", skin.GetStyle("PlanetLabel"));
	}
	
	function isInRect(rect : Rect) : boolean {
		return rect.Contains(Event.current.mousePosition);
	}
	
	function drawStatsLabels() {
		drawDilithiumStats();
		drawStoreMouseOvers();
	}
	
	function drawDilithiumStats() {
		if(isInRect(resizeRect(dilithiumRect))) {
			drawStats("Dilithium", getDilithiumCost(save.getPlayerShip()).ToString());
		}
	}
	
	function drawStoreButtons() {
	
		for(var x : int = 0; x < ships.Count; x++) {
			drawStoreButton(x);
		
		}
	
	}
	
	
	function drawDescription() {
		var desc : String = planet.description;
		GUI.Label(resizeRect(descRect), desc, skin.GetStyle("PlanetLabel"));
	}
	
	function drawName() {
		var name : String = planet.name;
		GUI.Label(resizeRect(nameRect), name, skin.label);
	}
	
	function drawFaction() {
		var faction : String = faction.getName();
		GUI.Label(resizeRect(ownerRect), faction, skin.label);
	}
	
	function drawStrenght() {
		var strenght : String = planet.getStrenght().ToString();
		GUI.Label(resizeRect(strRect), strenght, skin.label);
	}
	
	function getStoreButtonRect(id : int) : Rect {
		return resizeRect(new Rect (buttonPos[id].x, buttonPos[id].y, buttonSize.x, buttonSize.y));
	}
	
	function drawStoreButton(id : int) {
		var rect : Rect = getStoreButtonRect(id);
		var image : Texture = ships[id].GetComponent(shipProperties).getStoreImage();
		if(GUI.Button(rect, image, skin.GetStyle("StoreButton"))) {
			//Buy ship
			buyShip(ships[id]);
		}
	}
	
	function drawStoreMouseOvers() {
		for(var x : int = 0; x < ships.Count; x++) {
			drawStoreMouseOver(x);
		}
	}
	
	function drawStoreMouseOver(id : int) {
		var rect : Rect = getStoreButtonRect(id);
		if(isInRect(rect)) {
			var ship : GameObject = ships[id];
			drawStats(getShipClass(ship), getShipCost(ship).ToString());
		}
	}
	
	function getShipCost(ship : GameObject) : int {
		return ship.GetComponent(shipProperties).getPrice();
	}
	
	function getShipClass(ship : GameObject) : String {
		return ship.GetComponent(shipProperties).getClass();
	}
	
	function buyShip(ship : GameObject) {
		if(!inventory.canBuy(getShipCost(ship))) {
			message.AddMessage("Not enough latinum.");
		} else {
			inventory.spend(getShipCost(ship));
			var newShip : GameObject = GameObject.Instantiate(ship, genSpawnPoint(), Quaternion.identity);
			newShip.transform.LookAt(getPlayerPosition());
			newShip.name = Statics.RemoveClone(newShip.name);
			var props : shipProperties = newShip.GetComponent(shipProperties);
			props.setFaction(0);
			props.setPlayer(false);
			message.AddMessage("Ship acquired.");
		}
	}
	
	function genSpawnPoint() : Vector3 {
		var pos : Vector3 = getPlayerPosition();
		var rnd : Vector3 = Random.onUnitSphere * SPAWN_RADIUS;
		return pos + rnd;
		
	}
	
	function getPlayerPosition() : Vector3 {
		var ship : GameObject = save.getPlayerShip();
		return ship.transform.position;
	}
	
	function getFaction() : int {
		return general.getFactionId(faction);
	}
	
	function isHostile(faction : int) : boolean {
		return this.faction.isHostile(faction);
	}
	
	function isAllied(faction : int) : boolean {
		return this.faction.isAllied(faction);
	}
	
	function isNeutral(faction : int) : boolean {
		return !isHostile(faction) && !isAllied(faction);
	}
	
	function isOwn(faction : int) : boolean {
		return getFaction() == faction;
	}
	
	function getName() : String {
		return planet.name;
	}
	
	function getClass() : String {
		return CLASS;
	}
	
	function getHullPercentage() : float {
		return HEALTH;
	}
	
	function getShieldPercentage() : float {
		return HEALTH;
	}
	
	function getStoreImage() : Texture {
		return null;
	}
	
	function getTargetImage() : Texture {
		return planet.getImage();
	}
	
	function openComm() {
		setOn();
	}
	
	function closeComm() {
		setOff();
	}

}