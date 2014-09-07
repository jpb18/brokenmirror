#pragma strict

class GuiComponent {

	var image : Texture2D;
	var position : Rect;
	var text : String;
	
	function drawImage() {
		GUI.DrawTexture(position, image);
	}
	
	function drawTextButton() : boolean {
		return GUI.Button(position, text);
	}

}