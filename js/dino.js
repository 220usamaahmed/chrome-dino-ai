class Dino {

	constructor() {
		this.dims = { width: sprites.run1.width, height: sprites.run1.height };
		this.defaultY = height - Environment.groundHeight - this.dims.height;
		this.pos = { x: 64, y: this.defaultY };
		this.vel = { dx: 0, dy: 0 };
		this.acc = { ddx: 0, ddy: 0 };
		this.isDucking = false;
	}

	jump() {
		if (this.pos.y == this.defaultY) {
			this.isDucking = false;
			this.acc.ddy = -1.4;
			this.update();
		}
	}

	duck() {
		if (this.pos.y == this.defaultY) {
			this.isDucking = true;
			this.dims = { width: sprites.low1.width, height: sprites.low1.height };
			this.pos.y += 16;
		}
	}

	unduck() {
		this.isDucking = false;
		this.dims = { width: sprites.run1.width, height: sprites.run1.height };
		this.pos.y -= 16;
	}

	update() {
		this.vel.dx += this.acc.ddx;
		this.vel.dy += this.acc.ddy;

		this.pos.x += this.vel.dx;
		this.pos.y += this.vel.dy;

		if (!this.isDucking) {
			// If in the air
			if (this.pos.y < this.defaultY) {
				this.acc.ddy += 0.15;
			} else {
				this.acc.ddy = 0;
				this.vel.dy = 0;
				this.pos.y = this.defaultY;
			}
		}
	}

	draw() {
		// Jumping
		if (this.pos.y < this.defaultY)
			image(sprites.jump, this.pos.x, this.pos.y, this.dims.width, this.dims.height);

		// Ducking
		else if (this.isDucking)
			if (Math.round(frameCount / 8) % 2)
				image(sprites.low1, this.pos.x, this.pos.y, this.dims.width, this.dims.height);
			else
				image(sprites.low2, this.pos.x, this.pos.y, this.dims.width, this.dims.height);
		
		// Normal running
		else
			if (Math.round(frameCount / 8) % 2)
				image(sprites.run1, this.pos.x, this.pos.y, this.dims.width, this.dims.height);
			else
				image(sprites.run2, this.pos.x, this.pos.y, this.dims.width, this.dims.height);

		if (DEBUG) {
			stroke(0, 0, 255); strokeWeight(1); noFill();
			rect(this.pos.x, this.pos.y, this.dims.width, this.dims.height);
		}
	}

}