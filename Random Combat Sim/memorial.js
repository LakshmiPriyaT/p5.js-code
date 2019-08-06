class Memorial {
  constructor(x, y, team) {
    this.pos = createVector(x, y);
    this.soldiers = [];
    this.count = 5;
    this.team = team;
  }

  testPromotion(soldier) {
    
    if(soldier.team != this.team)
      return;
      
    if (this.soldiers.length < this.count) {
      this.soldiers.push(soldier.copy());
    } else {

      //if(this.soldiers.length >= this.count)
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
    push();
    translate(this.pos.x, this.pos.y);
    fill(15);
    rect(-5, -15, 150, this.count * 15);

    textSize(11);
    for (let i = 0; i < this.soldiers.length; i++) {
      let s = this.soldiers[i];
      fill(s.startCol);
      noStroke();
      text(s.killCount + ' : ' + s.firstName + ' ' + s.lastName + ' ' + s.age, 0, i * 12);
    }

    pop();
  }
}































//ws