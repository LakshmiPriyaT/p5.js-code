class Bird {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(1.7, 3), 0);
    this.acc = createVector();
    this.sinPos = random(TWO_PI);

    this.crashing = false;
    this.targeted = false;
    this.recieving = false;
    this.landed = false;

    this.g = 0.05;

    this.rand = floor(random(100));
    
    this.decay = 0;
    this.decayTime = 200 + this.rand;

  }

  fly() {
    let fps = frameRate();
    if (fps < 15)
      this.decayTime = 0;
    else if (fps < 30)
      this.decayTime = 20 + floor(this.rand * 0.75);
    else
      this.decayTime = 200 + this.rand;

    if (!this.crashing)
      this.vel.y = sin(this.sinPos) / 5;
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.sinPos += PI / 50;

    this.acc.mult(0);

    if (this.pos.x > width * 1.5 && !this.crashing) {
      this.pos.x = -16;

      this.pos.y = random(height / 4);
    }

    if (this.crashing) {
      this.acc.y += this.g;

      if (this.pos.y > factory.pos.y + factory.dim.y - 7) {
        this.vel.mult(0);

        this.pos.y = factory.pos.y + factory.dim.y - 7;

        if (this.landed == false)
          for (let i = 0; i < 3; i++)
            groundEx.push(new GroundEx(this.pos.x, this.pos.y + 5, 7));

        this.landed = true;
      }
    }

    if (this.landed && !this.recieving)
      this.decay++;

    for (let i = birds.length - 1; i >= 0; i--) {
      let b = birds[i];

      if (b == this && this.decay > this.decayTime || b.pos.x > width + 150) {
        for (let j = minions.length - 1; j >= 0; j--)
          if (minions[j].target == this) {
            minions.splice(j, 1);
            break;
          }

        for (let j = minionQueue.length - 1; j >= 0; j--)
          if (minionQueue[j].target == this) {
            minionQueue[j].target.recieving = false;
            minionQueue.splice(j, 1);
          }

        birds.splice(i, 1);
        return;
      }
    }
  }

  static show(x, y) {
    fill(255);
    noStroke();
    push();
    translate(x, y);
    rotate(PI);
    ellipse(0, 0, 15, 3);

    stroke(255);
    line(3, -1, -2, 3);
    line(-5, -2, -2, 0);
    pop();
  }

  show() {
    fill(255);
    noStroke();
    push();
    translate(this.pos.x, this.pos.y);
    if (this.crashing && this.vel.heading() == 0)
      rotate(PI / 2.5);
    else
      rotate(this.vel.heading());
    ellipse(0, 0, 15, 3);

    stroke(255);
    line(3, -1, -2, 3);
    line(-5, -2, -2, 0);

    if (this.crashing) {

      if (frameCount % 6 == 0)
        smoke.push(new Smoke(this.pos.x, this.pos.y, this));
      stroke(255, 0, 0);
      strokeWeight(5);
      for (let i = 0; i < 1; i++)
        line(random(-15, -12), random(-4, 4), -3, 0);

      stroke(200, 150, 0);
      for (let i = 0; i < 1; i++)
        line(random(-10, -6), random(-1, 1), -3, 0);
    }

    pop();
  }
}