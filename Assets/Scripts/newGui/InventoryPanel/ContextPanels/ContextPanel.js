#pragma strict


public class ContextPanel extends Object {

	protected var on : boolean;
	protected var rect : Rect;
	protected var itemCount : int;
	
	private var open : float;
	private static final var TIME : float = 0.2f;
	
	protected var skin : GUISkin;
	
	function ContextPanel() {
		this.on = false;
		this.rect = new Rect();
		this.itemCount = 0;
		this.skin = null;
		this.open = 0;
	}
	
	function ContextPanel(rect : Rect, itemCount : int, skin : GUISkin, open : float) {
		this.on = false;
		this.rect = rect;
		this.itemCount = itemCount;
		this.skin = skin;
		this.open = open;
	}
	
	function Open() {
		this.on = true;
	}
	
	function IsOpen() {
		return this.on;
	}
	
	function Close() {
		this.on = false;
	}

	function Draw(){
		Debug.LogWarning("Function not implemented!");
	}
	
	function TimeElapsed() : boolean {
		return Time.time > open + TIME;
	}
	
	protected function CheckOutsideClosure() {
		if(!TimeElapsed()) return;		
			
		
		var e : Event = Event.current;
		var mouseClick : boolean = 	Input.GetMouseButtonDown(0) || Input.GetMouseButtonDown(1);	
		var contains : boolean = !rect.Contains(e.mousePosition);						
		if(mouseClick && contains) {
			Close();
		}
	}
	
	protected function GetRect() : Rect {
		return rect;
	}
	
} 
