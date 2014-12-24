using UnityEngine;
using System.Collections;

namespace NewInputManager
{
    public abstract class Axis
    {

        private string name;
        private string description;

        /// <summary>
        /// Constructor for the base class
        /// </summary>
        /// <param name="name">Name of the axis</param>
        public Axis(string name, string description)
        {
            this.name = name;
            this.description = description;
        }

        /// <summary>
        /// This checks if the axis was accionated in the last frame...
        /// </summary>
        public abstract float Down { get; }

        /// <summary>
        /// This checks if the axis was released in the last frame...
        /// </summary>
        public abstract float Up { get; }

        /// <summary>
        /// This checks if the axis is being pressed...
        /// </summary>
        public abstract float Press { get; }

        /// <summary>
        /// Returns the text correspondent of the input
        /// </summary>
        public abstract string Text { get; }

        /// <summary>
        /// Returns the axis name...
        /// </summary>
        public string Name
        {
            get
            {
                return name;
            }
        }


        public string Description
        {
            get
            {
                return description;
            }
        }

    }

}