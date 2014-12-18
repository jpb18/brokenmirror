//script has been changed to fit Broken Mirror 3
//by pressing the right mouse button, and draging the mouse, the player should be able to rotate the camera
var target : Transform;
var distance = 10.0;

var maxDistance : float = 10.0f;
var minDistance : float = 1.0f;
var distanceRate : float = 2.0f;

var xSpeed = 250.0;
var ySpeed = 120.0;

var yMinLimit = -360;
var yMaxLimit = 360;

private var x = 0.0;
private var y = 0.0;

var rotation : Quaternion;
var position;

private var forked = false;
var freeCamera : GameObject;
var spaceCamera : GameObject;

private var nextFork : float;
private static final var FORK_TIME : float = 0.2f;

function Start () {
    var angles = transform.eulerAngles;
    x = angles.y;
    y = angles.x;

	spaceCamera = GameObject.FindGameObjectWithTag("SpaceScene_Camera");

	// Make the rigid body not change rotation
   	if (rigidbody)
		rigidbody.freezeRotation = true;
}

function LateUpdate () {

    if(!forked) {
    	CameraScript();
    }
    
    
    if(Input.GetAxis("FreeCamera") && !forked && Time.time >= nextFork) {
		lastFork = Time.time + FORK_TIME;
		fork();
		
	}
    
    
}

function CameraScript() {
		if (target) {
		//obtain red alert status
		
		var go : GameObject = target.gameObject;
		var red_alert : boolean = go.GetComponent(shipProperties).combatStatus.isRedAlert;
		var hasTarget : boolean = go.GetComponent(shipTarget).hasTarget();
	
		if(!red_alert && !hasTarget) //check if red alert isn't activated or the ship doesn't have any target
		{
		
			camScript();
				
	    } else if(red_alert && !hasTarget) {
	    
	    	camScript();
	    }
	    else 
	    {	
	    	 camScript();
	    		
//			        	x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
//			        	y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
//			        	y = ClampAngle(y, yMinLimit, yMaxLimit);
//			        	rotation = Quaternion.Euler(y, x, 0); //update rotation
//			        	 position = rotation * Vector3(0.0, 0.0, -distance) + target.position; //update camera position
//			        	 transform.rotation = rotation; //rotate
//			        	  transform.position = position;
	    	
	    	
    	}
    	
    	calcDistance();
    	
    } else {
    
    	rotateCam();
    
    }

}

function rotateCam() {

	if(Input.GetAxis("camSpace")) //Check status of "camSpace" Input Axis
	{
		//update coordinates
		x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
		y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
	}

	y = ClampAngle(y, yMinLimit, yMaxLimit);
	
	
	
	transform.rotation = Quaternion.Euler(y, x, 0);

}

function camScript() {

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
			    
			   
		    

}

function calcDistance() {
	 if(Input.GetAxis("camZoom") > 0)
			    {
			    	if (distance < maxDistance)
			    	{
			    		distance += distanceRate * Time.deltaTime;
			    	}
			    	else
			    	{
			    		distance = maxDistance;
			    	}
			    }
			    
			    if (Input.GetAxis("camZoom") < 0)
			    {
			    	if (distance > minDistance)
			    	{
			    		distance -= distanceRate * Time.deltaTime;
			    	}
			    	else
			    	{
			    		distance = minDistance;
			    	}
			    }
}

static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}

function fork() {
	//signal its forked
	forked = true;
	//disable this gameobject audio
	var audio : AudioListener = gameObject.GetComponent.<AudioListener>();
	audio.enabled = false;
	//disable this gameobject camera
	var c : Camera = gameObject.GetComponent(Camera);
	c.enabled = false;
	
	//instanteate and initialize new camera and its script
	var cam : GameObject = GameObject.Instantiate(freeCamera, transform.position, transform.rotation);
	var script : FreeCamera = cam.GetComponent.<FreeCamera>();
	script.init(gameObject);
	
	//associate the space camera with the new free floating camera
	var spaceScript : SU_SpaceSceneCamera = spaceCamera.GetComponent(SU_SpaceSceneCamera);
	spaceScript.parentCamera = cam.GetComponent(Camera);
	

}

function join() {
	//signal it isn't forked
	forked = false;
	//enable this audio listener
	var audio : AudioListener = gameObject.GetComponent.<AudioListener>();
	audio.enabled = true;
	//enable this camera
	var c : Camera = gameObject.GetComponent(Camera);
	c.enabled = true;
	//associate space cameta with this one
	var spaceScript : SU_SpaceSceneCamera = spaceCamera.GetComponent(SU_SpaceSceneCamera);
	spaceScript.parentCamera = Camera.main;
	
} 