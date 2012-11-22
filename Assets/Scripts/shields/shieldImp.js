//this script controls the shield impact effect
#pragma strict
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
	

}