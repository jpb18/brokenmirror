
class MissionDialogue extends FloatingWindow {

	var sizeRatio : float;
	
	private var bgRect : Rect = new Rect(0,0, 1112, 357);
	private var acceptRect : Rect = new Rect(400, 310, 133, 34);
	private static var ACCEPT : String = "Accept";
	private var rejectRect : Rect = new Rect(600,310, 133, 34);
	private static var REJECT : String = "Deny";
	private var descriptionRect : Rect = new Rect(30, 25, 950, 280);
	private var description : String;
	protected var missions : Missions;
	
	public var skin : GUISkin;
	
	function Start() {
		id = GUIUtility.GetControlID(FocusType.Passive);
		missions = GameObject.FindGameObjectWithTag("Missions").GetComponent(Missions);
	}
	
	function window() {
		resizeParent();
		drawBackground();
		drawAccept();
		drawReject();
		drawDescription();
		drag();
	}
	
	function resizeParent() {
		var r : Rect = resizeRect(bgRect);
		super.position.width = r.width;
		super.position.height = r.height;
	}
	
	function drawBackground() {
		GUI.DrawTexture(resizeRect(bgRect), super.background);
	
	}
	
	function drawAccept() {
		var rect : Rect = resizeRect(acceptRect);
		if(GUI.Button(rect, ACCEPT, skin.GetStyle("MissionButton"))) {
			accept();
		}
	
	}
	
	function accept(){}
	
	function drawReject() {
		var rect : Rect = resizeRect(rejectRect);
		if(GUI.Button(rect, REJECT, skin.GetStyle("MissionButton"))) {
			reject();
		}
	}
	
	function drawDescription() {
		var rect : Rect = resizeRect(descriptionRect);
		GUI.Label(rect, description, skin.GetStyle("MissionText"));
	}
	
	function reject(){
		super.setOff();
	}
	
	function drag() {
		
		GUI.DragWindow();
	}
	
	function resizeRect(rect : Rect) : Rect {
		
		return new Rect(rect.x * sizeRatio, rect.y * sizeRatio, Mathf.Floor(rect.width * sizeRatio), Mathf.Floor(rect.height * sizeRatio));
	
	}
	
	function setDescription(description : String) {
		this.description = description; 	
	}
	
	



}