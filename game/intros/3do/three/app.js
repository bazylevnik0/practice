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

var timers = []

//load
//earth
var earth = {
	loaded   : false,
	map      : [],
	material : undefined,
	sprite   : undefined,
	build    : function () {		
			function loadMaps() {
				return new Promise((resolve, reject) => {
					for (let i = 0; i < 22; i++) { earth.map[i] = new THREE.TextureLoader().load( './earth/' + i + '.png' ); }
					let timer = setInterval( function () {
						if ( earth.map[21] !== undefined ) {
							clearInterval(timer)
							resolve(true)
						} 
					} , 100 );
				})
			}
			async function loadMat() {
 	 		await loadMaps()
				return new Promise((resolve , reject) => {	
					earth.material = new THREE.SpriteMaterial( { map: earth.map[0] } ) 
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
				let array = [];
				let  x ,  y ,  z ,
				    rx , ry , rz , check
				for (let i = 0 ; i < 28; i+=4) {
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
				stars.groups[1].position.z = -9
				stars.groups[2].position.z = -4
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
					stars.groups[0].position.z < -4 ? stars.groups[0].position.z += 0.5 : stars.groups[0].position.z = -14	
					stars.groups[1].position.z < -4 ? stars.groups[1].position.z += 0.5 : stars.groups[1].position.z = -14	
					stars.groups[2].position.z < -4 ? stars.groups[2].position.z += 0.5 : stars.groups[2].position.z = -14	
				},1000/12)
		        }
		 }
}

//asteroids	
var asteroids = {
	loaded    : false,
	map       : [],
	material  : [],
	sprite    : [],
	groups   : [ new THREE.Group() , new THREE.Group() , new THREE.Group() ],
	build    : function () {
			function loadMaps() {
				return new Promise((resolve, reject) => {
					for (let i = 0 ; i < 6 ; i++) { asteroids.map.push( new THREE.TextureLoader().load( './asteroids/' + i + '.png' )); }
					let timer = setInterval( function () {
						if ( asteroids.map[5] !== undefined ) {
							clearInterval(timer)
							resolve(true)
						}
					} , 100 );
				})
			}
			async function loadMat() {
 	 		await loadMaps()
				return new Promise((resolve , reject) => {
					for (let i = 0 ; i < 6 ; i++) { asteroids.material.push( new THREE.SpriteMaterial( { map: asteroids.map[i] } )); }
					let timer = setInterval( function () {
						if (asteroids.material[5] !== undefined ) {
							clearInterval(timer)
							resolve(true)
						}
					} , 100);
				})	
			}
			async function createSprite() {
 			await loadMat()
				for( let i = 0; i < 6; i++) { asteroids.sprite.push( new THREE.Sprite( asteroids.material[i] )); }
				fill()
			}
			createSprite()
			function fill() {
				let  x ,  y ,  z , obj, scale_x , scale_y , rotate,
				    rx , ry , rz , check
				for (let i = 0 ; i < 7; i++) {
					for (let j = 0; j < 15; j+=2) {
						check = Math.floor(Math.random()*2);
						if (check == 1) {
							rx = Math.random()
							ry = Math.random()
							rz = Math.random()
							x = j - 7 + rx
							y = i - 3 + ry
							obj = Math.ceil(Math.random()*5)
							scale_x = Math.random()*2
							scale_y = Math.random()*2
							rotate = Math.random()*5
							let temp_a = asteroids.sprite[obj].clone()
							    temp_a.rotation.x = rotate
							    temp_a.position.set( x , y , rz * 10)
							    temp_a.scale.set( scale_x , scale_y , 1)
							    asteroids.groups[0].add(temp_a)
							x *= (-1)
							y *= (-1)
							scale_x = Math.random()*2
							scale_y = Math.random()*2
							obj = Math.ceil(Math.random()*5)
							rotate = Math.random()*5
							let temp_b = asteroids.sprite[obj].clone()
					   		    temp_b.rotation.x = rotate		
							    temp_b.position.set( x , y , rz * 10)
							    temp_b.scale.set( scale_x , scale_y , 1)
							    asteroids.groups[1].add(temp_b)
							x *= (-1)
							y *= (-1)
							scale_x = Math.random()*2+1
							scale_y = Math.random()*2+1
							rotate = Math.random()*2*Math.PI
							obj = Math.ceil(Math.random()*5)
							let temp_c = asteroids.sprite[obj].clone()
							    temp_c.rotation.x = rotate		
							    temp_c.position.set( x , y , rz * 10)
							    temp_c.scale.set( scale_x , scale_y , 1)
							    asteroids.groups[2].add(temp_c)
						}
					}
				}
				asteroids.groups[0].name = "asteroids_a"
				asteroids.groups[1].name = "asteroids_b"
				asteroids.groups[2].name = "asteroids_c"
				asteroids.groups[0].position.z = -14
				asteroids.groups[1].position.z = -7
				asteroids.groups[2].position.z = 5
				scene.add(asteroids.groups[0],asteroids.groups[1],asteroids.groups[2])
				asteroids.loaded = true;
			}
		 },
	refill   : function (name){
				let num
				switch(name){
					case "asteroids_a" : num = 0; break;
					case "asteroids_b" : num = 1; break;
					case "asteroids_c" : num = 2; break;
				}
				scene.children.forEach( (child) => {
					if (child.name == name) {
						child.clear()
						child =  new THREE.Group();
						child.name = name
					} 
				})
				let  x ,  y ,  z , obj, scale_x , scale_y , rotate , 
				    rx , ry , rz , check
				for (let i = 0 ; i < 7; i+=2) {
					for (let j = 0; j < 15; j+=Math.ceil(Math.random()*3)) {
						if ( j !== 7 ) {
							j !== 6
							check = Math.floor(Math.random()*2);
							if (check == 1) {
								rx = Math.random()
								ry = Math.random()
								rz = Math.random()
								x = j - 7 + rx
								y = i - 3 + ry
								obj = Math.ceil(Math.random()*5)
								scale_x = Math.random()*2+1
								scale_y = Math.random()*2+1	
								rotate = Math.random()*2*Math.PI
								let temp = asteroids.sprite[obj].clone()
								    temp.material.rotation = rotate
								    temp.position.set( x , y , rz * 5)
								    temp.show = function (local,x,y) {
									let local_x = x
									let local_y = y
									local.scale.set(x/4,y/4,1)
									local.timer = setInterval( function() {
										if ( local.scale.x < x) {
											local.scale.set( local.scale.x += 0.025 ,  local.scale.y += 0.025 , 1)
										} else clearInterval(local.timer)
										if ( local.position.z > 4 ) clearInterval(local.timer)
								 	   } ,50)
								    }
								    temp.show(temp,scale_x,scale_y);
								    asteroids.groups[num].add(temp)
							}
					       }
					}
				}
	},
	move     : {
		  check : false,
		  start : function () {
				asteroids.move.check = true
				let timer = setInterval( function () {
					asteroids.move.check == false ? clearInterval(timer) : false
					asteroids.groups.forEach( el => {
						if ( el.position.z < 5 ) {
							 el.position.z += 1 
						} else {
							 el.position.z = -14
							 asteroids.refill(el.name)
						}		
					});
				},1000/12)
		        }
		 }
}
//main stone
var   stone = {
	map      : undefined,
	material : undefined,
	sprite   : undefined,
	build    : function() {
			function createMap() {
				return new Promise((resolve ,reject) =>{
					stone.map = new THREE.TextureLoader().load( 'asteroids/main.png' );
					let timer = setInterval( ()=>{
						if(stone.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})
			}
			async function createMaterial() {
			await createMap() 
				return new Promise((resolve ,reject) => {
					stone.material = new THREE.SpriteMaterial( { map: stone.map } )
					let timer = setInterval( ()=>{
						if(stone.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})

			}
			async function createSprite() {
			await createMaterial()
				stone.sprite = new THREE.Sprite( stone.material );
				stone.sprite.scale.set( 6.25 , 3.75 , 1)
				scene.add(stone.sprite)
			}
			createSprite()
	}
}


//symbols
var symbols = {
		text	   : {
				map: undefined,
				material: undefined,
				sprite : undefined,
				build  : function () {
						
			function createMap() {
				return new Promise((resolve ,reject) =>{
					symbols.text.map = new THREE.TextureLoader().load( 'symbols/text.png' );
					let timer = setInterval( ()=>{
						if(symbols.text.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})
			}
			async function createMaterial() {
			await createMap() 
				return new Promise((resolve ,reject) => {
					symbols.text.material = new THREE.SpriteMaterial( { map: symbols.text.map } )
					let timer = setInterval( ()=>{
						if(symbols.text.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})

			}
			async function createSprite() {
			await createMaterial()
				symbols.text.sprite = new THREE.Sprite( symbols.text.material );
				symbols.text.sprite.scale.set( 15.25 , 6.75 , 1)
				scene.add(symbols.text.sprite)
			}
			createSprite()
				       }
			      },
		logo_all   : {
				map: undefined,
				material: undefined,
				sprite : undefined,
				build  : function () {
						
			function createMap() {
				return new Promise((resolve ,reject) =>{
					symbols.logo_all.map = new THREE.TextureLoader().load( 'symbols/logo_all.png' );
					let timer = setInterval( ()=>{
						if(symbols.logo_all.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})
			}
			async function createMaterial() {
			await createMap() 
				return new Promise((resolve ,reject) => {
					symbols.logo_all.material = new THREE.SpriteMaterial( { map: symbols.logo_all.map } )
					let timer = setInterval( ()=>{
						if(symbols.logo_all.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})

			}
			async function createSprite() {
			await createMaterial()
				symbols.logo_all.sprite = new THREE.Sprite( symbols.logo_all.material );
				symbols.logo_all.sprite.scale.set( 8 , 2 , 1)
				scene.add(symbols.logo_all.sprite)
			}
			createSprite()
				       }
			     },
		logo_split : {
			logo_r : new SimpleSprite("logo_r"),
			logo_e : new SimpleSprite("logo_e"),
			logo_a : new SimpleSprite("logo_a"),
			logo_l : new SimpleSprite("logo_l"),
			logo_red : new SimpleSprite("logo_red"),
			logo_green : new SimpleSprite("logo_green"),
			logo_blue : new SimpleSprite("logo_blue")
		},
		build : function() {	

symbols.text.build()	
symbols.logo_all.build()
symbols.logo_split.logo_r.build(this)
symbols.logo_split.logo_e.build(this)
symbols.logo_split.logo_a.build(this)
symbols.logo_split.logo_l.build(this)
symbols.logo_split.logo_red.build(this)
symbols.logo_split.logo_green.build(this)
symbols.logo_split.logo_blue.build(this)
		}
}


function SimpleSprite(name) {
	this.map      = undefined;
	this.material = undefined;
	this.sprite   = undefined;
	this.build    = function (obj) {
			function createMap() {
				return new Promise((resolve ,reject) =>{
					obj.map = new THREE.TextureLoader().load( 'symbols/'+name+'.png' );
					let timer = setInterval( ()=>{
						if(obj.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})
			}
			async function createMaterial() {
			await createMap() 
				return new Promise((resolve ,reject) => {
					obj.material = new THREE.SpriteMaterial( { map: obj.map } )
					let timer = setInterval( ()=>{
						if(obj.map!==undefined) {
							clearInterval(timer)
							resolve(true)
						}
					},100)
				})

			}
			async function createSprite() {
			await createMaterial()
				obj.sprite = new THREE.Sprite( obj.material );
				obj.sprite.scale.set( 8 , 2 , 1)
				scene.add(obj.sprite)
			}
			createSprite()
			}
}

/*
const sprite_logo_full = new THREE.TextureLoader().load( 'logo_4.png' );
const material_logo = new THREE.SpriteMaterial( { map: map_sprite_4 } )
var logo_sprite_1 = new THREE.Sprite( material_sprite_1 );
*/

//set
stars    .build()
asteroids.build()
stone    .build()
symbols.build()
earth    .build()

//
//show
let loaded = setInterval( function () {
	if(earth.loaded == true &&
	   stars.loaded == true && 
	   asteroids.loaded == true ) {		
		//
		console.log(scene)
		console.log(earth)
		console.log(stars)
		console.log(asteroids)
		//
		earth.rotate.start()
		stars.move.start()
		asteroids.move.start()

		//step 1

		//step 2

		//step 3
		clearInterval(loaded)
		animate()
		show()
	}
},500)

function show() {
	console.log("start")
}

//
//animate
const animate = function () {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
};

animate();
//
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

