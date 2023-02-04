import { Point } from 'pixi.js';
import { PhysicsBody } from './classes/PhysicsBody';
import { DEBUG, PlayerColor, SCALE_FACTOR } from './constants';
import { bool2d } from './types';
import { abs, floorTo } from './utility';
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
    collide(grid: bool2d, grid_size: number, ctx: CanvasRenderingContext2D): PhysicsBody[] {
        //TODO: fix the collision function.
        let fx = floorTo(this.x, grid_size);
        let fy = floorTo(this.y, grid_size);
        let possibleCollisions: PhysicsBody[] = [];
        for (let ix = -1; ix <= 1; ix++) { //<=1 is the same as <=2, but <=1 is much more clear in its intention.
            for (let iy = -1; iy <= 1; iy++) {
                if (grid[floor(this.x / grid_size) + ix][floor(this.y / grid_size) + iy]) {
                    possibleCollisions.push(new PhysicsBody(floorTo(fx + grid_size * (ix / 2), grid_size) + SCALE_FACTOR / 2, floorTo(fy + grid_size * (iy / 2), grid_size) + SCALE_FACTOR / 2, grid_size - SCALE_FACTOR, grid_size - SCALE_FACTOR))
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
            let d = Math.sqrt(sx * sx + sy * sy) //"magnitude" of s(x,y)
            let n = new Point(sx / d, sy / d); //s normalized
            let v = new Point(a.vx - (b.vx || 0), a.vy - (b.vy || 0)); //v is the relative velocity
            let ps = v.x * n.x + v.y * n.y 
            if (ps >= 0) {
                a.x -= (n.x);
                a.y -= (n.y);
                if (v.x > v.y) {
                    a.vx = 0;

                } else {
                    a.vy = 0
                }
            }
        }
        function checkCollision(a: PhysicsBody, b: PhysicsBody): boolean {
            let { collision, x, y } = testwithrect(a, b);
            if (collision) {
                solveCollision(a, b, x, y)
            }
            return collision
        }
        if ((grid[floor(this.x / grid_size) + 0][floor(this.y / grid_size) + 1])) {
            this.grounded = true
        } else {
            this.grounded = false;
        }
        let collisions = []
        for (let i = 0; i < possibleCollisions.length; i++) {
            const element = possibleCollisions[i];
            element.coef_friction = 1
            element.coef_restitution = 0
            this.coef_friction = 1
            this.coef_restitution = 0

            let wc = checkCollision(this, element)
            if (wc) {
                collisions.push(element)
                ctx.fillStyle = "blue"
                ctx.fillRect(element.x + element.width / 4, element.y + element.width / 4, element.width / 2, element.height / 2)

            }

            //TODO: if the colliding element is the floor, set the `grounded` flag to true.
        }
        return collisions
    }
}