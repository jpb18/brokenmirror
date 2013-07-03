#pragma strict

var screenWidth : int;
var screenHeight : int;
var screenRatio : float;

var isTesting : boolean = false;

class ScreenRatios {
	var s169 : float = 16f/9f;
	var s43 : float = 4f/3f;
	var s1610 : float = 16f/10f;

}


var screenRatios : ScreenRatios;



function Update () {
	
	//get screen ratio
	
	screenWidth = Screen.width;
	screenHeight = Screen.height;
	
	screenRatio = (screenWidth + 0.0f)/(screenHeight + 0.0f);
	
	
	//put stuff in here
	if (screenRatio == screenRatios.s169)
	{
	
	}
	else if (screenRatio == screenRatios.s43)
	{
	
	}
	else if (screenRatio == screenRatios.s1610)
	{
	
	}	
	
	
	//Load Next Screen
	if(!isTesting)
	{
		Application.LoadLevel(1);
	}
	

}

