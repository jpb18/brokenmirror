using UnityEngine;
using System.Collections;

public class MenuButton : MonoBehaviour
{
		public Camera mainCam;
		public bool startGame;
		public Texture2D image;
		public bool showSplash;


		// Update is called once per frame
		void Update ()
		{
				if (Input.GetKey (KeyCode.Mouse0)) {
						Ray ray = mainCam.ScreenPointToRay (Input.mousePosition);
						RaycastHit hit = new RaycastHit ();
						LayerMask layer = LayerMask.NameToLayer ("MenuText");
						if (Physics.Raycast (ray, out hit, 1000.0f, ~layer.value)) {
								GameObject hitGo = hit.transform.gameObject;
								if (hitGo.tag == "resume") {
										showSplash = true;
								}
						}
				}
		}
		void FixedUpdate ()
		{
				if (startGame) {
						Application.LoadLevel ("Start");
				}
		}
		void OnGUI ()
		{
				if (showSplash) {
						GUI.DrawTexture (new Rect (0, 0, Screen.width, Screen.height), image);
						startGame = true;
				}
		}
}

