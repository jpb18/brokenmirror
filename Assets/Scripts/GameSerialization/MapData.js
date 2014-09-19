#pragma strict
import System.Xml.Serialization;
import System.Collections.Generic;

@XmlRoot("MapData")
public class MapData {
	
	var planets : List.<PlanetData>;
	
	function MapData() {
		planets = new List.<PlanetData>();
	}
	
	function MapData(map : MapInfo) {
		this();
		for(var p : PlanetInfo in map.planets) {
			planets.Add(new PlanetData(p));
		}
		
	}

}
