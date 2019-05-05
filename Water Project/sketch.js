let b = [], pos = [];
let s, res;
let radius = 10;
let offset = 0;
let enemy;

function setup() {
  createCanvas(700, 650);
  res = createVector(radius + offset, radius + offset);
  let x = 0,
    y = 0;

  while (x <= width + radius && y <= height + radius) {
    pos.push(createVector(x, y));

    x += res.x;

    if (x >= width + radius) {
      x = 0;
      y += res.y;
    }
  }
  for (let i = 0; i < pos.length; i++)
    b.push(new Vehicle(pos[i].x, pos[i].y, pos[i]));
  enemy = new Spawner(width/2, height/2, 50, 11, 9, color(101));
  colorMode(HSB, 360);
}

function draw() {
  background(180+20, 200, 90);
  enemy.x = mouseX;enemy.y = mouseY;
  enemy.move();
  enemy.paint();
  
  for (let i = 0; i < b.length; i++) {
    b[i].r = radius;
    b[i].behaviors(createVector(enemy.x, enemy.y));
    b[i].move();
    b[i].maxSpeed = 17;
    b[i].maxForce = 2;
    b[i].slowingRadius = 100;
    b[i].mouseStrength = 4;
    b[i].mouseRadius = 50;
    enemy.r = b[i].mouseRadius * 1.75;
    b[i].col = color(
      map(b[i].vel.mag(), 0, b[i].maxSpeed, 180, 0),
      360,
      map(b[i].vel.mag(), 0, b[i].maxSpeed, 360, 360), 
      map(b[i].vel.mag(), 0, b[i].maxSpeed, 45, 360));
    
    //b[i].col = color(180, 360, 270, 
      //map(b[i].vel.mag(), 0, b[i].maxSpeed, 120, 180));
    
    b[i].paint();
  }
}