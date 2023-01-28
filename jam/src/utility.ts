/**
 * Rounds a number `v` to the nearest multiple of n
 * @param {number} v The value to round
 * @param {number} n The number to round `v` to 
 */
export function roundTo(v: number, n: number) {
    return Math.round(v / n) * n;
}
/**
 * Rounds a number `v` down to the nearest multiple of n
 * @param {number} v The value to round
 * @param {number} n The number to round `v` to 
 */
export function floorTo(v: number, n: number) {
    return Math.floor(v / n) * n;
}
/**
 * Rounds a number `v` up to the nearest multiple of n
 * @param {number} v The value to round 
 * @param {number} n The number to round `v` to 
 */
export function ceilTo(v: number, n: number) {
    return Math.ceil(v / n) * n;
}