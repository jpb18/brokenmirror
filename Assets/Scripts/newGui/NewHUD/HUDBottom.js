#pragma strict

class HUDBottom extends HUDElement {

	function getPlacementRect() : Rect {
		var origin : Rect = super.getResizedPosition();
		var x : float = (Screen.width/2 - origin.width/2) + origin.x;
		var y : float = Screen.height - origin.height + origin.y;
		return new Rect(x, y, origin.width, origin.height);
	}

}