import System.Collections.Generic;
#pragma strict

///<summary> This class contains the message definition </summary>
class Message {

	var message : String;
	
	public function Message(message : String) {
	
		this.message = message;
	
	}
	
	public function getMessage() : String {
	
		return message;
	
	}

}

var messages : List.< Message>;

function Start () {

}

function Update () {

}

function AddMessage(message : String) {
	messages.Add(new Message(message));
}