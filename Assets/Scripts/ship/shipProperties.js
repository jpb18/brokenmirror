//this script is used to contain all properties of a ship, without any modification
#pragma strict

//create classes
//stores all player/ship properties
class ShipPlayerProps {
	var isPlayer : boolean = false;
	var cloaked : boolean = false;
}

//this class is used to caracterize ship movement
class ShipMovementProps {
	var agility : float; //Standard Agility of the craft. In degrees per second.
	var impulseSpeed : float; //Standard Maximum Speed of the craft at sublight.
	var acceleration : float; //Ship acceleration at sublight speed (in percentage)
	var warpSpeed : int = 9;
}

class ShipCombatStatus {
	var isRedAlert : boolean; 
	private var lastRedPress : float;
	public static final var KEY_INT : float = 0.2f;
	
	function setRedAlert() {
		isRedAlert = !isRedAlert;
		lastRedPress = Time.time;
	}
	
	function canRedAlert() : boolean {
		return lastRedPress + KEY_INT < Time.time;
	}
	
}

//this contains the basic health status of the ship
class ShipHealthProps {
	var basicHealth : float;
	var basicShield : float;
	var armor : float = 0.0f;
}

class ShipProps {
	var shipStrenght : float; //this var contains the ship strenght... Used in AI, and calculating fleet and planet strenght
	var baseCost : int; //this represents the base cost of the ship
	var escapePod : boolean; //this says if the ship is an escape pod
}

class ShipModifiers {
	var reloadSpeed : float;
}

class ShipInfo {

	var faction : int;
	
	var storeImg : Texture;
	var targetImg : Texture; //this image will appear on the player gui
	var shipClass : String; //this contains the ship class
	var shipName : String; //this contains the ship name
	var shipDescription : String;
	var maintenanceCost : int = 150;

}

class shipProperties extends MonoBehaviour implements IFactionable, IBoardeable, IStrenghteable, IMovable, INameable, ITextureable, IClasseable, IDescribable, ICloakable, IEscapeable, IMaintainable, IPlayable {

	//use classes
	var playerProps : ShipPlayerProps;
	var movement : ShipMovementProps;
	var ShipHealth : ShipHealthProps;
	var shipProps : ShipProps;
	var shipModifiers : ShipModifiers;
	var shipInfo : ShipInfo;
	var combatStatus : ShipCombatStatus;
	var cam : MouseOrbit;

	var lastMap : float;
	public static final var WAIT_MAP : float = 0.2f;

	//other scripts
	var health : shipHealth;
	var map : MapInfo;
	var cloud : ShipCloud;
	var message : ShowMessage;
	private var general : GeneralInfo;
	private var upgrades : Upgrades;
	private var inventory : Inventory;
	private var target : shipTarget;
	var cloak : CloakScript;

	//constants
	public static var SHIELD_INIBITED : String = "Can't raise shields, shields inhibited.";
	public static var NO_SHIELD : String = "Shields down.";

	function Start() {
		cam = Camera.main.gameObject.GetComponent(MouseOrbit);
		health = gameObject.GetComponent(shipHealth);
		map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
		cloud = gameObject.GetComponent(ShipCloud);
		upgrades = gameObject.GetComponent.<Upgrades>();
		message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
		var saveGo : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
		general = saveGo.GetComponent(GeneralInfo);
		inventory = saveGo.GetComponent.<Inventory>();
		cloak = gameObject.GetComponent(CloakScript);
		target = gameObject.GetComponent.<shipTarget>();

	}

	function Update() {

		//change red alert status

		if (Input.GetAxis("RedAlert") && combatStatus.canRedAlert() && playerProps.isPlayer)
		{
			combatStatus.setRedAlert();
			
			if(cloud.isShieldInibited()) {
				if(getRedAlert()) message.AddMessage(SHIELD_INIBITED);
			} else if (!health.isShieldUp()) {
				if(getRedAlert()) message.AddMessage(NO_SHIELD);
			} else {
				health.showShields();
			}
		}

		//map status
		//in case Map Input is pressed
		if(Input.GetAxis("Map") && playerProps.isPlayer && lastMap + WAIT_MAP < Time.time) {
			map.swapStatus();
			lastMap = Time.time;
		}
		
		
		
		

	}


	function getRedAlert() : boolean {

		return combatStatus.isRedAlert;

	}
	
	function isPlayer() : boolean {
		return getPlayer();
	}

	function getPlayer() : boolean {
		return playerProps.isPlayer;

	}

	function setPlayer(isPlayer : boolean) {
		playerProps.isPlayer = isPlayer;
		
		

	}

	function getStoreImage() : Texture {
		return shipInfo.storeImg;
	}
	
	function getTargetImage() : Texture {
		return shipInfo.targetImg;
	}

	function getClass() : String {
		return shipInfo.shipClass;

	}

	function getDescription() : String {
		return shipInfo.shipDescription;

	}
	
	function setName(name : String) {
		shipInfo.shipName = name;
	}

	function getName() : String {
		try {
			var faction : FactionInfo = general.getFactionInfo(getFaction());
			return faction.getPrefix() + " " + shipInfo.shipName;
		} catch(e : NullReferenceException) {
			general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
			return getName(); 
		}
	}
	
	function getNameWithNoPrefix() : String {
		return shipInfo.shipName;
	}

	function getFaction() : int {
		return shipInfo.faction;
	}
	
	function isHostile(faction : int) : boolean {
		return general.isFactionEnemies(getFaction(), faction);							
	}
	
	function isAllied(faction : int) : boolean {
		return general.isFactionAllies(getFaction(), faction);
	}
	
	function isNeutral(faction : int) : boolean {
		return !isHostile(faction) && !isAllied(faction);
	}
	
	function isOwn(faction : int) : boolean {
		return getFaction() == faction;
	}

	function setFaction(fac : int) {
		shipInfo.faction = fac;
	}

	function getPrice() {
		return shipProps.baseCost;
	}

	function getStrenght() : int {
		return shipProps.shipStrenght;
	}

	function getSpeed() : float {
		try {
			return movement.impulseSpeed + upgrades.getSpeedBonus();
		} catch (e : NullReferenceException) {
			upgrades = gameObject.GetComponent.<Upgrades>();
			return getSpeed();
		}
	}
	
	function getAgility() : float {
		return movement.agility + upgrades.getAgilityBonus();
	}
	
	function getWarpSpeed() : int {
		return movement.warpSpeed;
	}
	
	function isCloaked() : boolean {
		return playerProps.cloaked;
	}
	
	function setCloak(cloak : boolean) {
		playerProps.cloaked = cloak;
		if(cloak) {
			
			this.cloak.hide(getPlayer());
		} else {
			
			this.cloak.show(getPlayer());
		}
	}
	
	function isEscapePod() : boolean {
		return shipProps.escapePod;
	}
	
	function getMaintenanceCost() : int {
		return shipInfo.maintenanceCost;
	}
	
	function Board(team : GameObject, faction : int) : boolean {
	
		if(health.isShieldUp()) {
			message.AddMessage("Can't get a lock. Shields are up.");
			return false;
		}
	
		var strenght : IStrenghteable = team.GetComponent(typeof(IStrenghteable)) as IStrenghteable;
		if(shipProps.shipStrenght < strenght.getStrenght()) {
			message.AddMessage("The ship is yours!");
			ChangeShipFaction(faction);
			return true;
		} else { //you loose the away team
			message.AddMessage("Your away team has failed its mission.");
			inventory.removeItem(team);
			return false;
		}
	}
	
	function ChangeShipFaction(faction : int) {
		shipInfo.faction = faction;
		target.ForceTarget();
	}
	
}
