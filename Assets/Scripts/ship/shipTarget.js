//this script controls the target selectin for the player;
#pragma strict

var target : GameObject;
var lastClick : float;
var clickInt : float = 0.2f;


function Start () {

}

function Update () {

	if (Input.GetAxis("Select") && Time.time >= lastClick + clickInt)
	{
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit: RaycastHit;
		
			if(Physics.Raycast(ray, hit)) //check if it hits something
			{
				if(hit.transform != target) //check if it's the first click
				{
					if(hit.transform != transform)
					{
						target = hit.transform.gameObject; //store the target
					}
				}
				else
				{
					
				}
				
			}
			else //if not, deselects
			{
				target = null; //clean selected variable
			}
			
			lastClick = Time.time;
	
	}

}