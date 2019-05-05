let b = 0;
let density = 50;
let hStep = 360 / 4;
let al = 360 / 1;
let dis = 300;
let verts = [];
let secs = [];
let one, two, three, four, five;

function setup() {
  createCanvas(700, 700);
  colorMode(HSB, 360);
}

function draw() {
  background(0);

  let x = mouseX; //ball.pos.x;
  let y = mouseY; //ball.pos.y;

  if (x > b && y > b && x < width - b && y < height - b) {
    one = new Section(x, y, b - 1, height - b, density);
    two = new Section(x, y, width - b, height - b - 1, density);
    three = new Section(b, b, x, y, density);
    four = new Section(width - b, b, x, y, density);
  }

  if (one && two && three) {
    stroke(255, al);
    one.connect(two, true);
    three.connect(one);
    four.connect(two);
    three.connect(four, true);
  }
}

function setStroke(h) {
  stroke(h, 255, 255, al);
}