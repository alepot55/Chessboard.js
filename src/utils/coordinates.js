/**
 * Coordinate utilities for Chessboard.js
 */

/**
 * Convert algebraic notation to array coordinates
 * @param {string} square - Square in algebraic notation (e.g., 'a1', 'h8')
 * @returns {Object} Object with row and col properties
 */
export function algebraicToCoords(square) {
  const file = square.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
  const rank = parseInt(square[1], 10) - 1; // '1' = 0, '2' = 1, etc.

  return { row: 7 - rank, col: file };
}

/**
 * Convert array coordinates to algebraic notation
 * @param {number} row - Row index (0-7)
 * @param {number} col - Column index (0-7)
 * @returns {string} Square in algebraic notation
 */
export function coordsToAlgebraic(row, col) {
  const file = String.fromCharCode(97 + col); // 0 = 'a', 1 = 'b', etc.
  const rank = (8 - row).toString(); // 0 = '8', 1 = '7', etc.

  return file + rank;
}

/**
 * Get the color of a square
 * @param {string} square - Square in algebraic notation
 * @returns {string} 'light' or 'dark'
 */
export function getSquareColor(square) {
  const { row, col } = algebraicToCoords(square);
  return (row + col) % 2 === 0 ? 'dark' : 'light';
}

/**
 * Check if coordinates are valid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean} True if coordinates are valid
 */
export function isValidCoords(row, col) {
  return row >= 0 && row <= 7 && col >= 0 && col <= 7;
}

/**
 * Check if algebraic notation is valid
 * @param {string} square - Square in algebraic notation
 * @returns {boolean} True if square notation is valid
 */
export function isValidSquare(square) {
  if (typeof square !== 'string' || square.length !== 2) return false;

  const file = square[0];
  const rank = square[1];

  return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
}
