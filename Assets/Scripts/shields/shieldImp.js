//this script controls the shield impact effect
#pragma strict
var startBrightness = 0;
var endBrightness = 2;
var incBright = 1;
var destroy : float = 2.0;
var creationTime :  float;


function Start () {

	creationTime = Time.time;

}

function Update () {
	if(Time.time > creationTime + destroy)
	{
		Destroy(gameObject);
	}
	
	if (Time.time < creationTime + (destroy / 2))
	{
		if (transform.light.intensity < endBrightness)
		{
			transform.light.intensity += incBright * Time.deltaTime;
		
		}
	
	
	}
	
	if (Time.time > creationTime + (destroy / 2))
	{
		
		transform.light.intensity -= incBright * Time.deltaTime;
	
	}

}