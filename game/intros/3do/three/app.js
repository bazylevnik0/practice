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
	loaded   : false,
	map      : {},
	material : undefined,
	sprite   : undefined,
	build    : function () {		
			function loadMaps() {
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
			async function loadMat() {
 	 		await loadMaps()
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
			async function createSprite() {
 			await loadMat()
				earth.sprite = new THREE.Sprite( earth.material );
				earth.sprite.name = "earth"
				scene.add(earth.sprite)
				earth.loaded = true;
			}
			createSprite()
		 },
	rotate   : {
		 check  : false,
		 step   : 0,
		 start  : function () {
				earth.rotate.check = true;
				this.timer = setInterval( function() {
					earth.rotate.check == false ? clearInterval(this.timer) : false	
					earth.sprite.material.map = earth.map[""+earth.rotate.step]
					earth.rotate.step == 21 ? earth.rotate.step = 0 : earth.rotate.step++ 
				},1000/8)
		       }
		 }
}
earth.build()

//stars
var stars = {
	loaded   : false,
	map      : new THREE.TextureLoader().load( 'star.png' )  ,
	material : undefined ,
	sprite   : undefined ,
	groups   : [ new THREE.Group() , new THREE.Group() , new THREE.Group() ],
	build    : function () {
			let timer_map = setInterval( ()=> {
				if (stars.map !== undefined) {
					stars.material = new THREE.SpriteMaterial( { map: stars.map } )
					clearInterval(timer_map);
					let timer_material = setInterval( ()=> {
						if(stars.material !== undefined) {
							stars.sprite   = new THREE.Sprite( stars.material )
							clearInterval(timer_material)
							let timer_sprite = setInterval( ()=> {
								if(stars.sprite !== undefined ){
									stars.sprite.scale.x = stars.sprite.scale.y = 0.25;			
									clearInterval(timer_sprite)
									fill()
								}
							},100)
						}
					} , 100) 
				}
			},100)
			function fill() {	
				// -3 3
				// -7 7 
				let array = []; 
				let  x ,  y ,  z ,
				    rx , ry , rz , check
						     //27
				for (let i = 0 ; i < 28; i+=4) {
							    //48
					for (let j = 0; j < 60; j+=4) {
						check = Math.floor(Math.random()*2);
						if (check == 1) {
							rx = Math.random()
							ry = Math.random()
							rz = Math.random()
							x = j - 28 + rx
							y = i - 12 + ry
							let temp_a = stars.sprite.clone()
							    temp_a.position.x = x
							    temp_a.position.y = y
							    temp_a.position.z = rz * 10
							    stars.groups[0].add(temp_a)
							x *= (-1)
							y *= (-1)
							let temp_b = stars.sprite.clone()
							    temp_b.position.x = x
							    temp_b.position.y = y
							    temp_b.position.z = rz * 10 * (-1)
							    stars.groups[1].add(temp_b)
							x *= (-1)
							y *= (-1)
							let temp_c = stars.sprite.clone()
							    temp_c.position.x = x
							    temp_c.position.y = y
							    temp_c.position.z = rz * 10 * (-1)
							    stars.groups[2].add(temp_c)
						}
					}
				}
				stars.groups[0].name = "stars_a"
				stars.groups[1].name = "stars_b"
				stars.groups[2].name = "stars_c"
				stars.groups[0].position.z = -14
				stars.groups[1].position.z = -7
				stars.groups[2].position.z = 5
				scene.add(stars.groups[0],stars.groups[1],stars.groups[2])
				stars.loaded = true
			}
		 },
	move     : {
		  check : false,
		  start : function () {
				stars.move.check = true
				let timer = setInterval( function () {
					stars.move.check == false ? clearInterval(timer) : false
					stars.groups[0].position.z < 5 ? stars.groups[0].position.z += 0.5 : stars.groups[0].position.z = -14	
					stars.groups[1].position.z < 5 ? stars.groups[1].position.z += 0.5 : stars.groups[1].position.z = -14	
					stars.groups[2].position.z < 5 ? stars.groups[2].position.z += 0.5 : stars.groups[2].position.z = -14	
				},1000/12)
		        }
		 }
}

stars.build()

//show
let loaded = setInterval( function () {
	if(earth.loaded == true &&
	   stars.loaded == true    ) {		
		//
		console.log(scene)
		console.log(earth)
		console.log(stars)
		//
		earth.rotate.start()
		stars.move.start()
		clearInterval(loaded)
		show()
	}
},500)

function show() {
	console.log("start")
}

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

export { scene }
