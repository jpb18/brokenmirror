#pragma strict

var gameOver : boolean;
var escape : boolean;
private var changing : boolean = false;
private var interrupt : boolean = false;

var fadeTime : float;

var alpha : float = 0;


var alert : Texture;
var alertRect : Rect;

var critical : Texture;
var criticalRect : Rect;

var abandoned : Texture;
var abandonedRect : Rect;

var continueRect : Rect;
var menuRect : Rect;

var background : Texture;

var hud : GUISkin;
private var buttonStyle : GUIStyle;

private var esc : EscMenu;

function Start () {
	reset();
	buttonStyle = hud.GetStyle("GameOverButton");
	esc = GameObject.FindGameObjectWithTag("PauseMenu").GetComponent(EscMenu);
}

function OnGUI() {
	Screen.showCursor = true;
	if(gameOver) {
		
		var tmp : Color = GUI.color;
		GUI.color = new Color(1,1,1, alpha);
		
		drawBackground();
		drawAlert();
		drawCritical();
		if(escape) {
			drawAbandoned();
			drawContinue();
		}
		drawMenu();
		
		GUI.color = tmp;
	
	}
}

function setGameOver(escape : boolean) {

	gameOver = true;
	this.escape = escape;
	if(!changing) {
		StartCoroutine(ChangeAlpha());
	}
	Time.timeScale = 0;
}

function reset() {
	alpha = 0;
	gameOver = false;
	escape = false;
	changing = false;
	interrupt = true;
	Time.timeScale = 1;
}

private function drawAlert() {
	var rect : Rect = centerRectInMiddle(alertRect);
	GUI.DrawTexture(rect, alert);
	
}

private function drawCritical() {
	var rect : Rect = centerRectInMiddle(criticalRect);
	GUI.DrawTexture(rect, critical);
}

private function drawAbandoned() {
	
	var rect : Rect = centerRectInMiddle(abandonedRect);
	GUI.DrawTexture(rect, abandoned);
	
}

private function drawContinue() {
	var rect : Rect = centerRectInMiddle(continueRect);
	if(GUI.Button(rect, "Continue", buttonStyle)) {
		continueGame();
	}
}

private function continueGame() {
	reset();
	
}

private function drawMenu() {
	var rect : Rect = centerRectInMiddle(menuRect);
	if(GUI.Button(rect, "Menu", buttonStyle)) {
		goToMenu();
	}
}

private function goToMenu() {
	
	esc.quit();
	reset();
}

private function drawBackground() {
	var rect : Rect = new Rect(0,0, Screen.width, Screen.height);
	GUI.DrawTexture(rect, background);
}

private function centerRectInMiddle(rect : Rect) {
	var center : Vector2 = (new Rect(0,0, Screen.width, Screen.height)).center;
	var x : float = center.x - rect.width/2 + rect.x;
	var y : float = center.y - rect.height/2 + rect.y;
	return new Rect(x, y, rect.width, rect.height);
}

private function ChangeAlpha() {
	changing = true;
	interrupt = false;
	var i : float = 0;
	var rate : float = 1/fadeTime * Time.deltaTime;
	while(i < 1) {
		if(interrupt) {
			alpha = 0;
			break;
		}
		i += rate;
		alpha = i;
		yield;
	}
	alpha = 1;
	changing = false;
	interrupt = false;

}

function isGameOver() : boolean {
	return gameOver;
}
