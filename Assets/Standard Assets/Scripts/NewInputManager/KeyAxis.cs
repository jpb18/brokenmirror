using UnityEngine;
using System.Collections.Generic;



namespace NewInputManager
{
    public class KeyAxis : Axis
    {
        private KeyCode key;

        public KeyAxis(string name, string description, KeyCode key)
            : base(name, description)
        {
            this.key = key;
        }

        public override float Down
        {
            get
            {
                if (Input.GetKeyDown(key))
                {
                    return 1;
                }
                return 0;
            }
        }

        public override float Up
        {
            get
            {
                if (Input.GetKeyUp(key))
                {
                    return 1;
                }
                return 0;
            }
        }

        public override float Press
        {
            get
            {
                if (Input.GetKey(key))
                {
                    return 1;
                }
                return 0;
            }

        }

        public override string Text
        {
            get
            {
                return key.ToString();
            }

        }

    }

}