#pragma strict

var mainCam : Camera;
var startGame : boolean;
var image : Texture2D;
var showSplash : boolean;


function Start () {

}

function Update () {

	if(Input.GetKey(KeyCode.Mouse0)) {
	
		var ray : Ray = mainCam.ScreenPointToRay (Input.mousePosition);
		var hit : RaycastHit = new RaycastHit ();
		var layer : LayerMask = LayerMask.NameToLayer ("MenuText");
		if (Physics.Raycast (ray, hit, 1000.0f, ~layer.value)) {
				var hitGo : GameObject = hit.transform.gameObject;
				if (hitGo.tag == "resume") {
						showSplash = true;
				}
		}
	
	}

}

function FixedUpdate() {
	if (startGame) {
			//get show message script
			var show : ShowMessage = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
			show.setGame();
			Application.LoadLevel ("Start");
	}


}

function OnGUI ()
{
		if (showSplash) {
				GUI.DrawTexture (new Rect (0, 0, Screen.width, Screen.height), image);
				startGame = true;
		}
}