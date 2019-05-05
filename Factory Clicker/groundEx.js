class GroundEx {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1.5, 1.5), -random(1, 3));
    this.acc = createVector();

    this.size = size;
    this.angle = random(PI);
    this.g = createVector(0, 0.1);
  }

  static manage() {
    for (let i = groundEx.length - 1; i >= 0; i--)
      if (groundEx[i].pos.y > height - 25)
        groundEx.splice(i, 1);
  }

  addForce(f) {
    this.acc.add(f);
  }

  show() {
    this.addForce(this.g);

    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

    fill(50, 100, 0);
    noStroke();

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    square(0, 0, this.size);
    pop();
  }
}