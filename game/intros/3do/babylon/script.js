scene.clearColor.r = 0
scene.clearColor.g = 0
scene.clearColor.b = 0


//sounds
let sound_in = new Audio("sounds/in.mp3");
let sound_air = new Audio("sounds/air.mp3");
let sound_air_ = new Audio("sounds/air_.mp3");
let sound_shot = new Audio("sounds/shot.mp3");
document.addEventListener( "click", function() {
	    sound_in.play();
})

//earth
var earth = {
	loaded   : false,
	manager  : [],
	sprite   : [],
	build    : function () {		
			function loadManagers() {
				return new Promise((resolve, reject) => {
					for (let i = 0; i < 22; i++) { earth.manager[i] = new BABYLON.SpriteManager("", "./earth/"+i+".png", 1 , {width: 600, height: 600} , scene); };
					let timer = setInterval( function () {
						if ( earth.manager[21] !== undefined ) {
							clearInterval(timer)
							resolve(true)
						} 
					} , 100 );
				})
			}
			async function createSprites() {
 	 		await loadManagers()
				for (let i = 0; i < 22; i++) { earth.sprite[i] = new BABYLON.Sprite("earth"+[i], earth.manager[i]); }
				let timer = setInterval( function () {
					if ( earth.sprite[21] !== undefined ) {
						clearInterval(timer)
						earth.loaded = true;
					} 
				} , 100 );
			}
			createSprites()
		 },
	rotate   : {
		 check  : false,
		 step   : 0,
		 start  : function () {
				earth.rotate.check = true;
				this.timer = setInterval( function() {
					earth.rotate.check == false ? clearInterval(this.timer) : false
					earth.setSprite(earth.rotate.step)
					earth.rotate.step == 21 ? earth.rotate.step = 0 : earth.rotate.step++ 
				},1000/8)
		       }
		 },
	setSprite : function setSprite(num) {
			for (let i = 0; i < 22; i++) earth.sprite[i].isVisible = false  
			earth.sprite[num].isVisible = true
		  }
}


//stars
var stars = {
	loaded   : 0 ,
	//this is grid , 10 x n for 3 groups:
	managers : [ [[],[],[],[],[],[],[],[],[],[]] , [[],[],[],[],[],[],[],[],[],[],[]] , [[],[],[],[],[],[],[],[],[],[]] ] ,
	sprites  : [ [[],[],[],[],[],[],[],[],[],[]] , [[],[],[],[],[],[],[],[],[],[],[]] , [[],[],[],[],[],[],[],[],[],[]] ] ,
        //this array places where stars:
	checks   : [[],[],[]] ,
	build    : function (num) {
			if (num == undefined) {
				stars.build(0)
				stars.build(1)
				stars.build(2)
				setStartPosition()
				return
			}
			function setStartPosition() {
				let timer = setInterval( function() {
					if (stars.loaded == true) {
					        //move objects in different z positions , like a layers
						for (let i = 0; i < stars.checks[1].length; i++){
							stars.sprites[1][stars.checks[1][i][0]][stars.checks[1][i][1]].position.z -= 50
						}
						for (let i = 0; i < stars.checks[2].length; i++){
							stars.sprites[2][stars.checks[2][i][0]][stars.checks[2][i][1]].position.z -= 100
						}
						clearInterval(timer)
					}
				},100)
			}
			function loadManagers() {
				return new Promise((resolve, reject) => {
					for (let i = 0 ; i < 10; i++) {
						for (let j = 0; j < 50; j++) {
									stars.managers[num][i][j] = new BABYLON.SpriteManager("", "star.png", 1 , {width: 300, height: 300} , scene)
						}
					}
					let timer = setInterval( function () {
						if ( stars.managers[num][9][19] !== undefined ) {
							clearInterval(timer)
							resolve(true)
						} 
					} , 100 );
				})
			}
			async function createSprites() {
 	 		await loadManagers()
					let  x ,  y ,  z ,
					    rx , ry , rz , check
					let last = []
					//go through grid and create object, and add position to checks 
					for (let i = 0 ; i < 10; i++) {
						for (let j = 0; j < 50; j+=2) {
								check = Math.floor(Math.random()*2);
								if (check == 1) {	
									rx = Math.random()
									ry = Math.random()
									rz = Math.random()
									x = j - 25 + rx
									y = i - 5  + ry
		
									stars.sprites[num][i][j]  = new BABYLON.Sprite("", stars.managers[num][i][j]);
									stars.sprites[num][i][j].position.x = x * 1
									stars.sprites[num][i][j].position.y = y * 3
									stars.sprites[num][i][j].position.z = 60 + (rz * 120)
									stars.sprites[num][i][j].width  = 0.5
									stars.sprites[num][i][j].height  = 0.5
									stars.checks[num].push([i,j])
									last = [i,j]
								} else  stars.managers[num][i][j] = undefined

						}
					}					
					//check loading
					let timer = setInterval( function () {
						if ( stars.sprites[num][last[0]][last[1]] !== undefined ) {
							clearInterval(timer)
							if (stars.loaded == 2 ) {
							    stars.loaded = true 
							    stars.move.start()
							} else stars.loaded++
						} 
					} , 100 );
			}
			createSprites()
		   },
	move     : {
		  check : false,
		  start : function () {
				stars.move.check = true
				let timer = setInterval( function () {
					stars.move.check == false ? clearInterval(timer) : false
					//if star near then change position to far
					for (let i = 0; i < stars.checks[0].length; i++){
							if( stars.sprites[0][stars.checks[0][i][0]][stars.checks[0][i][1]].position.z < 5 ) {
                                                            stars.sprites[0][stars.checks[0][i][0]][stars.checks[0][i][1]].position.z = 100 
							} else stars.sprites[0][stars.checks[0][i][0]][stars.checks[0][i][1]].position.z -= 1
					}		
					for (let i = 0; i < stars.checks[1].length; i++){
							if( stars.sprites[1][stars.checks[1][i][0]][stars.checks[1][i][1]].position.z < 5 ) {
                                                            stars.sprites[1][stars.checks[1][i][0]][stars.checks[1][i][1]].position.z = 100 
							} else  stars.sprites[1][stars.checks[1][i][0]][stars.checks[1][i][1]].position.z -= 1
					}		
					for (let i = 0; i < stars.checks[2].length; i++){
							if( stars.sprites[2][stars.checks[2][i][0]][stars.checks[2][i][1]].position.z < 5 ) {
                                                            stars.sprites[2][stars.checks[2][i][0]][stars.checks[2][i][1]].position.z = 100 
							} else  stars.sprites[2][stars.checks[2][i][0]][stars.checks[2][i][1]].position.z -=1					}
				
				},1000/12)
		        }
		 }
}


