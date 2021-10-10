const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");

scene.clearColor.r = 0
scene.clearColor.g = 0
scene.clearColor.b = 0


//var box = BABYLON.MeshBuilder.CreateBox("box", {})

//sounds
let sound_in = new Audio("sounds/in.mp3");
let sound_air = new Audio("sounds/air.mp3");
let sound_air_ = new Audio("sounds/air_.mp3");
let sound_shot = new Audio("sounds/shot.mp3");
document.addEventListener( "click", function() {
	    sound_in.play();
})

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

/*
const sprite_manager = new BABYLON.SpriteManager("", "star.png", 1 , {width: 300, height: 300} , scene);
const sprite         = new BABYLON.Sprite("", sprite_manager);
      sprite.position.x = 10
      sprite.position.y = 5
      sprite.position.z = 100
*/

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
								}

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


earth.build()
stars.build()
let timer = setInterval( function() {
	if(earth.loaded == true) {
		clearInterval(timer)
		earth.rotate.start()
	} else  false
},100);
