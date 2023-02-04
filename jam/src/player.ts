import { Point } from 'pixi.js';
import { PhysicsBody } from './classes/PhysicsBody';
import { DEBUG, PlayerColor, SCALE_FACTOR } from './constants';
import { bool2d } from './types';
import { abs, floorTo, floorToGrid } from './utility';
const floor = Math.floor
export class Player extends PhysicsBody {

    color: string = PlayerColor; //sky blue
    grounded: boolean = false;
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height, new Point(30, 30));

    }
    render(ctx: CanvasRenderingContext2D, grid_size: number): void {
        super.render(ctx, grid_size);
        if (DEBUG) {
            this.drawDebugArrows(ctx, 5);
        }
    }
    update(dt: number): void {

        this.gravity = !this.grounded;
        super.update(dt);
    }
    collide(grid: bool2d, grid_size: number): void {
        //TODO: don't pass `grid_size` as a parameter, and instead import it directly.
        //This applies to all uses
        let fx = floorTo(this.x, grid_size);
        let fy = floorTo(this.y, grid_size);
        let gx = floor(this.x / grid_size);
        let gy = floor(this.y / grid_size);
        if (grid[gx][gy - 1]) {
            this.y += grid_size / 2;
            this.vy = 0
        }
        if (grid[gx][gy + 1]) {
            this.y = floorToGrid(this.y)
            this.grounded = true
            this.vx *= 0.5
        } else {
            this.grounded = false
        }
        if (grid[gx - 1][gy]) {
            this.x += grid_size;
            this.vx = 0
        }
        if (grid[gx + 1][gy]) {
            this.x -= grid_size;
            this.vx = 0;
        }

    }
}