let fd = [], fish = [], sharks = [], hermits = [], deathParticles = [], userParticles = [], 
    bubbles = [], whales = [], ripples = [], grass = [], hsParticles = [], bombs = [];
let faster = false, looping = true;
let foodValue = 50;
let foodCount = 100;
let iterations = 1, fastForward = 2, jump = 1;
let sharkCount = 0, hermitCount = 0, bombCount = 0;

let maxForceCap = 3, maxSpeedCap = 20, eatDistanceCap = 5;
let sharksToFishRatio = 15;
let hermitsToFishRatio = 40;
let bombsToFishRatio = 60;
let borderW;
let optimized = false;

let res = 100, x2 = 0, y2 = 0, x3 = 0, y3 = 0;
let density = 0.1;

let highScore = 0;
let winAmount = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);

  borderW = height / 8;
  
  colorMode(HSB, 255);
  for (let i = 0; i < 1; i++)
    fish.push(new Fish(random(borderW, width - borderW), random(borderW, height - borderW), 15, color(255, 255, 255)));

  for (let i = 0; i < fish.length; i++) {
    fish[i].col = color(random(255), 255, 255, 255);
    fish[i].maxForce = random(1, 2);
    fish[i].maxSpeed = random(0, maxSpeedCap);
    fish[i].slowingRadius = random(0, 100);
    fish[i].avoidForce = fish[i].maxForce * 0.67;
    fish[i].eatDistance = random(0.5, 2);
  }
  
  for(let i = 0; i < 10; i++)
  	bubbles.push(new Bubble());
  
  let randomness = 5;
  let density = 25;
  for(let i = -density; i < width + density; i += density) {
    let r = random(width);
    let n = noise(r / 50);
    let g = new Grass(r, height, n * 20 + random(-randomness, randomness));
    let g2 = new Grass(r + random(-10, 10), height, n * 13 + random(-randomness, randomness));
    let g3 = new Grass(r + random(-10, 10), height, n * 7 + random(-randomness, randomness));
    g.thickness = 1;
    g2.thickness = 3;
    g3.thickness = 7;
    grass.push(g);
    grass.push(g2);
    grass.push(g3);
  }
}

