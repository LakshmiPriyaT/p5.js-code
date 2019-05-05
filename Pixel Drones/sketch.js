let img;
let scl = 6;
let vs = [];
let thresh = 30;

function preload() {
  img = loadImage('power.png');
}

function setup() {
  createCanvas(img.width, img.height);

  img.loadPixels();
  for (let r = 0; r < img.height; r += scl)
    for (let c = 0; c < img.width; c += scl) {
      let col = img.get(c, r);

      if (red(col) < thresh && green(col) < thresh && blue(col) < thresh)
        continue;

      let v = new Vehicle(random(width), random(height), createVector(c, r));
      v.col = col;
      v.r = scl;
      v.maxSpeed = 25;
      v.maxForce = 5;
      v.slowingRadius = 50;
      v.mouseRadius = 50;
      v.mouseStrength = 1;
      vs.push(v);
    }
  img.updatePixels();

}

function draw() {
  background(0);

  for (let v of vs) {
    v.move();
    v.behaviors(createVector(mouseX, mouseY));
    v.arrive();
    v.paint();
  }
}

function Vehicle(x, y, target) {
  this.pos = createVector(x, y);
  //this.vel = p5.Vector.random2D();
  this.vel = createVector();
  this.acc = createVector();
  this.target = target;
  this.r = 8;
  this.maxSpeed = 15;
  this.maxForce = 5;
  this.slowingRadius = 250;
  this.mouseStrength = 10;
  this.mouseRadius = 50;
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