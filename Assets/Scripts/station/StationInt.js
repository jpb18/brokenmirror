class StationInt {

	var bg_image : Texture;
	var area : Rect;
	
	var bt_missions : Rect;
	var bt_trade : Rect;
	var bt_sell : Rect;
	var bt_repais : Rect;
	
	var mode : InteractionsMode;
	
	var tradeMissions : List.<TradeMission>;
	var combatMissions : List.<CombatMission>;
	var missionNumber : int = 5;
	
	
	
	var view : ViewProps;
	
	var itemWidth : int = 245;
	var itemHeight : int = 50;
	var itemPos : Vector2;
	
	private var generator : MissionGenerator;
	private var missions : Missions;
	private var faction : FactionInfo;
	private var tradeDialogue : TradeMissionDialogue;
	private var combatDialogue : CombatMissionDialogue;
	public static var CARGO : String = "Cargo Mission: {0} GPL";
	public static var COMBAT : String = "Combat Mission : {0} GPL";
	
	
	
	function setMission(gen : MissionGenerator, missions : Missions) {
		this.generator = gen;
		this.missions = missions;
		generateMissions();
	}
	
	function setCombat(dialogue : CombatMissionDialogue, faction : FactionInfo) {
		this.combatDialogue = dialogue;
		this.faction = faction;
	}
	
	function setTrade(dialogue : TradeMissionDialogue) {
		this.tradeDialogue = dialogue;
	}
	
	private function generateMissions() {
	
		generateTradeMission();
		generateCombatMission();	
	
	}
	
	private function generateTradeMission() {
		for(var x : int = 0; x < missionNumber; x++) {
			var mission : TradeMission = generator.generateTradeMission();
			tradeMissions.Add(mission);
		}
	}
	
	private function generateCombatMission() {
		if(generator.hasCommonEnemies(faction)) {
			for(var x : int = 0; x < missionNumber; x++) {
				var mission : CombatMission = generator.generateCombatMission(faction);
				combatMissions.Add(mission);
				isCombat = true;
			}
		}
	}
	
	function removeTradeMissions() {
		for(var i : int= tradeMissions.Count; i > 0; i--) {
			if(tradeMissions[i-1].hasStarted()) {
				tradeMissions.RemoveAt(i-1);
			}
		}
	}
	
	function removeCombatMissions() {
		for(var i : int= combatMissions.Count; i > 0; i--) {
			if(combatMissions[i-1].hasStarted()) {
				combatMissions.RemoveAt(i-1);
			}
		}
	}
	
	function draw(info : StationInterface, skin : GUISkin) {
		
	
		removeTradeMissions();
		removeCombatMissions();
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
			case InteractionsMode.missions:
				drawCombatItems();
				break;
			default:
				break;
		}
		
	
	}
	
	private function drawTradeItems() {
		view.scrollPosition = GUI.BeginScrollView (view.getOutsideRect(itemPos.x, itemPos.y), view.scrollPosition, view.getInRect(missionNumber, itemHeight), true, true);
		
		for(var x : int = 0; x < tradeMissions.Count; x++) {
			var mission : TradeMission = tradeMissions[x];
			var cargo : Cargo = mission.getCargo();
			var price : int = cargo.getTotalPrice();
			var str : String = String.Format(CARGO, price);
			if(GUI.Button(new Rect(0, x * itemHeight, itemWidth, itemHeight), str)) {
				tradeDialogue.setMission(mission, this);
			}
			
		}
		
		GUI.EndScrollView();
	}
	
	private function drawCombatItems() {
		view.scrollPosition = GUI.BeginScrollView (view.getOutsideRect(itemPos.x, itemPos.y), view.scrollPosition, view.getInRect(missionNumber, itemHeight), true, true);
		
		for(var x : int = 0; x < combatMissions.Count; x++) {
			var mission : CombatMission = combatMissions[x];
			var price : int = mission.getLatinumReward();
			var str : String = String.Format(COMBAT, price);
			if(GUI.Button(new Rect(0, x * itemHeight, itemWidth, itemHeight), str)) {
				combatDialogue.setMission(mission, this);
			}
			
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
