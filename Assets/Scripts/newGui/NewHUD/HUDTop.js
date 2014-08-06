#pragma strict

class HUDTop extends HUDElement {

	function getPlacementRect() : Rect {
		var origin : Rect = getOrigin();
		var x : float = (Screen.width/2 - origin.width/2) + origin.x;
	
		return new Rect(x, origin.y, origin.width, origin.height);
	}
	
	private function getOrigin() : Rect {
		if(isTest) {
			return super.getPosition();
		} else {
			return super.getResizedPosition();
		}
	}

}