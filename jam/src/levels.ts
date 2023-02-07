import { Player } from "./player";
import { bool2d, Level } from "./types";
import level1 from "./levels/blonkers.rle"
import level2 from "./levels/glider_intercept1.rle"
import level3 from "./levels/glider_intercept2.rle"
import { grid_size } from "./constants";
import { padbool2d } from "./utility";
export class Levels {
    levels: Level[] = []
    currentlevel: number = 0
    levelsnum: number = 0;
    addLevel(level: Level): void {
        this.levels.push(level);
        this.levelsnum++
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
            grid = padbool2d(level.grid, grid[0].length, grid.length);
        }
        return grid
    }
    loadNext(player: Player, grid: bool2d): bool2d {
        this.currentlevel++
        return this.loadLevel(player, grid, this.currentlevel)
    }
    save() {

    }
}

let levelList = new Levels()
levelList.addLevel({ grid: level1, start: { x: 20, y: 0 }, end: { x: 22, y: 15 } })
levelList.addLevel({ grid: level2, start: { x: 20, y: 0 }, end: { x: 22, y: 15 } })
levelList.addLevel({ grid: level3, start: { x: 20, y: 0 }, end: { x: 22, y: 15 } })
export default levelList