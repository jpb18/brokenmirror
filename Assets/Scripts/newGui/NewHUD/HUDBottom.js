#pragma strict

class HUDBottom extends HUDElement {

	

	function getPlacementRect() : Rect {
		var origin : Rect = getOrigin();
		var x : float = (Screen.width/2 - origin.width/2) + origin.x;
		var y : float = Screen.height - origin.height + origin.y;
		return new Rect(x, y, origin.width, origin.height);
	}
	
	private function getOrigin() : Rect {
		if(isTest) {
			return super.getPosition();
		} else {
			return super.getResizedPosition();
		}
	}
	
	protected function getResizedRect(rect : Rect, maxValue : float, curValue : float) {
		var width : int = GetBarSize(rect.width, maxValue, curValue);
		return resizeRect(new Rect(rect.x, rect.y, width, rect.height));
	}
	
		//this function returns the size of a bar in pixels
	protected function GetBarSize (FullSize : int, MaxValue : float, CurValue : float) : int {

		if(MaxValue == 0) {
			return 0;
		}

		var newSize : int;
		
		newSize = (FullSize * CurValue)/MaxValue;
		
		return newSize;
		

	}

}