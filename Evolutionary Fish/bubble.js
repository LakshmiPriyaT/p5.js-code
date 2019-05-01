class Bubble {
  constructor(x, y, r) {
    this.pos = createVector(x || random(width), y || random(height));
    this.vel = createVector();
    this.r = r || random(10, 50);
    this.input = random(10);
    this.strength = random(0.1, 0.5);
  }

  split() {
    let bubble = new Bubble(this.pos.x + this.r / 2, this.pos.y, this.r);
    bubble.input = random(10);
    bubble.r /= 3;
    this.r -= this.r / 3;
    bubble.input = 10 - this.input;
    bubbles.push(bubble);
    this.pos.x -= this.r / 2;
    this.pos.y += 1;
  }

  run() {
    if (this.pos.y < -this.r) {
      this.pos.y = height + this.r * 2;
      this.pos.x = random(width);
      this.r = random(10, 50);
      this.input = random();
      this.strength = random(0.01, 0.5);
    }
    let offset = sin(this.input); // [-1, 1]
    this.input += 0.01;

    this.vel.x += offset * this.strength;
    this.vel.y -= map(this.r, 5, 15, 0.1, 0.3);

    this.pos.add(this.vel);
    this.vel.mult(0);
  }

  show() {
    strokeWeight(5);
    stroke(255 / 2 + 20, 255, 255, 5);
    fill(255 / 2, 70, 255, 3);
    circle(this.pos.x, this.pos.y, this.r);
  }
}