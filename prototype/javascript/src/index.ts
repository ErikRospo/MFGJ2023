// import * as _ from 'lodash';
import * as PIXI from 'pixi.js';

const canvas = document.createElement('canvas');
const ctx=canvas.getContext("2d");
document.body.appendChild(canvas);
type bool2d = boolean[][];
let grid: bool2d = [];
let width = 720;
let height =480
canvas.width=width;
canvas.height=height;
let grid_size = 10;

for (let x = 0; x < width / grid_size; x++) {
  let temp_array: boolean[]=[];
  for (let y = 0; y < height / grid_size; y++) {
    temp_array.push(false)
  }
  grid.push(temp_array)
}
function drawSquare(x: number,y: number,s: number,state:boolean=false): void{
  ctx.fillStyle=state?"black":"white";
  ctx.fillRect(x,y,s,s);
  
}
function updateGol(grid: bool2d): bool2d {
  let newgrid: bool2d=[];


  for (let x = 0; x < width / grid_size; x++) {
    let temp_array: boolean[]=[];
    for (let y = 0; y < height / grid_size; y++) {
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
    newgrid.push(temp_array)
  }
  return newgrid;
}
function render(rendergrid:bool2d=grid){
  for (let x = 0; x < width; x+=grid_size) {
    for (let y=0;y<height;y+=grid_size){
      drawSquare(x,y,grid_size,rendergrid[x/grid_size][y/grid_size])

    }    
  }
}
function step(){
  grid=updateGol(grid);
  render(grid)
}
setTimeout(()=>{step()},500)