class Shark extends Fish { //oppurtunity
  constructor(x, y, size, col) {
    super(x, y, size, col);
    this.pred = true;

    this.maxForce = 1.7;
    this.maxSpeed = 7;
    this.slowingRadius = 10;
    this.eatDistance = this.width / 2;
  }

  static managePopulation() {
    while (sharks.length != sharkCount)
      if (sharks.length <= sharkCount) {
        if (random() > 0.5)
          sharks.push(new Shark(-25, random(height), 20, color(255)));
        else
          sharks.push(new Shark(width + 25, random(height), 20, color(255)));
      } else
        sharks.pop();
  }

  static applyAllForces() {
    for (let i = 0; i < sharks.length; i++) {
      let s = sharks[i];
      s.forage(fish);
      s.avoidOthers(sharks);
      s.avoidOthers(hermits);
      s.update();
      s.show();
    }
  }

  show() {
    fill(127);
    strokeWeight(2);

    if (faster || optimized)
      stroke(0, 0, 255, 255);
    else
      stroke(0, 0, 255, 150);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    ellipse(0, 0, this.width, this.height);
    pop();
  }
}