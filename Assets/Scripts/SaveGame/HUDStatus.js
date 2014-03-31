
var isHidden : boolean = false;
var load : LoadScene;

private var last : float;
private var interval : float = 0.2f;

// Use this for initialization
function Start () {

	load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);

}

// Update is called once per frame
function Update () {

	if(Input.GetAxis("Hide") && hasIntervalPassed()) {
		isHidden = !isHidden;
		last = Time.time;
	}

}

function isShowingGui() : boolean {

	return !isHidden && !load.show;

}

private function hasIntervalPassed() : boolean {

	return Time.time > last + interval;

}

