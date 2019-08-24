class DeathParticle {
  constructor(x, y, size, col) {
    this.lifeSpan = 30;
    this.value = 50;
    this.maxLife = this.lifeSpan;
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.size = size;
    this.col = col;
    this.strength = 0.1;
    this.roughness = 0.67;
    this.drawStroke = true;
  }

  run(pop) {
    this.lifeSpan -= map(frameRate(), 30, 60, 3, 1);
    this.pos.add(this.vel);
    this.pos.add(p5.Vector.random2D().setMag(this.roughness));
    this.vel.x += random(-this.strength, this.strength);
    this.vel.y += random(-this.strength, this.strength);

    this.managePop(pop);
    this.show();
  }

  managePop(pop) {
    for (let i = pop.length - 1; i >= 0; i--)
      if (pop[i].lifeSpan <= 0)
        pop.splice(i, 1);
  }

  show() {
    let al = map(this.lifeSpan, this.maxLife / 2, 0, 255, 0);

    if (this.drawStroke)
      stroke(255, 0, 255, al - 255 / 8);
    else
      noStroke();
    
    strokeWeight(0.75);
    fill(hue(this.col), saturation(this.col), brightness(this.col), al);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}