/// <reference path="../types.d.ts"/>
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import { Place } from './patterns';
import { Player } from './player';
import { bool2d } from './types';
import level from "./levels/gospergun.rle";
import { padbool2d } from './utility';
console.log(level);
const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
let frame = 0;
let grid: bool2d = [];
let grid_size = 20;
let fps = 60;

let width = Math.floor(window.innerWidth / grid_size) * grid_size;
let height = Math.floor(window.innerHeight / grid_size) * grid_size;
canvas.width = width;
canvas.height = height;
function reset(): void {
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
    ctx.save()
    ctx.fillStyle = state ? "white" : "black";
    ctx.fillRect(x, y, s, s);
    ctx.restore()
}
// Place.glider(grid, 5, 5)
// Place.glider(grid, 10, 5)
// Place.glider(grid, 5, 10)
// Place.glider(grid, 10, 10)
Place.block(grid, 20, 30)
Place.block(grid, 23, 30)

// Place.blinker_h(grid, 30, 15)
// Place.blinker_v(grid, 35, 15)

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
    let px = Math.floor(player.x / grid_size)
    let py = Math.floor(player.y / grid_size)
    for (let x = 0; x < width / grid_size; x++) {

        for (let y = 0; y < height / grid_size; y++) {

            drawSquare(x * grid_size, y * grid_size, grid_size, rendergrid[x][y])
            if (x == px + 1 && y == py) {
                ctx.fillStyle = "red"
                ctx.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);

            }
            if (x == px && y == py + 1) {
                ctx.fillStyle = "green"
                ctx.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);

            }
            if (x == px && y == py - 1) {
                ctx.fillStyle = "blue"
                ctx.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);

            }
            if (x == px - 1 && y == py) {
                ctx.fillStyle = "yellow"
                ctx.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);

            }
        }
    }
    player.render(ctx, grid_size);
}
function step() {
    if (frame % 5 == 0) {
        grid = updateGol(grid);
    }
    frame += 1;
    player.update(1);
    player.collide(grid, grid_size)
    render(grid)
    if (player.x < 0 || player.y < 0 || player.x > width || player.y > height) {
        player.x = 20 * grid_size
        player.y = 0
        player.ax = 0
        player.ay = 0
        player.vx = 0
        player.vy = 0;
        // let player = new Player(20 * grid_size, 0, grid_size, grid_size);

    }

}
let enabled = !false
setInterval(() => {
    if (enabled) step()
}, 1000 / fps)

addEventListener("keypress", (ev) => {
    switch (ev.key) {
        case "y":
            if (!enabled) {
                step()
            }

            break
        case "t":
        case " ":
            enabled = !enabled
            break;
        case "r":
            reset()
            break;
        case "w":
            player.ay = -10;
            break;
        case "a":
            player.ax = -2;
            break;
        case "d":

            player.ax = 2;
            break;
        case "l":
            let pb = padbool2d(level, grid[0].length, grid.length);
            grid = pb;

            break;
        case "k":
            location.reload();
            break;

    }
})
step()