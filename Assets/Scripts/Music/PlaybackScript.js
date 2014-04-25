#pragma strict
import System.Collections.Generic;

enum PlaybackStatus {
	NEUTRAL,
	HOSTILE,
	GOOD,
	MISTERY
}
var isPlaying : boolean = false;

var source : AudioSource;
var status : PlaybackStatus;

var neutralMusics : List.<AudioClip>;
var hostileMusics : List.<AudioClip>;
var goodMusics : List.<AudioClip>;
var misteryMusics : List.<AudioClip>;

function Start () {
	GameObject.DontDestroyOnLoad(gameObject);
	source = gameObject.GetComponent(AudioSource);
}

function Update () {
	if(isPlaying) {
		if(!source.isPlaying) {
			play();
		}
	
	}
}

function startPlaying() {
	isPlaying = true;
}

function getStatus(status : PlaybackStatus) : boolean {
	return this.status.Equals(status);
}

function setStatus(status : PlaybackStatus) {
	this.status = status;
	play();
}


private function play() {
	var audio : AudioClip;
	switch(status) {
		case PlaybackStatus.NEUTRAL:
		audio = neutralMusics[Random.value * neutralMusics.Count];
		break;
		case PlaybackStatus.HOSTILE:
		audio = hostileMusics[Random.value * hostileMusics.Count];
		break;
		case PlaybackStatus.GOOD:
		audio = goodMusics[Random.value * goodMusics.Count];
		break;
		case PlaybackStatus.MISTERY:
		audio = misteryMusics[Random.value * misteryMusics.Count];
		break;
		default:
		break;
	}
	source.clip = audio;
	source.Play();
}