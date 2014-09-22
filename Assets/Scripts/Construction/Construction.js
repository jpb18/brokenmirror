#pragma strict

public class Construction implements IConstructable, IClasseable {

	var startDate : int;
	var name : String;
	var faction : int;
	var position : Vector3;
	var prefab : GameObject;
	var end : boolean;
	
	function Construction() {
		startDate = 0;
		name = "";
		faction = -1;
		prefab = null;
		position = new Vector3();
	}
	
	function Construction(startDate : int, name : String, faction : int, position : Vector3, prefab : GameObject) {
		this.startDate = startDate;
		this.name = name;
		this.faction = faction;
		this.prefab  = prefab;
		this.position = position;
	}
	
	function hasFinished(date : int) : boolean {
		var duration : int = getConstructionDuration();
		return startDate + duration < date;
	}
	
	//pre: hasFinished(date : int)
	function finish() : SaveStation {
		end = true;
		return new SaveStation(prefab, name, faction, position);
	}
	
	function getFinishDate() : int {
		return getConstructionDuration() + startDate;
	}
	
	function getClass() : String {
		var cls : IClasseable = prefab.GetComponent(typeof(IClasseable)) as IClasseable;
		return cls.getClass();
	}
	
	private function getConstructionDuration() : int {
		
		var build : IBuildable = prefab.GetComponent(typeof(IBuildable)) as IBuildable;
		return build.getDuration();
	
	}


}