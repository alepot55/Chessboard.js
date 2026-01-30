/**
 * Coordinate utilities for Chessboard.js
 */
/**
 * Convert algebraic notation to array coordinates
 * @param {string} square - Square in algebraic notation (e.g., 'a1', 'h8')
 * @returns {Object} Object with row and col properties
 */
export function algebraicToCoords(square: string): Object;
/**
 * Convert array coordinates to algebraic notation
 * @param {number} row - Row index (0-7)
 * @param {number} col - Column index (0-7)
 * @returns {string} Square in algebraic notation
 */
export function coordsToAlgebraic(row: number, col: number): string;
/**
 * Get the color of a square
 * @param {string} square - Square in algebraic notation
 * @returns {string} 'light' or 'dark'
 */
export function getSquareColor(square: string): string;
/**
 * Check if coordinates are valid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean} True if coordinates are valid
 */
export function isValidCoords(row: number, col: number): boolean;
/**
 * Check if algebraic notation is valid
 * @param {string} square - Square in algebraic notation
 * @returns {boolean} True if square notation is valid
 */
export function isValidSquare(square: string): boolean;
//# sourceMappingURL=coordinates.d.ts.map