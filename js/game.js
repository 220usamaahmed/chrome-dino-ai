DEBUG = false;

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
	dino = new Dino();

	env.addObstical();
}

function draw() {
	background(255);

	env.update();
	env.draw();

	dino.update();
	dino.draw();

	currentObs = env.findCurrentObstical(dino);

	if (DEBUG) {
		noStroke(); fill(255, 0, 0);
		ellipse(currentObs.pos.x, currentObs.pos.y, 8, 8);

		if (env.checkCollision(dino)) {
			noStroke(); fill(255, 0, 0);
			rect(0, 0, width, 8);
		}
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW) dino.jump();
	else if (keyCode === DOWN_ARROW) dino.duck();
}

function keyReleased() {
	if (keyCode === DOWN_ARROW) dino.unduck();
}