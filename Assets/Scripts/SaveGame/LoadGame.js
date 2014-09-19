#pragma strict

private var general : GeneralInfo;
private var inventory : Inventory;
private var hold : CargoHold;
private var saveGame : SaveGame;
private var stardate : Stardate;
private var map : MapInfo;
private var missions : Missions;


// Use this for initialization
function Start () {

	var saveGO : GameObject = GameObject.FindGameObjectWithTag("SaveGame");
	saveGame = saveGO.GetComponent(SaveGame);
	general = saveGO.GetComponent(GeneralInfo);
	inventory = saveGO.GetComponent(Inventory);
	hold = saveGO.GetComponent(CargoHold);
	stardate = saveGO.GetComponent(Stardate);
	
	var mapGO : GameObject = GameObject.FindGameObjectWithTag("MapInfo");
	map = mapGO.GetComponent(MapInfo);
	
	var missionsGo : GameObject = GameObject.FindGameObjectWithTag("Missions");
	missions = missionsGo.GetComponent(Missions);
	



}


function LoadGame(game : GameData) {
	
	setStardate(game);
	setPlayer(game.getPlayer());
	setFactions(game.factions);
	setMap(game.map);
	setInventory(game.getPlayer());
	setCargo(game.getPlayer());
	setMissions(game.missions);
}


private function setStardate(game : GameData) {
	var date : int = game.stardate;
	stardate.setStardate(date);

}

private function setPlayer(player : PlayerData) {

	general.setPlayer(player);
	saveGame.setPlayer(player.ship, player.fleet);

}

private function setFactions(factions : List.<FactionData>) {
	general.setFactions(factions);
}

private function setMap(map : MapData) {
	this.map.setMap(map.planets);
}

private function setInventory(player : PlayerData) {
	inventory.setInventory(player.inventory);
}

private function setCargo(player : PlayerData) {
	hold.setHold(player.cargo);
}

private function setMissions(missions : MissionsData) {
	this.missions.setMissions(missions);
}
