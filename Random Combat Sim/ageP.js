class AgeP {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = 0;
    this.acc = 0;
    this.r = 0;
    this.s = 0;
    this.al = 0.5;
    this.acc += 15;
  }

  update() {
    this.r += this.vel;
    this.vel += this.acc;
    this.acc = 0;

    this.vel *= 0.9;

    if (this.vel > 0.05)
      this.s += 0.25;
    else
      this.al -= 0.0075;
  }

  static clear() {
    for (let i = ageP.length - 1; i >= 0; i--)
      if (ageP[i]. al <= 0)
        ageP.splice(i, 1);
  }

  show() {
    this.update();
    strokeWeight(this.s);
    stroke(0, 0, 255, this.al);
    noFill();

    circle(this.pos.x, this.pos.y, this.r);
  }

}

































//ws