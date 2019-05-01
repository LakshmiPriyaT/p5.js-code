class Bomb extends Food {
  constructor(x, y, radius) {
    super(x, y);
    this.radius = radius;
    this.col = color(0, 255, 255);
    this.distance = 10000000;
    this.amount = 0;
    this.eatDistance = sq(this.radius) * 15;
    this.trigger = 3;
  }

  update() {
    this.checkForAmount(this.trigger);
    
    if (this.amount >= this.trigger) //
    {
      for (let i = fish.length - 1; i >= 0; i--) {
        let d = relativeDist(this.pos.x, this.pos.y, fish[i].pos.x, fish[i].pos.y);

        if (d < this.eatDistance && frameRate() > 15 && !faster && !optimized) {
          for (let j = 0; j < 5; j++)
              deathParticles.push(new DeathParticle(fish[i].pos.x, fish[i].pos.y, fish[i].width / 3, fish[i].col));
          fish.splice(i, 1);
        }
      }

      for (let i = bombs.length; i >= 0; i--)
        if (bombs[i] == this)
          bombs.splice(i, 1);

      if (!faster && !optimized)
        for (let i = 0; i < 50; i++)
          hsParticles.push(new HighScoreParticle(this.pos.x, this.pos.y, random(255), random(360)));
    }
  }

  checkForAmount(n) {
    let count = 0;
    for (let i = 0; i < fish.length; i++) {
      let d = relativeDist(this.pos.x, this.pos.y, fish[i].pos.x, fish[i].pos.y);
      
      if (d < sq(this.radius))
        count++;
      else if (d < this.eatDistance) {
        stroke(255, 0, 255, 30);
        strokeWeight(2);
        line(this.pos.x, this.pos.y, fish[i].pos.x, fish[i].pos.y);

        noStroke();
        fill(0, 255, 255, 200);

        push();
        translate(this.pos.x, this.pos.y);
        let desired = p5.Vector.sub(fish[i].pos, this.pos);
        rotate(desired.heading());
        rect(this.radius / 2, 0, this.radius, 1);
        pop();

      }
    }
    this.amount = count;
    return count >= n;
  }

  static managePopulation() {
    while (bombs.length != bombCount)
      if (bombs.length <= bombCount) {
        let x = random(borderW, width - borderW);
        let y = random(borderW, height - borderW);
        let s = new Bomb(x, y, 30);
        bombs.push(s);
      } else
        bombs.pop();
  }

  show() {
    this.update();

    strokeWeight(2);
    stroke(0, 0, 255, map(this.amount, 0, 3, 255, 0));
    noStroke();
    fill(0, 255, 255, map(this.amount, 0, 7, 50, 255));
    circle(this.pos.x, this.pos.y, this.radius);

    fill(0, 255, 255);
    square(this.pos.x, this.pos.y, 7);
  }
}
























//w