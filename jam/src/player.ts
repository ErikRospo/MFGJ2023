import { Point } from 'pixi.js';
import { PhysicsBody } from './classes/PhysicsBody';
import { PlayerColor } from './constants';
import { bool2d } from './types';
import { abs, floorTo } from './utility';
const floor = Math.floor
export class Player extends PhysicsBody {

    color: string = PlayerColor; //sky blue
    grounded: boolean = false;
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height, new Point(30, 30));

    }
    render(ctx: CanvasRenderingContext2D, grid_size: number) {
        ctx.save();
        ctx.fillStyle = this.color;

        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
    update(dt: number): void {

        this.gravity = !this.grounded;
        super.update(dt);
    }
    collide(grid: bool2d, grid_size: number) {
        let x = this.x / grid_size;
        let y = this.y / grid_size;
        let fx = floorTo(this.x, grid_size);
        let fy = floorTo(this.y, grid_size);
        let possibleCollisions: PhysicsBody[] = [];
        for (let ix = -2; ix < 2; ix++) {
            for (let iy = -2; iy < 2; iy++) {
                if (grid[floor(x) + ix][floor(y) + iy]) {
                    possibleCollisions.push(new PhysicsBody(fx + ix, fy + iy, grid_size, grid_size))
                }
            }
        }

        function testwithrect(a: PhysicsBody, b: PhysicsBody): { collision: boolean, x?: number, y?: number } {
            let dx = a.x - b.x;
            let dy = a.y - b.y;
            let adx = abs(dx)
            let ady = abs(dy)
            let shw = a.width + b.width
            let shh = a.height + b.height
            if (adx >= shw || ady >= shh) {
                return { collision: false }
            } else {
                let sx = shw - adx
                let sy = shh - ady;
                if (sx < sy) {
                    if (sx > 0) {
                        sy = 0
                    }
                }
                else {
                    if (sy > 0) {
                        sx = 0
                    }
                }
                if (dx < 0) {
                    sx = -sx
                }
                if (dy < 0) {
                    sy = -sy
                }
                return { collision: true, x: sx, y: sy }
            }
        }
        function solveCollision(a: PhysicsBody, b: PhysicsBody, sx: number, sy: number) {
            let d = Math.sqrt(sx * sx + sy * sy)
            let nx = sx / d
            let ny = sy / d;
            let vx = a.vx - (b.vx || 0);
            let vy = a.vy - (b.vy || 0);
            let ps = vx * nx + vy * ny;
            if (ps >= 0) {
                a.x -= sx;
                a.y -= sy;
                a.vx=0
                a.vy=0
            }
        }
        function checkCollision(a: PhysicsBody, b: PhysicsBody) {
            let { collision, x, y } = testwithrect(a, b);
            if (collision) {
                solveCollision(a, b, x, y)
                console.log(a,b)
            }
            return collision
        }
        if (possibleCollisions.length > 0) {
            console.log(possibleCollisions)
        }
        for (let i = 0; i < possibleCollisions.length; i++) {
            const element = possibleCollisions[i];
            let wc=checkCollision(this, element)
            //TODO: if the colliding element is the floor, set the `grounded` flag to true.
        }

    }
}