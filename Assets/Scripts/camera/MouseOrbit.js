//script has been changed to fit Broken Mirror 3
//by pressing the right mouse button, and draging the mouse, the player should be able to rotate the camera
var target : Transform;
var distance = 10.0;

var xSpeed = 250.0;
var ySpeed = 120.0;

var yMinLimit = -360;
var yMaxLimit = 360;

private var x = 0.0;
private var y = 0.0;

var rotation : Quaternion;
var position;



function Start () {
    var angles = transform.eulerAngles;
    x = angles.y;
    y = angles.x;

	// Make the rigid body not change rotation
   	if (rigidbody)
		rigidbody.freezeRotation = true;
}

function LateUpdate () {
	if (target) {
		//obtain red alert status
		/*var go : GameObject = target.gameObject;
		var script : playerShip = go.GetComponent(playerShip);
		var red_alert = script.isRedAlert;
		
	
		if(red_alert == false) //check if red alert isn't activated or if the ship is forward firing and the rotation key is pressed
		{*/
		
			
				if(Input.GetAxis("camSpace")) //Check status of "camSpace" Input Axis
				{
					Screen.showCursor = false; //Hide mouse cursor
				}
				else
				{
					Screen.showCursor = true; //Show mouse cursor
				}
			
			    if (target) { //Check if the script has a target
			    
					if(Input.GetAxis("camSpace")) //Check status of "camSpace" Input Axis
					{
						//update coordinates
			        	x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
			        	y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
			        }
			 		
			 		y = ClampAngle(y, yMinLimit, yMaxLimit);
			 		
			       if(Input.GetAxis("camSpace")) //Check status of "camSpace" Input Axis
			       {       
			        	rotation = Quaternion.Euler(y, x, 0); //update rotation
			        }
			        
			        position = rotation * Vector3(0.0, 0.0, -distance) + target.position; //update camera position
			        
			        if(Input.GetAxis("camSpace")) //Check status of "camSpace" Input Axis
			        {
			        	transform.rotation = rotation; //rotate
			        }
			        transform.position = position;
			        
			    }
			    else //else, warn the absence of target
			    {
			    	Debug.LogError("The script has no target");
			    }
		    
	    /*}
	    else
	    {	
	    	 //Check if the script has a target
	    		
			        	x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
			        	y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
			        	y = ClampAngle(y, yMinLimit, yMaxLimit);
			        	rotation = Quaternion.Euler(y, x, 0); //update rotation
			        	 position = rotation * Vector3(0.0, 0.0, -distance) + target.position; //update camera position
			        	 transform.rotation = rotation; //rotate
			        	  transform.position = position;
	    	
	    	
    	}*/
    }
    
}

static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}