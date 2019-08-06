let firstNames;
let lastNames;
let players = [];
let battles = [];
let particles = [];
let memorials = [];
let nukeP = [];
let ageP = [];
let scoreBuggy;
let battleCount = 5;

let greenColor;
let redColor;
let blueColor;
let yellowColor;

let critBounds; //     A  -> 0-10
let addBounds; //      D  -> 0-10
let instaWinBounds; // S  -> 0-10
let scores;
let paused = false;
let faster = false;
let totalKills = 0;
let nukePop = 0;
let nuked = false;
let barMotion;
let enemyBosses = 0;
let squadBosses = 0;
let enemyBossPhysics;
let squadBossPhysics;
let bossMotion;
let cooldownKills = 0;

let enemyNukeCount = 0;
let squadNukeCount = 0;

let grandAgeThresh = 70;
let grandKillThresh = 100;

let nukeDef = 100;
let nukeCooldown = nukeDef * 0.75;
let yearLength = 500;
let mouseCol = 0;
let clickDist = 70;

let facePics = [];
let mouthPics = [];
let hairPics = [];
let eyePics = [];
let fOff = [];
let eOff = [];
let hOff = [];
let mOff = [];

// weapons

function preload() {
  firstNames = loadStrings('\firstNames.txt');
  lastNames = loadTable('\lastNames.csv', 'csv', 'header');
  
  // for(let i = 0; i < 11; i++) {
  //   facePics.push( loadImage('pics/Faces/' + (i+'') +'.png') );
  //   fOff.push(createVector());
  // }
     
  // for(let i = 0; i < 16; i++) {
  //   mouthPics.push( loadImage('pics/Mouths/' + (i+'') +'.png') );
  //   mOff.push(createVector());
  // }
  
  
  // for(let i = 0; i < 11; i++) {
  //   hairPics.push( loadImage('pics/Hair/' + (i+'') +'.png') );
  //   hOff.push(createVector());
  // }
  
  // for(let i = 0; i < 14; i++) {
  //   eyePics.push( loadImage('pics/Eyes/' + (i+'') +'.png') );
  //   eOff.push(createVector());
  // }
}

function setup() {
  createCanvas(700, 600);
  colorMode(HSB);

  critBounds = createVector(0.05, 0.50); //     A  -> 3-10
  addBounds = createVector(0.1, 0.60); //    D  -> 3-10
  instaWinBounds = createVector(0.001, 0.02); // S  -> 3-10

  greenColor = color(255 / 2, 255, 60);
  redColor = color(0, 255, 100);
  blueColor = color(255 * 3 / 4, 255, 255);
  yellowColor = color(255 * 1 / 4, 255, 255);

  scores = createVector(battleCount, battleCount);

  enemyBossPhysics = createVector(0, 0, 0);
  squadBossPhysics = createVector(0, 0, 0);
  bossMotion = createVector(1, 1, 10);

  for (let i = 0; i < battleCount; i++)
    players.push(new Soldier(40 + i * 140, height / 4, false));

  for (let i = 0; i < battleCount; i++)
    players.push(new Soldier(40 + i * 140, height * 3 / 4, true));

  memorials.push(new Memorial(width - 140, 15, false));
  memorials.push(new Memorial(width - 140, height - 60, true));

  for (let i = 0; i < battleCount; i++) {
    battles.push(new Battle(players[i].targetPos, players[i + battleCount].targetPos, players[i], players[i + battleCount]));

    for (let b of battles) {
      b.sold1.battle = b;
      b.sold2.battle = b;
      b.sold1.opponent = b.sold2;
      b.sold2.opponent = b.sold1;
    }

    scoreBuggy = new ScoreBuggy();
  }
}

