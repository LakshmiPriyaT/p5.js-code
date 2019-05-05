let money = 0;
let factory;
let birds = [], missiles = [], minionQueue = [], minions = [], 
    smoke = [], groundEx = [], junk = [], trucks = [];
let turret;
let birdCount = 5;
let looping = true;
let reloadTime = 90;
let displayTruck;
let freqButton, birdButton, minionButton, minionSpeedButton, 
    missileSpeedButton, autoButton;
let freqEnabled = false, birdEnabled = false, minionEnabled = false,
    minionSpeedEnabled, missileSpeedEnabled, autoEnabled;
let buttonSpacing = 5;
let minionSpeed = 2, missileSpeed = 3;
    
function setup() {
  createCanvas(1000, 650);

  let w = 150;
  let h = 300;
  factory = new Factory(width / 2.5 - w / 2, 2 * height / 3 - h / 2 + 30, w, h);
  turret = new Turret(factory.pos.x + factory.dim.x / 2, factory.pos.y - factory.dim.y / 10);
  for (let i = 0; i < birdCount; i++)
    birds.push(new Bird(random(-width * 0.5, width * 1.5), random(height / 4)));
  
  displayTruck = new Truck(factory.pos.x + 57, 525, true);

  freqButton = new UI(100, 100, 250, 50);
  
  birdButton = new UI(freqButton.pos.x, freqButton.pos.y + freqButton.dim.y + buttonSpacing,
                       freqButton.dim.x, freqButton.dim.y);
  
  minionButton = new UI(birdButton.pos.x, birdButton.pos.y + birdButton.dim.y + buttonSpacing,
                       birdButton.dim.x, birdButton.dim.y);
  
  minionSpeedButton = new UI(minionButton.pos.x, minionButton.pos.y + minionButton.dim.y + buttonSpacing,
                       minionButton.dim.x, minionButton.dim.y);
  
  missileSpeedButton = new UI(minionSpeedButton.pos.x, minionSpeedButton.pos.y + minionSpeedButton.dim.y + buttonSpacing,
                       minionSpeedButton.dim.x, minionSpeedButton.dim.y);
  
  autoButton = new UI(missileSpeedButton.pos.x, missileSpeedButton.pos.y + missileSpeedButton.dim.y + buttonSpacing,
                       missileSpeedButton.dim.x, missileSpeedButton.dim.y);
  
  freqButton.cost = 1;
  birdButton.cost = 1;
  minionButton.cost = 1;
  minionSpeedButton.cost = 1;
  missileSpeedButton.cost = 1;
  autoButton.cost = 25;
}

function mousePressed() {
  if(!looping) {
    if(money >= freqButton.cost && freqButton.contains(mouseX, mouseY)) {
      
      if(reloadTime == 2)
        reloadTime = 1;
      else {
        reloadTime *= 0.75;
        reloadTime = round(reloadTime);
      }
      
      money -= freqButton.cost;
      freqButton.cost++;
    }
  
    if(money >= birdButton.cost && birdButton.contains(mouseX, mouseY)) {
      birdCount *= 1.25;
      birdCount = round(birdCount);
      money -= birdButton.cost;
      birdButton.cost++;
    }
  
    if(money >= minionButton.cost && minionButton.contains(mouseX, mouseY)) {
      factory.minionCount++;
      factory.minionCount = round(factory.minionCount);
      money -= minionButton.cost;
      minionButton.cost++;
    }
  
   if(money >= minionSpeedButton.cost && minionSpeedButton.contains(mouseX, mouseY)) {
      minionSpeed += 0.25;
      minionSpeed = round(100 * minionSpeed) / 100;
      money -= minionSpeedButton.cost;
      minionSpeedButton.cost++;
    }
  
    if(money >= missileSpeedButton.cost && missileSpeedButton.contains(mouseX, mouseY)) {
      missileSpeed += 0.25;
      money -= missileSpeedButton.cost;
      missileSpeedButton.cost++;
    }
    
    if(money >= autoButton.cost && autoButton.contains(mouseX, mouseY)) {
      turret.automated = true;
      money -= autoButton.cost;
      autoButton.cost++;
    }
    
    handleEnabling();
    ui();
  }
}

function keyPressed() {
  if (key == ' ' && looping) {
    looping = !looping;
    noLoop();
  } else if (key == ' ' && !looping) {
    looping = !looping;
    loop();
  }
  
  if(!looping)
    handleEnabling();
}

