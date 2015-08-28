


public class BorderRadarIcon extends Object {

	static var iconsSet : boolean = false;
	static var own : Texture;
	static var enemy : Texture;
	static var allied : Texture;
	static var neutral : Texture;
	
	function BorderRadarIcon() {
	
	}			
					
	public static function Set(ownIcon : Texture, enemyIcon : Texture, allyIcon : Texture, neutralIcon : Texture) {
		if(!this.iconsSet) {
			this.own = ownIcon;
			this.enemy = enemyIcon;
			this.allied = allyIcon;
			this.neutral = neutralIcon;
			this.iconsSet = true;
		}
	}
	
	public function Draw(transform : Transform, camera : Camera) {
	
	}
	
	
}