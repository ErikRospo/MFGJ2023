import * as PIXI from 'pixi.js';
import { PhysicsBody } from './classes/PhysicsBody';
class Player extends PhysicsBody{
    width:number;
    height:number;
    constructor(x: number,y: number,width: number,height: number){
        super(x,y);
        this.width=width
        this.height=height
    }
}