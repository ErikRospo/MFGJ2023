/// <reference path="../types.d.ts"/>
import * as _ from 'lodash';
import { Sounds as SoundsClass } from "./audioplayer"
import * as PIXI from 'pixi.js';
import { Place } from './patterns';
import { Player } from './player';
import { bool2d } from './types';
import { levelList } from './levels';
import { padbool2d } from './utility';
import { PhysicsBody } from './classes/PhysicsBody';
import { grid_size, fps } from './constants';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");
canvas.id = "canvasElm"
document.body.appendChild(canvas);
const playButton = document.getElementById("playButton");
const menuDiv = document.getElementById("menuDiv")
const optionsMenu = document.getElementById("optionsMenu");
const optionsButton = document.getElementById("optionsButton");
const optionsBackButton = document.getElementById("backButton");
const optionsBackButton2 = document.getElementById("backButton2");
const MusicVolumeLabel = document.getElementById("musicVolLabel") as HTMLLabelElement
const MusicVolumeSlider = document.getElementById("musicVol") as HTMLInputElement
const SFXVolumeLabel = document.getElementById("SFXVolLabel") as HTMLLabelElement
const SFXVolumeSlider = document.getElementById("SFXVol") as HTMLInputElement
let frame = 0;
let grid: bool2d = [];
let Sounds = new SoundsClass();
let hasClicked = false;
let optionsEnabled = false;
let playing = false;
let width = _.floor(window.innerWidth / grid_size) * grid_size;
let height = _.floor(window.innerHeight / grid_size) * grid_size;
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
let playerEnabled: boolean = false;

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

// Place.blinker_v(grid, 18, 30)

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
            // if (x == px + 1 && y == py) {
            //     ctx.fillStyle = "red"
            //     ctx.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);

            // }
            // if (x == px && y == py + 1) {
            //     ctx.fillStyle = "green"
            //     ctx.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);

            // }
            // if (x == px && y == py - 1) {
            //     ctx.fillStyle = "blue"
            //     ctx.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);

            // }
            // if (x == px - 1 && y == py) {
            //     ctx.fillStyle = "yellow"
            //     ctx.fillRect(x * grid_size, y * grid_size, grid_size, grid_size);

            // }
        }
    }
    if (playerEnabled) {
        player.render(ctx, grid_size);
    }
}
function step() {
    if (frame % 5 == 0) {
        grid = updateGol(grid);
    }
    frame += 1;
    if (playerEnabled) {
        player.update(0.5);
    }
    render(grid)
    if (playerEnabled) {
        player.collide(grid, grid_size)

        check_for_death();

    }

}
let enabled = true
function random_grid() {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            grid[x][y] = Math.random() > 0.5 ? grid[x][y] : Math.random() > 0.5;
        }
    }
}
function init() {
    menuDiv.style.display = "flex"
    playerEnabled = false;
    step()

    random_grid()
    loadLocalStorage();
    addEventListener("click", () => {
        if (!hasClicked) {
            hasClicked = true
            Sounds.playMusic()

        }
    })
    setInterval(() => {
        if (!playerEnabled) {
            random_grid()
        }

    }, 20000)
    canvas.classList.add("blur")
    optionsButton.addEventListener("click", () => {
        optionsMenu.style.display = "flex"
        menuDiv.style.display = "none"
    })
    optionsBackButton2.style.display = "none"

    optionsMenu.style.display = "none"
    optionsBackButton.addEventListener("click", () => {
        optionsMenu.style.display = "none"
        menuDiv.style.display = "flex";

    })
    SFXVolumeSlider.addEventListener("input", (e) => {
        Sounds.SFXvolume = SFXVolumeSlider.valueAsNumber / 100
        SFXVolumeLabel.innerText = `SFX Volume: ${SFXVolumeSlider.value}%`
        localStorage.setItem("sfxVolume", SFXVolumeSlider.value)

    })
    MusicVolumeSlider.addEventListener("input", (e) => {
        Sounds.MusicVolume = MusicVolumeSlider.valueAsNumber / 100
        MusicVolumeLabel.innerText = `Music Volume: ${MusicVolumeSlider.value}%`
        localStorage.setItem("musicVolume", MusicVolumeSlider.value)
    })
    optionsBackButton2.addEventListener("click", () => {
        if (playing) {
            if (!optionsEnabled) {
                optionsEnabled = true;
                playerEnabled = false;

                enabled = false;
                optionsMenu.style.display = "flex"
                canvas.classList.add("blur")
                optionsBackButton.style.display = "none";
                optionsBackButton2.style.display = "flex"


            } else {
                optionsEnabled = false;
                enabled = true;
                playerEnabled = true;
                optionsMenu.style.display = "none";
                canvas.classList.remove("blur")
                optionsBackButton2.style.display = "none"
            }
        }
    })
}
playButton.addEventListener("click", () => {
    canvas.classList.remove("blur")
    playerEnabled = true;
    reset()
    Place.block(grid, 20, 30)
    Place.block(grid, 23, 30)
    Place.block(grid, 26, 30)
    Place.blinker_h(grid, 30, 15)
    menuDiv.style.display = "none"
    playing = true;
})

setInterval(() => {
    if (enabled) step()
}, 1000 / fps)

addEventListener("keydown", (ev) => {
    switch (ev.key.toLowerCase()) {
        case "y":
            if (!enabled) {
                step()
            }

            break

        case "r":
            reset()
            break;
        case "w":
        case " ":
            if (player.grounded && playerEnabled) {
                player.vy = -20;
                Sounds.jump()
            }
            break;
        case "a":
            if (playerEnabled)
                player.vx = -2;
            break;
        case "d":
            if (playerEnabled) {
                player.vx = 2;
            }
            break;
        case "l":
            levelList.loadNext(player,grid)
            // let pb = padbool2d(level, grid[0].length, grid.length);

            break;
        case "k":
            location.reload();
            break;
        case "escape":
            if (playing) {
                if (!optionsEnabled) {
                    optionsEnabled = true;
                    playerEnabled = false;

                    enabled = false;
                    optionsMenu.style.display = "flex"
                    canvas.classList.add("blur")
                    optionsBackButton.style.display = "none";
                    optionsBackButton2.style.display = "flex"


                } else {
                    optionsEnabled = false;
                    enabled = true;
                    playerEnabled = true;
                    optionsMenu.style.display = "none";
                    canvas.classList.remove("blur")
                    optionsBackButton2.style.display = "none"
                }
            }
            break



    }
})
init()
function loadLocalStorage() {
    Sounds.SFXvolume = (Number(localStorage.getItem("sfxVolume")) || 50) / 100;
    Sounds.MusicVolume = (Number(localStorage.getItem("musicVolume")) || 50) / 100;
    MusicVolumeSlider.value = (Sounds.MusicVolume * 100).toFixed(0);
    SFXVolumeSlider.value = (Sounds.SFXvolume * 100).toFixed(0);
    SFXVolumeLabel.innerText = `SFX Volume: ${SFXVolumeSlider.value}%`;
    MusicVolumeLabel.innerText = `Music Volume: ${MusicVolumeSlider.value}%`;
}

function check_for_death() {
    if (player.x < 0 || player.y < 0 || player.x > width || player.y > height) {
        player.x = 20 * grid_size;
        player.y = 0;
        player.ax = 0;
        player.ay = 0;
        player.vx = 0;
        player.vy = 0;
        Sounds.die()
        return true
    }
    else {
        return false
    }
}
