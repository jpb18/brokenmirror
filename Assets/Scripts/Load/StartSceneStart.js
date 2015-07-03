#pragma strict

public class StartSceneStart extends SceneStart {

	var ships : GameObject[];
	var stations : GameObject[];

	var stationSpawn : Vector3;
	var shipSpawn : Vector3;

	function Start() {
		super.initScripts();
		super.SetInventoryPanel();
		super.SetSceneStart();	
		PlantStation();
		PlantShip();
		AttachCameraToShip();
		super.SetHudControl();	
	}
	
	private function PlantStation() {
		var id : int = super.general.GetPlayerAllegianceId();
		GameObject.Instantiate(stations[id-1], stationSpawn, stations[id-1].transform.rotation);
	}
	
	private function PlantShip() {
		var id : int = super.general.GetPlayerAllegianceId();
		super.playerShip = GameObject.Instantiate(ships[id-1], shipSpawn, Quaternion.identity);
		super.playerShip.name = super.save_scr.RemoveClone(playerShip.name);		
		var props : shipProperties = super.playerShip.GetComponent.<shipProperties>();
		
		props.setName(save_scr.playerShip.getName());
		props.setFaction(0);
		props.setPlayer(true);
		
	}
	
	private function AttachCameraToShip() {
		
			var cam : GameObject = Camera.main.gameObject;
			var cam_scr : MouseOrbit = cam.GetComponent(MouseOrbit);
			cam_scr.target = super.playerShip.transform;
	
	}
	
}
