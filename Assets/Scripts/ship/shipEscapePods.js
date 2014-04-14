#pragma strict

var isPod : boolean = false;
var podNumber : int = 0;
var pod : GameObject;

private var resetIsPod : boolean;
private var resetPodNumber : int;
private var resetPod : GameObject;

function Start() {
	resetIsPod = isPod;
	resetPodNumber = podNumber;
	resetPod = pod;
}

function reset() {
	isPod = resetIsPod;
	podNumber = resetPodNumber;
	pod = resetPod;
}

function hasEscapePod() : boolean {
	return podNumber > 0;
}

function isEscapePod() : boolean {
	return isPod;
}

function getEscapePod() : GameObject {
	return pod;
}

function instantiateEscapePod(position : Vector3, rotation : Quaternion) : GameObject {
	podNumber--;
	return Instantiate(pod, position, rotation);
	
}

