import System.Collections.Generic;
#pragma strict

var materials : List.<Material>;
var time : float = 2f;

private var changing : boolean = false;
private var alpha_shader : Shader;
private var normal_shader : Shader;
private var lastChange : float;

public static final var ALPHA_MAT = "Transparent/Self-Illumin/Diffuse";
public static final var NORMAL_MAT = "Self-Illumin/Diffuse";

public static final var MAX : float = 1f;
public static final var MIN : float = 0f;
public static final var MIN_P : float = 0.2f;


function Start () {
	alpha_shader = Shader.Find(ALPHA_MAT);
	normal_shader = Shader.Find(NORMAL_MAT);
	if(gameObject.renderer) {
		materials = new List.<Material>(renderer.materials);
	} else {
		for(var trans : Transform in transform) {
			var rend : Renderer = trans.renderer;
			if(rend) {
				materials = new List.<Material>(rend.materials);
				break;
			}
		
		}
	
	}
}

function isChanging() : boolean {
	return Time.time > lastChange + time;
}

function hide(player : boolean) {
	lastChange = Time.time;
	for(var material : Material in materials) {
		
		reduceAlpha(material, player);	
	}
	
}

function show(player : boolean) {
	lastChange = Time.time;
	for(var material : Material in materials) {
		
		increaseAlpha(material, player);	
	}
}

private function reduceAlpha(material : Material, player : boolean) {
	material.shader = alpha_shader;
	var min : float;
	if(player) {
		min = MIN_P;
	} else {
		min = MIN;
	}
	
	var rate : float = 1/time;
	var cur : float = 1;

	while(cur >= min) {
		if(cur < min) {
			material.color.a = min;
		} else {
			material.color.a = cur;
		}
		cur -= rate * Time.deltaTime;
		yield;
	}


	material.color.a = min;
	
}

private function increaseAlpha(material : Material, player : boolean) {
	
	var rate : float = 1/time;
	var cur : float;
	if(player) {
		cur = MIN_P;
	} else {
		cur = MIN;
	}
	while(cur < MAX) {
		if(cur > 1) {
			material.color.a = MAX;
		} else {
			material.color.a = cur;
		}
		cur += rate * Time.deltaTime; 
		yield;
	}
	material.color.a = MAX;
	
	material.shader = normal_shader;
	
}