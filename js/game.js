DEBUG = false;

DINO_PER_GEN = 64;

function preload() {
	sprites = {
		floor: loadImage('assets/sprites/floor-1.png'),
		idle: loadImage('assets/sprites/idle.png'),
		jump: loadImage('assets/sprites/jump.png'),
		run1: loadImage('assets/sprites/run1.png'),
		run2: loadImage('assets/sprites/run2.png'),
		low1: loadImage('assets/sprites/low1.png'),
		low2: loadImage('assets/sprites/low2.png'),
		cactus1: loadImage('assets/sprites/cactus1.png'),
		cactus2: loadImage('assets/sprites/cactus2.png'),
		cactus3: loadImage('assets/sprites/cactus3.png'),
		cactus4: loadImage('assets/sprites/cactus4.png'),
		cactus5: loadImage('assets/sprites/cactus5.png'),
		enemy1: loadImage('assets/sprites/enemy1.png'),
		enemy2: loadImage('assets/sprites/enemy2.png'),
	};
}

function setup() {
	createCanvas(600, 150);
	if (DEBUG) frameRate(8);

	env = new Environment();

	dinos = [];
	for (let i = 0; i < DINO_PER_GEN; i++) dinos.push(new Dino());
}

function draw() {
	background(255);

	env.update();
	env.draw();

	handleDinos();

	// noLoop();
	if (DEBUG) debug();
}

function handleDinos() {

	let atleast1Alive = false;	
	currentObs = env.findCurrentObstical(dinos[0]);

	for (let i = 0; i < DINO_PER_GEN; i++) {
		if (dinos[i].alive) {
			atleast1Alive = true;

			dinos[i].update();
			dinos[i].draw();

			dinos[i].takeAction([
				currentObs ? currentObs.pos.x : -1,
				currentObs ? currentObs.altitude : -1,
				currentObs ? currentObs.dims.width : -1,
				currentObs ? currentObs.dims.height : -1,
				// Environment.envSlide
			]);

			if (env.checkCollision(dinos[i])) dinos[i].die();
		}
	}

	if (!atleast1Alive) startNextGen();

}

function startNextGen() {
	env.reset();

	let bestDino = dinos[0];
	for (let i = 1; i < DINO_PER_GEN; i++)
		if (dinos[i].age > bestDino.age) bestDino = dinos[i]

	console.log("Best Dino Age: " + bestDino.age);

	dinos = [];
	for (let i = 0; i < DINO_PER_GEN; i++) dinos.push(new Dino(bestDino.brain));

}

function debug() {
	currentObs = env.findCurrentObstical(dinos[0]);
	noStroke(); fill(255, 0, 0);
	ellipse(currentObs.pos.x, currentObs.pos.y, 8, 8);

	if (env.checkCollision(dinos[0])) {
		noStroke(); fill(255, 0, 0);
		rect(0, 0, width, 8);
	}
}

// function keyPressed() {
// 	if (keyCode === UP_ARROW) dino.jump();
// 	else if (keyCode === DOWN_ARROW) dino.duck();
// }

// function keyReleased() {
// 	if (keyCode === DOWN_ARROW) dino.unduck();
// }