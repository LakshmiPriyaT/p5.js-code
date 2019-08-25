
class Interactable {
	constructor(x, y, inventorySize, interactDist) {
		this.pos = createVector(x, y);
		this.dim = createVector(50, 50);
		this.inventorySize = inventorySize;
		this.itemCount = 0;
		this.interactDist = interactDist;
		this.closeEnough = false;
		this.inventoryShowing = false;
		this.xOff = 0;

		if(inventorySize == 'small')
			this.inventoryDim = createVector(3, 3);

		this.cols = 3;
		this.inventory = [];
		this.offsets = createVector(width/2 - player.truePos.x, height/2 - player.truePos.y);
		this.regen();
	}

	regen() {
		this.inventory = [];

		for(let i = 0; i < 5; i++) {
    		this.addInventory( color(random(255), random(255), random(255)) );
  }
	}

	addInventory(item) {
		if(this.itemCount >= this.inventoryDim.x * this.inventoryDim.y)
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
		if(player.truePos.x > this.pos.x)
			this.xOff =  -375;
		else
			this.xOff = 0;

		let d = dist(player.truePos.x, player.truePos.y, this.pos.x, this.pos.y);
		//line(player.truePos.x, player.truePos.y, this.pos.x, this.pos.y);
		if(d < this.interactDist)
			this.closeEnough = true;
		else {
			this.closeEnough = false;
			this.inventoryShowing = false;
		}
	}

	show() {

		push();
		noStroke();
		fill(200, 255, 255);
		rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);

		stroke(255);
		
		if(this.inventoryShowing)
			this.showInventory();
		pop();
	}

	showInventory() {
		rectMode(CORNER);
		stroke(60);
		fill(0, 0, 20);

		push();

		translate(this.pos.x + this.xOff, this.pos.y);
		rect(50, -50, 70 * (this.inventoryDim.x+1), 70 * (this.inventoryDim.x+1));

		let index = 0;
		for(let r = 0; r < this.inventoryDim.y; r++)
			for(let c = 0; c < this.inventoryDim.x; c++) {

				this.spacing = 5;
				let boxV = createVector(c * (70 + this.spacing) + 80, r * (70 + this.spacing) - 17);
				this.offsets = createVector(width/2 - player.truePos.x, height/2 - player.truePos.y);
				let boxDist = distSq(boxV.x + this.xOff + 70/2, boxV.y + 70/2, mouseX - this.pos.x - this.offsets.x, mouseY - this.pos.y - this.offsets.y);
				stroke(0, 255, 255);

				fill(127/2);
				stroke(90);
				strokeWeight(2);
				if(boxDist < sq(30))
					fill(30);
				else
					fill(127/2);
				rect(boxV.x, boxV.y, 70, 70);

				if(this.inventory[index]) {
					ellipseMode(CENTER);
					fill(this.inventory[index]);
					circle(boxV.x + 70/2, boxV.y + 70/2, 15);
					ellipseMode(CORNER);
				}

				index++;
			}
		pop();
	}

}