//asteroids
var asteroids = {
	loaded   : false,
	managers : {},
	sprites  : {},
	build	 : function() {
			let last
			for (let i = 0; i < 50; i++ ) { i==49 ? last = asteroids.add() : asteroids.add()   }
			let timer = setInterval( function () {
					if ( asteroids.sprites[last] !== undefined ) {
						clearInterval(timer)
						let i = 0 
						for (let value in asteroids.sprites) {
							asteroids.sprites[value].position.z += i * 5
							if ( asteroids.sprites[value].position.x < 1  &&
							     asteroids.sprites[value].position.x > -1    ) asteroids.sprites[value].position.x *= 10
							if ( asteroids.sprites[value].position.y < 0.5  &&
							     asteroids.sprites[value].position.y > -0.5    ) asteroids.sprites[value].position.y *= 10
							i++
						}
						asteroids.loaded = true
					} 
			} , 100 );

	},
	add      : function() {			
			let num = Math.floor(Math.random()*6)
			let id  = (""+Math.random()).slice(2,)

			function loadManager() {
				return new Promise((resolve, reject) => {
					asteroids.managers[id] = new BABYLON.SpriteManager("", "./asteroids/"+num+".png", 1 , {width: 465, height: 465} , scene);
					let timer = setInterval( function () {
						if ( asteroids.managers[id] !== undefined ) {
							clearInterval(timer)
							resolve(true)
						} 
					} , 100 );
				})
			}
			async function createSprite() {
 	 		await loadManager()
				asteroids.sprites[id] = new BABYLON.Sprite("asteroid_"+id, asteroids.managers[id]);
				let  x ,  y , rx , ry , rangle , dir 
				rx     = Math.random()
				ry     = Math.random()
				rangle = Math.random() * 2
				x      = Math.random() * 14
				y      = Math.random() * 6
			
				asteroids.sprites[id].position.z = 100 + (Math.random()*50)
				dir = Math.floor(Math.random()*2); dir == 0 ? dir = (-1) : dir = 1
				asteroids.sprites[id].position.x = (x - 7) + (dir * rx)  
				dir = Math.floor(Math.random()*2); dir == 0 ? dir = (-1) : dir = 1
				asteroids.sprites[id].position.y = (y - 3) + (dir * ry)
				asteroids.sprites[id].angle = rangle * Math.PI 
				asteroids.sprites[id].width  = Math.random() + 0.5 
				asteroids.sprites[id].height = Math.random() + 0.5
				 
				let timer = setInterval( function () {
					if ( asteroids.sprites[id] !== undefined ) {
						clearInterval(timer)
					} 
				} , 100 );
			}
			createSprite()
			return id	
	},
	move     : {
		  check : false,
		  start : function () {
				asteroids.move.check = true
				let timer = setInterval( function () {
					asteroids.move.check == false ? clearInterval(timer) : false
						for (let value in asteroids.sprites) {
							if (asteroids.sprites[value].position.z < -5) {
								asteroids.sprites[value].position.z += 100
								asteroids.sprites[value].angle = Math.random() * (Math.PI*2)
							} else  asteroids.sprites[value].position.z -= 2 
						}
				},100)
		        }
		 }
}
//stone 
var stone = {
	loaded   : false     ,
	manager  : undefined ,
	sprite   : undefined ,
	build    : function() {
			function loadManager() {
				return new Promise((resolve, reject) => {
					stone.manager = new BABYLON.SpriteManager("", "./asteroids/main.png", 1 , {width: 813, height: 516} , scene);
					let timer = setInterval( function () {
						if ( stone.manager !== undefined ) {
							clearInterval(timer)
							resolve(true)
						} 
					} , 100 );
				})
			}
			async function createSprite() {
 	 		await loadManager()
				stone.sprite = new BABYLON.Sprite("stone", stone.manager);
				let timer = setInterval( function () {
					if ( stone.sprite !== undefined ) {
						stone.sprite.width  = 6
						stone.sprite.height = 4
						clearInterval(timer)
						stone.loaded = true;
					} 
				} , 100 );
			}
			createSprite()
		 }
}	

