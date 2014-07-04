using UnityEngine;
using System.Collections;

public class LoaderButton : MonoBehaviour
{

		public Rect buttonPos;
		public string label;
		public string scene;
		public bool isLeft = true;
		public bool isTop = true;

		// Use this for initialization
		void Start ()
		{
	
		}
	
		// Update is called once per frame
		void Update ()
		{
	
		}

		void OnGUI ()
		{

				if (GUI.Button (getRect (), label)) {
						Application.LoadLevel (scene);
				}

		}

		private Rect getRect ()
		{

				Rect rect = new Rect ();

				if (isLeft) {
						rect.x = buttonPos.x;
				} else {
						rect.x = Screen.width - buttonPos.x;
				}

				if (isTop) {
						rect.y = buttonPos.y;
				} else {
						rect.y = Screen.height - buttonPos.y;
				}

				rect.width = buttonPos.width;
				rect.height = buttonPos.height;

				return rect;

		}

}
