class StationInt {

	var bg_image : Texture;
	var area : Rect;
	
	var bt_missions : Rect;
	var bt_trade : Rect;
	var bt_sell : Rect;
	var bt_repais : Rect;
	
	var mode : InteractionsMode;
	
	var tradeMissions : List.<TradeMission>;
	var missionNumber : int = 5;
	
	var view : ViewProps;
	
	var itemWidth : int = 245;
	var itemHeight : int = 50;
	var itemPos : Vector2;
	
	private var generator : MissionGenerator;
	private var missions : Missions;
	public static var CARGO : String = "Cargo Mission: {0} GPL";
	
	
	function setMission(gen : MissionGenerator, missions : Missions) {
		this.generator = gen;
		this.missions = missions;
		generateMissions();
	}
	
	private function generateMissions() {
	
		for(var x : int = 0; x < missionNumber; x++) {
			var mission : TradeMission = generator.generateTradeMission();
			tradeMissions.Add(mission);
		}
	
	}
	
	function draw(info : StationInterface, skin : GUISkin) {
	
		GUILayout.BeginArea(area);
			//draw background
			GUI.DrawTexture(Rect(0,0, area.width, area.height), bg_image);
			//draw buttons
			drawButtons(skin);
			
			drawArea();
			
		GUILayout.EndArea();
	}
	
	private function drawArea() {
		
		switch(mode) {
			case InteractionsMode.trade:
				drawTradeItems();
				break;
			default:
				break;
		}
		
	
	}
	
	private function drawTradeItems() {
		view.scrollPosition = GUI.BeginScrollView (view.getOutsideRect(itemPos.x, itemPos.y), view.scrollPosition, view.getInRect(missionNumber, itemHeight), true, true);
		
		for(var x : int = 0; x < missionNumber; x++) {
			var mission : TradeMission = tradeMissions[x];
			var cargo : Cargo = mission.getCargo();
			var price : int = cargo.getTotalPrice();
			var str : String = String.Format(CARGO, price);
			GUI.Button(new Rect(0, x * itemHeight, itemWidth, itemHeight), str);
			//TODO Code the next stage here... Preferably on a new window...
		}
		
		GUI.EndScrollView();
	}
	
	private function drawButtons(skin : GUISkin) {
		
		if(GUI.Button(bt_missions, "Missions", skin.GetStyle("StationOptions"))) {
			mode = InteractionsMode.missions;
		}
		
		if(GUI.Button(bt_trade, "Trade", skin.GetStyle("StationOptions"))) {
			mode = InteractionsMode.trade;
		}
		
		if(GUI.Button(bt_sell, "Sell", skin.GetStyle("StationOptions"))) {
			mode = InteractionsMode.sell;
		}
		
		if(GUI.Button(bt_repais, "Repairs", skin.GetStyle("StationOptions"))) {
			mode = InteractionsMode.repairs;
		}
		
	}
	
	

}