//symbols
var symbols = {
	text : {
		loaded   : false     ,
		manager  : undefined ,
		sprite   : undefined ,
		build    : function() {
			function loadManager() {
				return new Promise((resolve, reject) => {
					symbols.text.manager = new BABYLON.SpriteManager("", "./symbols/text.png", 1 , {width: 1600, height: 900} , scene);
					let timer = setInterval( function () {
						if ( symbols.text.manager !== undefined ) {
							clearInterval(timer)
							resolve(true)
						} 
					} , 100 );
				})
			}
			async function createSprite() {
 	 		await loadManager()
				symbols.text.sprite = new BABYLON.Sprite("text", symbols.text.manager);
				let timer = setInterval( function () {
					if ( symbols.text.sprite !== undefined ) {
						symbols.text.sprite.width  = 14
						symbols.text.sprite.height = 7
						clearInterval(timer)
						symbols.text.loaded = true;
					} 
				} , 100 );
			}
			createSprite()
		 }
	},
	logo : {
		loaded: 0,
		r     : new SimpleSymbolSprite("r"),
		e     : new SimpleSymbolSprite("e"),
		a     : new SimpleSymbolSprite("a"),
		l     : new SimpleSymbolSprite("l"),
		red   : new SimpleSymbolSprite("red"),
		green : new SimpleSymbolSprite("green"),
		blue  : new SimpleSymbolSprite("blue")
	},
	build : function () {
		symbols.text.build()
		symbols.logo.r.build()
		symbols.logo.e.build()
		symbols.logo.a.build()
		symbols.logo.l.build()
		symbols.logo.red.build()
		symbols.logo.green.build()
		symbols.logo.blue.build()
	}
}

function SimpleSymbolSprite(name) {
	this.name   =  name,
	this.loaded  = false,
	this.manager = undefined,
	this.sprite  = undefined,
	this.build   = function() {
			let name = this.name
			function loadManager() {
				return new Promise((resolve, reject) => {
					console.log(name.length)
					if (name.length == 1) {
					       symbols.logo[name].manager = new BABYLON.SpriteManager("", "./symbols/logo_"+name+".png", 1 , {width: 272, height: 191} , scene);
					} else symbols.logo[name].manager = new BABYLON.SpriteManager("", "./symbols/logo_"+name+".png", 1 , {width: 53, height: 53} , scene);
					let timer = setInterval( function () {
						if ( symbols.logo[name].manager !== undefined ) {
							clearInterval(timer)
							resolve(true)
						} 
					} , 100 );
				})
			}
			async function createSprite() {
 	 		await loadManager()
				symbols.logo[name].sprite = new BABYLON.Sprite("logo"+name, symbols.logo[name].manager);
				if (name.length == 1) {
 					 symbols.logo[name].sprite.width = 2
 					 symbols.logo[name].sprite.height = 2
				} else {
 				 	 symbols.logo[name].sprite.width = 0.5
 					 symbols.logo[name].sprite.height = 0.5
				}
				let timer = setInterval( function () {
					if ( symbols.logo[name].sprite !== undefined ) {
						clearInterval(timer)
						symbols.logo[name].loaded = true;
						symbols.logo.loaded += symbols.logo[name].loaded
						if (symbols.logo.loaded == 7) symbols.logo.loaded = true
					} 
				} , 100 );
			}
			createSprite()
			
	}
}
stars.build()
asteroids.build()
stone.build()
earth.build()
symbols.build()


let timer = setInterval( function() {
	if(earth.loaded == true) {
		clearInterval(timer)
		earth.rotate.start()
		asteroids.move.start()
	} else  false
},100);
