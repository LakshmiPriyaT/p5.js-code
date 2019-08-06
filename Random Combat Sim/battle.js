class Battle {
  constructor(base1, base2, sold1, sold2) {
    this.base1 = base1;
    this.base2 = base2;

    this.base1Filled = false;
    this.base2Filled = false;

    this.sold1 = sold1;
    this.sold2 = sold2;

    this.sold1.myTurn = random() > 0.5;
    this.sold2.myTurn = !this.sold1.myTurn;

    this.baseDamage = 15;

    this.criticalMultiplier = 2.0;
    this.addHealthMultiplier = 0.33;
    this.critR = 0;
    this.addR = 0;
    this.winR = 0;

    this.battleTime = 0;
    this.freq = 1;
  }

  update() {

    this.sold1.battle = this;
    this.sold2.battle = this;

    if (this.sold1.arrivedToBattle && this.sold1.team == false || this.sold2.arrivedToBattle && this.sold2.team == false)
      this.base1Filled = true;
    else
      this.base1Filled = false;

    if (this.sold1.arrivedToBattle && this.sold1.team == true || this.sold2.arrivedToBattle && this.sold2.team == true)
      this.base2Filled = true;
    else
      this.base2Filled = false;

    
    if (this.battleTime % this.freq == 0 && this.battleTime != 0 && this.base1Filled && this.base2Filled) {

      if (this.sold1.myTurn)
        this.processTurn(this.sold1, this.sold2);
      else
        this.processTurn(this.sold2, this.sold1);

      this.sold2.myTurn = !this.sold2.myTurn;
      this.sold1.myTurn = !this.sold1.myTurn;
    }

    if (nuked) 
      cooldownKills = abs(nukePop - totalKills);
    
    if (cooldownKills >= nukeCooldown)
        nuked = false;

    if (nuked == false && abs(scores.x - scores.y) >= nukeDef) //
    {
      if (scores.x > scores.y && enemyBosses >= 3) {
        nuke();
        nuked = true;
        squadNukeCount += 1;
        scores = createVector();
      }
      if (scores.y > scores.x && squadBosses >= 3) {
        nuke();
        nuked = true;
        enemyNukeCount += 1;
        scores = createVector();
      }
    }

    this.battleTime++;
  }

  processTurn(me, you) {
    this.rollDice();
    
    let threshs = Battle.getThreshs(me);

    let critical = this.critR <= threshs.x;
    let addHealth = this.addR <= threshs.y;
    let instaWin = this.winR <= threshs.z;

    if (addHealth) {
      me.health += 100 * this.addHealthMultiplier;

      if (me.health > 100)
        me.health = 100;

      particles.push(new Particle(2, me));
    }

    if (critical) {
      you.incDamage((this.baseDamage + me.attack - you.defence) * this.criticalMultiplier);
      particles.push(new Particle(1, me));
    } else
      you.incDamage((this.baseDamage + me.attack - you.defence));

    if (you.alive && instaWin) {
      you.incDamage(you.health);


      let off = 27;
      if (me.team)
        spawnNuke(you.pos.x + off, height / 4, int(random(7, 10 + 1)));
      else
        spawnNuke(you.pos.x + off, height * 3 / 4, int(random(7, 10 + 1)));
    }

    if (you.health <= 0) //
    {
      me.killCount++;
      totalKills++;
      
      let selfSum = me.attack + me.defence + me.speed;

      if (me.xp < 15)
        me.xp++;
      else
        me.giveKill();

      if (you.xp >= 15) {
        me.xp += 4;
        me.improve(2);
      }

      if (you.grand)
        me.xp += 11;

      me.improve();

      if (me.xp > 15)
        me.xp = 15;
    }
  }
  static getThreshs(soldier) {
    let c = map(soldier.attack, 3, 10, critBounds.x, critBounds.y);
    let d = map(soldier.defence, 3, 10, addBounds.x, addBounds.y);
    let i = map(soldier.speed, 3, 10, instaWinBounds.x, instaWinBounds.y);

    let xp = soldier.xp;

    if (xp >= 5)
      soldier.attUpgrade = 1.8;

    if (xp >= 10)
      soldier.defUpgrade = 1.5;

    if (xp >= 15)
      soldier.spdUpgrade = 3;

    if (c < 0 || soldier.attack < 3)
      c = 0;
    if (d < 0 || soldier.defence < 3)
      d = 0;
    if (i < 0 || soldier.speed < 3)
      i = 0;

    return createVector(c * soldier.attUpgrade, d * soldier.defUpgrade, i * soldier.spdUpgrade);
  }

  rollDice() {
    this.critR = random();
    this.addR = random();
    this.winR = random();
  }
}

















//ws