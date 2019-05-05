class Minion {
  constructor(x, y, target = null) {
    this.init = createVector(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.target = target;

    this.maxForce = minionSpeed;
    this.scouring = true;
  }

  update() {
    this.pos.add(this.vel);
    this.pos.y = this.init.y;
    this.vel.add(this.acc);
    this.acc.mult(0);

    if (abs(dist(this.pos.x, this.pos.y, this.target.pos.x, this.target.pos.y)) < max(this.maxForce + 1, 3)) {
      this.scouring = false;

      for (let i = birds.length - 1; i >= 0; i--)
        if (birds[i] == this.target)
          birds.splice(i, 1);
    }

    if (this.scouring) {
      this.target.recieving = true;
      this.arrive(this.target.pos);
    } else
      this.arrive(createVector(this.init.x - factory.dim.x / 2, this.init.y));

    for (let i = minions.length - 1; i >= 0; i--) {
      if (!minions[i].scouring && minions[i].pos.x < factory.pos.x + factory.dim.x - 50) {
        minions.splice(i, 1);
        factory.addStock();

        junk.push(new Junk(factory.pos.x + 12 + random(15), factory.pos.y + factory.dim.y / 2 + 50, 5));
      }
    }
  }

  addForce(f) {
    this.acc.add(f);
  }

  arrive(target, truck = false) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();

    if (d > 50)
      desired.setMag(this.maxForce);
    else if (truck)
      desired.setMag(map(d, 0, 1, 0, this.maxForce));
    else
      desired.setMag(map(d, 0, 50, 0, this.maxForce));
    let steering = p5.Vector.sub(desired, this.vel);
    this.addForce(steering);
  }

  show() {
    noStroke();
    if (this.scouring)
      fill(255, 0, 0, 127);
    else
      fill(0, 255, 0, 127);
    ellipse(this.pos.x, this.pos.y, 4, 7);

    if (!this.scouring)
      Bird.show(this.pos.x, this.pos.y - 5);
  }
}