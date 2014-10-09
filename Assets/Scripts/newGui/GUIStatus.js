#pragma strict

var windows : FloatingWindow[];

private var map : MapInfo;

function Start () {
	windows = gameObject.GetComponents.<FloatingWindow>();
	
	map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent.<MapInfo>();
	
}

function isAnyWindowUp() : boolean {
	
	return checkGUIWindows() && map.isMapOn();

}

private function checkGUIWindows() : boolean {
	for(var x : int = 0;  x < windows.Length; x++) {
		if(windows[x].isOn()) {
			return true;
		}	
	}
	return false;

}
