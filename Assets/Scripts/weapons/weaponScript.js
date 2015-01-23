//this "class" is more here to interface the rest of the game with the several weapon scripts, plus status
#pragma strict

	enum WeaponType {
		beam,
		torpedo,
		pulse,

	}

public class weaponScript extends MonoBehaviour implements INameable, IImageable, IDescribable {

	var type : WeaponType;
	var firingAngle : float;
	var guiInfo : GuiInfo;
	var altRate : float;
	var baseCost : int;
	var energyCost : float;




	class GuiInfo {
		var name : String;
		var description : String;
		var image : Texture2D;

	}



	function Start () {
		
	}

	function Update () {

	}

	///<summary>Gets the weapon type</summary>
	function getType() : WeaponType {
		return type;
	}

	function getImage() : Texture {

		return guiInfo.image;

	}

	function getName() : String {
		return guiInfo.name;

	}

	function getDescription() : String {
		return guiInfo.description;

	}

	//this method gets the weapon cooldown
	function getCooldown() : float {
		var cd : float = 0.0f;
		
		switch(type) {
			case WeaponType.beam:
				cd = gameObject.GetComponent(phaserScript).standard_cd;
				break;
			case WeaponType.torpedo:
				cd = gameObject.GetComponent(torpedoScript).status.cooldown;
				break;
			case WeaponType.pulse:
				cd = gameObject.GetComponent(torpedoScript).status.cooldown;
				break;
				
		
		}
		
		return cd;


	}

	function getDamage(isShield : boolean) : float {
		var dmg : float = 0.0f;
		
		switch(type) {
			case WeaponType.beam:
				dmg = gameObject.GetComponent(phaserScript).damage;
				break;
			case WeaponType.torpedo:
				dmg = gameObject.GetComponent(torpedoScript).getDamage(isShield);
				break;
			case WeaponType.pulse:
				dmg = gameObject.GetComponent(torpedoScript).getDamage(isShield);
				
		
		}
		
		return dmg;

	}
	
	function getDamage() : float {
		return getDamage(true) > getDamage(false) ? getDamage(true) : getDamage(false);
	}

	//this method gets the weapon range
	function getRange() : float {
		var range : float = 0.0f;
		
		switch(type) {
			case WeaponType.beam:
				range = gameObject.GetComponent(phaserScript).range;
				break;
			case WeaponType.torpedo:
				range = gameObject.GetComponent(torpedoScript).status.range;
				break;
			case WeaponType.pulse:
				range = gameObject.GetComponent(torpedoScript).status.range;
			
		
		}
		
		return range;
		
	}

	//this method checks if the target is in range
	function isRange(origin : GameObject, target : GameObject) : boolean {
		var range : float = getRange();
		var or : Vector3 = origin.transform.position;
		var tar : Vector3 = target.transform.position;
		return ((or - tar).sqrMagnitude <= range * range);


	}

	//this method check if the target is inside the firing arc
	function isAngle(origin : GameObject, target : GameObject) : boolean {

		return Vector3.Angle(target.transform.position - origin.transform.position, origin.transform.forward) <= firingAngle/2;

	}


	//this method set the weapon target
	//@pre target != null
	function setTarget(target : GameObject) {
		switch(type) {
			
			case WeaponType.torpedo:
				gameObject.GetComponent(torpedoScript).setTarget(target);
				break;
			case WeaponType.pulse:
				gameObject.GetComponent(torpedoScript).setTarget(target);
				
		
		}
	}

	//this method sets the weapon origin point
	//@pre origin != null
	function setOrigin(origin : GameObject) {

		switch(type) {
			
			case WeaponType.torpedo:
				gameObject.GetComponent(torpedoScript).setOrigin(origin);
				break;
			case WeaponType.pulse:
				gameObject.GetComponent(torpedoScript).setOrigin(origin);
		
		}


	}

	function setUpgrade(upgrades : Upgrades) {
		
		if(type == WeaponType.torpedo || type == WeaponType.pulse) {
			gameObject.GetComponent(torpedoScript).setUpgrade(upgrades);
		}

	}
	
	function setEnergy(energy : float) {
		if(type == WeaponType.torpedo || type == WeaponType.pulse) {
			gameObject.GetComponent(torpedoScript).setEnergy(energy);
		}
	}

	function getPrice() : int {
		return baseCost;
	}

	function getAlternateRate() : float {
		return altRate;
	}

	function getEnergyCost() : float {
		return energyCost;
	}
	
	
	function getDetailsDescription() : String {
		var description : String = getDescription() + "\n";
		description = description + "Damage: " + getDamage().ToString() + "\n";
		description = description + "Cooldown: " + getCooldown().ToString() + "\n";
		description = description + "Range: " + getRange().ToString() + "\n";
		description = description + "Firing Angle: " + firingAngle.ToString() + "\n";
		description = description + "Energy Cost: " + energyCost.ToString();
		return description;
	}

}