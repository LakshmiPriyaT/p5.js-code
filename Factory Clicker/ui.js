class UI {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.dim = createVector(w, h);
    
    this.enabled = false;
    this.cost = 0;
  }

  contains(x, y) {
    return x >= this.pos.x && x <= this.pos.x + this.dim.x &&
      y >= this.pos.y && y <= this.pos.y + this.dim.y;
  }
  
  update(x, y, coeff) {
    if (this.enabled && this.contains(mouseX, mouseY)) {
      money -= this.cost;
      this.cost = round(100 * inc(this.cost, 1.01)) / 100;
      this.att = round(this.att * coeff);
      this.enabled = false;
    }
    this.show();
  }

  setString() {
    this.fullString = this.str + this.att + "\n" + this.str + "Cost: " + this.cost;
  }
}