//this script is used so that the player can take game screenshots without the need of a image editor software.
//Broken Mirror III

using UnityEngine;
using System.Collections;
using System.IO;

public class screenshot : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// LateUpdate is called once per frame
	void LateUpdate () {
		
		if(!Application.isWebPlayer)
		{
			if(Input.GetKeyDown (KeyCode.F11))
			{
				//create game directory
				string direc = Application.dataPath;
				
				
				if(Application.platform == RuntimePlatform.WindowsPlayer || Application.platform == RuntimePlatform.OSXPlayer)
				{
					direc = direc + "\\Screenshots\\";
				}
				else if (Application.platform == RuntimePlatform.LinuxPlayer)
				{
					direc = direc + "/Screenshots/";	
				}
				
				
				if(!System.IO.Directory.Exists(@direc))
				{
					System.IO.Directory.CreateDirectory(@direc);	
				}
				
				//count files already present
				System.IO.DirectoryInfo dir = new System.IO.DirectoryInfo(direc);
		    	int count = dir.GetFiles().Length;
				
				//extend the name
				direc = direc + "Screenshot" + count.ToString () + ".png";
				
				//save the screenshot
				Application.CaptureScreenshot (direc);
				
			}
		}
		
	}
	
	
	
}
