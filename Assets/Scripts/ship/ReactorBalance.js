
@Range(0, 1.5f)
var weapons : float = 1f;
@Range(0, 1.5f)
var defense : float = 1f;
@Range(0, 1.5f)
var speed : float = 1f;


private var reactor : Reactor;


// Use this for initialization
function Start () {
	reactor = gameObject.GetComponent.<Reactor>();
}

// Update is called once per frame
function Update () {
	var cost : float = CalculateEnergyCost();
	if(cost > 0 && reactor.hasEnough(cost)) {
		Shutdown();
	} else {
		reactor.spend(cost);
	}
}

private function CalculateEnergyCost() : float {
	var average : float = (weapons + defense + speed)/3;
	var rate : float = reactor.rechargeRate;
	return rate * (average - 1);
}

private function Shutdown() {
	weapons = 0;
	defense = 0;
	speed = 0;
}

