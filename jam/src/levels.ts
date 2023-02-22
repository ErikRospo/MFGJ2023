import { Player } from "./player";
import { bool2d, Level } from "./types";
import level1 from "./levels/blonkers.rle"
import level2 from "./levels/glider_intercept1.rle"
import level3 from "./levels/glider_intercept2.rle"
import { grid_size } from "./constants";
import { newBool2D, overlay2DBools, padbool2dBR, rotate } from "./utility";
import Sounds from "./audioplayer";
export class Levels {
    levels: Level[] = [];
    toLoad: number = -1;
    currentlevel: number = 0;
    levelsnum: number = 0;
    levelsDiv: HTMLDivElement;
    constructor() {
        this.levelsDiv = document.getElementById("levelSelectDiv") as HTMLDivElement;


    }
    addLevel(level: Level) {
        this.levels.push(level);
        this.levelsnum++;
        let levelElement = document.createElement("div");
        levelElement.innerText = this.levelsnum.toString();
        levelElement.classList.add("monospace");
        levelElement.classList.add("menubutton");
        levelElement.classList.add("noselect");
        levelElement.addEventListener("click", () => {
            Sounds.select()

            // this method of getting the level number can easily be taken advantage of
            // for example, if you clear lvl 1, you can imdtly load any level, by editing the html. 
            // we could prevent this by only allowing you to load levels that have been cleared, or the next level.
            // however, this isn't a huge issue, as this just a simple, single player game.
            let lvlN = Number.parseInt(levelElement.innerText);
            this.toLoad = lvlN;

        })

        this.levelsDiv.appendChild(levelElement);
        return levelElement
    }
    tryLoad(player: Player, grid: bool2d) {
        if (this.toLoad !== -1) {
            let rv = this.loadLevel(player, grid, this.toLoad)
            this.toLoad = -1;

            return rv;
        }

        return false

    }
    loadLevel(player: Player, grid: bool2d, id: number): bool2d {
        let level = this.levels[id]
        if (level) {
            player.vx = 0
            player.vy = 0
            player.ax = 0
            player.ay = 0
            player.x = level.start.x * grid_size
            player.y = level.start.y * grid_size
            player.end = { x: level.end.x, y: level.end.y }
            if (level.gridOffset) {
                let newEmpty: bool2d = newBool2D(grid.length, grid[0].length)
                grid = padbool2dBR(overlay2DBools(newEmpty, level.grid, level.gridOffset.x, level.gridOffset.y), grid.length, grid[0].length);


            } else {

                grid = padbool2dBR(level.grid, grid[0].length, grid.length);
            }
        }
        return grid
    }
    loadNext(player: Player, grid: bool2d): bool2d {
        this.currentlevel++
        return this.loadLevel(player, grid, this.currentlevel)
    }
    reload(player: Player, grid: bool2d) {
        return this.loadLevel(player, grid, this.currentlevel)
    }

}

let levelList = new Levels()
levelList.addLevel({ grid: (level1), start: { x: 20, y: 0 }, end: { x: 20, y: 15 }, gridOffset: { x: 5, y: 10 } })
levelList.addLevel({ grid: rotate(level2), start: { x: 20, y: 0 }, end: { x: 22, y: 15 }, gridOffset: { x: 5, y: 10 } })
levelList.addLevel({ grid: rotate(level3), start: { x: 20, y: 0 }, end: { x: 22, y: 15 }, gridOffset: { x: 5, y: 10 } })

export default levelList