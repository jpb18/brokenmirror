using UnityEngine;
using System.Collections;

public class ChangeSceneOnFinish : MonoBehaviour
{

		public Animation animation;
		public string destinyScene;
		public float wait;

		

		// Use this for initialization
		void Start ()
		{
				if (animation == null) {
						animation = gameObject.GetComponent<Animation> ();
				}
		}
	
		// Update is called once per frame
		void Update ()
		{
				//Debug.Log (animation.isPlaying.ToString ());
				if (canTerminate ()) {
						StartCoroutine (terminate ());
				} else if (isSkiping ()) {
						skip ();
				}
		}

		private bool canTerminate ()
		{
			
				return !animation.isPlaying;

		}

		private bool isSkiping ()
		{
				return Input.GetKey (KeyCode.Escape);
		}

		private IEnumerator terminate ()
		{
				yield return new WaitForSeconds (wait);
				
				Application.LoadLevel (destinyScene);
		}

		private void skip ()
		{
				Application.LoadLevel (destinyScene);

		}
}
		

