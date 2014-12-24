using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace BmNameGenerator
{
    public class Faction
    {
        [JsonProperty]
        public String name;
        public List<String> ships;
        public List<String> stations;

        public Faction(string name)
        {
            this.name = name;
            ships = new List<String>();
            stations = new List<String>();
        }

        public void AddStation(String name)
        {
            if(!stations.Contains(name))
                stations.Add(name);
        }

        public void AddShip(String name)
        {
            if (!ships.Contains(name))
                ships.Add(name);
        }

        public void RemoveStation(String name)
        {
            if (stations.Contains(name))
                stations.Remove(name);
        }

        public void RemoveShip(String name)
        {
            if (ships.Contains(name))
                ships.Remove(name);
        }

    }
}
