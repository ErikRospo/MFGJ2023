// import * as _ from 'lodash';
import * as PIXI from 'pixi.js';

// function component() {
//     const element = document.createElement('div');
//     // Lodash, now imported by this script
//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//     return element;
//   }

//   document.body.appendChild(component());
type bool2d = boolean[][];
let grid: bool2d = [];
let width = 720;
let height = 480
let grid_width = 10;
let grid_height = 10;
for (let x = 0; x < width / grid_width; x++) {
  let temp_array: boolean[]
  for (let y = 0; y < height / grid_height; y++) {
    temp_array.push(false)
  }
  grid.push(temp_array)
}
function updateGol(grid: bool2d): bool2d {
  let newgrid: bool2d


  for (let x = 0; x < width / grid_width; x++) {
    let temp_array: boolean[]
    for (let y = 0; y < height / grid_height; y++) {
      let total: number = 0;
      total += grid[x - 1][y + 1] ? 1 : 0
      total += grid[x - 1][y - 1] ? 1 : 0
      total += grid[x - 1][y] ? 1 : 0
      total += grid[x + 1][y + 1] ? 1 : 0
      total += grid[x + 1][y - 1] ? 1 : 0
      total += grid[x + 1][y] ? 1 : 0
      total += grid[x][y + 1] ? 1 : 0
      total += grid[x][y - 1] ? 1 : 0
      if (grid[x][y] && (total == 2 || total == 3)) {
        temp_array.push(true)
      }
      else if (!grid[x][y] && (total == 3)) {
        temp_array.push(true)
      } else {
        temp_array.push(false)
      }
    }
    grid.push(temp_array)
  }
  return newgrid;
}