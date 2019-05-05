class Section {
  constructor(x1, y1, x2, y2, amount = 100) {
    this.start = createVector(x1, y1);
    this.end = createVector(x2, y2);
    this.amount = amount;

    this.dx = (x2 - x1) / amount;
    this.dy = (y2 - y1) / amount;
    this.slope = (y2 - y1) / (x2 - x1);
    this.verts = this.fillVerts();
  }

  fillVerts() {
    let a = [];
    let x = this.start.x, y = this.start.y;
    while (x != this.end.x && y != this.end.y) {
      a.push(createVector(x, y));
      if (abs(this.end.x - x) > this.dx)
        x += this.dx;
      else
        x = this.end.x;
      if (abs(this.end.y - y) > this.dy)
        y += this.dy;
      else
        y = this.end.y;
    }
    a.push(createVector(x, y));
    return a;
  }

  connect(other, reverse = false) {
    for (let i = 0; i < this.verts.length; i++) {
      let point1;
      let point2 = other.verts[i];
      if (reverse)
        point1 = this.verts[other.verts.length - i - 1];
      else
        point1 = this.verts[i];
      if (point1 && point2)
        line(point1.x, point1.y, point2.x, point2.y);
    }
  }

  show() {
    fill(0, 255, 0);
    stroke(255);
    strokeWeight(1);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
    strokeWeight(2);

    for (let i = 0; i < this.verts.length; i++) {
      let v = this.verts[i];
      circle(v.x, v.y, 2);
    }
  }
}






















//w