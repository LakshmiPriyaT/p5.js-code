class Missile {
  constructor(x, y, target) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.target = target;

    this.maxForce = missileSpeed;
    this.automated = turret.automated;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

    if (this.automated)
      this.seek(this.target);
    else
      this.continue();

    if (this.target.crashing)
      this.maxForce += 0.5;

    if (this.pos.x > width|| this.pos.x < 0 ||
       this.pos.y > height || this.pos.y < 0)
      this.suicide();
  }

  continue () {
    this.addForce(createVector(this.vel.x, this.vel.y));
                  
    this.vel.setMag(missileSpeed);
    
    for(let i = birds.length-1; i >= 0; i--) {
      let b = birds[i];
      let d = dist(this.pos.x, this.pos.y, b.pos.x, b.pos.y);
      
      if(d < 7) {
        b.crashing = true;
        this.suicide();
      }
    }
  }

  seek(target) {
    let desired = p5.Vector.sub(target.pos, this.pos);
    desired.setMag(this.maxForce);

    let steering = p5.Vector.sub(desired, this.vel);

    this.addForce(steering);

    if (dist(this.pos.x, this.pos.y, target.pos.x, target.pos.y) < 7) {
      target.crashing = true;
      this.suicide();
    }
  }

  addForce(f) {
    this.acc.add(f);
  }

  suicide() {
    for (let i = missiles.length - 1; i >= 0; i--)
      if (missiles[i] == this)
        missiles.splice(i, 1);
  }

  show() {
    fill(255, 0, 0);
    noStroke();

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() == 0 ? 90 : this.vel.heading());
    rect(0, 0, 10, 2);
    pop();
  }
}