using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using BmNameGenerator;


namespace Assets.Standard_Assets.Scripts.NameLoader
{
    public static class Serializer
    {

        public static Namer Deserialize(String path)
        {

            StreamReader reader = new StreamReader(path);

            string json = reader.ReadToEnd();

            Namer namer = JsonConvert.DeserializeObject<Namer>(json);

            return namer;
        }

    }
}
