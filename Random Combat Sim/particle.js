class Particle {
  constructor(type, soldier) {
    this.type = type; // 1 - 4

    this.pos = soldier.pos.copy();
    this.vel = createVector();
    this.acc = createVector();

    this.pos.y -= 10;
    
    this.al = 1;

    this.attC = color(0, 255, 255, this.al);
    this.addC = color(255 * 3 / 4, 255, 255, this.al);
    this.instaC = color(255 * 1 / 4, 255, 255, this.al);
    this.giveC = color(0, 0, 255, this.al);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

    this.addForce(createVector(0, -0.015));

    this.attC = color(0, 255, 255, this.al);
    this.addC = color(255 * 3 / 4, 255, 255, this.al);
    this.instaC = color(255 * 1 / 4, 255, 255, this.al);
    this.giveC = color(0, 0, 255, this.al);

    this.al -= 0.02;
  }

  addForce(f) {
    this.acc.add(f);
  }

  show() {
    this.update();

    let col = null;
    let txt = '';
    switch (this.type) {
      case 1:
        col = this.attC;
        break;
      case 2:
        col = this.addC;
        break;
      case 3:
        col = this.instaC;
        break;
      case 4:
        col = this.giveC;
    }

    strokeWeight(1);
    noStroke();
    fill(col);
    textSize(12);

    switch (this.type) {
      case 1:
        rect(this.pos.x + 20, this.pos.y - 15, 10, 10);
        break;
      case 2:
        circle(this.pos.x + 5, this.pos.y - 10, 15);
        break;
      case 3:
        stroke(col);
        noFill();
        circle(this.pos.x + 10, this.pos.y - 10, 15);
        line(this.pos.x + 5, this.pos.y - 10, this.pos.x + 15, this.pos.y - 10);
        line(this.pos.x + 10, this.pos.y - 5, this.pos.x + 10, this.pos.y - 15);
        break;
      case 4: 
        circle(this.pos.x + 50, this.pos.y - 20, 15);
        break;
    }
  }
}




















//ws