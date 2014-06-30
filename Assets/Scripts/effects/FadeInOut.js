#pragma strict
// FadeInOut
//
//--------------------------------------------------------------------
//                        Public parameters
//--------------------------------------------------------------------
 
public var fadeOutTexture : Texture2D;
public var fadeSpeed : float = 0.3f;
 
var drawDepth : float = -1000f;
 
//--------------------------------------------------------------------
//                       Private variables
//--------------------------------------------------------------------
 
var alpha : float = 1.0f; 
 
var fadeDir : float = -1f;
 
//--------------------------------------------------------------------
//                       Runtime functions
//--------------------------------------------------------------------
 
//--------------------------------------------------------------------
 
function OnGUI(){
 
	alpha += fadeDir * fadeSpeed * Time.deltaTime;	
	alpha = Mathf.Clamp01(alpha);	
 
	GUI.color.a = alpha;
 
	GUI.depth = drawDepth;
 
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), fadeOutTexture);
}
 
//--------------------------------------------------------------------
 
function fadeIn(){
	fadeDir = -1;	
}
 
//--------------------------------------------------------------------
 
function fadeOut(){
	fadeDir = 1;	
}
 
function Start(){
	alpha=1;
	fadeIn();
}

function setFadeOff() {
	alpha = 0;
}