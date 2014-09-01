#pragma strict
@script ExecuteInEditMode()

var eventsColor : Color;
var eventsRect : Rect;
var eventsBackgroundRect : Rect;
var eventsLabelRect : Rect;
var continueButtonRect : Rect;

var tipMainRect : Rect;
var tipRect : Rect;

var tipList : List.<String>;
var imageList : List.<Texture>;

var overlay : Texture;

var skin : GUISkin;
private var tmpSkin : GUISkin;
private var image : Texture;
private var tip : String;
private var messages : String;

private var carry : SceneTransferCarry;
private var transfer : SceneTransfer; 
private var stardate : Stardate;
private var load : LoadScene;
private var hud : HUDStatus;

public static final var BASE_HEIGHT : float = 1440f;
public static final var BASE_WIDTH : float = 2560f;
public static final var IMAGE_WIDTH : float = 2560f;
public static final var IMAGE_HEIGHT : float = 1143f;

public static final var TIP : String = "Tip:";
public static final var MESSAGE : String = "Current stardate: {0:0.0}.\nConsumed {1} dilithium in {2} days.\n" ;

function Start () {
	
	image = pickRandomImage();
	tip = pickRandomTip();
	
	transfer = gameObject.GetComponent(SceneTransfer);
	carry = GameObject.FindGameObjectWithTag("Transfer").GetComponent(SceneTransferCarry);
	hud = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
	stardate = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Stardate);
	load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
	hud.hide();
	
	messages = getMessages();
	
}

function OnGUI () {
	if(!tmpSkin) {
		tmpSkin = GUI.skin;
	}
	GUI.skin = skin;
	
	drawBackground();
	drawEventsWindow();
	GUI.skin = tmpSkin;
}

function drawBackground() {
	drawBackgroundImage();	
	drawOverlay();
	drawTip();
}

function drawBackgroundImage() {
	
	var rect : Rect = getTextureRect(image);
	GUI.DrawTexture(rect ,image);
}

function drawOverlay() {
	var rect : Rect = getOverlayRect();
	GUI.DrawTexture(rect, overlay);
}

function drawTip() {
	var mainRect : Rect = getTipMainRect();
	GUI.Label(mainRect, TIP, skin.GetStyle("TipMain"));
	var rect : Rect = getTipRect();
	GUI.Label(rect, tip, skin.GetStyle("Tip"));
}

function getTipMainRect() : Rect {
	
	var y : float = getTipY(tipMainRect);
	return new Rect(tipMainRect.x, y, tipMainRect.width, tipMainRect.height);
}
function getTipRect() : Rect {
	var y : float = getTipY(tipRect);
	return new Rect(tipRect.x, y, tipRect.width, tipRect.height);
}

function getTipY(rect : Rect) : float {
	var textureRect : Rect = getTextureRect(image);
	return textureRect.y + textureRect.height + rect.y;
} 

function getTextureRect(image : Texture) : Rect {
	var ratio : float = getRatio();
	var rect : Rect = new Rect(0,0, IMAGE_WIDTH * ratio, IMAGE_HEIGHT * ratio);
	rect.y = Screen.height/2 - rect.height/2;
	rect.x = -((rect.width - Screen.width)/2);
	return rect;
	
}

function getOverlayRect() : Rect {
	var ratio : float = getRatio();
	var rect : Rect = new Rect(0,0, BASE_WIDTH * ratio, BASE_HEIGHT * ratio);
	rect.y = Screen.height/2 - rect.height/2;
	rect.x = -((rect.width - Screen.width)/2);
}

function drawEventsWindow() {
	GUILayout.BeginArea(getEventRect());
		var tmp : Color = GUI.color;
		GUI.color = eventsColor;
		GUI.Box(resizeRect(eventsBackgroundRect), "Warp Info");
		GUI.color = tmp;
		GUI.Label(resizeRect(eventsLabelRect), messages);
		if(GUI.Button(resizeRect(continueButtonRect), "Continue")) {
			loadNewScene();
		
		}
		
	GUILayout.EndArea();
}

function loadNewScene() {
		var destiny : String = carry.getDestiny();
		carry.reset();
		
		
		
		Application.LoadLevel(destiny);
}

function getEventRect() : Rect {
	var rect : Rect = resizeRect(eventsRect);
	var screenHeight : int = Screen.height;
	var y : int = screenHeight/2 - rect.height/2;
	return new Rect(rect.x, y, rect.width, rect.height);
}

function resizeRect(rect : Rect) : Rect {
	var ratio : float = getRatio();
	return new Rect(rect.x * ratio, rect.y * ratio, rect.width * ratio, rect.height * ratio);
}

function getRatio() : float {
	return Screen.height/BASE_HEIGHT;
}

function getMessages() : String {
	var message : String = String.Format(MESSAGE, stardate.getCurrentStardate(), carry.getFuel(), carry.getTime());
 	message = message + transfer.getMessages();
	return message;
}

function pickRandomTip() : String {
	var num : int = 0;
	if(tipList.Count > 0) {
		num = Random.Range(0, tipList.Count);
	}
	return tipList[num];	
}

function pickRandomImage() : Texture {
	var num : int = 0;
	if(tipList.Count > 0) {
		num = Random.Range(0, imageList.Count);
	}
	return imageList[num];
}