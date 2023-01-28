import { bool2d } from './types';
export namespace Place {
    /**
     * Places a glider at a specified (x,y) location on the grid;
     * NOTE: Mutates the array
     * @param {bool2d} grid The grid on which to place the glider
     * @param {number} x The X position of the top left of the glider's bounding box
     * @param {number} y The Y position of the top left of the glider's bounding box
     */
    export function glider(grid: bool2d, x: number, y: number): bool2d {
        grid[x][y] = false;
        grid[x + 1][y] = false;
        grid[x + 2][y] = true;
        grid[x][y + 1] = true;
        grid[x + 1][y + 1] = false;
        grid[x + 2][y + 1] = true;
        grid[x][y + 2] = false;
        grid[x + 1][y + 2] = true;
        grid[x + 2][y + 2] = true;
        return grid;
    }
    /**
     * Places a block at a specified (x,y) location on the grid;
     * NOTE: Mutates the array
     * @param {bool2d} grid The grid on which to place the block
     * @param {number} x The X position of the top left of the block's bounding box
     * @param {number} y The Y position of the top left of the block's bounding box
     */
    export function block(grid: bool2d, x: number, y: number): bool2d {
        grid[x][y] = true;
        grid[x + 1][y] = true;
        grid[x][y + 1] = true;
        grid[x + 1][y + 1] = true;
        return grid;
    }
    /**
     * Places a vertical blinker at a specified (x,y) location on the grid;
     * NOTE: Mutates the array
     * @param {bool2d} grid The grid on which to place the blinker
     * @param {number} x The X position of the top left of the blinker's bounding box
     * @param {number} y The Y position of the top left of the blinker's bounding box
     */
    export function blinker_v(grid: bool2d, x: number, y: number): bool2d {
        grid[x][y] = true;
        grid[x][y + 1] = true;
        grid[x][y - 1] = true;
        return grid;
    }
    /**
     * Places a horizontal blinker at a specified (x,y) location on the grid;
     * NOTE: Mutates the array
     * @param {bool2d} grid The grid on which to place the blinker
     * @param {number} x The X position of the top left of the blinker's bounding box
     * @param {number} y The Y position of the top left of the blinker's bounding box
     */
    export function blinker_h(grid: bool2d, x: number, y: number): bool2d {
        grid[x][y] = true;
        grid[x - 1][y] = true;
        grid[x + 1][y] = true;
        return grid;
    }
}