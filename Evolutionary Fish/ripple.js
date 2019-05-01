class Ripple {
  constructor(x, y, col, speed = 3) {
    this.pos = createVector(x, y);
    this.r = 0;
    this.speed = speed;
    this.al = 15;
    this.col = col;
  }

  managePop(pop) {
    for (let i = pop.length - 1; i >= 0; i--)
      if (pop[i].al <= 0)
        pop.splice(i, 1);
  }

  show() {
    this.managePop(ripples);
    this.r += this.speed;
    this.al -= 0.3;

    fill(hue(this.col), saturation(this.col), 255, this.al);
    stroke(this.col, 255, 255, this.al * 2);
    noStroke();
    strokeWeight(1);
    circle(this.pos.x, this.pos.y, this.r);
  }
}