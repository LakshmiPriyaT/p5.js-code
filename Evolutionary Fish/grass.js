class Grass { //difficulty
  constructor(x, y, length) {
    this.pos = createVector(x, y);
    this.length = length;
    this.thickness = 1;
    this.col = color(70, 255, 255);
    this.input = random(100000);
    this.speed = random(0.005, 0.01);
    this.hueLocation = random(10);
  }

  show() {
    noFill();
    strokeWeight(this.thickness);
    beginShape();
    for (let i = 0; i < this.length; i++) //
    {
      let h = hue(this.col) + sin(this.hueLocation) * 30;
      fill(h, 100, 255, 10);
      this.hueLocation += 0.005;
      let s = 255;
      let b = map(i, 1, this.length, 40, 120);
      let a = 255;
      stroke(h, s, b, a);

      let sineV = sin(this.input + i) * map(i, 0, this.length, 0, 7);
      let noiseV = map(noise((this.input + i) / 50), 0, 1, -1, 1) * i * 5;

      vertex(this.pos.x + sineV + noiseV, this.pos.y - i * 10);
      this.input += this.speed;
    }
    endShape();
  }
}