import { cyrb53String as cyrb53 } from "./utility"
function testCryb53() {
    console.log(`cyrb53('a') -> ${cyrb53('a')}`)
    console.log(`cyrb53('b') -> ${cyrb53('b')}`)
    console.log(`cyrb53('revenge') -> ${cyrb53('revenge')}`)
    console.log(`cyrb53('revenue') -> ${cyrb53('revenue')}`)
    console.log(`cyrb53('revenue', 1) -> ${cyrb53('revenue', 1)}`)
    console.log(`cyrb53('revenue', 2) -> ${cyrb53('revenue', 2)}`)
    console.log(`cyrb53('revenue', 3) -> ${cyrb53('revenue', 3)}`)
}