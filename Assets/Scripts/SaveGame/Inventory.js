import System.Collections.Generic;
#pragma strict

var isOpen : boolean = false;
var items : List.<GameObject>;
var maxSize : int = 30;


private var load : LoadScene;

function Start () {
	load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
}

function Update () {
	
	if(Input.GetAxis("Inventory")) {
		isOpen = !isOpen;
	}
	
}

function OnGUI () {

	if(!load.show) drawGui();

}

function drawGui() {

	//TODO put GUI code here
	return null;

}

function addItem(item : GameObject) {
	
	items.Add(item);
	
}

function isFull() : boolean {
	
	return items.Count >= maxSize;
	
}

function resize(addSlots : int) {

	maxSize += addSlots;

}