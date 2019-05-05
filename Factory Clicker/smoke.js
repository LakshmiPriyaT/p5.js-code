class Smoke {
  constructor(x, y, bird) {
    this.pos = createVector(x, y);
    this.bird = bird;
    this.speed = 6;
    this.sinPos = random(1000);
    this.al = 150;
  }

  show() {

    for (let i = smoke.length - 1; i >= 0; i--) {
      if (smoke[i].al <= 0)
        smoke.splice(i, 1);
    }

    this.al -= random(4, 7);

    if(this.bird && this.bird.landed)
      this.pos.y -= random(this.speed);

    this.pos.x += sin(this.sinPos) * 0.5;

    this.sinPos += 0.01;
    fill(60, this.al);
    noStroke();
    circle(this.pos.x, this.pos.y, map(this.al, 150, 0, 2, 20));
  }
}