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
	
	function EnterWormhole(ship : GameObject) {
		var playable : IPlayable = ship.GetComponent(typeof(IPlayable)) as IPlayable;
		if(phenomenon.isScanned() && stable && playable.isPlayer()) {
			//TODO
		} else if (playable.isPlayer()) {
			ship.GetComponent.<shipHealth>().kill();
		}
	}
	

}