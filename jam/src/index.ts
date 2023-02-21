/// <reference path="../types.d.ts"/>
import { Sounds as SoundsClass } from "./audioplayer"
import { Place } from './patterns';
import { Player } from './player';
import { bool2d } from './types';
import levelList from './levels';
import { grid_size, fps, EndColor, DEBUG } from './constants';
import SaveFile from "./savefile";
import { isCompatable } from "./compat";
const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");
canvas.id = "canvasElm"
document.body.appendChild(canvas);
const playButton = document.getElementById("playButton");
const menuDiv = document.getElementById("menuDiv")
const optionsMenu = document.getElementById("optionsMenu");
const levelSelectDiv = document.getElementById("levelSelectDiv");
const optionsButton = document.getElementById("optionsButton");
const optionsBackButton = document.getElementById("backButton");
const optionsBackButton2 = document.getElementById("backButton2");
const MusicVolumeLabel = document.getElementById("musicVolLabel") as HTMLLabelElement
const MusicVolumeSlider = document.getElementById("musicVol") as HTMLInputElement
const SFXVolumeLabel = document.getElementById("SFXVolLabel") as HTMLLabelElement
const SFXVolumeSlider = document.getElementById("SFXVol") as HTMLInputElement
let savefile = new SaveFile()
savefile.load(levelList.levelsnum);
let compat = isCompatable()
const MOBILE = !compat.device

console.log(levelList)
let frame = 0;
let grid: bool2d = [];
let Sounds = new SoundsClass();
let hasClicked = false;
let optionsEnabled = false;
let playing = false;
let width = Math.floor(window.innerWidth / grid_size) * grid_size;
let height = Math.floor(window.innerHeight / grid_size) * grid_size;
canvas.width = width;
canvas.height = height;
function reset_grid(): void {
    grid = [];
    for (let x = 0; x < width / grid_size; x++) {
        let temp_array: boolean[] = [];
        for (let y = 0; y < height / grid_size; y++) {
            temp_array.push(false)
        }
        grid.push(temp_array)

    }
}
reset_grid()
let player = new Player(20 * grid_size, 0, grid_size, grid_size);
let playerEnabled: boolean = false;

/**
 * Draws a square at a location, (`x`,`y`) on the grid, that has a side length of `s`   
 * If state is false, the square is black, otherwise, it is white;
 * @param {number} x the x position to draw the square at
 * @param {number} y the y position to draw the square at
 * @param {number} s the square's side length
 * @param {boolean} state whether to draw the square as black (false) or white (true)
 */
function drawSquare(x: number, y: number, s: number = grid_size, state: boolean = false): void {
    ctx.save()
    ctx.fillStyle = state ? "white" : "black";
    ctx.fillRect(x * grid_size, y * grid_size, s, s);
    ctx.restore()
}
/**
 * Draws a square at a location, (`x`,`y`) on the grid, that has a side length of `s`   
 * If state is false, the square is black, otherwise, it is white;
 * @param {number} x the x position to draw the square at
 * @param {number} y the y position to draw the square at
 * @param {number} s the square's side length
 * @param {string} color whether to draw the square as black (false) or white (true)
 */
function drawSquareColor(x: number, y: number, s: number = grid_size, color: string = "#000000"): void {
    ctx.save()
    ctx.fillStyle = color;
    ctx.fillRect(x * grid_size, y * grid_size, s, s);
    ctx.restore()
}


function updateGol(oldgrid: bool2d): bool2d {
    let newgrid: bool2d = [];
    let gh = oldgrid[0].length
    let gw = oldgrid.length

    for (let x = 0; x < gw; x++) {
        let temp_array: boolean[] = [];

        for (let y = 0; y < gh; y++) {
            let total: number = 0;


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

            if (playerEnabled && x == player.end.x && y == player.end.y) {
                drawSquareColor(x, y, grid_size, EndColor)
            } else {

                drawSquare(x, y, grid_size, rendergrid[x][y])
            }

        }
    }
    if (playerEnabled) {
        player.render(ctx);
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
        player.collide(grid)

        let dead = check_for_death();
        if (dead) {
            grid = levelList.reload(player, grid)
        }
        if (player.checkForWin()) {
            savefile.levelsCompleted[levelList.currentlevel] = true
            grid = levelList.loadNext(player, grid)

        }
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

    }, 25000)
    canvas.classList.add("blur")
    optionsButton.addEventListener("click", () => {
        if (MOBILE) {
            mobileAlert();
        }
        else {
            optionsMenu.style.display = "flex"
            menuDiv.style.display = "none"
        }
    })
    optionsBackButton2.style.display = "none"

    optionsMenu.style.display = "none"
    optionsBackButton.addEventListener("click", () => {
        optionsMenu.style.display = "none"
        menuDiv.style.display = "flex";
        levelSelectDiv.style.display="none";

    })
    SFXVolumeSlider.valueAsNumber = Sounds.SFXvolume * 100
    MusicVolumeSlider.valueAsNumber = Sounds.MusicVolume * 100

    SFXVolumeSlider.addEventListener("input", (_) => {
        Sounds.SFXvolume = SFXVolumeSlider.valueAsNumber / 100
        SFXVolumeLabel.innerText = `SFX Volume: ${SFXVolumeSlider.value}%`
        localStorage.setItem("sfxVolume", SFXVolumeSlider.value)

    })
    MusicVolumeSlider.addEventListener("input", (_) => {
        Sounds.MusicVolume = MusicVolumeSlider.valueAsNumber / 100
        MusicVolumeLabel.innerText = `Music Volume: ${MusicVolumeSlider.value}%`
        localStorage.setItem("musicVolume", MusicVolumeSlider.value)
    })
    levelSelectDiv.style.display = "none"

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
    playButton.addEventListener("click", () => {

        if (MOBILE) {
            mobileAlert()
        }
        else {
            if (savefile.levelsCompleted.length>0){
            
                levelSelectDiv.style.display = "grid";
                menuDiv.style.display="none";
                optionsMenu.style.display="none";
                optionsBackButton.style.display="flex";

            }else{
                canvas.classList.remove("blur");
                playerEnabled = true;
                reset_grid();
                grid = levelList.loadNext(player, grid);
                // Place.block(grid,Math.floor(player.x/grid_size),Math.floor(player.y/grid_size)+13)        
                menuDiv.style.display = "none";
                playing = true;
            }
        }
    })
    let _tmp=document.getElementById("titleText")
    _tmp.style.opacity="1"
    _tmp.style.scale="1"
}

setInterval(() => {
    if (enabled) step()
}, 1000 / fps)

addEventListener("keydown", (ev) => {
    switch (ev.key.toLowerCase()) {

        case "w":
        case " ":
            if (player.grounded && playerEnabled) {
                player.vy = -20;
                Sounds.jump()
            }
            break;
        case "a":
            if (playerEnabled)
                if (player.grounded) {
                    player.ax = -5;
                } else {
                    player.ax = -1
                }
            break;
        case "d":
            if (playerEnabled) {
                if (player.grounded) {
                    player.ax = 5;
                } else {
                    player.ax = 1
                }
            }
            break;
        case "l":
            if (DEBUG) {
                let newgrid = levelList.loadNext(player, grid)
                grid = newgrid
            }

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
function mobileAlert() {
    alert("This game is not designed for mobile. It requires a keyboard to play.");
}

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
