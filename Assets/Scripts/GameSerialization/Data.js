#pragma strict


public class Data {

	protected function getGameObject(name : String) : GameObject {
		if(name == "null") {
			return null;
		} else {
			return Resources.Load(name) as GameObject;
		}
	}
	
	protected function getGameObjectList(names : List.<String>) : List.<GameObject> {
		var list : List.<GameObject> = new List.<GameObject>();
		
		for(var name : String in names) {
			list.Add(getGameObject(name));
		}
		
		return list;
	}

}