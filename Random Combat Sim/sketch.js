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

let grandAgeThresh = 50;
let grandKillThresh = 100;

let nukeDef = 50;
let nukeCooldown = 50;//nukeDef * 0.75;
let yearLength = 500;

let facePics = [];
let mouthPics = [];
let hairPics = [];
let eyePics = [];
let eOff = [];
let hOff = [];
let mOff = [];

let backX = 0;
let backY = 0;

// aviators, sunglasses
// weapons

function preload() {
  firstNames = loadStrings('https://raw.githubusercontent.com/drewgriffith123/p5.js-code/master/Random%20Combat%20Sim/firstNames.txt');
  lastNames = loadTable('https://raw.githubusercontent.com/drewgriffith123/p5.js-code/master/Random%20Combat%20Sim/lastNames.csv', 'csv', 'header');
  loadImages();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  let spacing = windowWidth / (battleCount + 1);

  for (let i = 0; i < players.length; i++)
    players[i].targetPos = createVector(spacing/2 + (i % battleCount) * spacing, players[i].team ? height / 5 : height * 4 / 5);

  //spacing/2 + i * spacing
  for(let i = 0; i < battles.length; i++) {
    battles[i].base1 = players[i].targetPos;
    battles[i].base2 = players[i + battleCount].targetPos;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
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

  let spacing = width / (battleCount + 1);

  for (let i = 0; i < battleCount; i++)
    players.push(new Soldier(spacing/2 + i * spacing, height / 5, false));

  for (let i = 0; i < battleCount; i++)
    players.push(new Soldier(spacing/2 + i * spacing, height * 4 / 5, true));

  memorials.push(new Memorial(width - 140, 25, false));
  memorials.push(new Memorial(width - 140, height - 50, true));

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

function mouseClicked() {
  for(let m of memorials)
    if(mouseX > m.physics.x + width - 212)
      m.collapsed = !m.collapsed;
    
}

function draw() {

  drawWater(70, backX, backY);
//background(5);
  backX += map(scoreBuggy.physics.x, scoreBuggy.start, scoreBuggy.end, 0.5, -0.5);
  backY += map(scoreBuggy.physics.x, scoreBuggy.start, scoreBuggy.end, -0.075, 0.075) + 0.01;

  fill(255);
  text(frameRate(), 10, 10);
  let f = faster ? 10 : 1;
  for (let i = 0; i < f; i++) //
  {

    fill( color(hue(redColor), saturation(redColor), 15) );
    stroke(redColor);

    beginShape();
    let spacing = width / (battleCount-1);
    vertex(spacing/6 - 20, height / 5 - 70);
    vertex(4 * spacing - spacing/1.5 + 20, height / 5 - 70);
    vertex(4 * spacing - spacing/1.5 - 20, height / 5 + 150);
    vertex(spacing/6 + 20, height / 5 + 150);
    endShape(CLOSE);

    fill( color(hue(greenColor), saturation(greenColor), 15) );
    stroke(greenColor);

    beginShape();
    spacing = width / (battleCount-1);
    vertex(spacing/6 - 20, height * 4 / 5 + 70);
    vertex(4 * spacing - spacing/1.5 + 20, height * 4 / 5 + 70);
    vertex(4 * spacing - spacing/1.5 - 20, height * 4 / 5 - 150);
    vertex(spacing/6 + 20, height * 4 / 5 - 150);
    endShape(CLOSE);

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

  doPhysics(enemyBossPhysics);
  doPhysics(squadBossPhysics);

  smoothFollow(enemyBosses, enemyBossPhysics, bossMotion);
  smoothFollow(squadBosses, squadBossPhysics, bossMotion);

  for (let s of players)
    s.showBase();

  for (let p of ageP)
    p.show();

  for (let s of players) {
    s.updateSmooth();
    s.show();
  }

  for (let p of particles)
    p.show();

  for (let i = nukeP.length - 1; i >= 0; i--)
    nukeP[i].show();

  for (let s of players)
    if (mouseIsPressed && mouseX > s.pos.x - 25 && mouseX < s.pos.x + 90 && mouseY > s.pos.y - 50 && mouseY < s.pos.y + 100)
      s.showInfo();

    scoreBuggy.show();

  memorials[0].updateSmooth();
  memorials[1].updateSmooth();

  memorials[0].show();
  memorials[1].show();

  NukeP.clear();
  AgeP.clear();
}

function drawWater(res, x2, y2, density = 0.1) { 
  var xoff = 0.0;
  for (var x = 0; x <= width + res; x += res) {
    var yoff = 10000.0;
    for (var y = 0; y <= height + res; y += res) {
      var bright = map(noise(xoff + x2, yoff + y2), 0, 1, 0, 20);
      noStroke();

      fill(lerpColor( color(hue(greenColor), map(abs(scores.x-scores.y), 0, nukeDef, 0, 255), bright) , color(hue(redColor),  map(abs(scores.x-scores.y), 0, nukeDef, 0, 255), bright), scoreBuggy.physics.x / (scoreBuggy.end - scoreBuggy.start)));

      rect(x, y, res, res);
      yoff += density;
    }
    xoff += density;
  }
  x2 += 0.005;
  y2 += 0.0025;
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
    spawnNuke(battles[i].base1.x + 27, battles[i].base1.y, int(random(5, 10 + 1)));

  for (let i = 0; i < battleCount; i++)
    spawnNuke(battles[i].base2.x + 27, battles[i].base2.y, int(random(5, 10 + 1)));
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

function rev(arr) {
  let n = [];

  for(let i = arr.length - 1; i >=0; i--)
    n.push(arr[i]);
  return n;
}

function loadImages() {
 eyePics.push(loadImage('https://www.dropbox.com/s/2aaz1efxq920vt6/e14.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/3gel3q94hqh1im9/e13.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/bcrehup5jhuhwbk/e12.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/1n76nc5i39p2iu7/e11.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/40pjbn2ngyghjma/e10.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/aymk2xim60ch6f4/e9.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/30zvvq4sqhxdzzq/e8.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/n3uch62a1p7zvp6/e7.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/ngshdob493xldnx/e6.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/7g00erk7mf5l11q/e5.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/xazw8ynq6askydh/e4.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/o1tof0pacjrl46y/e3.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/v22rq8xvtcesj93/e2.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/bz7vloxg6ewudg7/e1.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 eyePics.push(loadImage('https://www.dropbox.com/s/rpwg2ikyjwjwan7/e0.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));

 facePics.push(loadImage('https://www.dropbox.com/s/22xvgyby7n5k9ii/f11.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/krb88tmh8kjvspo/f10.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/3gs7voi1e6l7u5a/f9.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/jdb34gas02jjhgd/f8.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/8laxcmv67er13ox/f7.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/6lijwfnljpmpnbc/f6.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/ptrfqzqq1uh7jjp/f5.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/y2vlp81tobaruqh/f4.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/84p5yr6qg0ido0v/f3.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/8utzyb6kn7jx14c/f2.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/ru3hngmzpr508n9/f1.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 facePics.push(loadImage('https://www.dropbox.com/s/0x5nw9qrq4rikmc/f0.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));

 hairPics.push(loadImage('https://www.dropbox.com/s/v11ev22e323akjs/h12.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/bjuolcmqo3ld8fz/h11.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/4ev696oqfd8jrnp/h10.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/51aissvpocr30m3/h9.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/qi12x9m6d545mrs/h8.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/zk3275mrewztie8/h7.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/ypdfqh1u275yhi6/h6.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/u4jf2pig8bo9a4y/h5.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/kq144w4bgwsmfg4/h4.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/ub8lq0vh1l3j5hc/h3.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/hzzxwmlk6ky06fm/h2.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/fv84l7pd10u3v17/h1.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 hairPics.push(loadImage('https://www.dropbox.com/s/segvm2nmk1c7k4f/h0.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));

 mouthPics.push(loadImage('https://www.dropbox.com/s/irff6iinevkiogt/m15.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/89n79e454qohaq2/m14.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/lg6on53ttd0yf91/m13.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/4n5w4ci4vdrvko5/m12.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/a4rgr6stycz76e1/m11.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/jx03fwosr0nt2ir/m10.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/0oyo0dm42nxv3uc/m9.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/0zsfxz1hzbwjhje/m8.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/z4lkkfvq92jptdj/m7.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/9bquhnrpn190gg1/m6.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/ttma99agijxhs9f/m5.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/7yzbitpute5zcvo/m4.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/mrhcqm9riz33rqr/m3.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/uffidtwzzkyj7xs/m2.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/625wvr2p0zcakdp/m1.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));
 mouthPics.push(loadImage('https://www.dropbox.com/s/at3wfba0210vgq0/m0.png?dl=0'.replace('www.dropbox.com', 'dl.dropboxusercontent.com')));

 eyePics = rev(eyePics);
 hairPics = rev(hairPics);
 mouthPics = rev(mouthPics);
 facePics = rev(facePics);
}