/// <reference path="../types.d.ts"/>
import jumpSound_src from "./assets/audio/sfx/jump.mp3"
import dieSound_src from "./assets/audio/sfx/hurt.mp3"
import MainSong_src from "./assets/audio/music/MainSong.mp3"
import MainSongV1_src from "./assets/audio/music/MainSongV1.mp3"
import MainSongV2_src from "./assets/audio/music/MainSongV2.mp3"
import clickSound_src from "./assets/audio/music/MainSongV2.mp3"
import { DEBUG } from "./constants"
const jumpSound = new Audio(jumpSound_src);
const dieSound = new Audio(dieSound_src);
const clickSound = new Audio(clickSound_src);
const MainSong = new Audio(MainSong_src);
const MainSongV1 = new Audio(MainSongV1_src);
const MainSongV2 = new Audio(MainSongV2_src);

 class Sounds {
    private _sfxVolume: number = DEBUG ? 0 : 0.5;
    private _musicVolume: number = DEBUG ? 0 : 0.5;
    constructor() {
        jumpSound.volume = this._sfxVolume;
        dieSound.volume = this._sfxVolume
        clickSound.volume = this._sfxVolume
        MainSong.volume = this._musicVolume
        MainSongV1.volume = this._musicVolume
        MainSongV2.volume = this._musicVolume

    }
    jump() {

        jumpSound.play();
    }
    die() {
        dieSound.play()
    }
    select() {
        clickSound.play()
    }

    public get SFXvolume(): number {
        return this._sfxVolume;
    }
    public set SFXvolume(v: number) {
        this._sfxVolume = v;
        jumpSound.volume = this._sfxVolume;
        dieSound.volume = this._sfxVolume
        clickSound.volume = this._sfxVolume
    }
    public get MusicVolume(): number {
        return this._musicVolume;
    }
    public set MusicVolume(v: number) {
        this._musicVolume = v;
        MainSong.volume = this._musicVolume;
        MainSongV1.volume = this._musicVolume;
        MainSongV2.volume = this._musicVolume;
    }
    playMusic() {
        let musicId = Math.floor(Math.random() * 3)
        MainSong.removeEventListener("ended", () => { this.playMusic() })
        MainSongV1.removeEventListener("ended", () => { this.playMusic() })
        MainSongV2.removeEventListener("ended", () => { this.playMusic() })
        MainSong.pause()
        MainSong.currentTime = 0;
        MainSongV1.pause()
        MainSongV1.currentTime = 0;
        MainSongV2.pause()
        MainSongV2.currentTime = 0;
        if (musicId === 0) {
            MainSong.play().catch((e) => { console.log("Couldn't play music: " + e) })
            MainSong.addEventListener("ended", () => { this.playMusic() })
        } else if (musicId === 1) {
            MainSongV1.play().catch((e) => { console.log("Couldn't play music: " + e) })
            MainSongV1.addEventListener("ended", () => { this.playMusic() })
        } else if (musicId === 2) {
            MainSongV2.play().catch((e) => { console.log("Couldn't play music: " + e) })
            MainSongV2.addEventListener("ended", () => { this.playMusic() })
        }
    }



}
let a=new Sounds()
export default a;