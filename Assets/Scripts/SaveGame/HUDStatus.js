
var isHidden : boolean = false;
private var load : LoadScene;
private var over : GameOver;
var isGame : boolean = false;

private var last : float;
private var interval : float = 0.2f;

// Use this for initialization
function Start () {

	load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
	over = GameObject.FindGameObjectWithTag("GameOver").GetComponent(GameOver);

}

// Update is called once per frame
function Update () {

	if(Input.GetAxis("Hide") && hasIntervalPassed()) {
		isHidden = !isHidden;
		last = Time.time;
	}

}

function isShowingGui() : boolean {

	return !isHidden && !load.show && isGame && !isGameOver();

}

private function hasIntervalPassed() : boolean {

	return Time.time > last + interval;

}

function setGame(game : boolean) {
	this.isGame = game;
}

private function isGameOver() : boolean {
	return over.isGameOver();
}

function hide() {
	isHidden = true;
}

function show() {
	isHidden = false;
}
