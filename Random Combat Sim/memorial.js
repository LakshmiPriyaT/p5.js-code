class Memorial {
  constructor(x, y, team) {
    this.init = createVector(x, y);
    this.pos = createVector(x, y);
    this.soldiers = [];
    this.count = battleCount;
    this.team = team;

    this.physics = createVector(200, 0, 0);
    this.motion = createVector(4, 1, 60);
    this.target = width - 100;

    this.collapsed = false;
  }

  testPromotion(soldier) {
    if(soldier.team != this.team)
      return;
      
    if (this.soldiers.length < this.count) {
      this.soldiers.push(soldier.copy());
    } else {

      this.sort();

      let smallest = Infinity;
      let s = null;

      for (let sold of this.soldiers)
        if (sold.killCount < smallest) {
          smallest = sold.killCount;
          s = sold;
        }

      for (let i = 0; i < this.soldiers.length; i++) //
      {
        if (!this.contains(soldier) && soldier.killCount > this.soldiers[i].killCount &&
          this.soldiers[i].startCol == s.startCol && this.soldiers[i].team == s.team) {
          this.soldiers[i] = soldier.copy();
          return;
        }

        if (this.contains(soldier) && this.soldiers[i].startCol == soldier.startCol && this.soldiers[i].team == soldier.team) {
          this.soldiers[i] = soldier.copy();
          return;
        }
      }
    }
  }

  updateSmooth() {
    this.sort();

     if(this.collapsed)
      this.target =  147;
    else
      this.target =  -15;

    for(let i = 0; i < this.soldiers.length; i++) {
      let s = this.soldiers[i];
      smoothFollow(this.soldiers.indexOf(s) * (height/2/(battleCount+1)) - 20, s.memPhysics, s.memMotion);
    }
    
    for(let i = 0; i < this.soldiers.length; i++) {
      let s = this.soldiers[i];
      doPhysics(s.memPhysics);
    } 

    smoothFollow(this.target, this.physics, this.motion);
    doPhysics(this.physics);

  }

  sort() {
    let index = 0;
    let newOrder = [];
    let oldOrder = this.soldiers;

    while (index < this.soldiers.length) {
      let greatest = this.getGreatest(index);
      this.swap(index, greatest);
      index++;
    }
  }

  swap(one, two) {
    let three = this.soldiers[two];
    this.soldiers[two] = this.soldiers[one];
    this.soldiers[one] = three;
  }

  getGreatest(startIndex) {
    let record = -1;
    let greatest = 0;

    for (let i = startIndex; i < this.soldiers.length; i++)
      if (this.soldiers[i].killCount > record) {
        record = this.soldiers[i].killCount;
        greatest = i;
      }
    return greatest;
  }

  contains(soldier) {
    for (let s of this.soldiers)
      if (soldier.startCol == s.startCol && soldier.team == s.team)
        return true;
    return false;
  }

  show() {
    this.sort();

    push();
    translate(width - 170, !this.team ? 90 : height/2 + 80);

    stroke(this.team ? greenColor : redColor);
    fill(this.team ? color(hue(greenColor), saturation(greenColor), 15) : color(hue(redColor), saturation(redColor), 15));
    strokeWeight(2);
    rect(this.physics.x-40, -65, 215, this.count * 0.47 * (height/(battleCount)) );
    noStroke();

    textSize(12);
    for (let i = 0; i < this.soldiers.length; i++) {
      let s = this.soldiers[i];
      let mag = 15;
      let fSpace = map(s.memPhysics.x, 0, this.count * (height/(battleCount+3)), -mag, 3*mag);

      fill(s.startCol);
      noStroke();
      text(s.killCount + ' : ' + s.firstName + ' ' + s.lastName + ' ' + s.age, this.physics.x + 25, s.memPhysics.x);

      s.showFace(this.physics.x + 15, s.memPhysics.x + 50 + fSpace);
    }
    pop();
  }
}































//ws