using UnityEngine;


namespace NewInputManager
{
    public class ScrollAxis : Axis
    {

        private const string AXIS_NAME = "Mouse ScrollWheel";

        public ScrollAxis(string name, string description) : base(name, description) {}


        public override float Down
        {
            get
            {
                return Input.GetAxis(AXIS_NAME);
            }
        }

        public override float Up
        {
            get
            {
                return this.Down;
            }
        }

        public override float Press
        {
            get
            {
                return this.Down;
            }

        }

        public override string Text
        {
            get
            {
                return AXIS_NAME;
            }

        } 
        

    }
}
