function Vehicle(x, y, target) {
  this.pos = createVector(x, y);
  //this.vel = p5.Vector.random2D();
  this.vel = createVector(0,0);
  this.acc = createVector();
  this.target = target;
  this.r = 8;
  this.maxSpeed = 15;
  this.maxForce = 1;
  this.slowingRadius = 250;
  this.mouseStrength = 10;
  this.mouseRadius = 50;
  colorMode(HSB, 360);
  this.col = color(255);
}

Vehicle.prototype.move = function() {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
}

Vehicle.prototype.behaviors = function(tar = createVector(0, 0)) {
  let arriveForce = this.arrive(this.target);
  let fleeForce = this.flee(tar);
  this.applyForce(arriveForce);
  this.applyForce(fleeForce);
}

Vehicle.prototype.seek = function() {
  let desired = p5.Vector.sub(this.target, this.pos);
  desired.setMag(this.maxSpeed);

  let steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxForce);
  return steer;
}

Vehicle.prototype.flee = function(tar) {
  let desired = p5.Vector.sub(this.pos, tar);
  let d = desired.mag();
  desired.setMag(this.maxSpeed);

  let steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxForce);

  return d < this.mouseRadius ? steer.mult(this.mouseStrength) : createVector(0, 0);
}

Vehicle.prototype.arrive = function() {
  let desired = p5.Vector.sub(this.target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;

  if (d < this.slowingRadius)
    speed = map(d, 0, this.slowingRadius, 0, this.maxSpeed);

  desired.setMag(speed);

  let steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxForce);
  return steer;
}

Vehicle.prototype.applyForce = function(f) {
  this.acc.add(f);
}

Vehicle.prototype.paint = function() {
  noStroke();
  fill(this.col);
  rect(this.pos.x, this.pos.y, this.r, this.r);
}

function Spawner(x, y, r, xV, yV, col) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.col = col;
  this.xV = xV;
  this.yV = yV;

  this.move = function() {
    this.x += this.xV;
    this.y -= this.yV;

    if (this.x < this.r*0.5) {
      this.x = this.r*0.5;
      this.xV *= -1;
    }

    if (this.x > width - this.r*0.5) {
      this.x = width - this.r*0.5;
      this.xV *= -1;
    }

    if (this.y < this.r*0.5) {
      this.y = this.r*0.5;
      this.yV *= -1;
    }

    if (this.y > height - this.r*0.5) {
      this.y = height - this.r*0.5;
      this.yV *= -1;
    }
  }
  this.paint = function() {
    fill(this.col);
    ellipse(this.x, this.y, this.r);
  }
}