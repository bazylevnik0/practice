console.log( "app.js" );
import * as THREE         from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OBJLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/OBJLoader.js'; 
import { MTLLoader }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/MTLLoader.js'; 
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js'; 
import { RenderPass }     from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/RenderPass.js'; 
import { BloomPass }      from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/BloomPass.js'; 
import { FilmPass }       from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/postprocessing/FilmPass.js';

//import * as Tone from "https://cdn.skypack.dev/tone"

//const synth = new Tone.Synth().toDestination();
//synth.triggerAttackRelease("C4", "8n");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

//load
//earth
var earth = {
	map      : {},
	material : undefined,
	sprite   : undefined,
	rotate   : {
		check  : false,
		step   : 0,
		launch : function () {
			earth.rotate.check = true;
			this.timer = setInterval( function() {
				earth.rotate.check == false ? clearInterval(this.timer) : false	
				earth.sprite.material.map = earth.map[""+earth.rotate.step]
				earth.rotate.step == 21 ? earth.rotate.step = 0 : earth.rotate.step++ 
			},1000/8)
		}
	}
}
	//fill earth
	function fillSpriteEarthMap() {
		return new Promise((resolve, reject) => {
			for (let i = 0; i < 22; i++) { earth.map[""+i] = new THREE.TextureLoader().load( './earth/' + i + '.png' ); }
			let timer = setInterval( function () {
				if ( earth.map["21"] !== undefined ) {
					clearInterval(timer)
					resolve(true)
				} 
			} , 100 );
		})
	}
	async function fillSpriteEarthMaterial() {
 	 await fillSpriteEarthMap()
		return new Promise((resolve , reject) => {	
			earth.material = new THREE.SpriteMaterial( { map: earth.map["0"] } ) 
			let timer = setInterval( function () {
				if (earth.material !== undefined ) {
					clearInterval(timer)
					resolve(true)
				}
			} , 100);
		})
	}
	async function createSpriteEarth() {
 	 await fillSpriteEarthMaterial()
		earth.sprite = new THREE.Sprite( earth.material );
		scene.add(earth.sprite)
		earth.rotate.launch()
	}
	createSpriteEarth()


const animate = function () {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
};

animate();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
