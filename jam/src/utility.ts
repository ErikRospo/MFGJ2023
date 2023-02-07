import { grid_size } from "./constants";
import { bool2d } from "./types";
export const floor = Math.floor
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
 * Rounds a number `v` down to the nearest multiple of n
 * @param {number} v The value to round
 */
export function floorToGrid(v: number) {
    return floorTo(v, grid_size);
}
/**
 * Rounds a number `v` up to the nearest multiple of n
 * @param {number} v The value to round 
 * @param {number} n The number to round `v` to 
 */
export function ceilTo(v: number, n: number) {
    return Math.ceil(v / n) * n;
}
/**
 * Returns the absolute value of `n`
 * @param {number} n 
 * @returns the absolute value
 */
export function abs(n: number): number {
    return Math.abs(n)
}
/**
 * Pads a bool2d array out to a specified width X height, using `val`. defaults to false.
 * pads in the bottom right
 * @param {bool2d} array The array to pad out.
 * @param {number} width the width to pad the array out to.
 * @param {number} height the height to pad the array out to
 * @param {boolean} val the value to pad the array with. Defaults to false
 * @returns {bool2d} The array, padded out to width X height
 */
export function padbool2dBR(array: bool2d, width: number, height: number, val: boolean = false): bool2d {
    let newarray = []
    for (let index = 0; index < height; index++) {
        let element = array[index] ?? Array(width).fill(val);
        if (element.length != width) {
            element = element.concat(Array(width - array[index].length).fill(val))
        }
        newarray[index] = element;

    }
    return newarray
}
/**
 * Clamps a value to a range, min-max, inclusive
 * @param {number} value The value to clamp
 * @param {number} min The minimum value
 * @param {number} max The maximum value
 * @return {number} the value, clamped to the range
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}
/** rotates a grid by 90 degrees */
export function rotate(grid: bool2d): bool2d {
    const n = grid.length;
    const m = grid[0].length;
    const result = [];
    for (let i = 0; i < m; i++) {
        result.push([]);
        for (let j = n - 1; j >= 0; j--) {
            result[i].push(grid[j][i]);
        }
    }
    return result;
}
/**
 * overlays a inset onto a base bool2d
 * returns a new array, and doesn't modifiy the original variables.
 * @param {bool2d} base The array on which to put the other bool2d
 * @param {bool2d} inset The array to put onto `base`
 * @param {number} ox the x offset to put the inset onto base
 * @param {number} oy the y offset to put the inset onto the base
 */
export function overlay2DBools(
    base: bool2d,
    inset: bool2d,
    ox: number=0,
    oy: number=0
  ): bool2d {
    const result = base.map(row => [...row]);
    for (let i = 0; i < inset.length; i++) {
      for (let j = 0; j < inset[i].length; j++) {
        const targetX = i + ox;
        const targetY = j + oy;
        if (targetX >= 0 && targetX < result.length && targetY >= 0 && targetY < result[i].length) {
          result[targetX][targetY] = inset[i][j];
        }
      }
    }
    return result;
  }