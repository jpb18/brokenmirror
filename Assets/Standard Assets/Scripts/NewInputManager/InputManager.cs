using UnityEngine;
using System.Collections.Generic;

namespace NewInputManager
{
    public class InputManager
    {

        private Dictionary<string, Axis> axis;

        public InputManager()
        {
            axis = new Dictionary<string, Axis>();
        }
        public float GetAxisDown(string axis)
        {
            Axis a = null;
            if (!this.axis.TryGetValue(axis, out a))
            {
                Debug.LogWarning("Axis " + axis + " does not exist.");
                return 0;
            }

            return a.Down;

        }

        public float GetAxisUp(string axis)
        {
            Axis a = null;
            if (!this.axis.TryGetValue(axis, out a))
            {
                Debug.LogWarning("Axis " + axis + " does not exist.");
                return 0;
            }
            return a.Up;
        }

        public float GetAxis(string axis)
        {
            Axis a = null;
            if (!this.axis.TryGetValue(axis, out a))
            {
                Debug.LogWarning("Axis " + axis + " does not exist.");
                return 0;
            }
            return a.Press;
        }

    }

}