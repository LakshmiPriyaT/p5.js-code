
class Player {
	constructor(x, y) {
		this.targetSpeed = 3;
		this.maxSpeed = 4;
		this.slowingRadius = 25;
		this.maxForce = 1;
		this.pos = createVector(x, y);
		this.vel = createVector();
		this.acc = createVector();

		this.truePos = createVector(width/2 - this.pos.x, height/2 - this.pos.y);

		this.inventory = [];
		this.inventorySize = 10;
		this.itemCount = 0;
	}

	addForce(f) {
		this.acc.add(f);
	}

	addInventory(item) {
		if(this.itemCount >= this.inventorySize)
			return;

		this.inventory.push(item);
		this.itemCount++;
	}

	removeInventory(item) {
		for(let i = this.inventory.length - 1; i >= 0; i--)
			if(this.inventory[i] == item) {
				this.inventory.splice(i, 1);
				this.itemCount--;
				return;
			}
	}

	update() {
		doPhysics2D(this);
		seek(this, targetPos);

		this.truePos = createVector(width/2 - this.pos.x, height/2 - this.pos.y);
	}

	show() {
		rectMode(CENTER);
		fill(255);
		noStroke();
		push();
		translate(this.truePos.x, this.truePos.y);
		rotate(this.vel.heading());
		rect(0, 0, 25, 25);
		pop();
	}

	showInventory() {
		rectMode(CENTER);

		push();
		translate(this.truePos.x, this.truePos.y);
		fill(20);
		stroke(50);
		rect(0, height * 0.4, width - width / (this.inventorySize * 1.5), 150);
		let index = 0;

		for(let i = -width/2 + width / (this.inventorySize+1); i < width/2 - 1; i += width / (this.inventorySize+1)) {
			fill(127/2);
			stroke(90);
			strokeWeight(2);
			rect(i, height * 0.4, 75, 75);

			if(index < this.itemCount) {
				fill(this.inventory[index]);
				circle(i, height*0.4, 25);
				index++;
			}
		}
		strokeWeight(1);

		pop();
	}
} 