import { isMobile } from "pixi.js"

export function testLocalStorage(): boolean {
    let k = "test"
    let v = 0xC0FFEE
    localStorage.setItem(k, v.toString())
    return (Number.parseInt(localStorage.getItem(k)) === v)
}
export function testMobile(): boolean {
    return isMobile.phone;
}

type isCompatableResult = {
    storage: boolean
    device: boolean
    all: boolean
}

export function isCompatable(): isCompatableResult {
    let result={
        storage:true,
        device:true,
        all:true
    }
    // isCompatableResult
    if (testMobile()){
        result.device=false
    }
    if (testLocalStorage){
        result.storage=false
    }
    result.all=!result.storage||!result.device
    return result
}