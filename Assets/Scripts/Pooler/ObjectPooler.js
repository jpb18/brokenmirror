#pragma strict
import System.Collections.Generic;

var object : GameObject;
var number : int;

private var objects : List.<GameObject>;

function Start () {
	objects = new List.<GameObject>();
	for(var i : int = 0; i < number; i++) {
		addNewObject();
	}
	
}

private function hasObjectAvailable() : boolean {
	var has : boolean = false;
	var i : int = 0;
	while(i < number && !has) {
		has = objects[i].activeInHierarchy;	
		i++;
	}
	
	return has;
}

function getObject() : GameObject {
	if(!hasObjectAvailable()) {
		addNewObject();
		number++;
	}

	var obj : GameObject = null;
	var i : int = 0;
	
	while(i < number && obj == null) {
		if(!objects[i].activeInHierarchy) {
			obj = objects[i];
		}
		i++;
	}
	
	return obj;
	
}

function equals(obj : GameObject) {
	return obj == object;
}

private function addNewObject() {
		var obj : GameObject = Instantiate(object);
		obj.SetActive(false);
		DontDestroyOnLoad(obj);
		objects.Add(obj);
}