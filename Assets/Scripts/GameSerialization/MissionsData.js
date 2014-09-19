#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;


@XmlRoot("MissionsData")
public class MissionsData {
	
		var trade : List.<TradeMissionData>;
		var combat : List.<CombatMissionData>;
		
		var tradeMissionsCompleted : int;
		var tradeMissionsAccepted : int;
		
		var combatMissionsCompleted : int;
		var combatMissionsAccepted : int;
		
		function MissionsData() {
			trade = new List.<TradeMissionData>();
			combat = new List.<CombatMissionData>();
		}
				
		function MissionsData(missions : Missions) {
			this();
			for(var t : TradeMission in missions.tradeMissions) {
				trade.Add(new TradeMissionData(t));
			}
			for(var c : CombatMission in missions.combatMissions) {
				combat.Add(new CombatMissionData(c));
			}
			
			tradeMissionsAccepted = missions.tradeMissionsAccepted;
			tradeMissionsCompleted = missions.tradeMissionsCompleted;
	
			combatMissionsAccepted = missions.combatMissionsAccepted;
			combatMissionsCompleted = missions.combatMissionsCompleted;
			
		}
		
		function getTradeMissions() : List.<TradeMission> {
			var list : List.<TradeMission> = new List.<TradeMission>();
			
			for(var t : TradeMissionData in trade) {
				list.Add(t.getMission());
			}
			
			return list;
		}
		
		function getCombatMissions() : List.<CombatMission> {
			var list : List.<CombatMission> = new List.<CombatMission>();
			
			for(var c : CombatMissionData in combat) {
				list.Add(c.getMission());
			}
			
			return list;
		}	

}
