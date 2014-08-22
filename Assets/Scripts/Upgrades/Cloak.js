

class Cloak extends Upgrade implements IActive {
	
	var cooldown : float;
	var duration : float;
	var energy : float;
	
	function Cloak(name : String, cost : int, description : String, image : Texture, cooldown : float, duration : float) {
		super(name, cost, description, image);
		this.cooldown = cooldown;
		this.duration = duration;
	}

	///<summary>Use this to set off the ships renderer.</summary>
	///<param name="target">Contains the object to be hidden</param>
	///<pre>target.tag == "Ship" || target.tag == "Station"</pre>
	function use(target : GameObject) {
		hide(target);
		//setHide(target);
	}
	
	function isDisabable() : boolean {
		return true;
	}
	
	function getConsumption() : float {
		return energy;
	}
	
	///<summary>Use this to set on the ships renderer.</summary>
	///<param name="target">Contains the object to be shown</param>
	///<pre>isDisabable() && target.tag == "Ship" || target.tag == "Station"</pre>
	function disable(target : GameObject) {
		show(target);
	}
	
	function getCooldown() : float {
		return cooldown;
	}
	
	function getDuration() : float {
		return duration;
	}
	
	private function setHide(target : GameObject) {
		WaitForSeconds(duration);
		show(target);
	}
	
	private function hide(target : GameObject) {
		//target.renderer.enabled = false;
		var cloak : ICloakable = target.GetComponent(typeof(ICloakable)) as ICloakable;
		cloak.setCloak(true);
	}
	
	private function show(target : GameObject) {
		//target.renderer.enabled = true;
		var cloak : ICloakable = target.GetComponent(typeof(ICloakable)) as ICloakable;
		cloak.setCloak(false);
	}

}