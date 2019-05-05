class Junk extends GroundEx {
  constructor(x, y, size) {
    super(x, y, size);

    this.vel = createVector(1.6, -2.8);

    this.angle = -QUARTER_PI;
  }

  static manage() {
     for (let i = junk.length - 1; i >= 0; i--)
      if (junk[i].vel.y > 0 && junk[i].pos.y > factory.pos.y + factory.dim.y / 2 + 50)
        junk.splice(i, 1);
  }

  show() {
    this.addForce(this.g);

    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
    
    fill(255);
    noStroke();

    push();
    translate(this.pos.x, this.pos.y);
    rotate(360 - this.vel.heading() + PI);
    Bird.show(0, 0);
    pop();
  }
}