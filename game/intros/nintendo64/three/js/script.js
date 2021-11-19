import * as THREE from 'https://cdn.skypack.dev/three@0.133.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.133.0/examples/jsm/loaders/GLTFLoader.js'; 

var camera, scene, renderer;
var geometry, material, mesh;
var model, mixer , animations , actions

init();
function init() {

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 100 );
	camera.position.z = 10;
	camera.position.y = 7.5;
	camera.position.x = 0
	camera.rotation.x = -((30 *Math.PI) / 180) 

	scene = new THREE.Scene();

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
const spotLight_r = new THREE.SpotLight( 0xffffff );
spotLight_r.position.set( 10, 10, 10 );
scene.add( spotLight_r );
const spotLight_l = new THREE.SpotLight( 0xffffff );
spotLight_l.position.set( -10, 10, 10 );
scene.add( spotLight_l );

	const geometry = new THREE.PlaneGeometry( 30, 30 );
const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
plane.rotation.x = -1.4
scene.add( plane );

	const loader = new GLTFLoader();
	      loader.load( './src/scene.glb',  function ( gltf ) {

					model = gltf.scene;
					model.scale.set(0.1, 0.1, 0.1)
					scene.add( model );

					model.traverse( function ( object ) {

						if ( object.isMesh ) object.castShadow = true;

					} );

					animations = gltf.animations;

					mixer = new THREE.AnimationMixer( model );
					
					actions = {}
					animations.forEach( (el)=> {
						actions[el.name] = mixer.clipAction( el )
						actions[el.name].loop = THREE.LoopOnce
						actions[el.name].clampWhenFinished = true
					})

	
		let loading = setInterval( function() {
			if (model !== undefined &&
			    mixer !== undefined) {
				clearInterval(loading)
				
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animation );
	document.body.appendChild( renderer.domElement );

				temp()		

				
			} 
		},25)
      } );

function temp() {
		console.log(animations,actions)
		
		for( let val in actions ) { actions[val].reset().play()	}
	
	

}

}

	var clock = new THREE.Clock();

function animation( time ) {

	let mixerUpdateDelta = clock.getDelta();
	mixer !== undefined ? mixer.update( mixerUpdateDelta ) : false


	renderer.render( scene, camera );

}
