//this script creates several impact points on a shield surface for the phaser beams
#pragma strict

var ImpPoint : GameObject;
var radius : float;
var amount : int = 50;
var parent : Transform;

function Start () {	
	
	var col : SphereCollider = gameObject.GetComponent(SphereCollider); 
	radius = col.radius;
	parent = transform.parent;
	
	for (var x = 0; x < amount; x++)
	{
		var Cood : Vector3 = Random.insideUnitSphere * radius;
		Cood.x = Cood.x * parent.localScale.x;
		Cood.y = Cood.y * parent.localScale.y;
		Cood.z = Cood.z * parent.localScale.z;
		Cood += transform.position;
		
		var inst : GameObject = Instantiate(ImpPoint, Cood, Random.rotation);
		inst.transform.parent = parent;
		
	
	}


}

