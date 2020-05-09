class DinoBrain {

	constructor (parentBrain=null) {
		this.inputSize = 6;
		this.hiddenLayer1Size = 6;
		this.hiddenLayer2Size = 3;
		this.outputSize = 3;
		this.mutationFactor = 0.2;

		if (parentBrain != null) this.createBrainFromParent(parentBrain);
		else this.createBrainFromScratch();
	}

	createBrainFromScratch() {
		this.W_I_H0 = tf.randomUniform([this.hiddenLayer1Size, this.inputSize], -1, 1);
		this.B_I_H0 = tf.randomUniform([this.hiddenLayer1Size, 1], -1, 1);

		this.W_H0_H1 = tf.randomUniform([this.hiddenLayer2Size, this.hiddenLayer1Size], -1, 1);
		this.B_H0_H1 = tf.randomUniform([this.hiddenLayer2Size, 1], -1, 1);

		this.W_H1_Y = tf.randomUniform([this.outputSize, this.hiddenLayer2Size], -1, 1);
	}

	createBrainFromParent(parentBrain) {
		this.W_I_H0 = tf.add(parentBrain.W_I_H0, tf.mul(tf.randomNormal(parentBrain.W_I_H0.shape), this.mutationFactor));
		this.B_I_H0 = tf.add(parentBrain.B_I_H0, tf.mul(tf.randomNormal(parentBrain.B_I_H0.shape), this.mutationFactor));

		this.W_H0_H1 = tf.add(parentBrain.W_H0_H1, tf.mul(tf.randomNormal(parentBrain.W_H0_H1.shape), this.mutationFactor));
		this.B_H0_H1 = tf.add(parentBrain.B_H0_H1, tf.mul(tf.randomNormal(parentBrain.B_H0_H1.shape), this.mutationFactor));

		this.W_H1_Y = tf.add(parentBrain.W_H1_Y, tf.mul(tf.randomNormal(parentBrain.W_H1_Y.shape), this.mutationFactor));
	}

	pickAction(input) {
		const I = tf.tensor(input).reshape([this.inputSize, 1]);
		const H0 = tf.add(tf.matMul(this.W_I_H0, I), this.B_I_H0).sigmoid();
		const H1 = tf.add(tf.matMul(this.W_H0_H1, H0), this.B_H0_H1).sigmoid();
		const Y = tf.matMul(this.W_H1_Y, H1).reshape([1, this.outputSize]).softmax();
		return Y.argMax(1).dataSync()[0];
	}

}


class Dino {

	constructor() {
		this.dims = { width: sprites.run1.width, height: sprites.run1.height };
		this.defaultY = height - Environment.groundHeight - this.dims.height;
		this.pos = { x: 64, y: this.defaultY };
		this.vel = { dx: 0, dy: 0 };
		this.acc = { ddx: 0, ddy: 0 };
		this.isDucking = false;
		this.brain = new DinoBrain();
		this.age = 0;
		this.alive = true;
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

		this.age += 1;

		if (!this.isDucking) {
			if (this.pos.y < this.defaultY) { // If in the air
				this.acc.ddy += 0.15;
			} else {
				this.acc.ddy = 0;
				this.vel.dy = 0;
				this.pos.y = this.defaultY;
			}
		}
	}

	takeAction(externalObservations) {
		let action = this.brain.pickAction(externalObservations.concat([
			this.pos.y,
			// this.vel.dy,
			// this.acc.ddy
		]));
		if (action == 0) this.duck();
		else if (action == 1) this.jump();
	}

	die() {
		this.alive = false;
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