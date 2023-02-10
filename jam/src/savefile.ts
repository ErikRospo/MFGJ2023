import { DEBUG } from "./constants"

export default class SaveFile {
    levelsCompleted: boolean[] = []
    isDev: boolean = DEBUG || false
    hasCompletedGame: boolean = false

    save(): void {
        localStorage.setItem("save", JSON.stringify({ lc: this.levelsCompleted, id: this.isDev, hc: this.hasCompletedGame }))

    }
    load(levelsnum: number) {
        let { lc, id, hc } = JSON.parse(localStorage.getItem("save")) || { lc: Array<boolean>(levelsnum).fill(false), id: DEBUG || false, hc: false }
        this.levelsCompleted = lc;
        this.isDev = id;
        this.hasCompletedGame = hc;
    }
}
