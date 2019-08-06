class ScoreBuggy {
  constructor() {
    this.tx = width / 2;

    this.physics = createVector(width/2, 0, 0);
    this.motion = createVector(12, 3, 150);
  }

  update() {
    this.physics.x += this.physics.y;
    this.physics.y += this.physics.z;
    this.physics.z = 0;
  }

  addForce(f) {
    this.acc += f;
  }

  show() {
    this.tx = constrain(map((scores.x - scores.y), -nukeDef, nukeDef, 0, width), 15, width - 15);

    smoothFollow(this.tx, this.physics, this.motion);
    this.update();
    
    let h = lerpColor(greenColor, redColor, this.physics.x / width);
    
    //middle line
    strokeWeight(1);
    stroke(60);
    line(width / 2, height / 2 - 15, width / 2, height / 2 + 15);
    
    strokeWeight(2);
    stroke(h);
    line(10, height / 2, width - 10, height / 2);

    noStroke();

    textFont('helvetica');
    fill(redColor);
    textSize(12);

    let off = constrain(map((scores.x - scores.y), -nukeDef, nukeDef, 25, -25), -25, 25);
    text(scores.x, this.physics.x - 3 + off - (scores.x + '').length * 4.5 + 4.5, height / 2 - 35);

    fill(greenColor);
    text(scores.y, this.physics.x - 3 + off - (scores.y + '').length * 4.5 + 4.5, height / 2 + 45);

    fill(color(hue(h), saturation(h), brightness(h) - 40));
    stroke(color(hue(h), saturation(h), brightness(h) - 40));
    strokeWeight(3);

    circle(this.physics.x, height / 2, 25);
    line(this.physics.x, height / 2, this.physics.x + off, height / 2 - 25);
    line(this.physics.x, height / 2, this.physics.x + off, height / 2 + 25);

    fill(0);
    strokeWeight(1);
    circle(this.physics.x, height / 2, 18);

    noStroke();
    fill(h);
    arc(this.physics.x, height / 2, 18, 18, 0, map(cooldownKills, 0, nukeCooldown, 0, TWO_PI));
  }

}
































//ws