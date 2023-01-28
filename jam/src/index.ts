import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import { Place } from './patterns';
import { Player } from './player';
import { bool2d } from './types';
const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
let grid: bool2d = [];
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
let player = new Player(20 * grid_size, 0, grid_size, grid_size);

/**
 * Draws a square at a location, (`x`,`y`), that has a side length of `s`   
 * If state is false, the square is black, otherwise, it is white;
 * @param {number} x the x position to draw the square at
 * @param {number} y the y position to draw the square at
 * @param {number} s the square's side length
 * @param {boolean} state whether to draw the square as black (false) or white (true)
 */
function drawSquare(x: number, y: number, s: number, state: boolean = false): void {
    ctx.fillStyle = state ? "white" : "black";
    ctx.fillRect(x, y, s, s);

}
Place.glider(grid, 5, 5)
Place.glider(grid, 10, 5)
Place.glider(grid, 5, 10)
Place.glider(grid, 10, 10)
Place.block(grid, 20, 15)
Place.blinker_h(grid, 30, 15)
Place.blinker_v(grid, 35, 15)
function updateGol(oldgrid: bool2d): bool2d {
    let newgrid: bool2d = [];
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
function render(rendergrid: bool2d = grid) {
    console.log(rendergrid.length)
    for (let x = 0; x < width / grid_size; x++) {

        for (let y = 0; y < height / grid_size; y++) {
            drawSquare(x * grid_size, y * grid_size, grid_size, rendergrid[x][y])

        }
    }
    player.render(ctx, grid_size);
}
function step() {
    grid = updateGol(grid);
    player.update(1);
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
            break
    }
})
step()