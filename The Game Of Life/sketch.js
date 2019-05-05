let res = 5;
let cols, rows;
let old;

function setup() {
  let d = 600;
  createCanvas(d, d);
  cols = floor(width / res);
  rows = floor(height / res);

  old = generateBoard(cols, rows);

  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
        old[i][j] = floor(random(0, 2));
  
}

function draw() {
  background(0);

  //paint
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      if (old[i][j] == 0)
        fill(0);
      else
        fill(color(
      map(i, 0, rows, 0, 255),
      map(j, 0, cols, 255, 0),
      map(j, 0, cols, 0, 255)));
			noStroke();
      let x = i * res - 1;
      let y = j * res - 1;
      rect(x, y, res, res);
    }

  let next = generateBoard(cols, rows);
  
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      if (old[i][j] == 0 && countNeighbors(old, i, j) == 3) {
        next[i][j] = 1;
      } else if (old[i][j] == 1 && (countNeighbors(old, i, j) < 2 || countNeighbors(old, i, j) > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = old[i][j];
      }
    }

  old = next;
}

function countNeighbors(grid, row, col) {
  let sum = 0;

  for (var i = -1; i <= 1; i++)
    for (var j = -1; j <= 1; j++) {
      let x = (col + i + cols) % cols;
      let y = (row + j + rows) % rows;
      sum += grid[y][x];
    }
  return sum - grid[row][col];
}

function generateBoard(cols, rows) {
  let arr = new Array(cols);

  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
  }

  return arr;
}