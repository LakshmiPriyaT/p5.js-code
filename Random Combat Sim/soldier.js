class Soldier {
  constructor(tx = 0, ty = 0, team = true) {
    this.pos = createVector(random(width), random(height));
    this.targetPos = createVector(tx, ty);

    if (this.targetPos.y < height / 2)
      this.awayPos = createVector(random(this.targetPos.x - 100, this.targetPos.x + 100), -200);
    else
      this.awayPos = createVector(random(this.targetPos.x - 100, this.targetPos.x + 100), height + 200);
    this.vel = p5.Vector.random2D().setMag(7);

    this.grand = false;
    this.team = team;
    this.regenerate();
  }

  regenerate() {
    if (this.grand && (this.battle != null && this.battle != undefined && !this.battle.nuked)) //
    { // grand
      this.firstName = Soldier.generateFirstName();
      this.col = this.startCol;
      this.age = 11;
      this.attack = 10;
      this.defence = 10;
      this.speed = 10;
      this.xp = 15;

      this.grand = false;
    } else //
    { // not grand
      this.firstName = Soldier.generateFirstName();
      this.lastName = Soldier.generateLastName();
      this.age = constrain(round(randomGaussian(21, 7)), 11, 35);
      this.attack = constrain(round(randomGaussian(4, 3)), 0, 10);
      this.defence = constrain(round(randomGaussian(4, 3)), 0, 10);
      this.speed = constrain(round(randomGaussian(4, 3)), 0, 10);
      this.col = color(random(60, 200), 255, 255);
      this.xp = 0;
    }

    this.startCol = this.col;
    this.startAge = this.age;

    this.oa = this.attack;
    this.od = this.defence;
    this.os = this.speed;

    this.graphicOff = 10;

    this.acc = createVector();

    this.maxSpeed = map(this.speed, 0, 10, 2, 17);
    this.slowingRadius = map(this.speed, 0, 10, 25, 200);
    this.maxForce = 1;

    this.arrivedToBattle = false;
    this.arrivedAway = false;

    this.alive = true;
    this.health = 100;
    this.hPhysics = createVector(100, 0, 0); //pos, vel, acc;
    this.hMotion = createVector(1, 3, 15);

    this.aPhysics = createVector(0, 0, 0);
    this.dPhysics = createVector(0, 0, 0);
    this.sPhysics = createVector(0, 0, 0);

    this.battle = null;

    this.threshs = Battle.getThreshs(this);

    this.attUpgrade = 1.0;
    this.defUpgrade = 1.0;
    this.spdUpgrade = 1.0;

    this.killCount = 0;
    this.lifeSpan = 0;

    this.caps = createVector(10, 10, 10);
    this.capped = false;

    this.barLength = 5;
    this.maxSegments = [];
    this.segmentCount = 7;
    this.amp = 4;
    this.segOff = 0;
    this.maxSegAl = 0;
    this.barSpeed = 0.15;

    for (let i = 0; i <= this.segmentCount; i++)
      this.maxSegments.push(createVector((this.barLength * 10) / this.segmentCount * i));

    if (this.battle)
      if (this.battle.sold1.killCount > this.battle.sold2.killCount) {
        this.battle.sold1.myTurn = false;
        this.battle.sold2.myTurn = true;
      } else {
        this.battle.sold1.myTurn = true;
        this.battle.sold2.myTurn = false;
      }

      this.memPhysics = createVector(300, 0, 0);
      this.memMotion = createVector(2, 1, 25);
      this.memTarget = 0;

      this.facePic = int(random(facePics.length));
      this.hairPic = int(random(hairPics.length));
      this.mouthPic = int(random(mouthPics.length));
      this.eyePic = int(random(eyePics.length));

    //this.eyePic = 11; //0-9
    eOff[0] = createVector(13, 18);
    eOff[1] = createVector(18, 18);
    eOff[2] = createVector(13, 4);
    eOff[3] = createVector(10, 25);
    eOff[4] = createVector(-2, 22);
    eOff[5] = createVector(12, 18);
    eOff[6] = createVector(12, 22);
    eOff[7] = createVector(14, 20);
    eOff[8] = createVector(12, 20);
    eOff[9] = createVector(14, 20);
    eOff[10] = createVector(14, 20);
    eOff[11] = createVector(7, 20);
    eOff[12] = createVector(9, 23);
    eOff[13] = createVector(0, 23);

    //this.mouthPic = 1; //0-10
    mOff[0] = createVector(12, 40);
    mOff[1] = createVector(-1.5, 18);
    mOff[2] = createVector(11, 43);
    mOff[3] = createVector(17, 38);
    mOff[4] = createVector(12, 40);
    mOff[5] = createVector(15, 42);
    mOff[6] = createVector(12, 42);
    mOff[7] = createVector(23, 39);
    mOff[8] = createVector(10, 40);
    mOff[9] = createVector(16, 40);
    mOff[10] = createVector(23, 40);
    mOff[11] = createVector(7.5, 35);
    mOff[12] = createVector(14.25, 37);
    mOff[13] = createVector(14.25, 35);
    mOff[14] = createVector(14.25, 40);
    mOff[15] = createVector(17, 42);

    //this.hairPic = 12; //0-10
    hOff[0] = createVector(-2.5, -6);
    hOff[1] = createVector(-2.5, -6);
    hOff[2] = createVector(4, -20);
    hOff[3] = createVector(-6, -4);
    hOff[4] = createVector(7.5, -1);
    hOff[5] = createVector(-5, -11.2);
    hOff[6] = createVector(-32, -12);
    hOff[7] = createVector(-5, -18);
    hOff[8] = createVector(5, -1);
    hOff[9] = createVector(-4, -10);
    hOff[10] = createVector(-5, -13.5);
    hOff[11] = createVector(-40, -48);
    hOff[12] = createVector(27, -20);
  }

  copy() {
    let s = new Soldier();
    s.firstName = this.firstName;
    s.lastName = this.lastName;
    s.age = this.age;
    s.attack = this.attack;
    s.defence = this.defence;
    s.speed = this.speed;
    s.col = this.col;
    s.xp = this.xp;
    s.killCount = this.killCount;
    s.startCol = this.startCol;
    s.team = this.team;

    s.facePic = this.facePic;
    s.hairPic = this.hairPic;
    s.mouthPic = this.mouthPic;
    s.eyePic = this.eyePic;

    s.memPhysics = this.memPhysics;
    s.memTarget = this.memTarget;
    return s;
  }

  updateSmooth() {
    doPhysics(this.hPhysics);
    doPhysics(this.aPhysics);
    doPhysics(this.dPhysics);
    doPhysics(this.sPhysics);

    this.hPhysics.x = constrain(this.hPhysics.x, 1, 100);

    smoothFollow(this.health, this.hPhysics, this.hMotion);
    smoothFollow(this.attack, this.aPhysics, barMotion);
    smoothFollow(this.defence, this.dPhysics, barMotion);
    smoothFollow(this.speed, this.sPhysics, barMotion);

    if (this.capped)
      this.maxSegAl += 0.01;
    this.segOff += this.barSpeed;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);

    for (let i = 0; i <= this.segmentCount; i++)
      this.maxSegments[i].y = sin(i + this.segOff) * this.amp;

    if (!this.team)
      this.targetPos.y = height / 4;
    else
      this.targetPos.y = height * 3 / 4;

    if (this.pos.x > this.targetPos.x - 1 && this.pos.x < this.targetPos.x + 1 &&
      this.pos.y > this.targetPos.y - 1 && this.pos.y < this.targetPos.y + 1) {
      this.arrivedToBattle = true;
  } else
  this.arrivedToBattle = false;


  if (this.pos.x > this.awayPos.x - 10 && this.pos.x < this.awayPos.x + 10 &&
      this.pos.y > this.awayPos.y - 10 && this.pos.y < this.awayPos.y + 10) //
  {
    this.arrivedAway = true;
    this.xp = 0;

    if (this.age == 11 && this.attack >= 10 && this.defence >= 10 && this.speed >= 10) {
      this.xp = 15;
    }
  } else
  this.arrivedAway = false;

  if (this.arrivedAway && this.health == 0) {
    this.lifeSpan = 0;
    this.regenerate();
  }

  if (this.health == 0) {
    this.alive = false;
    this.battle.battleTime = 0;
  }

  if (this.alive)
    this.seek(this.targetPos);
  else {
    this.seek(this.awayPos);
  }

  this.lifeSpan++;

  if (this.lifeSpan % yearLength == 0 && this.alive) {
    this.age++;

    let reg = 2;
    if (this.age >= 50 && this.age % 10 == 0) {
      this.caps.x -= round(random(reg + 0.25));
      this.caps.y -= round(random(reg / 2 + 0.25));
      this.caps.z -= round(random(reg * 1.5 + 0.25));

      if (this.caps.x < 0)
        this.caps.x = 0;
      if (this.caps.y < 0)
        this.caps.y = 0;
      if (this.caps.z < 0)
        this.caps.z = 0;

      ageP.push(new AgeP(this.pos.x + 28, this.pos.y));
    }
  }

  if (this.age >= grandAgeThresh && this.killCount >= grandKillThresh)
    this.grand = true;
  else
    this.grand = false;

  this.col = lerpColor(this.startCol, color(hue(this.startCol), 0, 255), map(this.age, this.startAge, grandAgeThresh, 0, 1));

  if (this.attack >= this.caps.x && this.defence >= this.caps.y && this.speed >= this.caps.z)
    this.capped = true;
  else
    this.capped = false;

  if (this.attack > this.caps.x)
    this.attack = this.caps.x;
  if (this.defence > this.caps.y)
    this.defence = this.caps.y;
  if (this.speed > this.caps.z)
    this.speed = this.caps.z;

  this.threshs = Battle.getThreshs(this);

  if (!this.team)
    this.awayPos = createVector(random(this.targetPos.x - 100, this.targetPos.x + 100), -150);
  else
    this.awayPos = createVector(random(this.targetPos.x - 100, this.targetPos.x + 100), height + 150);
}

