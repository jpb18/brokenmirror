#pragma strict

private var parent : GameObject;

public static final var ROTATION_SPEED : float = 360f;
public static final var TRANSLATION_SPEED : float = 1f;

function Start () {


}

function init(parent : GameObject) {
	this.parent = parent;
}

function LateUpdate () {

	if(Input.GetAxis("camSpace")) //Check status of "camSpace" Input Axis
	{
		//update coordinates
		var x : float = Input.GetAxis("Mouse X") * ROTATION_SPEED * Time.deltaTime;
		var y : float = Input.GetAxis("Mouse Y") * ROTATION_SPEED * Time.deltaTime;
		transform.Rotate(-y, -x, 0);
	}

	var trans : float = Input.GetAxis("camZoom") * TRANSLATION_SPEED;
	transform.Translate(transform.forward * -trans);
		
	if(Input.GetAxis("FreeCamera")) {
		destroy();
	}

}

function destroy() {
	var script : MouseOrbit = parent.GetComponent.<MouseOrbit>();
	script.join();
	Destroy(gameObject);	
	
}