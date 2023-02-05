import { Player } from "./player";
import { bool2d, Level } from "./types";
import level1 from "./levels/glider.rle"
import { grid_size } from "./constants";
import { padbool2d } from "./utility";
export class Levels {
    levels: Level[] = []
    levelnum: number = 0
    addLevel(level: Level) {
        this.levels.push(level);
    }
    loadLevel(player: Player, grid: bool2d, id: number): boolean {
        let level = this.levels[id]
        if (level) {
            player.vx = 0
            player.vy = 0
            player.ax = 0
            player.ay = 0
            player.x = level.start.x * grid_size
            player.y = level.start.y * grid_size
            grid = padbool2d(grid, grid[0].length, grid.length);
            return true
        }
        return false
    }
    loadNext(player: Player, grid: bool2d): boolean {
        this.levelnum++
        return this.loadLevel(player, grid, this.levelnum)
    }
}
export let levelList = new Levels()
levelList.addLevel({ grid: level1, start: { x: 20, y: 0 }, end: { x: 22, y: 15 } })
