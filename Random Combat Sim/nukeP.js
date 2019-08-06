class NukeP {
  constructor(x, y, a) {
    this.init = createVector(x, y);
    this.pos = createVector(x, y);
    this.vel = p5.Vector.fromAngle(a);
    this.acc = createVector();

    this.a = a;
    this.s = 25;
    this.vel.setMag(6);
    this.lifeTime = 0;
  }

  static clear() {
    for(let i = nukeP.length - 1; i >= 0; i--)
      if(nukeP[i].vel.mag() < 0.1)
        nukeP.splice(i, 1);
  }
  
  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

    this.vel.mult(0.9);

    if (frameCount % 5 == 0)
      this.lifeTime++;
  }

  addForce(f) {
    this.acc.add(f);
  }

  show() {
    this.update();
    let p = this.lifeTime / 7;
    strokeWeight(this.s);
    strokeCap(SQUARE);
    stroke(lerpColor(redColor, yellowColor, p));
    
    push();
    translate(this.pos.x, this.pos.y);
    rotate(random(-0.25, 0.25));
    line(random(0.25), random(0.25), -this.vel.x * 12, -this.vel.y * 12);
    pop();

  }
}

































//ws