function draw() {

  let f = faster ? 10 : 1;
  for (let i = 0; i < f; i++) //
  {
    background(5);

    stroke(255, 0.1);
    line(0, height / 2 - clickDist, width, height / 2 - clickDist);
    line(0, height / 2 + clickDist, width, height / 2 + clickDist);

    enemyBosses = 0;
    squadBosses = 0;

    if (f > 1)
      barMotion = createVector(1.75, 1, 3);
    else
      barMotion = createVector(0.75, 0.33, 1);

    for (let s of players)
      if (s.xp >= 15 && s.pos.y < height / 2 && s.capped)
        enemyBosses++;

    for (let s of players)
      if (s.xp >= 15 && s.pos.y > height / 2 && s.capped)
        squadBosses++;

    for (let b of battles)
      if (!paused)
        b.update();

    for (let s of players) {
      if (!paused)
        s.update();
      for (let m of memorials)
        m.testPromotion(s);
    }

    if (paused) {
      fill(255);
      noStroke();
      textSize(32);
      textFont('helvetica');
      text('Paused', width / 2 - 50, height - 25);
    }

    for (let i = particles.length - 1; i >= 0; i--)
      if (particles[i].al <= 0)
        particles.splice(i, 1);
  }

  for (let i = 0; i < 5; i++) //
  {
    strokeWeight(1);

    if (squadBosses >= 5) {
      fill(yellowColor);
      stroke(yellowColor);
    } else if (squadBosses < 3) {
      stroke(greenColor);
      noFill();
    } else {
      fill(255);
      stroke(255);
    }

    let spacing = 30;
    circle(spacing / 2 + i * spacing - battleCount * spacing + squadBossPhysics.x * spacing, height - 50, 15);

    if (enemyBosses >= 5) {
      fill(yellowColor);
      stroke(yellowColor);
    } else if (enemyBosses < 3) {
      stroke(redColor);
      noFill();
    } else {
      fill(255);
      stroke(255);
    }

    circle(spacing / 2 + i * spacing - battleCount * spacing + enemyBossPhysics.x * spacing, 50, 15);
  }

  enemyNukeCount = round(enemyNukeCount);
  squadNukeCount = round(squadNukeCount);

  noStroke();
  textSize(34);
  fill(redColor);
  text(enemyNukeCount, width / 2 - (enemyNukeCount + '').length * 15 + 5, 40);

  fill(greenColor);
  text(squadNukeCount, width / 2 - (squadNukeCount + '').length * 15 + 5, height - 15);

  doPhysics(enemyBossPhysics);
  doPhysics(squadBossPhysics);

  smoothFollow(enemyBosses, enemyBossPhysics, bossMotion);
  smoothFollow(squadBosses, squadBossPhysics, bossMotion);

  for (let s of players)
    s.showBase();

  for (let s of players) {
    s.updateSmooth();
    s.show();
  }

  for (let p of particles)
    p.show();

  for (let p of ageP)
    p.show();

  for (let i = nukeP.length - 1; i >= 0; i--)
    nukeP[i].show();

  for (let s of players)
    if (mouseIsPressed && mouseX > s.pos.x - 25 && mouseX < s.pos.x + 90 && mouseY > s.pos.y - 50 && mouseY < s.pos.y + 100)
      s.showInfo();

  scoreBuggy.show();

  //if(mouseX > memorials[0].pos.x - 5 && mouseY < memorials[0].pos.y + 70)
    memorials[0].show();
  
  //if(mouseX > memorials[1].pos.x - 5 && mouseY > memorials[1].pos.y - 15)
    memorials[1].show();

  NukeP.clear();
  AgeP.clear();

  mouseCol = constrain(int(mouseX / (width / battleCount)), 0, battleCount - 1);
}

function doPhysics(physicsVector) {
  physicsVector.x += physicsVector.y;
  physicsVector.y += physicsVector.z;
  physicsVector.z = 0;
}

function smoothFollow(targetNum, physicsVector, motionVector) {
  let desired = targetNum - physicsVector.x;
  let speed = motionVector.x;

  if (desired < motionVector.z)
    speed = map(desired, 0, motionVector.z, 0, motionVector.x);

  desired = speed;

  let steer = desired - physicsVector.y;

  if (steer > motionVector.y)
    steer = motionVector.y;

  physicsVector.z += steer;
}

function spawnNuke(x, y, n) {
  for (let i = 0; i < n; i++)
    nukeP.push(new NukeP(x, y, TWO_PI / n * i));
}

function spawnNukes() {
  for (let i = 0; i < battleCount; i++)
    spawnNuke(67 + i * 140, height / 4, int(random(5, 10 + 1)));

  for (let i = 0; i < battleCount; i++)
    spawnNuke(67 + i * 140, height * 3 / 4, int(random(5, 10 + 1)));
}

function nuke() {
  for (let s of players)
    s.incDamage(s.health);

  nukePop = totalKills;
  spawnNukes();
}

function keyPressed() {
  if (key == ' ')
    paused = !paused;
  else if (key == 'f')
    faster = !faster;

  if (key == 'n')
    nuke();
}

function cutFirstName(s) {
  return s.substring(0, s.indexOf(","));
}

function capLast(s) {
  return s.substring(0, 1) + s.substring(1).toLowerCase();
}