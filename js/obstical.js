class Obstical {

	constructor(_width, _height, _altitude, _sprites) {
		this.dims = { width: _width, height: _height };
		this.pos = { x: width, y: height - Environment.groundHeight - this.dims.height - _altitude };
		this.sprites = _sprites;
	}

	update() {
		this.pos.x += Environment.envSlide;
	}

	draw () {
		image(this.sprites[Math.round(frameCount / 12) % this.sprites.length], this.pos.x, this.pos.y, this.dims.width, this.dims.height);

		if (DEBUG) {
			stroke(255, 0, 0); strokeWeight(1); noFill();
			rect(this.pos.x, this.pos.y, this.dims.width, this.dims.height);
		}
	}

	isOffScreen() {
		return this.pos.x + this.dims.width < 0;
	}

	checkCollision(dino) {
		let tx = dino.pos.x;
		let ty = dino.pos.y;
		let lx = tx + dino.dims.width;
		let ly = ty + dino.dims.height;

		let collisionX = false;
		let collicionY = false;

		if (tx >= this.pos.x && tx <= this.pos.x + this.dims.width)
			collisionX = true;
		else if (lx >= this.pos.x && lx <= this.pos.x + this.dims.width)
			collisionX = true;

		if (ty >= this.pos.y && ty <= this.pos.y + this.dims.height)
			collicionY = true;
		else if (ly >= this.pos.y && ly <= this.pos.y + this.dims.height)
			collicionY = true;

		return collisionX && collicionY;
	}
	
}