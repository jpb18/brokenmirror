#pragma strict

public class BuildPanel extends FloatingWindow {

	var listArea : Rect;
	var itemPos : Vector2;
	var itemHeight : int;
	var itemWidth : int;
	var view : ViewProps;
	
	var panelArea : Rect;
	var textureArea : Rect;
	var classArea : Rect;
	var nameLabel : Rect;
	var nameAreaRect : Rect;
	private var stationName : String;
	var selfBuild : Rect;
	var offerBuild : Rect;
	
	private var selected : GameObject;
	private var inventory : Inventory;
	private var message : ShowMessage;
	private var map : MapInfo;
	private var stardate : Stardate;
	private var save : SaveGame;
	
	private var lastPress : float;
	public static final var TIME : int = 0.1f;

	function Start () {
		initBuild();
	}

	function initBuild() {
		super.initFloat();
		inventory = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Inventory);
		message = GameObject.FindGameObjectWithTag("ShowMessage").GetComponent(ShowMessage);
		map = GameObject.FindGameObjectWithTag("MapInfo").GetComponent(MapInfo);
		stardate = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(Stardate);
		save = GameObject.FindGameObjectWithTag("SaveGame").GetComponent(SaveGame);
		stationName = "";
		lastPress = 0;
	}
	
	function Update() {
	
		if(Input.GetAxis("Build") && Time.time > lastPress + TIME) {
			lastPress = Time.time;
			super.toggle();
		}
		
	}

	function window() {
		GUILayout.BeginArea(new Rect(0,0, super.position.width, super.position.height));
		
			drawList();
			drawPanel();
			drag();
		GUILayout.EndArea();
	}

	private function drawList() {
		GUILayout.BeginArea(listArea);
			var list : List.<GameObject> = inventory.plans;
			var size : int = 20;
			if(size < list.Count) {
				size = list.Count;
			}
			
			
			view.scrollPosition = GUI.BeginScrollView (view.getOutsideRect(itemPos.x, itemPos.y), view.scrollPosition, view.getInRect(size, itemHeight), true, true);
				
			for(var x : int = 0; x < list.Count; x++) {
				drawScrollButton(x, list[x]);
							
			}
				
			GUI.EndScrollView();
		GUILayout.EndArea();
		
	}

	private function drawScrollButton(num : int, plan : GameObject) {
		var text : Texture = getTexture(plan);
		var name : String = getClass(plan);
		var content : GUIContent = new GUIContent(name, text);
		var rect : Rect = getItemRect(num);
		if(GUI.Button(rect, content)) {
			selected = plan;
		}
			
	}

	private function getItemRect(num : int) : Rect {
		var n : int = num + 1;
		var rect : Rect = new Rect(itemPos.x, itemPos.y + (itemHeight * n), itemWidth, itemHeight);
		return rect;
	}

	private function getTexture(plan : GameObject) : Texture {
		var textureable : ITextureable = plan.GetComponent(typeof(ITextureable)) as ITextureable;
		return textureable.getStoreImage();
	}

	private function getClass(plan : GameObject) : String {
		var classeable : IClasseable = plan.GetComponent(typeof(IClasseable)) as IClasseable;
		return classeable.getClass();
	}
	
	private function getCost(plan : GameObject) : int {
		var build : IBuildable = plan.GetComponent(typeof(IBuildable)) as IBuildable;
		return build.getRawMaterialCost();
	}
	
	private function drawPanel() {
		if(selected) {
			GUILayout.BeginArea(panelArea);
				GUI.DrawTexture(textureArea, getTexture(selected));
				GUI.Label(classArea, getClass(selected));
				GUI.Label(nameLabel, "Name: ");
				stationName = GUI.TextField(nameAreaRect, stationName);
				
				if(GUI.Button(selfBuild, "Build")) {
					orderBuild(selected, getPlayerCoordinates(), 0);
					super.setOff();
				}
				
				if(GUI.Button(offerBuild, "Offer")) {
					var planet : PlanetInfo = map.getPlanetInCurrentScene();
					orderBuild(selected, getPlayerCoordinates(), planet.faction);
					planet.addReputation(getReputationBonus(selected));
					super.setOff();
				}
				
			
			GUILayout.EndArea();
		}
	}
	
	private function orderBuild(plan : GameObject, coordinates : Vector3, faction : int) {
		var construction : Construction = new Construction(stardate.stardate, stationName, faction, coordinates, plan);
		map.setConstruction(construction);
	}
	
	private function getPlayerCoordinates() : Vector3 {
		var player : GameObject = save.getPlayerShip();
		return player.transform.position;
	}
	
	
	private function getReputationBonus(plan : GameObject) : int {
		var rep : IReputable = plan.GetComponent(typeof(IReputable)) as IReputable;
		return rep.getReputationBonus();
	}
	
	
	

}