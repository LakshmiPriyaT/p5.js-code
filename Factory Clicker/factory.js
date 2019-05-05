class Factory {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.dim = createVector(w, h);

    this.target = createVector(this.pos.x + this.dim.x - 10, this.pos.y + this.dim.y / 2);
    this.capacity = 1;
    this.stock = 0;

    this.minionCount = 1;

  }

  addStock(n = 1) {
    if (this.stock < this.capacity - 1)
      this.stock += n;
    else {
      this.stock = 0;
      displayTruck.drop();
      trucks.push(new Truck(factory.pos.x + 15, height - 70));
    }
  }

  upgradeCap(n = 5) {
    this.capacity += n;
  }

  operate() {
    for (let i = 0; i < birds.length; i++) {
      let b = birds[i];

      if (!b.recieving && b.crashing && b.vel.heading() == 0)
        minionQueue.push(new Minion(factory.pos.x + factory.dim.x - 35, factory.pos.y + factory.dim.y - 5, b));
    }

    let crashedCount = 0;
    for(let i = 0; i < birds.length; i++) {
      if(birds[i].landed == true)
        crashedCount++;
    }
    
    while (minionQueue.length > 0 && minions.length < this.minionCount && minions.length < crashedCount) {
      minions.push(minionQueue.pop());
    }
  }

  show() {
    //building
    fill(0, 0, 170);
    noStroke();
    rect(this.pos.x, this.pos.y, this.dim.x, this.dim.y);

    ellipse(this.pos.x + this.dim.x, this.pos.y + this.dim.y, 75, 75);
    fill(0);
    ellipse(this.pos.x + this.dim.x, this.pos.y + this.dim.y, 75, 50);

    let d = 10;
    fill(127);
    rect(this.pos.x + d, this.pos.y + this.dim.y / 2, this.dim.x - 2 * d, 50);

    //red cap bar
    fill(255, 0, 0);
    stroke(0, 0, 170);
    strokeWeight(2);
    let offset = this.dim.y / 14;
    rect(this.pos.x, this.pos.y - offset, this.dim.x, offset);

    //green stock bar
    fill(0, 230, 0);
    noStroke();
    let stepSize = this.dim.x / this.capacity;
    rect(this.pos.x, this.pos.y - offset + 1, stepSize * this.stock, offset - 2);

    //money
    fill(220);
    stroke(0);
    strokeWeight(2);
    textSize(24);
    //text("cap: " + this.capacity, this.pos.x + this.dim.x / 6, this.pos.y + this.dim.y / 10);
  }
}