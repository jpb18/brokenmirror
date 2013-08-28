#pragma strict

var shipTar : shipTarget;
var shipProps : shipProperties;

function Start () {
	shipTar = gameObject.GetComponent(shipTarget);
	shipProps = gameObject.GetComponent(shipProperties);
}

function Update () {

}

function OnGUI () {
	if(shipProps.playerProps.isPlayer) {
	
	 	if(shipTar.repeatClick == true) {
	 		
	 		GUILayout.BeginArea(Rect(200, 300, 400, 200));
	 		
	 			GUILayout.BeginHorizontal();
	 				GUILayout.Label("Do you want to swap ships?");
	 			GUILayout.EndHorizontal();
	 			
	 			
	 			GUILayout.BeginHorizontal();
	 				GUILayout.BeginVertical();
			 			if(GUILayout.Button("Yes")) {
			 			
			 				//change is player here to false
			 				shipProps.playerProps.isPlayer = false;
			 				//check is player in target to true
			 				var targetProps : shipProperties = shipTar.target.GetComponent(shipProperties);
			 				targetProps.playerProps.isPlayer = true;
			 				
			 				//now change camera target
			 				var camScript : MouseOrbit = Camera.main.GetComponent(MouseOrbit);
			 				camScript.target = shipTar.target.transform;
			 				
			 				
			 				shipTar.repeatClick = false;
			 			
			 			}
		 			
		 			GUILayout.EndVertical();
		 			
		 			GUILayout.BeginVertical();
		 			
			 			if(GUILayout.Button("No")) {
			 			
			 				shipTar.repeatClick = false;
			 			
			 			}
		 			
		 			GUILayout.EndVertical();
	 			GUILayout.EndHorizontal();
	 		
	 		GUILayout.EndArea();
	 	
	 	}
 	}

}