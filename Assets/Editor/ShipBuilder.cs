using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;

public class ShipBuilder : Object {


    private const string PHASER = "phaser_point";
    private const string TORPEDO_FORWARD = "forward_torpedo_point";
    private const string TORPEDO_BACKWARD = "backward_torpedo_point";
    private const string REENTRY = "reentry";
    private const string SHIELD = "Shields";
    private const string WARP = "Warp";

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

    [MenuItem("BM Tools/Ship/Build")]
    private static void BuildShip() {
        
        //get selected game object
        GameObject selected = Selection.activeGameObject;

        //set Ship tag
        selected.tag = "Ship";

        //and now lets add a rigidbody and set its default values
        Rigidbody rb = selected.AddComponent<Rigidbody>();
        rb.angularDrag = 1f;
        rb.useGravity = false;
        rb.mass = 1f;

        //and finally, add all the remaining components
        selected.AddComponent<shipProperties>();
        selected.AddComponent<shipMovement>();
        selected.AddComponent<shipHealth>();// search for the shield
        selected.AddComponent<shipTarget>();
        selected.AddComponent<shipTriggers>(); //here we need to find the reentry particle system
        selected.AddComponent<shipWeapons>();//here we need to find it's firing points
        selected.AddComponent<ShipAI>();
        selected.AddComponent<shipEscapePods>();
        selected.AddComponent<ShipFuel>();
        selected.AddComponent<ShipCloud>();
        selected.AddComponent<Upgrades>();
        selected.AddComponent<ShipReactor>();
        selected.AddComponent<CommPanel>(); //here we need to set its values
        selected.AddComponent<RadarObject>();
        selected.AddComponent<CloakScript>();


    }


    [MenuItem("BM Tools/Ship/Set Defaults")]
    private static void SetDefaults()
    {
        GameObject selected = Selection.activeGameObject;


        //shipMovement

        shipMovement move = selected.GetComponent<shipMovement>();

        foreach (Transform trans in selected.transform)
        {
            if (trans.tag == WARP)
            {
                move.warpParticle = trans.gameObject.particleSystem;
                break;
            }
        }

        //ship health
        shipHealth health = selected.GetComponent<shipHealth>();

        foreach (Transform trans in selected.transform)
        {
            if (trans.tag == SHIELD)
            {
                health.shield = trans.gameObject;
                break;
            }
        }

        //also set the shield show default values
        health.shieldShow.showDur = 1f;

        //ship triggers
        shipTriggers triggers = selected.GetComponent<shipTriggers>();
        foreach (Transform trans in selected.transform)
        {
            if (trans.tag == REENTRY)
            {
                triggers.reentryParticles = trans.gameObject;
                break;
            }
        }

        //ship weapons
        shipWeapons weapons = selected.GetComponent<shipWeapons>();
        List<Transform> weaponList = GetChildTransformWithTag(selected.transform, PHASER);

        foreach (Transform phaser in weaponList)
        {
            weapons.phaser.phaserPoint.Add(phaser.gameObject);
        }


        weaponList = GetChildTransformWithTag(selected.transform, TORPEDO_FORWARD);
        weapons.torp1.torpedoPoint = weaponList[0].gameObject;
        weaponList = GetChildTransformWithTag(selected.transform, TORPEDO_BACKWARD);
        weapons.torp2.torpedoPoint = weaponList[0].gameObject;

    
        //now set the phaser layers
        weapons.phaser.shieldLayerMask = LayerMask.NameToLayer("ShieldRay");
        weapons.phaser.hullLayerMask = LayerMask.NameToLayer("Default");


        //Comm Panel
        CommPanel comm = selected.GetComponent<CommPanel>();
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


    private static List<Transform> GetChildTransformWithTag(Transform parent, string tag)
    {

        List<Transform> ret = new List<Transform>();

        foreach (Transform trans in parent)
        {
            if (trans.tag == tag)
            {
                ret.Add(trans);
            }
            List<Transform> tmp = GetChildTransformWithTag(trans, tag);
            ret.AddRange(tmp);

        }


        return ret;
    }

}
