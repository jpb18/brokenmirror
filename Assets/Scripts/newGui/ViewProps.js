#pragma strict
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
	
	function getOutsideRect(x : int, y : int) : Rect {
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
