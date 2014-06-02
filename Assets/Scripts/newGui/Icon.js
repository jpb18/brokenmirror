#pragma strict

class Icon implements IDrawable{
	//@Tooltip ("Icon image. If its null, it won't draw.")
	var image : Texture;
	//@Tooltip ("Relative icon position.")
	var pos : Rect;
	
	function draw() {
		if(image) {
			GUI.DrawTexture(pos, image);
		}
	}

}