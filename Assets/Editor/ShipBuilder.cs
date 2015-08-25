using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;

public class ShipBuilder : Object
{


		private const string PHASER = "phaser_point";
		private const string TORPEDO_FORWARD = "forward_torpedo_point";
		private const string TORPEDO_BACKWARD = "backward_torpedo_point";
		private const string REENTRY = "reentry";
		private const string SHIELD = "Shields";
		private const string WARP = "Warp";

		// Use this for initialization
		void Start ()
		{
	
		}
	
		// Update is called once per frame
		void Update ()
		{
	
		}

		[MenuItem("BM Tools/Ship/Build")]
		private static void BuildShip ()
		{
        
				//get selected game object
				GameObject selected = Selection.activeGameObject;

				//set Ship tag
				selected.tag = "Ship";

				//and now lets add a rigidbody and set its default values
				Rigidbody rb = selected.AddComponent<Rigidbody> ();
				rb.angularDrag = 1f;
				rb.useGravity = false;
				rb.mass = 1f;

				//and finally, add all the remaining components
				selected.AddComponent<shipProperties> ();
				selected.AddComponent<shipMovement> ();
				selected.AddComponent<shipHealth> ();
				selected.AddComponent<shipTarget> ();
				selected.AddComponent<shipTriggers> ();
				selected.AddComponent<shipWeapons> ();
				selected.AddComponent<ShipAI> ();
				selected.AddComponent<shipEscapePods> ();
				selected.AddComponent<ShipFuel> ();
				selected.AddComponent<ShipCloud> ();
				selected.AddComponent<Upgrades> ();
				selected.AddComponent<ShipReactor> ();
				selected.AddComponent<CommPanel> ();
				selected.AddComponent<RadarObject> ();
				selected.AddComponent<CloakScript> ();
				selected.AddComponent<ReactorBalance> ();

		}


		[MenuItem("BM Tools/Ship/Set Defaults")]
		private static void SetDefaults ()
		{
				GameObject selected = Selection.activeGameObject;
                SetShipMovement(selected);
                SetShipHealth(selected);
                SetShipTriggers(selected);
                SetShipWeapons(selected);
                SetCommPanel(selected);
		}

		static void SetShipMovement (GameObject ship)
		{
            shipMovement move = ship.GetComponent<shipMovement>();

            foreach (Transform trans in ship.transform)
            {
                if (trans.tag == WARP)
                {
                    move.warpParticle = trans.gameObject.particleSystem;
                    break;
                }
            }
		}

        static void SetShipHealth(GameObject ship) {
            shipHealth health = ship.GetComponent<shipHealth>();

            foreach (Transform trans in ship.transform)
            {
                if (trans.tag == SHIELD)
                {
                    health.shield = trans.gameObject;
                    break;
                }
            }
            health.shieldShow.showDur = 1f;
        }

        static void SetShipTriggers(GameObject ship)
        {
            shipTriggers triggers = ship.GetComponent<shipTriggers>();
            foreach (Transform trans in ship.transform)
            {
                if (trans.tag == REENTRY)
                {
                    triggers.reentryParticles = trans.gameObject;
                    break;
                }
            }

        }

        static void SetShipWeapons(GameObject ship)
        {
            shipWeapons weapons = ship.GetComponent<shipWeapons>();
            List<Transform> weaponList = GetChildTransformWithTag(ship.transform, PHASER);

            foreach (Transform phaser in weaponList)
            {
                weapons.phaser.phaserPoint.Add(phaser.gameObject);
            }


            weaponList = GetChildTransformWithTag(ship.transform, TORPEDO_FORWARD);
            weapons.torp1.torpedoPoint = weaponList[0].gameObject;
            weaponList = GetChildTransformWithTag(ship.transform, TORPEDO_BACKWARD);
            weapons.torp2.torpedoPoint = weaponList[0].gameObject;


            //now set the phaser layers
            weapons.phaser.shieldLayerMask = LayerMask.NameToLayer("ShieldRay");
            weapons.phaser.hullLayerMask = LayerMask.NameToLayer("Default");
        }

