/**
 * Validation utilities for Chessboard.js
 */

/**
 * Validate piece notation
 * @param {string} piece - Piece notation (e.g., 'wP', 'bK')
 * @returns {boolean} True if piece notation is valid
 */
export function isValidPiece(piece) {
  if (typeof piece !== 'string' || piece.length !== 2) return false;
  
  const color = piece[0];
  const type = piece[1];
  
  return ['w', 'b'].includes(color) && ['P', 'R', 'N', 'B', 'Q', 'K'].includes(type);
}

/**
 * Validate position object
 * @param {Object} position - Position object with square-piece mappings
 * @returns {boolean} True if position is valid
 */
export function isValidPosition(position) {
  if (typeof position !== 'object' || position === null) return false;
  
  for (const [square, piece] of Object.entries(position)) {
    if (!isValidSquare(square) || !isValidPiece(piece)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Validate FEN string format
 * @param {string} fen - FEN string
 * @returns {Object} Validation result with success and error properties
 */
export function validateFenFormat(fen) {
  if (typeof fen !== 'string') {
    return { success: false, error: 'FEN must be a string' };
  }
  
  const parts = fen.split(' ');
  if (parts.length !== 6) {
    return { success: false, error: 'FEN must have 6 parts separated by spaces' };
  }
  
  // Validate piece placement
  const ranks = parts[0].split('/');
  if (ranks.length !== 8) {
    return { success: false, error: 'Piece placement must have 8 ranks' };
  }
  
  return { success: true };
}

/**
 * Validate configuration object
 * @param {Object} config - Configuration object
 * @returns {Object} Validation result with success and errors array
 */
export function validateConfig(config) {
  const errors = [];
  
  if (config.orientation && !['white', 'black', 'w', 'b'].includes(config.orientation)) {
    errors.push('Invalid orientation. Must be "white", "black", "w", or "b"');
  }
  
  if (config.position && config.position !== 'start' && typeof config.position !== 'object') {
    errors.push('Invalid position. Must be "start" or a position object');
  }
  
  if (config.size && typeof config.size !== 'string' && typeof config.size !== 'number') {
    errors.push('Invalid size. Must be a string or number');
  }
  
  return {
    success: errors.length === 0,
    errors
  };
}

// Re-export from coordinates utility
export { isValidSquare } from './coordinates.js';
