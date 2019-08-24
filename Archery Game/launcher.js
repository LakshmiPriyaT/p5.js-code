class Launcher {
	constructor(x, y) {
		this.pos = createVector(x, y);

		this.pressPos = createVector();
		this.dragPos = createVector();

		this.maxDrawback = 250;
		this.maxForce = 50;

		this.drawBack = createVector();
		this.drawBackMag = createVector();
		this.drawBackAngle = 0;
		

		this.bPhysics = createVector(0, 0, 0);
		this.bMotion = createVector(12, 2, 43);
		this.bowTarget = 0;

		this.bowH = 100;
		this.dummyArrow = new Arrow(0, 0, 0);

		this.angleOff = 0;
	}

	updateBow() {
		smoothFollow(this.bowTarget, this.bPhysics, this.bMotion);

		doPhysics(this.bPhysics);
	}

	setBowValues() {
		this.drawBack = p5.Vector.sub(this.dragPos, this.pressPos);
		this.drawBackAngle = this.drawBack.heading() + PI + this.angleOff;
		this.drawBackMag = constrain(map(this.drawBack.mag(), 0, this.maxDrawback, 0, this.maxForce), 0, this.maxForce);
	}

	shoot() {
		this.setBowValues();
		arrows.push(new Arrow(this.pos.x, this.pos.y, this.drawBackAngle, this.drawBackMag));
	}

	showTrail() {
		this.setBowValues();
		push();
		
		let a = new Arrow(0, 0, this.drawBackAngle, this.drawBackMag);
		rotate(-this.drawBackAngle);
		noFill();
		stroke(255, 50);
		beginShape();
		while(a.pos.y <= height) {
			a.update();
			vertex(a.pos.x, a.pos.y);
		}
		endShape();
		pop();
	}

	showOptimal(b) {
		this.setBowValues();
		push();
		translate(this.pos.x, this.pos.y);

		let val = constrain(map(b.mid.x - this.pos.x, 0, width, 5, 20), 5, 20);
		let x = b.mid.x - this.pos.x;
		let y = b.mid.y - this.pos.y + val;

		stroke(255);
		strokeWeight(1);
		line(0, 0, x, y);
		let g = -gravity;
		let v =  this.maxForce;
		let theta1 = atan((v*v - sqrt( v*v*v*v - g * (g * x*x + 2*y * v*v) )) / (g*x));
		let theta2 = atan((v*v + sqrt( v*v*v*v - g * (g * x*x + 2*y * v*v) )) / (g*x));

		print(v);

		if(frameCount % 100 == 0) {
			arrows.push(new Arrow(this.pos.x, this.pos.y, theta1, v));
		}
		pop();
	}


	show() {
		strokeWeight(1);
		noStroke();
		push();
		translate(this.pos.x, this.pos.y);

		stroke(255);
		let h = this.bowH;
		noFill();

		rotate(this.drawBackAngle);

		let a1 = createVector(-this.bPhysics.x, -h/2);
		let a2 = createVector(-this.bPhysics.x, h/2);

		let c1 = createVector(0, -h/4);
		let c2 = createVector(0, h/4);
		strokeWeight(3);
		stroke(150, 250, 0);
		bezier(a1.x, a1.y, c1.x, c1.y, c2.x, c2.y, a2.x, a2.y);
		stroke(127);
		strokeWeight(1);
		line(a1.x, a1.y, a2.x, a2.y);

		if(mouseIsPressed)	{
			this.dummyArrow.pos.x = -this.bPhysics.x + this.dummyArrow.arrowLength * 0.25;
			this.dummyArrow.show();

			this.showTrail();
		}

		pop();
	}
}