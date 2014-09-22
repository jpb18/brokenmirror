import System.Collections.Generic;
#pragma strict

///<summary> This class contains the message definition </summary>
class Message {

	var message : String;
	var creation : float;
	var position : Vector2; //position inside the scroll view
	
	public function Message(message : String) {
	
		this.message = message;
		creation = Time.time;
		position = Vector2.zero;
	}
	
	public function getMessage() : String {
	
		return message;
	
	}
	
	
	//public function sendDown(units : int, time : float) {
	//	MonoBehaviour.StartCoroutine(smoothMove(units, time));
	//}
	
	///<summary>Sends down the message, by changing the Y value of its position</summary>
	///<param name="units">Number of pixels the message will be sent down</param>
	///<param name="time">Time it'll take to send the message down, in seconds</param>
	///<pre>units > 0 && time >= 0</pre>
	public function smoothMove(units : int, time : float) {
		
		var elapsed : float = 0.0f;
		var move : int = (units/time);
		while(elapsed < time) {
			
			this.position.y += move * Time.deltaTime;
		 	elapsed += Time.deltaTime; 
		 	yield;
		} 
		
		
	
	}

}

var messages : List.< Message>;
var moveTime : float;
var skin : GUISkin;
var view : ViewProps;
var messageProps : MessageProps;
var isGame : boolean = false;
var loadScene : LoadScene;
var hud : HUDStatus;

var messageLimit : int = 3;



class MessageProps {
	var width : int;
	var height : int;
	
	
	///<summary>Gets rect for message in the Scroll View</summary>
	///<returns>Message Rect</returns>
	///<param name="position">Position of said message in the scroll view</param>
	///<param name="padding">Distance from previous message</param>
	function getRect(position : Vector2, padding : int) : Rect {
			
		return new Rect(position.x,position.y + padding,width,height);
	
	}
}

function Start () {
	loadScene = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
	hud = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
}

function OnGUI () {


	if(isGame  && hud.isShowingGui()) {
		drawMessageWindow();
	}
}

///<summary>This method adds a new message to the list</summary>
///<param name="message">Message to be inserted</param>
///<pre>message != null</pre>
function AddMessage(message : String) {
	sendAllMessagesDown();
	messages.Add(new Message(message));
}

///<summary>This method sends all messages down</summary>
function sendAllMessagesDown() {

	for(var x : int = 0; x < messages.Count; x++) {
		
		StartCoroutine(messages[x].smoothMove(messageProps.height, moveTime));
	
	}

}

///<summary>This method draws the message window</summary>
function drawMessageWindow() {
		view.scrollPosition = GUI.BeginScrollView (view.getOutRect(), view.scrollPosition, view.getInRect(messageLimit, messageProps.height));
		
		for(var x : int = messages.Count; x > 0 && x > (messages.Count - messageLimit) ; x--) {
			
			drawMessage(messages[x-1], messages.Count - x);
		}
		
		
		
		GUI.EndScrollView ();
	

}

///<summary>This method draws the message inside the message window</summary>
///<param name="message">Contains the message object</param>
function drawMessage(message : Message, x : int) {
	var alpha : float = getAlphaValue(x);
	GUI.color = new Color(1,1,1, alpha);
	GUI.Label(messageProps.getRect(message.position, view.insidePadding), message.message, skin.GetStyle("MessageItem"));
	GUI.color = new Color(1,1,1,1);
}

///<summary>This method clears the message history</summary>
function clearHistory() {
	messages = new List.<Message>();
}

function setGame() {
	isGame = true;
}

function setOff() {
	isGame = false;
}

function getAlphaValue(x : int) : float {
	var i : float = messageLimit - x;
	var lim : float = messageLimit;
	return i/lim;		
} 

