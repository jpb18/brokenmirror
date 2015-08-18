#pragma strict

class Station extends MonoBehaviour implements IFactionable, IPlayable, IBoardeable {

	var health : Health;
	var weapon : StationWeapons;
	var factionInfo : FactionInfo;
	var faction : int = -1;
	var rotation : Vector3;
	var strenght : int;
	

	private var general : GeneralInfo;
	private var message : ShowMessage;
	private var inventory : Inventory;

	function Start () {
		//get station weapons script
		weapon = gameObject.GetComponent(StationWeapons);
		health = gameObject.GetComponent(Health);
		
		general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(GeneralInfo);
		factionInfo = general.getFactionInfo(faction);
		
		message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent.<ShowMessage>();
		inventory = GameObject.FindGameObjectWithTag("SaveGame").GetComponent.<Inventory>();
	}

	function Update () {

		
		scan();
		fire();
		life();
		transform.Rotate(rotation);

	}


	function getFactionInfo() : FactionInfo {
		return factionInfo;
	}

	//make all weapons scan
	private function scan() {
		
		//scan for phasers
		for(var x : int = 0; x < weapon.getLength(WeaponType.beam); x++) {
			weapon.scan(x, WeaponType.beam);
			
		}

		//scan for torpedoes
		for(x  = 0; x < weapon.getLength(WeaponType.torpedo); x++) {
			weapon.scan(x, WeaponType.torpedo);
		}
		
		//scan for pulses
		for(x = 0; x < weapon.getLength(WeaponType.pulse); x++) {
			weapon.scan(x, WeaponType.pulse);
		}

	}

	//makes all weapons fire
	private function fire() {

		//fire phasers
		for(var x : int = 0; x < weapon.getLength(WeaponType.beam); x++) {
			weapon.fire(x, WeaponType.beam);
		}

		//fire torpedoes
		for(x  = 0; x < weapon.getLength(WeaponType.torpedo); x++) {
			weapon.fire(x, WeaponType.torpedo);
		}
		
		//fire pulses
		for(x = 0; x < weapon.getLength(WeaponType.pulse); x++) {
			weapon.fire(x, WeaponType.pulse);
		}


	}

	//check health status
	private function life() {
		
		//check if the station is dead or alive
		if(!health.hasHull()) {
			health.die(gameObject); //kill it if its dead
		}
		
		//check if the shield can regen
		if(health.canRegen()) {
			health.shieldRegen(); //if so, regen
		}


	}

	function getStrenght() : int {
		return strenght;
	}
	
	
	function getFaction() : int {
		return faction;
	}
	
	function isHostile(faction : int) : boolean {
		return factionInfo.isHostile(faction);
	}
	
	function isAllied(faction : int) : boolean {
		return factionInfo.isAllied(faction);
	}
	
	function isNeutral(faction : int) : boolean {
		return !isHostile(faction) && !isAllied(faction);
	}
	
	function isOwn(faction : int) : boolean {
		return this.faction == faction;
	}
	
	function isPlayer() : boolean {
		return false;
	}
	
	function Board(team : GameObject, faction : int) : boolean {
		if(health.isShieldUp()) {
			message.AddMessage("Can't get a lock. Shields are up.");
			return false;
		}
	
		var strenght : IStrenghteable = team.GetComponent(typeof(IStrenghteable)) as IStrenghteable;
		if(this.strenght < strenght.getStrenght()) {
			message.AddMessage("The station is yours!");
			ChangeStationFaction(faction);
			return true;
		} else { //you loose the away team
			message.AddMessage("Your away team has failed its mission.");
			inventory.removeItem(team);
			return false;
		}
	}
	
	private function ChangeStationFaction(faction : int) {
		this.faction = faction;
		this.factionInfo = general.getFactionInfo(faction);
		this.scan();
	}
	
}