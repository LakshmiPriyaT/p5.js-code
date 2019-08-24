let player;
let right = 0, left = 0, up = 0, down = 0;
let targetPos;
let circles = [];
let interactables = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  player = new Player(0, 0);
  targetPos = player.pos.copy();

  fill(0, 255, 255);
  noStroke();
  for(let i = 0; i < 1000; i++) {
    circles.push(createVector(random(-width, width), random(-height, height), random(10, 50)));
  }

  for(let i = 0; i < 1; i++) {
    interactables.push(new Interactable(random(width/4, width*3/4), random(0, height), 'small', 200));
  }

  for(let i = 0; i < 5; i++) {
    player.addInventory( color(random(255), random(255), random(255)) );
  }
}

function draw()
{
  noStroke();
  background(0);
  fill(0, 255, 255);

  targetPos.x -= (right - left) * player.targetSpeed;
  targetPos.y -= (down - up) * player.targetSpeed;

  player.update();
  translate(player.pos.x, player.pos.y);

  for(let c of circles) {

    if(abs(dist(player.truePos.x, player.truePos.y, c.x, c.y)) < 250)
      fill(0, 0, 30);
    else
      fill(255, 0, 5);
    circle(c.x, c.y, c.z);
  }

  for(let i of interactables) {
    i.update();
    i.show();
  }
  
  player.show();
  player.showInventory();

}

function mousePressed() {
for(let i of interactables) {
    i.offsets = createVector(width/2 - player.truePos.x, height/2 - player.truePos.y);
    let mousePos = createVector(mouseX - i.offsets.x, mouseY - i.offsets.y);
    fill(255);
    circle(mousePos.x, mousePos.y, 25);
    circle(i.pos.x, i.pos.y, 10);
    if(i.closeEnough && (mousePos.x > i.pos.x - i.dim.x/2 && mousePos.x < i.pos.x + i.dim.x/2 && mousePos.y > i.pos.y - i.dim.y/2 && mousePos.y < i.pos.y + i.dim.y/2)) {
      i.inventoryShowing = !i.inventoryShowing;
    }
  }
}

function keyReleased()
{
    if (keyCode == LEFT_ARROW || keyCode == 65) { left = 0; }
    if (keyCode == RIGHT_ARROW || keyCode == 68){ right = 0; }
    if (keyCode == UP_ARROW || keyCode == 87) { up = 0; }
    if (keyCode == DOWN_ARROW || keyCode == 83){ down = 0; }

}

function keyPressed()
{
    if (keyCode == LEFT_ARROW || keyCode == 65) { left = 1; }
    if (keyCode == RIGHT_ARROW || keyCode == 68){ right = 1; }
    if (keyCode == UP_ARROW || keyCode == 87) { up = 1; }
    if (keyCode == DOWN_ARROW || keyCode == 83){ down = 1; }

    if(key == 'o')
      player.addInventory(color(random(255), random(255), random(255)));
    if(key == 'x')
      player.removeInventory(player.inventory[player.itemCount - 1]);
  
}