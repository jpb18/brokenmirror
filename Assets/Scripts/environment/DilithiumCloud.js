#pragma strict
class DilithiumCloud extends Cloud {

	var timeInterval : float;
	var amount : int;


	private var last : float;


	function Start () {

	}

	function Update () {
		if(Time.time >= last + timeInterval) {
			last = Time.time;
			for(var ship : GameObject in shipsInside) {
				var fuel : ShipFuel = ship.GetComponent(ShipFuel);
				if(!fuel.isFull()) {
					fuel.addFuel(amount);
				}
			}
		}

	}

}
