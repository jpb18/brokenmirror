using UnityEngine;
using System.Collections;

namespace NewInputManager
{

    public class MouseAxis : Axis
    {
        private MouseButton button;

        public MouseAxis(string name, string description, MouseButton button)
            : base(name, description)
        {
            this.button = button;
        }

        public override float Down
        {
            get
            {
                if (Input.GetMouseButtonDown((int)button))
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
                if (Input.GetMouseButtonUp((int)button))
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
                if (Input.GetMouseButton((int)button))
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
                return ((int)button).ToString();

            }

        }


    }

}