using UnityEngine;
using System.Collections;

public class ChangeSceneOnPress : MonoBehaviour
{

		public KeyCode key;
		public string scene;

		
	
		// Update is called once per frame
		void Update ()
		{
				if (Input.GetKey (key)) {
						Application.LoadLevel (scene);
				}
		}
}
