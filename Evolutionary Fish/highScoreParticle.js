class HighScoreParticle {
  constructor(x, y, h, angle = random(0, PI)) {
    this.pos = createVector(x, y);
    this.angle = angle;
    this.speed = random(3, 10);
    this.length = random(5, 25);
    this.al = 255;
    this.h = h;
  }

  update() {
    this.al -= 15;
    let v = p5.Vector.fromAngle(this.angle);
    v.mult(this.speed);
    this.pos.add(v);
  }


  static managePop() {
    for (let i = hsParticles.length - 1; i >= 0; i--)
      if (hsParticles[i].al <= 0)
        hsParticles.splice(i, 1);
  }

  show() {
    this.update();
    fill(this.h, 255, 255, this.al);
    noStroke();
    
    push();
    translate(this.pos.x + 5, this.pos.y + this.length / 2 - 15);
    rotate(this.angle);
    rect(0, 0, this.length, 2);
    pop();
    
    HighScoreParticle.managePop();
  }
}
















//w