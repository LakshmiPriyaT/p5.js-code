class Turret {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.targeting = createVector(this.pos.x - 150, this.pos.x);
    this.reloading = 0;
    this.automated = false;
  }

  getClosest(sky) {
    let closest = null;
    let distance = Infinity;

    for (let i = 0; i < sky.length; i++) {
      let b = sky[i];
      let d = dist(this.pos.x, this.pos.y, b.pos.x, b.pos.y);

      if (!b.crashing && !b.targeted && d < distance && b.pos.x > this.targeting.x && b.pos.x < this.targeting.y) {
        distance = d;
        closest = b;
      }
    }
    return closest;
  }

  operate() {
    if (this.reloading - 1 < reloadTime)
      this.reloading++;

    if (this.automated) {
      let closest = this.getClosest(birds);

      if (closest != null && this.reloading > reloadTime) {
        closest.targeted = true;
        missiles.push(new Missile(this.pos.x, this.pos.y - 25, closest));

        let temp = new Bird(this.pos.x, this.pos.y);
        temp.landed = true;

        for (let i = 0; i < 1; i++)
          smoke.push(new Smoke(this.pos.x + 45, this.pos.y - 40, temp));
        this.reloading = 0;
      }
    }
  }

  show() {
    let closest = this.getClosest(birds);
    let desired = closest != null ? p5.Vector.sub(closest.pos, this.pos) : createVector(-1, -1);
    stroke(255, 0, 0);

    fill(255, 0, 0, 30);
    noStroke();
    rect(this.targeting.x, 0, this.targeting.y - this.targeting.x, height / 3);

    fill(60);
    stroke(127);
    ellipse(this.pos.x, this.pos.y, 70, 15);

    fill(255, 0, 0);
    noStroke();
    circle(this.pos.x, this.pos.y - 25, 7);

    fill(60);
    stroke(127);
    beginShape();
    vertex(this.pos.x - 20, this.pos.y);
    vertex(this.pos.x - 7, this.pos.y - 25);
    vertex(this.pos.x + 7, this.pos.y - 25);
    vertex(this.pos.x + 20, this.pos.y);
    endShape();

    //reload bar
    let h = 40;
    let step = h / reloadTime;
    let ht = map(this.reloading, 0, reloadTime, h, 0)
    fill(200);
    noStroke();
    rect(this.pos.x + 40, this.pos.y - h, 10, h);

    fill(map(ht, 0, h, 0, 255), map(ht, 0, h, 255, 0), 0);
    if (this.reloading < reloadTime)
      rect(this.pos.x + 40, this.pos.y - h + step * this.reloading, 10, ht);
  }
}


















//w