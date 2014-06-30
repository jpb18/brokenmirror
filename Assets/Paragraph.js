#pragma strict

function Start () {

}
// Moves all transform children 10 units upwards!
for (var child : Transform in transform) {
    child.position += Vector3.up * 10.0;
}
function Update () {

}