import * as _ from 'lodash';

import { Point } from 'pixi.js';
import { GRAVITY } from '../constants';
import { abs } from '../utility';
export class PhysicsBody {
    /**Position*/
    pos: Point;
    /**Velocity*/ 
    vel: Point;
    /**Acceleration */
    acc: Point;
    /**the width of the object */
    width: number;
    /**the height of the object */
    height: number;
    /**whether the object has gravity */
    gravity:boolean=true;
    /**how "bouncy" the object is */
    coef_restitution:number=0.5;
    /**how "grippy" the object is */
    coef_friction:number=0.5;
    color:boolean|string=false;
    /**The maximum velocity. Note that it is used for both the minumum and maximum velocity.
     * The velocity is clamped between -maxVel, and maxVel
    */
    private _maxVel:Point;
    /**
     * The PhysicsBody class.
     * @param {number} x the starting x position
     * @param {number} y the starting y position
     * @param {number} width the width of the object
     * @param {number} height the height of the object
     * @param {Point} maxVel the maximum speed of an object. Optional, but defaults to both x and y being clamped to 100
     */
    constructor(x: number, y: number,width: number,height: number,maxVel?:Point) {
        this.pos = new Point(x, y);
        this.vel = new Point();
        this.acc = new Point();
        this.width = width
        this.height = height
        this._maxVel=new Point(abs(maxVel?.x||100),abs(maxVel?.y||100));
    }
    // #region get/set pos, vel, acc
    /**
     * X position
     */
    public get x(): number {
        return this.pos.x;
    }
    public set x(v: number) {
        this.pos.x = v;
    }
     /**
     * Y position
     */
    public get y(): number {
        return this.pos.y;
    }
    public set y(v: number) {
        this.pos.y = v;
    }
        /**
     * X velocity
     */
    public get vx() {
        return this.vel.x
    }
    public set vx(v: number) {
        this.vel.x = v;
    }
        /**
     * Y velocity
     */
    public get vy() {
        return this.vel.y
    }
    public set vy(v: number) {
        this.vel.y = v;
    }
        /**
     * X acceleration
     */
    public get ax() {
        return this.acc.x
    }
    public set ax(v: number) {
        this.acc.x = v;
    }
        /**
     * Y acceleration
     */
    public get ay() {
        return this.acc.y
    }
    public set ay(v: number) {
        this.acc.y = v;
    }
    // #endregion
    /** the maximum velocity. Note that it can not be set to a negative number.
     * if it is, the absolute value will be used instead.
    */
    public get maxVel() : Point {
        return this._maxVel;
    }
    
    public set maxVel(v : Point) {
        if (v.x<0 || v.y<0){
            console.warn("max vel can not be set to a negative number")
        }
        this._maxVel = new Point(abs(v.x),abs(v.y));
    }
    render(ctx: CanvasRenderingContext2D, _grid_size: number): void {
        ctx.save();
        ctx.fillStyle = (typeof this.color=="boolean"?(this.color?"black":"white"):this.color);


        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
    /**
     * Updates the position, velocity, and the acceleration
     * @param {number} dt Delta Time
     */
    update(dt:number): void{
        this.x+=this.vx*dt;
        this.y+=this.vy*dt;
        this.vx+=this.ax*dt;
        this.vy+=this.ay*dt;
        this.vx=_.clamp(this.vx,-this.maxVel.x,this.maxVel.x)
        this.vy=_.clamp(this.vy,-this.maxVel.y,this.maxVel.y)
        this.ax=0;
        if (this.gravity){
            this.ay=GRAVITY;
        }else{
            this.ay=0;
        }
    }
}