import UnityEngine.UI;
import System.Collections.Generic;

var on : boolean;

var canvas : GameObject;
var texts : InputField[];


var skillLabel : Text[];
var factionImages : Image[];

var selectedRace : int;
var skills : SkillSet[];

private var faction : FactionInfo;

var menu : MenuScript;
private var general : GeneralInfo;
private var save : SaveGame;


public static final var SKILL_MASK = "{0}/100";

// Use this for initialization
function Start () {
	on = false;
	var go : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	general = go.GetComponent.<GeneralInfo>();
	save = go.GetComponent(SaveGame);
	
	menu = GameObject.FindGameObjectWithTag("MainCamera").GetComponent.<MenuScript>();
	
	
	this.SetFaction(0);
	this.SetRace(0);
	
}

// Update is called once per frame
function Update () {
}

function Show() {
	canvas.SetActive(true);
	
	for(var text in texts) {
		text.text = "";
	}
	
	factionImages[0].enabled = true;
	for(var i = 1; i < factionImages.Length; i++) {
		factionImages[i].enabled = false;
	}
	
	on = true;
}

function Hide() {
	canvas.SetActive(false);
	on = false;
	menu.Show();
}

function SetFaction(faction : int) {

	this.faction = general.getFactionInfo(faction+1);
	
	for(var i = 0; i < factionImages.Length; i++) {
		if(i != faction) {
			factionImages[i].enabled = false;
		} else {
			factionImages[i].enabled = true;
		}
	}	
}

function SetRace(race : int) {

	this.selectedRace = race;
	var skills : int[] = this.skills[race].ToArray();
	for(var i = 0; i < skills.Length; i++) {
		if(i < 4)		
			skillLabel[i].text = String.Format(SKILL_MASK, skills[i]);
		else
			skillLabel[i].text = skills[i].ToString();
	}
	
}

function StartGame() {

	general.setPlayerName(texts[0].text);
	general.setPlayerFactionName(texts[1].text);
	general.setPlayerFactionPrefix(faction.prefix);
	general.setPlayerRace(this.selectedRace); //NOTE: Here's an implicit cast from int to Race.
	general.SetPlayerAllegiance(faction);
	save.setPlayerShipName(texts[2].text);
	
	faction.alliedFactions.Add(0);
	
	Application.LoadLevel("Intro");

}


