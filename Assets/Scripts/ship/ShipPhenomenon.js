

public class ShipPhenomenon extends MonoBehaviour {
	
	private var properties : shipProperties;
	
	function Start() {
		properties = gameObject.GetComponent.<shipProperties>();
	}

	function OnTriggerEnter(hit : Collider) {
		if(!properties.isPlayer()) return;
		if(hit.tag == "Wormhole") {
			hit.gameObject.GetComponent.<Wormhole>().EnterWormhole(gameObject);
		} else if (hit.tag == "ShowPhenomenon") {
			var show : ShowPhenomenon = hit.gameObject.GetComponent(typeof(ShowPhenomenon)) as ShowPhenomenon;
			show.Activate();
		}
		
	}
	
	function OnTriggerExit(hit : Collider) {
		if(!properties.isPlayer()) return;
		if(hit.tag == "ShowPhenomenon") {
			var show : ShowPhenomenon = hit.gameObject.GetComponent(typeof(ShowPhenomenon)) as ShowPhenomenon;
			show.Deactivate();
		}
	}

}
