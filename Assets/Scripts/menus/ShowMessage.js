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
var isTest : boolean;

class ViewProps {
	var width : int;
	var height : int;
	var rightPadding : int;
	var insidePadding : int;
	var scrollPosition : Vector2;
	
	///<summary>Gets outside rect of the Scroll View</summary>
	///<returns>Outside Rect</returns>
	function getOutRect() : Rect {
		var x : int = Screen.width - (width + rightPadding);
		var y : int = (Screen.height - height)/2;
		
		return new Rect(x,y,width,height);
	
	}
	
	///<summary>Gets inside rect of the Scroll View</summary>
	///<returns>Inside Rect</returns>
	///<param name="number">Number of messages its going to contain</param>
	///<param name="height">Height of each message block</param>
	function getInRect(number : int, height : int) : Rect {
		var fheight : int = (height + insidePadding) * number;
		
		return new Rect(0,0,width,fheight);
	}
	
}

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
	AddMessage("Welcome to the game!");
	if(isTest) {
		StartCoroutine(test());
	}
}

function OnGUI () {
	drawMessageWindow();
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
		view.scrollPosition = GUI.BeginScrollView (view.getOutRect(), view.scrollPosition, view.getInRect(messages.Count, messageProps.height));
		
		for(var x : int = 0; x < messages.Count; x++) {
			drawMessage(messages[x]);
		}
		
		GUI.EndScrollView ();
	

}

///<summary>This method draws the message inside the message window</summary>
///<param name="message">Contains the message object</param>
function drawMessage(message : Message) {
	
	GUI.Label(messageProps.getRect(message.position, view.insidePadding), message.message, skin.GetStyle("MessageItem"));

}

///<summary>This method clears the message history</summary>
function clearHistory() {
	messages = new List.<Message>();
}

private function test() {
	var x : int = 0;
	while(true) {
		AddMessage(x.ToString());
		x++;
		yield WaitForSeconds(2);
	}

}
