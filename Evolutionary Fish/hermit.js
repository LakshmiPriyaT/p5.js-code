class Hermit extends Fish {
  constructor(x, y, size, col) {
    super(x, y, size, col);
    this.initialPos = createVector(x, y);
    this.pred = true;

    this.returning = true;
    this.radius = size;
    this.width = 10;
    this.maxForce = 12;
    this.maxSpeed = 20;
    this.slowingRadius = 5;
    this.eatDistance = this.width / 2;
    this.fleeRadius = 10;
    this.food = null;
  }

  forage(foodArr) { // Food[]
    this.food = foodArr;
    let bite = this.getClosestFood(foodArr);
    if (!bite) {
      this.comeBack();
      return;
    }
    this.returning = false;

    let desired = p5.Vector.sub(bite.pos, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;

    if (this.anyInRadius(foodArr))
      this.slowingRadius = 5;
    else
      this.slowingRadius = 100;

    if (d < abs(this.slowingRadius))
      speed = map(d, 0, this.slowingRadius, 0, this.maxSpeed);

    desired.setMag(speed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.addForce(steer);
  }

  comeBack() {
    this.returning = true;

    let desired = p5.Vector.sub(this.initialPos, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;

    if (this.anyInRadius(this.food))
      this.slowingRadius = 5;
    else
      this.slowingRadius = 100;

    if (d < abs(this.slowingRadius))
      speed = map(d, 0, this.slowingRadius, 0, this.maxSpeed);

    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.addForce(steer);
  }

  getClosestFood(foodArr) {
    let minDistance = 100000000;
    let closestFood = null;

    for (let i = 0; i < foodArr.length; i++) {
      let dMe = relativeDist(this.pos.x, this.pos.y, foodArr[i].pos.x, foodArr[i].pos.y);
      let dInit = relativeDist(this.initialPos.x, this.initialPos.y, foodArr[i].pos.x, foodArr[i].pos.y);

      if (abs(dMe) < sq(this.eatDistance) && abs(dInit) < sq(this.radius)) {
        if (this.pred && !faster && frameRate() > 15)
          for (let j = 0; j < this.deathPCount; j++)
            deathParticles.push(new DeathParticle(this.pos.x, this.pos.y, foodArr[i].width / 3, foodArr[i].col));

        this.lifeSpan = this.lifeSpan <= 100 ? this.lifeSpan + foodArr[i].value : 100;
        foodArr.splice(i, 1);
        minDistance = 100000000;
        closestFood = null;
        i = 0;
      } else if (abs(dMe) < minDistance && abs(dInit) < sq(this.radius)) {
        minDistance = dMe;
        closestFood = foodArr[i];
        this.returning = false;
      }
    }

    if (closestFood == null && closestFood != this)
      this.returning = true;
    else
      this.returning = false;
    return closestFood;
  }

  anyInRadius(foodArray) {
    for (let f of foodArray) {
      let d = relativeDist(f.pos.x, f.pos.y, this.initialPos.x, this.initialPos.y);
      if (abs(d) < sq(this.radius) && f != this)
        return true;
    }
    return false;
  }

  static managePopulation() {
    while (hermits.length != hermitCount)
      if (hermits.length <= hermitCount) {
        let x = random(borderW, width - borderW),
          y = random(borderW, height - borderW);
        let s = new Hermit(x, y, 70, color(255));
        hermits.push(s);
      } else
        hermits.pop();
  }

  static applyAllForces() {
    for (let i = 0; i < hermits.length; i++) {
      let h = hermits[i];
      h.forage(fish);
      h.forage(sharks);
      h.update();
      h.show();
    }
  }

  show() {
    let d = relativeDist(this.initialPos.x, this.initialPos.y, this.pos.x, this.pos.y);
    let al = map(d, 0, this.radius * this.radius / 2, 0, 255);
    let b_al = map(d, 0, this.radius * this.radius / 4, 50, 127 / 3);
    fill(127);
    stroke(0, 0, 255, al / 2);
    strokeWeight(10);
    line(this.initialPos.x, this.initialPos.y, this.pos.x, this.pos.y);

    fill(0, 0, 255, al);
    stroke(0, 0, 255, al);
    strokeWeight(5);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    circle(0, 0, 5 / 2);
    pop();

    fill(0, 0, 255, b_al / 2);
    noStroke();
    strokeWeight(5);

    if (faster || optimized)
      circle(this.initialPos.x, this.initialPos.y, 60);
    else if (frameCount % 5 == 0)
      ripples.push(new Ripple(this.initialPos.x, this.initialPos.y, color(50, 0, 255), 2));
  }
}




















//w