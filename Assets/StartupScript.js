#pragma strict

private var hud : HUDStatus;
private var show : ShowMessage;
private var music : PlaybackScript;



function Start () {
	show = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
	music = GameObject.FindGameObjectWithTag("OST").GetComponent(PlaybackScript);
	hud  = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
	startComponents();
}


function startComponents() {
		show.setGame();
			
			music.startPlaying();
			
			hud.setGame(true);
}