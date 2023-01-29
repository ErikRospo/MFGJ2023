import { Point } from 'pixi.js';
import { PhysicsBody } from './classes/PhysicsBody';
import { PlayerColor } from './constants';
import { bool2d } from './types';
import { floorTo } from './utility';
const floor=Math.floor
export class Player extends PhysicsBody {

    color: string = PlayerColor; //sky blue
    grounded:boolean=false;
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

        this.gravity=!this.grounded;
        super.update(dt);
    }
    collide(grid: bool2d, grid_size: number) {
        // let movedx = false;
        // let movedy = false;
        // let px = Math.floor(this.x / grid_size)
        // let py = Math.floor(this.y / grid_size)
        // this.x=px*grid_size;
        // this.y=py*grid_size;
        // while (true) {
            let px = floor(this.x / grid_size)
            let py = floor(this.y / grid_size)
            if (grid[px][py+1]||grid[px][py]) {
                this.grounded=true;
            }else{
                this.grounded=false;
            }
            // if (grid[px][py]) {
                
            //     if (this.vx > this.vy) {
            //         this.x -= grid_size;
            //         movedx = true;
            //     } else {
            //         this.y -= grid_size;
            //         movedy = true;
            //     }
            //     if (movedx) {
            //         this.vx = 0;
            //     }
            //     if (movedy) {
            //         this.vy = 0;
            //     }

            // } else {
            //     break;
            // }

        // }
        if (this.grounded){
            this.x=floorTo(this.x,grid_size)
            this.y=floorTo(this.y,grid_size)
            this.vx=0
            this.vy=0;
        }
    }
}