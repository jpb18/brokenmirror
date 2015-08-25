

public class ShipPhenomenon extends MonoBehaviour {
	
	private var properties : shipProperties;
	
	function Start() {
		properties = gameObject.GetComponent.<shipProperties>();
	}

	function OnTriggerEnter(hit : Collider) {
		if(!properties.isPlayer()) return;
		if(hit.tag == "Wormhole") {
			hit.gameObject.GetComponent.<Wormhole>().EnterWormhole(gameObject);
		}
		
	}

}
