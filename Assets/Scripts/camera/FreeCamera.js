#pragma strict

private var parent : GameObject;
var rotation : float = 50f;
var translation : float= 5f;



function Start () {


}

function init(parent : GameObject) {
	this.parent = parent;
}

function LateUpdate () {

	if(Input.GetAxis("camSpace")) //Check status of "camSpace" Input Axis
	{
		//update coordinates
		var x : float = Input.GetAxis("Mouse X") * rotation * Time.deltaTime;
		var y :float = Input.GetAxis("Mouse Y") * rotation * Time.deltaTime;
		transform.Rotate(x, y, 0);
	}

	var trans : float = Input.GetAxis("camZoom") * translation;
	transform.Translate(transform.forward * trans);
		
	if(Input.GetAxis("FreeCamera")) {
		destroy();
	}

}

function destroy() {
	var script : MouseOrbit = parent.GetComponent.<MouseOrbit>();
	script.join();
	Destroy(gameObject);	
	
}