#pragma strict

public class ActivateWormhole extends MonoBehaviour implements ShowPhenomenon {

	var on : boolean;
	var particles : ParticleSystem;
	var lensFlare : Light;

	function Activate() {
		if(!on) {
			if(!particles.isPlaying) {
				particles.Play();
			}
			lensFlare.enabled = true;			
		}
	}
	
	function Deactivate() {
		if(on) {
			if(particles.isPlaying) {
				particles.Stop();
			}
			lensFlare.enabled = false;
		}
	}


}