function mousePressed() {
  for(let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    let d = relativeDist(b.pos.x, b.pos.y, mouseX, mouseY);
    if(d <= sq(b.r))
      b.split();
  }
  
  for(let i = sharks.length - 1; i >= 0; i--) {
    let s = sharks[i];
    let d = relativeDist(s.pos.x, s.pos.y, mouseX, mouseY);
    
    if(d <= sq(s.width) / 1.5  && frameRate() > 15) {
        for(let j = 0; j < 15; j++)
          deathParticles.push(new DeathParticle(sharks[i].pos.x, sharks[i].pos.y, sharks[i].width / 3, sharks[i].col));
      sharks.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (keyCode == DOWN_ARROW && fd.length >= 3)
    decreaseFood(floor(fd.length / 4));
    
  if (keyCode == 32) { // [SPACE]
    looping = !looping;

    if (looping)
      loop();
    
  } else if (key == 'f') {
    faster = !faster;
    deathParticles = [];
  }
}

function draw() {

  manageFood();
  
  if(optimized || faster)
  	background(137, 255, 25);
  else
    drawWater();

  if (keyIsDown(UP_ARROW) && fd.length < 500)
      increaseFood(10);
  
  while(fd.length > 501)
    decreaseFood();
        
  
  if (keyIsDown(RIGHT_ARROW))
    fastForward += 1;
  else if (keyIsDown(LEFT_ARROW))
    fastForward -= 1;

  fastForward = map(frameRate(), 30, 60, 1, 50);
  fastForward = constrain(fastForward, 1, 50);

  if (looping == false)
    noLoop();

  jump = faster ? fastForward : 1;

  for (let k = 0; k < jump; k++) //
  {
    iterations++;

    for (let i = 0; i < fd.length; i++) // show food
      fd[i].show();
    
    for (let i = 0; i < bombs.length; i++) // show bombs
      bombs[i].show();
    
    sharkCount = floor(fish.length / sharksToFishRatio);
    hermitCount = floor(fish.length / hermitsToFishRatio);
    bombCount = floor(fish.length / bombsToFishRatio);

    Shark.managePopulation();		
    Hermit.managePopulation();
	  Bomb.managePopulation();
    
    Shark.applyAllForces();
    Hermit.applyAllForces();
    
    manageFood();
    
    Fish.removeDead(fish);
	  Fish.applyAllForces(0.007, 0.033); // applyAllForces(reproduction_chance, mutation_chance)

    manageFood();
  }

  if(!faster && !optimized) { // manage particles
    for (let i = 0; i < deathParticles.length; i++)
      deathParticles[i].run(deathParticles);

      for(let i = 0; i < bubbles.length; i++) {
        bubbles[i].run();
        bubbles[i].show();
      }
    
    for(let i = 0; i < ripples.length; i++) 
        ripples[i].show();
    
     for(let i = 0; i < grass.length; i++)
        grass[i].show();
      
    for(let i = 0; i < hsParticles.length; i++)
      hsParticles[i].show();
  }
  
  if(fish.length > highScore) {
    highScore = fish.length;
    
    if(!faster && !optimized)
      for(let i = 0; i < 10; i++)
        hsParticles.push(new HighScoreParticle(width/2, 40, random(255)));
  }
  
  if(highScore > winAmount && !faster && !optimized)
      for(let i = 0; i < 1; i++)
        hsParticles.push(new HighScoreParticle(width/2, 40, 51));
  
  textFont("Arial");
  noStroke();
  textSize(30);
  fill(color(255, 0, 255));
  text("Population: "+fish.length, 10, 30);
  
  
  if(foodCount > 500)
    text("Food: " + 500, width - 170, 30);
  else
    text("Food: " + foodCount, width - 170, 30);
  
  fill(50, 255, 255);
  textSize(48);
  stroke(25);
  text(highScore, width / 2 - 7 * (highScore + "").length, 50);
  
  if(!looping) { // show fish stats
    textSize(16);
    textFont("monospace");
    strokeWeight(2);
    text("Average Speed:          " + roundToPlace(Fish.averageSpeed(), 1), 10, 60);
    text("Average Force:          " + roundToPlace(Fish.averageForce(), 3), 10, 80);
    text("Average Slowing Radius: " + roundToPlace(Fish.averageSlowing()), 10, 100);
    text("Average Eat Distance:   " + roundToPlace(Fish.averageDist(), 3), 10, 120);
  }
  
}

function roundToPlace(value, places = 0) {
  let n = pow(10, places);
  return floor(value * n + 0.5) / n;
}

function drawWater() { 
  var xoff = 0.0;
  for (var x = 0; x <= width + res; x += res) {
    var yoff = 10000.0;
    for (var y = 0; y <= height + res; y += res) {
      var bright = map(noise(xoff + x2, yoff + y2), 0, 1, 0, 70);
      noStroke();
      fill(255/2 + 10, 255, bright);
      rect(x, y, res, res);
      yoff += density;
    }
    xoff += density;
  }
  x2 += 0.005;
  y2 += 0.0025;
}

function relativeDist(x1, y1, x2, y2) {
    let a = x2 - x1, b = y2 - y1;
    return (a * a) + (b * b);
}

function manageFood() {
  while (fd.length <= foodCount)
      fd.push(new Food(random(borderW, width - borderW), random(borderW, height - borderW)));
}

function increaseFood(amount = 1) {
  foodCount += amount;

  for (let i = 0; i < amount; i++)
    fd.push(new Food(random(borderW, width - borderW), random(borderW, height - borderW)));
}

function decreaseFood(amount = 1) {
  foodCount -= amount;
  fd.splice(0, amount);
}

function spawnRipple(x, y, col) {
  for(let i = 1; i < 3; i++)
    ripples.push(new Ripple(x, y, col, 0.33 * i));
}






 









//whitespace