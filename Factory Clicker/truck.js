class Truck extends Minion {
  constructor(x, y, fake = false) {
    super(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(fake ? 0 : -1, 0);
    this.acc = createVector();
    this.fake = fake;

    this.maxForce = this.fake ? 15 : 2;
    this.speed = this.fake ? 5 : 0.05;
  }

  static manage() {
    for (let i = trucks.length - 1; i >= 0; i--)
      if (trucks[i].pos.x < -75) {
        money += factory.capacity;
        trucks.splice(i, 1);
      }
  }

  drop() {
    this.addForce(createVector(-5, this.speed));
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

    if (!this.fake)
      this.addForce(createVector(-this.speed, 0));

    if (this.fake)
      this.arrive(createVector(factory.pos.x + 57, 492, true));

  }

  show() {
    if (birdCount >= 100)
      this.draw18Wheeler();
    else if (birdCount >= 25)
      this.drawTruck();
    else if (birdCount >= 10)
      this.drawTractor();
    else
      this.drawBug();
  }
  
  drawTractor() {
    let offY = this.fake ? 10 : 15;
    stroke(255);
    line(this.pos.x + 45, this.pos.y + 3 + offY, this.pos.x + 50, this.pos.y + 8 + offY);
    noStroke();
    fill(0, 90, 0);
    rect(this.pos.x, this.pos.y + offY, 20, 15);

    stroke(0, 90, 0);
    strokeWeight(5);
    noFill();
    arc(this.pos.x + 33, this.pos.y + 10 + offY, 25, 25, -PI * 1.05, -PI / 4);
    line(this.pos.x + 20, this.pos.y + offY, this.pos.x + 23, this.pos.y - 15 + offY);
    line(this.pos.x + 40, this.pos.y + offY, this.pos.x + 40, this.pos.y - 15 + offY);
    line(this.pos.x + 19, this.pos.y - 15 + offY, this.pos.x + 40, this.pos.y - 15 + offY);

    line(this.pos.x + 7, this.pos.y + offY, this.pos.x + 7, this.pos.y - 7 + offY);

    fill(120, 60, 0);
    noStroke();
    rect(this.pos.x + 50, this.pos.y + 3 + offY, 25, 10);
    rect(this.pos.x + 68, this.pos.y - 5 + offY, 7, 10);

    fill(0);

    circle(this.pos.x + 7, this.pos.y + 12 + offY, 6);
    circle(this.pos.x + 33, this.pos.y + 9 + offY, 9);

    circle(this.pos.x + 55, this.pos.y + 13 + offY, 5);
    circle(this.pos.x + 70, this.pos.y + 13 + offY, 5);
    
    fill(255, 255, 0);
    circle(this.pos.x + 7, this.pos.y + 12 + offY, 2);
    circle(this.pos.x + 33, this.pos.y + 9 + offY, 5);

    strokeWeight(1);
    if (!this.fake)
      Bird.show(this.pos.x + 58, this.pos.y + offY);
    
    if (!this.fake && frameCount % 5 == 0)
      smoke.push(new Smoke(this.pos.x  + 7, this.pos.y - 7 + offY));
    
  }

  drawBug() {
    let offY = this.fake ? 17 : 20;
    stroke(255);
    line(this.pos.x + 5, this.pos.y + offY, this.pos.x + 20, this.pos.y + 5 + offY);
    noStroke();
    fill(0, 205, 255);
    circle(this.pos.x, this.pos.y + offY, 10);
    fill(60);
    circle(this.pos.x - 5, this.pos.y + offY, 5);
    fill(0, 205, 255);
    rect(this.pos.x - 15, this.pos.y + offY, 25, 10);

    fill(60);
    circle(this.pos.x - 10, this.pos.y + 9 + offY, 5);
    circle(this.pos.x + 5, this.pos.y + 9 + offY, 5);

    fill(120, 60, 0);
    rect(this.pos.x + 15, this.pos.y - 3 + offY, 50, 10);
    rect(this.pos.x + 58, this.pos.y - 10 + offY, 7, 10);

    fill(60);
    circle(this.pos.x + 25, this.pos.y + 9 + offY, 5);
    circle(this.pos.x + 55, this.pos.y + 9 + offY, 5);

    if (!this.fake)
      Bird.show(this.pos.x + 45, this.pos.y - 5 + offY);
  }

  drawTruck() {
    let offY = this.fake ? 12 : 3;
    smooth();
    stroke(200);
    strokeWeight(2);
    line(this.pos.x + 70, this.pos.y + 17 + offY, this.pos.x + 60, this.pos.y + 17 + offY);
    noStroke();
    fill(90);
    circle(this.pos.x + 25, this.pos.y + offY, 10);
    rect(this.pos.x - 5, this.pos.y + 5 + offY, 5, 10);
    fill(170, 30, 0);
    rect(this.pos.x, this.pos.y + offY, 70, 15);
    square(this.pos.x + 25, this.pos.y - 10 + offY, 10, 12);
    fill(50);
    circle(this.pos.x + 15, this.pos.y + 20 + offY, 10);
    circle(this.pos.x + 52, this.pos.y + 20 + offY, 10);
    stroke(0);
    strokeWeight(1);
    noFill();
    circle(this.pos.x + 50, this.pos.y + 5 + offY, 3);

    if (!this.fake && frameCount % 5 == 0)
      smoke.push(new Smoke(this.pos.x + 70, this.pos.y + offY + 17));

    if (!this.fake) {
      Bird.show(this.pos.x + 45, this.pos.y - 2 + offY);
      Bird.show(this.pos.x + 50, this.pos.y - 5 + offY);
      Bird.show(this.pos.x + 55, this.pos.y - 2 + offY);
    }
  }

  draw18Wheeler() {
    stroke(200);
    fill(255, 130, 0);
    rect(this.pos.x, this.pos.y, 80, 25);

    stroke(255);
    strokeWeight(2);
    line(this.pos.x - 4, this.pos.y + 8, this.pos.x - 4, this.pos.y);
    line(this.pos.x - 4, this.pos.y, this.pos.x + 3, this.pos.y - 8);

    if (!this.fake && frameCount % 5 == 0)
      smoke.push(new Smoke(this.pos.x + 3, this.pos.y - 8));

    stroke(200);
    fill(200);
    rect(this.pos.x - 15, this.pos.y + 10, 15, 15);
    rect(this.pos.x - 20, this.pos.y + 20, 15, 7);

    fill(0);
    rect(this.pos.x - 15, this.pos.y + 10, 12, 10);

    fill(80);
    noStroke();
    circle(this.pos.x, this.pos.y + 26, 6);
    circle(this.pos.x + 60, this.pos.y + 26, 6);

    fill(255);
    textFont('monospace');
    textSize(12);
    text('evil inc.', this.pos.x + 5, this.pos.y + 18);
  }
}