        static void SetCommPanel(GameObject ship)
        {
            CommPanel comm = ship.GetComponent<CommPanel>();
            comm.position = new Rect(0, 0, 366, 92);
            comm.background = Resources.Load<Texture2D>("comm/comm_bg");
            comm.tradeRect = new Rect(12, 75, 100, 18);
            comm.boardRect = new Rect(120, 75, 100, 18);
            comm.commandRect = new Rect(227, 75, 19, 18);
            comm.closeRect = new Rect(340, 75, 100, 18);
            comm.nameLabelRect = new Rect(70, 8, 100, 15);
            comm.messageLabelRect = new Rect(75, 25, 293, 60);
            comm.iconRect = new Rect(12, 12, 50, 50);
            comm.skin = Resources.Load<GUISkin>("comm/HUDSkin.guiskin");

        }

		static List<Transform> GetChildTransformWithTag (Transform parent, string tag)
		{

				List<Transform> ret = new List<Transform> ();

				foreach (Transform trans in parent) {
						if (trans.tag == tag) {
								ret.Add (trans);
						}
						List<Transform> tmp = GetChildTransformWithTag (trans, tag);
						ret.AddRange (tmp);

				}


				return ret;
		}

		[MenuItem("BM Tools/Ship/Update Ships")]
		static void UpdateShips ()
		{

				List<GameObject> ships = GetAllShips ();

				foreach (GameObject ship in ships) {

						if (ship.GetComponent<shipProperties> () == null)
								ship.AddComponent<shipProperties> ();

                        if (ship.GetComponent<shipMovement>() == null)
                        {
                            ship.AddComponent<shipMovement>();
                           // SetShipMovement(ship);
                        }
						
						if (ship.GetComponent<shipHealth>() == null)
                        {
                            ship.AddComponent<shipHealth>();
                           // SetShipHealth(ship);
                        }
						
		                if(ship.GetComponent<shipTarget>() == null)
						    ship.AddComponent<shipTarget> ();

                        if (ship.GetComponent<shipTriggers>() == null)
                        {
                            ship.AddComponent<shipTriggers>();
                            //SetShipTriggers(ship);
                        }

                        if (ship.GetComponent<shipWeapons>() == null)
                        {
                            ship.AddComponent<shipWeapons>();
                           // SetShipWeapons(ship);
                        }

                        if(ship.GetComponent<ShipAI>() == null)
						    ship.AddComponent<ShipAI> ();

                        if(ship.GetComponent<shipEscapePods>() == null)
						    ship.AddComponent<shipEscapePods> ();

                        if(ship.GetComponent<ShipFuel>() == null)
						    ship.AddComponent<ShipFuel> ();
                        
                        if(ship.GetComponent<ShipCloud>() == null)
						    ship.AddComponent<ShipCloud> ();

                        if(ship.GetComponent<Upgrades>() == null)
						    ship.AddComponent<Upgrades> ();

                        if(ship.GetComponent<ShipReactor>() == null)
						    ship.AddComponent<ShipReactor> ();

                        if (ship.GetComponent<CommPanel>() == null)
                        {
                            ship.AddComponent<CommPanel>();
                           // SetCommPanel(ship);
                        }

                        if(ship.GetComponent<RadarObject>() == null)
						    ship.AddComponent<RadarObject> ();

                        if(ship.GetComponent<CloakScript>() == null)
						    ship.AddComponent<CloakScript> ();

                        if(ship.GetComponent<ReactorBalance>() == null)
						    ship.AddComponent<ReactorBalance> ();

						if(ship.GetComponent<ShipPhenomenon>() == null)
							ship.AddComponent<ShipPhenomenon>();

				}


		}

		static List<GameObject> GetAllShips ()
		{

				GameObject[] objs = Resources.FindObjectsOfTypeAll<GameObject>();
				List<GameObject> ships = new List<GameObject> ();

				foreach (GameObject obj in objs) {
						if (obj.tag == "Ship") {
								ships.Add (obj);
						}
				}

				return ships;
		}

}
