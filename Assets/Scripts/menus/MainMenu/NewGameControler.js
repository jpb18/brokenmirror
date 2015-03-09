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


public static final var SKILL_MASK = "{0}/100";

// Use this for initialization
function Start () {
	on = false;
	var go : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	general = go.GetComponent.<GeneralInfo>();
	
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

	this.faction = general.getFactionInfo(faction);
	
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

]

