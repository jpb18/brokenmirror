import System.Collections.Generic;

public class EscapePodCache extends MonoBehaviour {
	
	public static var cache : EscapePodCache;
	
	private var pods : List.<GameObject>[];
	private var general : GeneralInfo;
	
	function Start() {
		if(this.cache == null) {
			super.cache = this;
		}
		Reset();
	}
	
	function Reset() {
		general = GameObject.FindGameObjectWithTag("SaveGame").GetComponent.<GeneralInfo>();
		pods = new List.<GameObject>[general.factionInfo.Count];
		
		for(var x : int = 0; x < pods.Length; x++) {
			pods[x] = new List.<GameObject>();
		}
	
	}
	
	function AddPod(pod : GameObject) {
		var faction : int = GetPodFaction(pod);
		if(!pods[faction].Contains(pod)) {
			pods[faction].Add(pod);
		}		
		
	}
	
	function RemovePod(pod : GameObject) {
		var faction : int = GetPodFaction(pod);
		if(!pods[faction].Contains(pod)) {
			pods[faction].Add(pod);
		}
	}
	
	function GetFactionPods(faction : int) : List.<GameObject> {
		return pods[faction];	
	}
	
	function GetHostilePods(faction : int) : List.<GameObject> {
		var info : FactionInfo = general.getFactionInfo(faction);
		var hostiles : List.<int> = info.hostileFactions;
		var enemies : List.<GameObject> = new List.<GameObject>();
		
		for(var enemy : int in hostiles) {
			enemies.AddRange(pods[enemy]);	
		}
		
		return enemies;
	}
	
	function GetHostilePods(pod : GameObject) : List.<GameObject> {
		var faction : int = GetPodFaction(pod);
		return GetHostilePods(faction);
	}
	
	private function GetPodFaction(pod : GameObject) : int {
		var faction : IFactionable = pod.GetComponent(typeof(IFactionable)) as IFactionable;
		return faction.getFaction();
	}

}