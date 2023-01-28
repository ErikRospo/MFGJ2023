import * as PIXI from 'pixi.js';
import { GRAVITY } from '../constants';
export class PhysicsBody {
    /**Position*/
    pos: PIXI.Point;
    /**Velocity*/ 
    vel: PIXI.Point;
    /**Acceleration */
    acc: PIXI.Point;
    /**
     * The PhysicsBody class.
     */
    constructor(x: number, y: number) {
        this.pos = new PIXI.Point(x, y);
        this.vel = new PIXI.Point()
        this.acc = new PIXI.Point();
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

    /**
     * @param {number} dt Delta Time
     * Updates the position, velocity, and the acceleration
     */
    update(dt:number){
        this.x+=this.vx*dt;
        this.y+=this.vy*dt;
        this.vx+=this.ax*dt;
        this.vy+=this.ay*dt;
        this.ax=0;
        this.ay=GRAVITY;
    }
}