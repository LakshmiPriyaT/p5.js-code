class Barrier {
	constructor(x1, y1, x2, y2) {
		this.a = createVector(x1, y1);
		this.b = createVector(x2, y2);
		this.size = 100;

		this.mid = p5.Vector.add(this.a, this.b).div(2);
	}

	checkIntersection() {
		this.mid = p5.Vector.add(this.a, this.b).div(2);
		for(let arrow of arrows) {

			this.x1 = arrow.pos.x;
			this.y1 = arrow.pos.y;
			this.x2 = this.x1 + arrow.arrowLength * cos(arrow.vel.heading() + PI);
			this.y2 = this.y1 + arrow.arrowLength * sin(arrow.vel.heading() + PI);
			this.x3 = this.a.x;
			this.y3 = this.a.y;
			this.x4 = this.a.x + (this.a.x - this.b.x);
			this.y4 = this.a.y + (this.a.y - this.b.y);

			let denom = (this.x1 - this.x2)*(this.y3 - this.y4)-(this.y1 - this.y2)*(this.x3 - this.x4);
			let t = ((this.x1 - this.x3)*(this.y3 - this.y4)-(this.y1 - this.y3)*(this.x3 - this.x4)) / denom;
			let u = ((this.x1 - this.x2)*(this.y1 - this.y3)-(this.y1 - this.y2)*(this.x1 - this.x3)) / denom;

			if(u >= 0 && u <= 1 && t >= 0 && t <= 1) 
				arrow.stop();
			
		}
	}

	show() {
		stroke(255);
		strokeWeight(2);
		line(this.a.x, this.a.y, this.b.x, this.b.y);

		circle(this.mid.x, this.mid.y, 3);
	}
}