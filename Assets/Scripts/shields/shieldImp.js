//this script controls the shield impact effect
#pragma strict

var destroy : float;
var creationTime :  float;




function Start () {
	
	var scr : ParticleSystem = gameObject.GetComponent(ParticleSystem);
	destroy = scr.duration;
	creationTime = Time.time;
	

}

function Update () {
	if(Time.time > creationTime + destroy)
	{
		Destroy(gameObject);
	}
	
	
}