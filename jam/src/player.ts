import { Point } from 'pixi.js';
import { PhysicsBody } from './classes/PhysicsBody';
import { PlayerColor } from './constants';
import { bool2d } from './types';
import { floorTo } from './utility';
export class Player extends PhysicsBody {

    color: string = PlayerColor; //sky blue
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height, new Point(30, 30));

    }
    render(ctx: CanvasRenderingContext2D, grid_size: number) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(floorTo(this.x, grid_size), floorTo(this.y, grid_size), this.width, this.height);
        ctx.restore();
    }
    update(dt: number): void {
        super.update(dt);
        console.log(this.pos, this.vel, this.acc);
    }
    collide(grid: bool2d, grid_size: number) {
        let moved = false;
        while (true) {
            let px = Math.floor(this.x / grid_size)
            let py = Math.floor(this.y / grid_size)
            if (grid[px][py]) {
                if (this.vx > this.vy) {
                    this.x -= grid_size
                } else {
                    this.y -= grid_size;
                }
                moved = true;


            } else {
                break;
            }

        }
        if (moved) {
            this.vy = 0;
            this.vx = 0;
        }
    }
}