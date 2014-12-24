using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BmNameGenerator
{
    public class Namer
    {

        public List<Faction> factions;

        public Namer()
        {
            factions = new List<Faction>();
        }

        public Namer(List<String> factions) : this()
        {
            foreach (String faction in factions)
            {
                this.factions.Add(new Faction(faction));
            }

        }

        public void AddFaction(String name)
        {
            factions.Add(new Faction(name));
        }

        public Faction GetFaction(String name)
        {
            foreach (Faction faction in factions)
            {
                if (faction.name.Equals(name))
                {
                    return faction;
                }
            }

            return null;

        }

        public void RemoveFaction(String name)
        {
            Faction faction = GetFaction(name);
            factions.Remove(faction);
        }

    }
}