addForce(f) {
  this.acc.add(f);
}

incDamage(amount) {
  this.health -= amount;

  if (this.health <= 0) {
    this.health = 0;
    this.alive = false;

    if (!this.team)
      scores.y++;
    else
      scores.x++;
  }
}

getNextHighest(players) {
  let record = -30;
  let next = null;
  for (let s of players)
    if ((this.team && s.team) || (!this.team && !s.team)) {
      let sum = s.attack + s.defence + s.speed;

      if (sum > record && s != this && s.xp < 15 && !s.capped && s.alive) {
        record = sum;
        next = s;
      }
    }
    return next;
  }

  giveKill() {
    let next = this.getNextHighest(players);

    if (next != null) {
      next.xp++;
      //next.improve();
      next.threshs = Battle.getThreshs(next);
      if (next.arrivedToBattle == true)
        particles.push(new Particle(4, next));
    }
  }

  improve(amount = 1) {
    for (let i = 0; i < amount; i++) //
    {
      if (this.attack <= this.defence && this.attack <= this.speed && this.attack < this.caps.x) //
        this.attack++;
      else if (this.defence <= this.attack && this.defence <= this.speed && this.defence < this.caps.y)
        this.defence++;
      else if (this.speed <= this.attack && this.speed <= this.defence && this.speed < this.caps.z)
        this.speed++;
    }

    if (this.attack > this.caps.x)
      this.attack = this.caps.x;
    if (this.defence > this.caps.y)
      this.defence = this.caps.y;
    if (this.speed > this.caps.z)
      this.speed = this.caps.z;

    this.threshs = Battle.getThreshs(this);
  }

  seek(target) {
    let bite = target;
    if (!bite)
      return;

    let desired = p5.Vector.sub(bite, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;


    if (d < this.slowingRadius)
      speed = map(d, 0, this.slowingRadius, 0, this.maxSpeed);

    desired.setMag(speed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.addForce(steer);
  }

  show() {
    let barOff = 3;

    noStroke();
    fill(this.col);
    textSize(10);

    push();
    translate(this.pos.x - 7, this.pos.y + 7);

    fill(0);
    if(this.alive)
      stroke(this.team ? greenColor : redColor);
    else
      stroke(50);
    rect(-30, -34, 130, 62, 90);
    noStroke();

    this.showHealthBar();
    this.showProfile(this.graphicOff, this.barLength, barOff);
    this.showExtras();
    this.showAge(this.graphicOff, this.barLength, barOff);
  pop();
  this.showFace(this.pos.x, this.pos.y);
}

showFace(xPos, yPos) {
  push();
  translate(xPos - 60, yPos - 135);

    let startDim = 3;
    let dim = startDim;

    let f = facePics[this.facePic];
    let e = eyePics[this.eyePic];
    let h = hairPics[this.hairPic];
    let m = mouthPics[this.mouthPic];
    let y = 20;

    image(f, 0, 25 + y, f.width / dim, f.height / dim);
    
  if(this.eyePic == 11)
     dim += 0.5;
   image(e, 0 + eOff[this.eyePic].x, 25 + eOff[this.eyePic].y + y, e.width / dim, e.height / dim);

   dim = startDim;
  if (this.mouthPic == 1)
    dim -= 0.1;
  image(m, 0 + mOff[this.mouthPic].x, 25 + mOff[this.mouthPic].y + y, m.width / dim, m.height / dim);

  dim = startDim;
  if (this.hairPic == 3 || this.hairPic == 5)
    dim -= 0.5;
  image(h, 0 + hOff[this.hairPic].x, 25 + hOff[this.hairPic].y + y, h.width / dim, h.height / dim);

  pop();
}

showBase() {
  noFill();
    if (!this.team) //
    {
      if (!this.myTurn)
        stroke(redColor);
      else
        stroke(15);
    } else {
      if (!this.myTurn)
        stroke(greenColor);
      else
        stroke(0);
    }

    circle(this.targetPos.x + 28, this.targetPos.y, 145);

    noStroke();
    textSize(12);


    let myDamage = this.attack - this.opponent.defence;
    let youDamage = this.opponent.attack - this.defence;

    if (myDamage > youDamage) {
      if (this.team) {
        fill(greenColor);
        text('+' + (myDamage - youDamage), this.targetPos.x + 15, this.targetPos.y - 40);
      } else {
        fill(redColor);
        text('+' + (myDamage - youDamage), this.targetPos.x + 15, this.targetPos.y + 50);
      }
    }
  }

  showExtras() {
    noStroke();

  if(this.alive)
    fill(lerpColor(this.startCol, color(hue(this.startCol), 0, 255), constrain(map(this.xp, 5, 15, 0, 1), 0, 1)));
  else
    fill(50);

    if (this.xp != 0)
      text('XP: ' + this.xp, 40, -15);

    fill(255);
    noStroke();

    if (this.attUpgrade > 1.0) {
      fill(this.alive ? redColor : 50);
      circle(15, 17, 5);
    }

    if (this.defUpgrade > 1.0) {
      fill(this.alive ? blueColor : 50);
      circle(25, 17, 5);
    }

    if (this.spdUpgrade > 1.0) {
      fill(this.alive ? yellowColor : 50);
      circle(35, 17, 5);
    }
  }

  showProfile(x, length, barOff) {
    fill(0);
    circle(0, 5, 30);

if(this.alive)
    fill(lerpColor(this.startCol, color(hue(this.startCol), 0, 255), map(this.killCount, 0, grandKillThresh, 0, 1)));
  else
    fill(50);

    text(this.killCount, -12, 10);

    fill(this.alive ? this.col : color(50));
    text(this.firstName + " " + this.lastName, x - 10, -1);

    strokeWeight(1);
    stroke(this.alive ? redColor : color(50));
    line(x, barOff, x + this.aPhysics.x * length, barOff);

    stroke(this.alive ? blueColor : color(50));
    line(x, 2 * barOff, x + this.dPhysics.x * length, 2 * barOff);

    stroke(this.alive ? yellowColor : color(50));
    line(x, 3 * barOff, x + this.sPhysics.x * length, 3 * barOff);

    stroke(this.alive ? 60 : 50);
    line(x + length * 3, barOff, x + length * 3, 3 * barOff);

    stroke(0);
    strokeWeight(2);
    point(x + this.oa * length, barOff);
    point(x + this.od * length, 2 * barOff);
    point(x + this.os * length, 3 * barOff);

    stroke(90);
    strokeWeight(2);
    point(x + this.aPhysics.x * length, barOff);
    point(x + this.dPhysics.x * length, 2 * barOff);
    point(x + this.sPhysics.x * length, 3 * barOff);

    stroke(255, this.maxSegAl);
    strokeWeight(1);
    noFill();
    beginShape();

    for (let v of this.maxSegments)
      vertex(this.graphicOff + v.x, v.y + this.amp + this.amp / 2);
    endShape();
  }

  showHealthBar() {
    fill(30);
    arc(0, 0, 40, 40, PI * 2 / 3, PI + QUARTER_PI, PIE);

    if (this.health > 0) {
      fill(lerpColor(this.startCol, redColor, 1 - this.hPhysics.x / 100));
      arc(0, 0, 40, 40, PI * 2 / 3, map(this.hPhysics.x, 0, 100, PI * 2 / 3, PI + QUARTER_PI), PIE);
    }
  }

  showAge(x, length, barOff) {
    noStroke();
    if (this.age >= grandAgeThresh && this.killCount >= grandKillThresh) {
      fill(this.col);
      rect(x + length * 10 + 4, 1, 15 + ((this.age + '').length - 2) * 4, 11);
      fill(0);
      text(this.age, 65, 10);
    } else {
      fill(this.alive ? this.col : color(50));
      text(this.age, 65, 10);
    }

    noStroke();

    if(this.alive)
      fill(255, 0, 255, 255);
    else
      fill(50);

    rect(x + length * 10 + 1, 1 * barOff - 1, constrain((this.caps.x - 10), -10, 0) * length - 1, 2);
    rect(x + length * 10 + 1, 2 * barOff - 1, constrain((this.caps.y - 10), -10, 0) * length - 1, 2);
    rect(x + length * 10 + 1, 3 * barOff - 1, constrain((this.caps.z - 10), -10, 0) * length - 1, 2);
  }

  showInfo() {
    this.threshs = Battle.getThreshs(this);
    textSize(10);
    noStroke();
    fill(5);

    push();
    translate(this.pos.x + 20, this.pos.y - 105);
    rect(8, 12, 70, 65);

    fill(50);
    textFont('monospace');

    text('Attack:  ' + this.attack, this.graphicOff, 20);
    text('Defence: ' + this.defence, this.graphicOff, 30);
    text('Speed:   ' + this.speed, this.graphicOff, 40);

    text('Crit:  ' + int(this.threshs.x * 10000) / 100 + '%', this.graphicOff, 55);
    text('Regen: ' + int(this.threshs.y * 10000) / 100 + '%', this.graphicOff, 65);
    text('Kill:  ' + int(this.threshs.z * 10000) / 100 + '%', this.graphicOff, 75);
    pop();
  }

  static generateFirstName() {
    return cutFirstName(firstNames[int(abs(randomGaussian(0, firstNames.length / 6)))]);
  }

  static generateLastName() {
    return capLast(lastNames.get(int(abs(randomGaussian(0, lastNames.getRowCount() / 6))), 'name'));
  }

  toString() {
    return this.firstName + " " + this.lastName + ", age " + this.age + ", a=" + this.attack + ", d=" + this.defence + ", s=" + this.speed;
  }

}






























//ws