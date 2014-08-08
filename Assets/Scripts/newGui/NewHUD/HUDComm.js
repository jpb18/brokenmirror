#pragma strict

class HUDComm extends FloatingWindow implements IHailable {


	private var isOpen : boolean;
	
	var window : Rect;
	
	var backgroundTexture : Rect;
	var backgroundRect : Rect;
	
	var tradeRect : Rect;
	var boardRect : Rect;
	var commandRect : Rect;
	var closeRect : Rect;
	
	var nameLabelRect : Rect;
	var messageLabelRect : Rect;
	var iconRect : Rect;
	
	var skin : GUISkin;

	// Use this for initialization
	function Start () {
	}

	

	function openComm() {
		isOpen = true;
	}
	
	function closeComm() {
		isOpen = false;
	}

}
