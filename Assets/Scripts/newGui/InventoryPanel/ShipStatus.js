#pragma strict
public class ShipStatus extends Object {

	var statusRect : Rect;
	var shieldLabelRect : Rect;
	var shieldValueRect : Rect;
	var hullLabelRect : Rect;
	var hullValueRect  : Rect;
	var impulseLabelRect : Rect;
	var impulseValueRect : Rect;
	var agilityLabelRect : Rect;
	var agilityValueRect : Rect;
	var powerLabelRect : Rect;
	var powerValueRect : Rect;
	
	var phaserLabelRect : Rect;
	var phaserValueRect : Rect;
	var torp1LabelRect : Rect;
	var torp1ValueRect : Rect;
	var torp2LabelRect : Rect;
	var torp2ValueRect : Rect;
		
	var dividerRect : Rect;
	var dividerTexture : Texture2D;
		
	private var parent : InventoryPanel;
		
	function Set(parent : InventoryPanel) {
		this.parent = parent;
	}

	function draw(health : IHealtheable, move : IMovable, strenght : IStrenghteable, skin : GUISkin) {
		GUILayout.BeginArea(parent.resizeRect(statusRect));
			
			var labelStyle : GUIStyle = skin.GetStyle("StatusLabel");
			var valueStyle : GUIStyle = skin.GetStyle("StatusValue");
			
			GUI.DrawTexture(parent.resizeRect(dividerRect), dividerTexture);
			
			drawSet(shieldLabelRect, shieldValueRect, "Shields", health.getMaxShield().ToString(), labelStyle, valueStyle);
			drawSet(hullLabelRect, hullValueRect, "Hull", health.getMaxHull().ToString(), labelStyle, valueStyle);
			drawSet(impulseLabelRect, impulseValueRect, "Impulse", move.getSpeed().ToString(), labelStyle, valueStyle);
			
			GUI.Label(parent.resizeRect(hullLabelRect), "Hull", labelStyle);
			GUI.Label(parent.resizeRect(hullValueRect), health.getMaxHull().ToString(), valueStyle);
			
			GUI.Label(parent.resizeRect(impulseLabelRect), "Impulse", labelStyle);
			GUI.Label(parent.resizeRect(impulseValueRect), move.getSpeed().ToString(), valueStyle);
			
			GUI.Label(parent.resizeRect(agilityLabelRect), "Agility", labelStyle);
			GUI.Label(parent.resizeRect(agilityValueRect), move.getAgility().ToString(), valueStyle);
			
			GUI.Label(parent.resizeRect(powerLabelRect), "Power", labelStyle);
			GUI.Label(parent.resizeRect(powerValueRect), strenght.getStrenght().ToString(), valueStyle);	
						
		GUILayout.EndArea();
	}
	
	private function drawSet(labelRect : Rect, valueRect : Rect, label : String, val : String, labelStyle : GUIStyle, valueStyle : GUIStyle) {
		GUI.Label(parent.resizeRect(labelRect), label, labelStyle);
		GUI.Label(parent.resizeRect(valueRect), val, valueStyle);
	
	}


}
