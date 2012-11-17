//this is the script that controls a planet in Broken Mirror III

var rotation : float = 1.0; //this var indicates how much the planet will rotate each second, in degrees

function Start () {

}

function Update () {

	transform.Rotate(Vector3.up * -rotation * Time.deltaTime); //we put rotation negative because normally planets rotate counter clock wise
}