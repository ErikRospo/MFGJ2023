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
    }
    collide(grid: bool2d, grid_size: number) {
        let movedx = false;
        let movedy = false;
        // let px = Math.floor(this.x / grid_size)
        // let py = Math.floor(this.y / grid_size)
        // this.x=px*grid_size;
        // this.y=py*grid_size;
        while (true) {
            let px = Math.floor(this.x / grid_size)
            let py = Math.floor(this.y / grid_size)
            if (grid[px][py]) {
                if (this.vx > this.vy) {
                    this.x -= grid_size;
                    movedy = true;
                } else {
                    this.y -= grid_size;
                    movedx = true;
                }


            } else {
                break;
            }

        }
        if (movedx) {
            this.vx = 0;
        }
        if (movedy) {
            this.vy = 0;
        }
    }
}