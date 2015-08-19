#pragma strict

public class Wormhole extends MonoBehaviour {

	var stable : boolean;
	var destination : String;

	private var phenomenon : Phenomenon;	

	function Start () {
		phenomenon = gameObject.GetComponent.<Phenomenon>();
	}

	function Set(stable : boolean, destination : String) {
		this.stable = stable;
		this.destination = destination;
	}
	
	function OnTriggerEnter(col : Collider) {
		var go : GameObject = col.gameObject; 
		if(go.tag == "Ship") {
			var playable : IPlayable = go.GetComponent(typeof(IPlayable)) as IPlayable;
			if(phenomenon.isScanned()) {
				//send player to destination
			} else if (playable.isPlayer()) {
				//kill player ship
				go.GetComponent.<shipHealth>().kill();
			}
		}
		
	}

}