function draw() {
  background(20);
  
   if(mouseIsPressed && !turret.automated && turret.reloading > reloadTime) {
    let m = new Missile(turret.pos.x, turret.pos.y - 25, createVector());
    m.automated = false;
    m.vel = p5.Vector.sub(createVector(mouseX, mouseY), turret.pos);
    m.vel.setMag(missileSpeed);
    missiles.push(m);
    turret.reloading = 0;
  }
  
  if(birdCount >= 100)
    factory.capacity = 50;
  else if(birdCount >= 25)
    factory.capacity = 10;
  else if(birdCount >= 10)
    factory.capacity = 3;
  
  while (birds.length < birdCount) {
    birds.push(new Bird(random(-width * 0.5, -5), random(height / 4)));
  }

  for (let i = missiles.length - 1; i >= 0; i--) {
    missiles[i].show();
    missiles[i].update();
  }

  factory.show();
  factory.operate();

  turret.operate();
  turret.show();
  
  for (let i = 0; i < birds.length; i++) {
    birds[i].fly();
    birds[i].show();
  }

  GroundEx.manage();
  for (let p of groundEx)
    p.show();

  for (let i of minions) {
    i.show();
    i.update();
  }

  for (let p of smoke)
    p.show();
  
  Junk.manage();
  
  for (let p of junk)  {
    p.show();
  }
  
  Truck.manage();
  for (let p of trucks) {
    p.update();
    p.show();
  }
  
  displayTruck.update();
  displayTruck.show();

  fill(0, 0, 170);
  noStroke();
  rect(factory.pos.x, factory.pos.y + factory.dim.y/2 + 50, factory.dim.x, 70);
  rect(factory.pos.x, factory.pos.y + factory.dim.y - 50, factory.dim.x * 0.75, 50);
  
  drawMoney();
  
  fill(0, 0, 170);
  ellipse(factory.pos.x, factory.pos.y + factory.dim.y, 75, 75);
  
  fill(50, 100, 0);
  noStroke();
  rect(0, height - 37, width * 1.5, 100);
  
  
  
  if(!looping)
    ui();
  
}

function ui() {
  drawMoney();
  
  let str = "Frequency";
  let freqStr = str + ": " + reloadTime + "\n" + str + " Cost: " + freqButton.cost;
  str = "Bird Count";
  let birdStr = str + ": " + birdCount + "\n" + str + " Cost: " + birdButton.cost;
  str = "Minion Count";
  let minionStr = str + ": " + factory.minionCount + "\n" + str + " Cost: " + minionButton.cost;
  str = "Minion Speed";
  let minionSpeedStr = str + ": " + minionSpeed + "\n" + str + " Cost: " + minionSpeedButton.cost;
  str = "Missile Speed";
  let missileSpeedStr = str + ": " + missileSpeed + "\n" + str + " Cost: " + missileSpeedButton.cost;
  str = "Turret Automation";
  let autoStr = str + ": " + turret.automated + "\n" + str + " Cost: " + autoButton.cost;
  
  drawButton(freqStr, freqButton.pos, freqButton.dim, freqButton.enabled);
  drawButton(birdStr, birdButton.pos, birdButton.dim, birdButton.enabled);
  drawButton(minionStr, minionButton.pos, minionButton.dim, minionButton.enabled);
  drawButton(minionSpeedStr, minionSpeedButton.pos, minionSpeedButton.dim, minionSpeedButton.enabled);
  drawButton(missileSpeedStr, missileSpeedButton.pos, missileSpeedButton.dim, missileSpeedButton.enabled);
  drawButton(autoStr, autoButton.pos, autoButton.dim, autoButton.enabled);
}

function drawButton(s, pos, dim, enabled) {
  let enabledC = color(255, 100, 0);
  let disabledC = color(60, 60, 65);
  let enabledS = color(255, 255, 0);
  let disabledS = color(100);
  
  if(enabled) {
    fill(enabledC);
    stroke(enabledS);
  } else {
    fill(disabledC);
    stroke(disabledS);
  }
  
  rect(pos.x, pos.y, dim.x, dim.y);
  
  fill(255);
  noStroke();
  textSize(14);
  text(s, pos.x + 10, pos.y + 18);
}

function handleEnabling() {
  if(money >= freqButton.cost) {
      freqButton.enabled = true;
    } else {
      freqButton.enabled = false;
    }
    
    if(money >= birdButton.cost) {
      birdButton.enabled = true;
    } else {
      birdButton.enabled = false;
    }
  
  if(money >= minionButton.cost) {
      minionButton.enabled = true;
    } else {
      minionButton.enabled = false;
    }
  
  if(money >= minionSpeedButton.cost) {
      minionSpeedButton.enabled = true;
    } else {
      minionSpeedButton.enabled = false;
    }
  
  if(money >= missileSpeedButton.cost) {
      missileSpeedButton.enabled = true;
    } else {
      missileSpeedButton.enabled = false;
    }
  
  if(money >= autoButton.cost && !turret.automated) {
      autoButton.enabled = true;
    } else {
      autoButton.enabled = false;
    }
}

function drawMoney() {
  fill(30);
  let m = round(100 * money) / 100;
  rect(width/2-20, 20, 20 + 20*(m+"").length, 37);
  fill(255, 255, 0);
  textSize(32);
  text(m, width / 2 - 10, 50);
}

function inc(value, coeff) {
  return coeff * value * value;
}















//w