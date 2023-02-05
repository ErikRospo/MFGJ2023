/// <reference path="../types.d.ts"/>
import jumpSound_src from "./assets/audio/jump.wav"
import dieSound_src from "./assets/audio/hurt.wav"
const jumpSound = new Audio(jumpSound_src);
const dieSound = new Audio(dieSound_src);

export class Sounds {
    private _volume: number = 0.5;
    constructor() {
        jumpSound.volume = this._volume;
        dieSound.volume = this._volume
    }
    jump() {

        jumpSound.play();
    }
    die() {
        dieSound.play()
    }

    public get volume(): number {
        return this._volume;
    }
    public set volume(v: number) {
        this._volume = v;
        jumpSound.volume = this._volume;
        dieSound.volume = this._volume
    }




}