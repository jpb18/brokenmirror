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

        public void CreateAxis(string name, string description, KeyCode key)
        {
            if (this.axis.ContainsKey(name))
            {
                Debug.LogWarning("Axis named " + name + " already exists.");
                return;
            }

            Axis axis = new KeyAxis(name, description, key);

            this.axis.Add(name, axis);


        }

        public void CreateAxis(string name, string description, MouseButton button)
        {
            if (this.axis.ContainsKey(name))
            {
                Debug.LogWarning("Axis named " + name + " already exists.");
                return;
            }

            Axis axis = new MouseAxis(name, description, button);
            this.axis.Add(name, axis);

        }

        public void CreateAxis(string name, string description)
        {
            if (this.axis.ContainsKey(name))
            {
                Debug.LogWarning("Axis named " + name + " already exists.");
                return;
            }

            Axis axis = new ScrollAxis(name, description);
            this.axis.Add(name, axis);

        }
        /// <summary>
        /// This edits the axis to be a KeyCode axis
        /// </summary>
        /// <param name="name">name of the axis</param>
        /// <param name="key">keycode for the axis</param>
        public void EditAxis(string name, KeyCode key)
        {
            Axis axis = null;
            if (this.axis.TryGetValue(name, out axis))
            {
                Axis newAxis = new KeyAxis(name, axis.Description, key);
                this.axis[name] = newAxis;
            }
            else
            {
                Debug.LogWarning("There's no axis named " + name + ".");
            }

            

        }

        /// <summary>
        /// This edits the axis to be a mouse button axis
        /// </summary>
        /// <param name="name">name of the axis</param>
        /// <param name="button">keycode for the axis</param>
        public void EditAxis(string name, MouseButton button)
        {
            Axis axis = null;
            if (this.axis.TryGetValue(name, out axis))
            {
                Axis newAxis = new MouseAxis(name, axis.Description, button);
                this.axis[name] = newAxis;
            }
            else
            {
                Debug.LogWarning("There's no axis named " + name + ".");
            }
        }

        /// <summary>
        /// This edits the axis to be a scrollwheel axis
        /// </summary>
        /// <param name="name">name of the axis</param>
        public void EditAxis(string name)
        {
            Axis axis = null;
            if (this.axis.TryGetValue(name, out axis))
            {
                Axis newAxis = new ScrollAxis(name, axis.Description);
                this.axis[name] = newAxis;
            }
            else
            {
                Debug.LogWarning("There's no axis named " + name + ".");
            }
        }

        public void RemoveAxis(string name)
        {
            if (!this.axis.Remove(name))
            {
                Debug.LogWarning("There's no axis named " + name + ".");
            }
        } 

        public Dictionary<string, Axis>.Enumerator Enumerator
        {
            get
            {
                return axis.GetEnumerator();
            }
        }

    }

}