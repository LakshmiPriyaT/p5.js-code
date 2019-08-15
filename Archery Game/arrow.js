
class Arrow {
	constructor(x, y, a, mag) {
		this.pos = createVector(x, y);
		this.vel = p5.Vector.fromAngle(a);
		this.acc = createVector();

		this.angle = a;

		this.vel.setMag(mag);

		this.arrowLength = 100;
		this.stopped = false;
	}

	update() {
		if(this.stopped)
			return;

		this.pos.add(this.vel);
		this.vel.add(this.acc);
		this.acc.mult(0);

		this.addForce(createVector(0, gravity));
	}

	stop() {
		this.stopped = true;
	}

	addForce(f) {
		this.acc.add(f);
	}

	show(x, y) {
		strokeWeight(1);
		push();
		translate(x, y);
		rotate(this.vel.heading());
		stroke(255);
		line(-this.arrowLength*3/4, 0, this.arrowLength/4, 0);

		//head
		line(this.arrowLength/4, 0, this.arrowLength/4 - 10, -5);
		line(this.arrowLength/4, 0, this.arrowLength/4 - 10, 5);

		fill(255);

		//fletchings
		beginShape();
		vertex(-this.arrowLength*3/4, -1);
		vertex(-this.arrowLength/2 - 2, -1);
		vertex(-this.arrowLength*3/4 - 2, -5);

		vertex(-this.arrowLength*3/4, 1);
		vertex(-this.arrowLength/2 - 2, 1);
		vertex(-this.arrowLength*3/4 - 2, 5);

		endShape();

		pop();
	}

	show() {
		strokeWeight(1);
		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		stroke(255);
		line(-this.arrowLength*3/4, 0, this.arrowLength/4, 0);

		//head
		line(this.arrowLength/4, 0, this.arrowLength/4 - 10, -5);
		line(this.arrowLength/4, 0, this.arrowLength/4 - 10, 5);

		fill(255);
		
		//fletchings
		beginShape();
		vertex(-this.arrowLength*3/4, -1);
		vertex(-this.arrowLength/2 - 2, -1);
		vertex(-this.arrowLength*3/4 - 2, -5);

		vertex(-this.arrowLength*3/4, 1);
		vertex(-this.arrowLength/2 - 2, 1);
		vertex(-this.arrowLength*3/4 - 2, 5);

		endShape();

		pop();
	}
}