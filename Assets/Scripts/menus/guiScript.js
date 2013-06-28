#pragma strict

class MovementGui {
	var height : int;
	var width : int;
	var style : GUIStyle;
	
	var stopIcon : Texture2D;
	var upIcon : Texture2D;
	var downIcon : Texture2D;

}

var MovGUI : MovementGui;
var shipProps : shipProperties;
var shipMov : shipMovement;

function Start () {

	//get ship props script
	shipProps = gameObject.GetComponent(shipProperties);

}

function OnGUI () {
	//gets escape menu status
	var cam_go : GameObject = Camera.main.gameObject;
	var cam_sc : testReturn = cam_go.GetComponent(testReturn);
	var isPause : boolean = cam_sc.isPause;

	if(shipProps.playerProps.isPlayer && !isPause)
	{
		MovementGUI();
	
	}


}

//this function build the movement gui section
function MovementGUI () {
	//Create Movement GUI Area
	GUILayout.BeginArea(Rect(0, Screen.height - MovGUI.height, MovGUI.width, MovGUI.height));
		//Create button area	
		GUILayout.BeginVertical();
			//Stop Button
			GUILayout.BeginHorizontal();
				
				
				
			GUILayout.EndHorizontal();
	
		GUILayout.EndVertical();
	GUILayout.EndArea();
	
	

}