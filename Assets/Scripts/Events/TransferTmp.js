#pragma strict
private var carry : SceneTransferCarry;
private var transfer : SceneTransfer; 
private var stardate : Stardate;
private var load : LoadScene;
private var hud : HUDStatus;

public static final var MESSAGE : String = "Current stardate: {0}.\nConsumed {1} dilithium in {2} days.\n" ;

// Use this for initialization
function Start () {
	transfer = gameObject.GetComponent(SceneTransfer);
	carry = GameObject.FindGameObjectWithTag("Transfer").GetComponent(SceneTransferCarry);
	hud = GameObject.FindGameObjectWithTag("GlobalInfo").GetComponent(HUDStatus);
	stardate = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Stardate);
	load = GameObject.FindGameObjectWithTag("LoadScene").GetComponent(LoadScene);
	load.setOff();
	hud.hide();
}



function OnGUI() {

	if(GUI.Button(new Rect(0,0, 250, 100), "Accept")) {
		var destiny : String = carry.getDestiny();
		carry.reset();
		
		load.showScreen();
		
		Application.LoadLevel(destiny);
 	}
 	
 	var message : String = String.Format(MESSAGE, stardate.getCurrentStardate(), carry.getFuel(), carry.getTime());
 	message = message + transfer.getMessages();
 	GUI.Label(new Rect(0, 100, Screen.width, Screen.height - 100), message);
 	

}