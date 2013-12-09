var resumeClip : AnimationClip;
function OnMouseEnter (){
	gameObject.Find("ResGame").animation.Play("AnimResume");
}

var resumeExitClip : AnimationClip;
function OnMouseExit (){
	gameObject.Find("ResGame").animation.Play("MouseOut");
}
