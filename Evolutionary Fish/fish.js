class Fish {
  constructor(x, y, size, col) {
    this.lifeSpan = 100;
    this.width = size;
    this.height = size / 2;
    this.col = col;
    this.pred = false;

    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.angle = PI / 12;
    this.avoidForce = 7;
    this.maxSpeed = 25;
    this.slowingRadius = 100;
    this.maxForce = 0.1;
    this.fleeForce = this.maxForce;
    this.fleeRadius = 100;
    this.eatDistance = 0.01;
    this.deathPCount = 7;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

    this.vel.limit(this.maxSpeed);

    this.angle = this.vel.heading();
    this.fleeForce = this.maxForce;

    if (!this.pred)
      this.lifeSpan -= 1;

    if (this.isOutOfBounds()) {
      if (this.pred) //
      {
        if (random() > 0.5)
          this.pos.x = width + this.width;
        else
          this.pos.x = width + this.width;
        this.pos.y = random(height);
        this.vel = createVector();
      } else {
        this.pos.x = -this.width;
        this.pos.y = random(height);
        this.vel = createVector();
      }
    }
  }

  addForce(force) {
    this.acc.add(force);
  }

  static applyAllForces(repChance, mutChance) {
    for (let i = fish.length - 1; i >= 0; i--) {
      fish[i].forage(fd);
      fish[i].avoidOthers(fish);
      fish[i].avoidOthers(sharks);
      fish[i].avoidOthers(hermits);
      fish[i].update();
      fish[i].reproduce(fish, repChance, mutChance);
      fish[i].show();
    }
  }

  isOutOfBounds() {
    return (this.pos.x < -500 || this.pos.x > width + 500 ||
      this.pos.y < -500 || this.pos.y > height + 500);
  }

  static removeDead(pool) {
    for (let i = 0; i < pool.length; i++) {
      if (pool.length <= 1)
        fish[i].lifeSpan = 100;
      if (pool[i].lifeSpan <= 0 && pool.length >= 2) {
        pool.splice(i, 1);
        i--;
      }
    }
  }

  static averageSpeed() {
    let sum = 0.0;
    for (let el of fish)
      sum += el.maxSpeed;
    return sum / fish.length;
  }

  static averageForce() {
    let sum = 0.0;
    for (let el of fish)
      sum += el.maxForce;
    return sum / fish.length;
  }
  static averageSlowing() {
    let sum = 0.0;
    for (let el of fish)
      sum += el.slowingRadius;
    return sum / fish.length;
  }
  static averageDist() {
    let sum = 0.0;
    for (let el of fish)
      sum += el.eatDistance;
    return sum / fish.length;
  }

  reproduce(pool, repChance, mutChance) {
    if (pool.length <= 2)
      repChance = 1000;

    let mutated = false;
    if (random() < repChance) //
    {
      let newFish = new Fish(this.pos.x, this.pos.y, this.width, this.col);
      newFish.maxSpeed = this.maxSpeed;
      newFish.slowingRadius = this.slowingRadius;
      newFish.avoidForce = this.avoidForce;
      newFish.eatDistance = this.eatDistance;
      newFish.col = this.col;
      newFish.maxForce = this.maxForce;
      newFish.angle = this.angle;

      if (random() < mutChance) {
        mutated = true;
        newFish.maxSpeed += this.maxSpeed < maxSpeedCap ? random(-3, 3) : 0;
        if (newFish.maxSpeed < 0)
          newFish.maxSpeed = 0;
      }
      if (random() < mutChance) {
        mutated = true;
        newFish.slowingRadius += random(-10, 10);
        if (newFish.slowingRadius < 0)
          newFish.slowingRadius = 0;
      }
      if (random() < mutChance) {
        mutated = true;
        newFish.avoidForce += random(-1, 1);
        newFish.avoidForce = constrain(newFish.avoidForce, 1, newFish.maxForce);
      }

      if (random() < mutChance) {
        mutated = true;
        newFish.eatDistance += this.eatDistance < eatDistanceCap ? random(-1, 1) : 0;

        if (newFish.eatDistance < 0)
          newFish.eatDistance = 0;
      }

      if (random() < mutChance) {
        mutated = true;
        newFish.maxForce += this.maxForce < maxForceCap ? random(-0.5, 0.5) : 0;
        if (newFish.maxForce <= 0)
          newFish.maxForce = 0;
      }

      if (mutated) {
        let hu = hue(this.col) <= 255 ? hue(this.col) : 0;
        newFish.col = color(hu + 30, 255, 255);
      }
      pool.push(newFish);
    }
  }

  getClosestFood(foodArr) {
    let minDistance = 100000000;
    let closestFood = null;

    for (let i = 0; i < foodArr.length; i++) //
    {
      let d = relativeDist(this.pos.x, this.pos.y, foodArr[i].pos.x, foodArr[i].pos.y);

      if (abs(d) < sq(this.eatDistance)) //
      {
        if (this.pred && !faster && frameRate() > 15)
          for (let j = 0; j < this.deathPCount; j++)
            deathParticles.push(new DeathParticle(foodArr[i].pos.x, foodArr[i].pos.y, foodArr[i].width / 3, foodArr[i].col));
        else if (!faster && !optimized)
          spawnRipple(foodArr[i].pos.x, foodArr[i].pos.y, foodArr[i].col);

        this.lifeSpan = this.lifeSpan <= 100 ? this.lifeSpan + foodArr[i].value : 100;
        foodArr.splice(i, 1);
        minDistance = 100000000;
        closestFood = null;
        i = 0;
      } else if (abs(d) < minDistance) {
        minDistance = d;
        closestFood = foodArr[i];
      }
    }
    return closestFood;
  }

  avoidOthers(pool) {
    for (let fish of pool) //
    {
      let d = relativeDist(this.pos.x, this.pos.y, fish.pos.x, fish.pos.y);

      if (!fish.pred && d < sq(this.width)) {
        let desired = p5.Vector.sub(fish.pos, this.pos);
        desired.mult(-1);
        desired.setMag(this.avoidForce);
        this.addForce(desired);
      } else if (fish.pred && d < sq(this.fleeRadius)) {
        let desired = p5.Vector.sub(fish.pos, this.pos);
        desired.mult(-1);
        desired.setMag(this.fleeForce);
        this.addForce(desired);
      }
    }
  }

  forage(foodArr) {
    let bite = this.getClosestFood(foodArr);
    if (!bite)
      return;

    let desired = p5.Vector.sub(bite.pos, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;

    if (d < this.slowingRadius)
      speed = map(d, 0, this.slowingRadius, 0, this.maxSpeed);

    desired.setMag(speed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.addForce(steer);
  }

  show() {
    fill(hue(this.col), saturation(this.col), brightness(this.col), map(this.lifeSpan, 100, 0, 255, 0));
    noStroke();

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    rectMode(CENTER);
    ellipse(0, 0, this.width, this.height);
    pop();
  }
}

class Food {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.value = foodValue;
    this.col = color(127);
  }

  show() {
    if (!faster && !optimized) {
      let h = map(noise((this.pos.x + x3) / 200, (this.pos.y + y3) / 200), 0, 1, 50, 200);
      this.col = color(h, 255, 255);
      if (!faster) {
        x3 += 0.002;
        y3 += 0.0008;
      }
    } else
      this.col = color(50, 255, 255);

    noStroke();
    fill(this.col);
    rectMode(CENTER);
    square(this.pos.x, this.pos.y, 3);
  }
}