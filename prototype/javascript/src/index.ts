import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
type state2d = boolean[][];
let grid: state2d = [];
let grid_size = 20;
let fps = 5;

let width = Math.floor(window.innerWidth / grid_size) * grid_size;
let height = Math.floor(window.innerHeight / grid_size) * grid_size;
canvas.width = width;
canvas.height = height;
function reset() {
  grid = [];
  for (let x = 0; x < width / grid_size; x++) {
    let temp_array: boolean[] = [];
    for (let y = 0; y < height / grid_size; y++) {
      temp_array.push(false)
    }
    grid.push(temp_array)

  }
}
reset()
function drawSquare(x: number, y: number, s: number, state: boolean = false): void {
  ctx.fillStyle = state ? "white" : "black";
  ctx.fillRect(x, y, s, s);

}
function glider(x: number, y: number): void {
  grid[x][y] = false
  grid[x + 1][y] = false
  grid[x + 2][y] = true
  grid[x][y + 1] = true
  grid[x + 1][y + 1] = false
  grid[x + 2][y + 1] = true
  grid[x][y + 2] = false
  grid[x + 1][y + 2] = true
  grid[x + 2][y + 2] = true
}
glider(5, 5)
glider(5, 10)
glider(10, 5)
glider(10, 10)
grid[21][20] = true
grid[22][20] = true
grid[23][20] = true
function updateGol(oldgrid: state2d): state2d {
  let newgrid: state2d = [];
  let gh = oldgrid[0].length
  let gw = oldgrid.length

  for (let x = 0; x < gw; x++) {
    let temp_array: boolean[] = [];
    for (let y = 0; y < gh; y++) {
      let total: number = 0;

      // check the number of neighboring cells

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if ((i !== 0 || j !== 0) && oldgrid[(x + i + gw) % gw][(y + j + gh) % gh]) {
            total++;
          }
        }
      }
      if (oldgrid[x][y] && (total == 2 || total == 3)) {
        temp_array.push(true)
      }
      else if (!oldgrid[x][y] && (total == 3)) {
        temp_array.push(true)
      } else {
        temp_array.push(false)
      }
    }
    newgrid.push(temp_array)
  }
  return newgrid;
}
function render(rendergrid: state2d = grid) {
  console.log(rendergrid.length)
  for (let x = 0; x < width / grid_size; x++) {

    for (let y = 0; y < height / grid_size; y++) {
      drawSquare(x * grid_size, y * grid_size, grid_size, rendergrid[x][y])

    }
  }
}
function step() {
  grid = updateGol(grid);
  console.log(grid);
  render(grid)
}
let enabled = true
setInterval(() => {
  if (enabled) step()
}, 1000 / fps)
addEventListener("keypress", (ev) => {
  switch (ev.key) {
    case "s":
      if (!enabled) {
        step()
      }

      break
    case "t":
    case " ":
      enabled = !enabled
      break
    case "r":
      reset()
      glider(5, 5)
      break
  }
})
step()