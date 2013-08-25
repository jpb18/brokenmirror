#pragma strict

var scene : int;
var loadImage : Texture;

function Start () {

}

function OnGUI () {
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), loadImage);
	Application.LoadLevel(scene);
}