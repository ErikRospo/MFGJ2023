import { Point } from 'pixi.js';
import { PhysicsBody } from './classes/PhysicsBody';
import { DEBUG, grid_size, PlayerColor, SCALE_FACTOR } from './constants';
import { bool2d, vec2 } from './types';
import { floorTo, floorToGrid, floor } from './utility';
export class Player extends PhysicsBody {

    color: string = PlayerColor; //sky blue
    grounded: boolean = false;
    end: vec2;
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height, new Point(30, 30));

    }
    render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);
        if (DEBUG) {
            this.drawDebugArrows(ctx, 5);
        }
    }
    update(dt: number): void {

        this.gravity = !this.grounded;
        super.update(dt);
    }
    collide(grid: bool2d): void {
        //TODO: don't pass `grid_size` as a parameter, and instead import it directly.
        //This applies to all uses
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
    checkForWin() {
        let gx = floor(this.x / grid_size);
        let gy = floor(this.y / grid_size);
        return gx === this.end.x && gy === this.end.y
    }
}