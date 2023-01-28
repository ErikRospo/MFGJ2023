import * as PIXI from 'pixi.js';
import { PhysicsBody } from './classes/PhysicsBody';
import { PlayerColor } from './constants';
import { floorTo } from './utility';
export class Player extends PhysicsBody {
    width: number;
    height: number;
    color: string = PlayerColor; //sky blue
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y);
        this.width = width
        this.height = height
    }
    render(ctx: CanvasRenderingContext2D,grid_size:number) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(floorTo(this.x,grid_size), floorTo(this.y,grid_size), this.width, this.height);
        ctx.restore();
    }
    update(dt: number): void {
        super.update(dt);
        console.log(this.pos,this.vel,this.acc);
    }
}