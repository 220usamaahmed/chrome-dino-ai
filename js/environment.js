class Environment {

	static groundHeight = 8;
	static envSlide = -8;
	
	constructor() {
		this.obsTypes = [
			// Cacti
			{ width: sprites.cactus1.width, height: sprites.cactus1.height, altitude: 0, sprites: [sprites.cactus1] },
			{ width: sprites.cactus2.width, height: sprites.cactus2.height, altitude: 0, sprites: [sprites.cactus2] },
			{ width: sprites.cactus3.width, height: sprites.cactus3.height, altitude: 0, sprites: [sprites.cactus3] },
			{ width: sprites.cactus4.width, height: sprites.cactus4.height, altitude: 0, sprites: [sprites.cactus4] },
			{ width: sprites.cactus5.width, height: sprites.cactus5.height, altitude: 0, sprites: [sprites.cactus5] },

			// Birds
			// { width: sprites.enemy1.width, height: sprites.enemy1.height, altitude: 16, sprites: [sprites.enemy1, sprites.enemy2] },
			// { width: sprites.enemy1.width, height: sprites.enemy1.height, altitude: 42, sprites: [sprites.enemy1, sprites.enemy2] },
		];
		this.newObsEvery = 48;
		this.obsticals = [];
		this.slideAmount = 0;

		this.addObstical();
	}

	update() {
		if (this.slideAmount % (this.newObsEvery * Environment.envSlide) == 0)
			this.addObstical();

		if (this.obsticals.length && this.obsticals[0].isOffScreen())
			this.obsticals.shift();

		this.drawObsticals();

		this.slideAmount += Environment.envSlide;
	}

	addObstical() {
		let newObsType = this.obsTypes[Math.floor(Math.random() * this.obsTypes.length)];
		let newObs = new Obstical(newObsType.width, newObsType.height, newObsType.altitude, newObsType.sprites);
		this.obsticals.push(newObs);
	}

	drawObsticals() {
		for (let i = 0; i < this.obsticals.length; i++) {
			this.obsticals[i].update();
			this.obsticals[i].draw();
		}
	}

	draw() {
		this.drawGround();
	}

	drawGround() {
		let offset = this.slideAmount % sprites.floor.width;
		image(sprites.floor, offset, height - Environment.groundHeight - 16);
		if (offset + sprites.floor.width < width)
			image(sprites.floor, offset + sprites.floor.width, height - Environment.groundHeight - 16);
	}

	findCurrentObstical(dino) {
		for (let i = 0; i < this.obsticals.length; i++) {	
			let obs = this.obsticals[i];
			if (obs.pos.x + obs.dims.width < dino.pos.x) continue;
			return obs;
		}
	}

	checkCollision(dino) {
		let currentObs = this.findCurrentObstical(dino);
		return currentObs.checkCollision(dino);
	}

	reset() {
		this.obsticals = [];
		this.slideAmount = 0;
	}
	
}