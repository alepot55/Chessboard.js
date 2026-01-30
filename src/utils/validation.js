/**
 * Validation utilities for Chessboard.js
 * @module utils/validation
 * @since 2.0.0
 */

// Import and re-export from coordinates utility
import { isValidSquare as validateSquare } from './coordinates.js';
export { validateSquare as isValidSquare };

// Local alias for internal use
const isValidSquare = validateSquare;

/**
 * Validation cache for performance optimization
 * @type {Map}
 */
const validationCache = new Map();
const CACHE_MAX_SIZE = 1000;

/**
 * Caches validation result
 * @param {string} key - Cache key
 * @param {boolean} result - Validation result
 */
function cacheResult(key, result) {
  if (validationCache.size >= CACHE_MAX_SIZE) {
    const firstKey = validationCache.keys().next().value;
    validationCache.delete(firstKey);
  }
  validationCache.set(key, result);
}

/**
 * Validate piece notation with caching
 * @param {string} piece - Piece notation (e.g., 'wP', 'bK')
 * @returns {boolean} True if piece notation is valid
 */
export function isValidPiece(piece) {
  if (typeof piece !== 'string' || piece.length !== 2) {
    return false;
  }

  const cacheKey = `piece:${piece}`;
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey);
  }

  const color = piece[0];
  const type = piece[1];

  const isValid = ['w', 'b'].includes(color) && ['P', 'R', 'N', 'B', 'Q', 'K'].includes(type);

  cacheResult(cacheKey, isValid);
  return isValid;
}

/**
 * Validate position object with comprehensive checks
 * @param {Object} position - Position object with square-piece mappings
 * @returns {boolean} True if position is valid
 */
export function isValidPosition(position) {
  if (typeof position !== 'object' || position === null) {
    return false;
  }

  // Check for circular references
  try {
    JSON.stringify(position);
  } catch {
    return false;
  }

  // Validate each square-piece mapping
  for (const [square, piece] of Object.entries(position)) {
    if (!isValidSquare(square) || !isValidPiece(piece)) {
      return false;
    }
  }

  // Optional: Check for chess-specific rules
  return isValidChessPosition(position);
}

/**
 * Validates chess-specific position rules
 * @param {Object} position - Position object
 * @returns {boolean} True if position follows chess rules
 */
function isValidChessPosition(position) {
  const pieces = Object.values(position);

  // Count kings
  const whiteKings = pieces.filter((p) => p === 'wK').length;
  const blackKings = pieces.filter((p) => p === 'bK').length;

  // Must have exactly one king of each color
  if (whiteKings !== 1 || blackKings !== 1) {
    return false;
  }

  // Count pawns (max 8 per side)
  const whitePawns = pieces.filter((p) => p === 'wP').length;
  const blackPawns = pieces.filter((p) => p === 'bP').length;

  if (whitePawns > 8 || blackPawns > 8) {
    return false;
  }

  // Check pawn placement (not on first or last rank)
  for (const [square, piece] of Object.entries(position)) {
    if (piece === 'wP' || piece === 'bP') {
      const rank = square[1];
      if (rank === '1' || rank === '8') {
        return false;
      }
    }
  }

  return true;
}

/**
 * Validate FEN string format with comprehensive checks
 * @param {string} fen - FEN string
 * @returns {Object} Validation result with success and error properties
 */
export function validateFenFormat(fen) {
  if (typeof fen !== 'string') {
    return { success: false, error: 'FEN must be a string' };
  }

  const cacheKey = `fen:${fen}`;
  if (validationCache.has(cacheKey)) {
    return validationCache.get(cacheKey);
  }

  const parts = fen.trim().split(' ');
  if (parts.length !== 6) {
    const result = { success: false, error: 'FEN must have 6 parts separated by spaces' };
    cacheResult(cacheKey, result);
    return result;
  }

  // Validate piece placement
  const ranks = parts[0].split('/');
  if (ranks.length !== 8) {
    const result = { success: false, error: 'Piece placement must have 8 ranks' };
    cacheResult(cacheKey, result);
    return result;
  }

  // Validate each rank
  for (let i = 0; i < ranks.length; i++) {
    const rankResult = validateRank(ranks[i]);
    if (!rankResult.success) {
      const result = { success: false, error: `Invalid rank ${i + 1}: ${rankResult.error}` };
      cacheResult(cacheKey, result);
      return result;
    }
  }

  // Validate active color
  if (!['w', 'b'].includes(parts[1])) {
    const result = { success: false, error: 'Active color must be "w" or "b"' };
    cacheResult(cacheKey, result);
    return result;
  }

  // Validate castling availability
  if (!/^[KQkq-]*$/.test(parts[2])) {
    const result = { success: false, error: 'Invalid castling availability' };
    cacheResult(cacheKey, result);
    return result;
  }

  // Validate en passant target square
  if (parts[3] !== '-' && !isValidSquare(parts[3])) {
    const result = { success: false, error: 'Invalid en passant target square' };
    cacheResult(cacheKey, result);
    return result;
  }

  // Validate halfmove clock
  const halfmove = parseInt(parts[4], 10);
  if (isNaN(halfmove) || halfmove < 0) {
    const result = { success: false, error: 'Invalid halfmove clock' };
    cacheResult(cacheKey, result);
    return result;
  }

  // Validate fullmove number
  const fullmove = parseInt(parts[5], 10);
  if (isNaN(fullmove) || fullmove < 1) {
    const result = { success: false, error: 'Invalid fullmove number' };
    cacheResult(cacheKey, result);
    return result;
  }

  const result = { success: true };
  cacheResult(cacheKey, result);
  return result;
}

/**
 * Validates a single rank in FEN notation
 * @param {string} rank - Rank string
 * @returns {Object} Validation result
 */
function validateRank(rank) {
  if (typeof rank !== 'string') {
    return { success: false, error: 'Rank must be a string' };
  }

  let squareCount = 0;

  for (let i = 0; i < rank.length; i++) {
    const char = rank[i];

    if (/[1-8]/.test(char)) {
      squareCount += parseInt(char, 10);
    } else if (/[prnbqkPRNBQK]/.test(char)) {
      squareCount += 1;
    } else {
      return { success: false, error: `Invalid character "${char}" in rank` };
    }
  }

  if (squareCount !== 8) {
    return { success: false, error: `Rank must represent exactly 8 squares, got ${squareCount}` };
  }

  return { success: true };
}

/**
 * Validate move notation in various formats
 * @param {string} move - Move string (e.g., 'e2e4', 'Nf3', 'O-O')
 * @returns {Object} Validation result
 */
export function validateMove(move) {
  if (typeof move !== 'string') {
    return { success: false, error: 'Move must be a string' };
  }

  const trimmed = move.trim();
  if (trimmed.length === 0) {
    return { success: false, error: 'Move cannot be empty' };
  }

  // Check for castling
  if (trimmed === 'O-O' || trimmed === 'O-O-O') {
    return { success: true, type: 'castling' };
  }

  // Check for coordinate notation (e.g., e2e4, e7e8q)
  if (/^[a-h][1-8][a-h][1-8][qrnbQRNB]?$/.test(trimmed)) {
    return { success: true, type: 'coordinate' };
  }

  // Check for algebraic notation (e.g., Nf3, Qxd5, e4)
  if (/^[PRNBQK]?[a-h]?[1-8]?x?[a-h][1-8](\+|#)?$/.test(trimmed)) {
    return { success: true, type: 'algebraic' };
  }

  return { success: false, error: 'Invalid move format' };
}

/**
 * Validate configuration object with detailed error reporting
 * @param {Object} config - Configuration object
 * @returns {Object} Validation result with success and errors array
 */
export function validateConfig(config) {
  const errors = [];

  if (!config || typeof config !== 'object') {
    return { success: false, errors: ['Configuration must be an object'] };
  }

  // Required fields
  if (!config.id && !config.id_div) {
    errors.push('Configuration must include "id" or "id_div"');
  }

  // Optional field validation
  if (config.orientation && !['white', 'black', 'w', 'b'].includes(config.orientation)) {
    errors.push('Invalid orientation. Must be "white", "black", "w", or "b"');
  }

  if (config.position && config.position !== 'start' && typeof config.position !== 'object') {
    errors.push('Invalid position. Must be "start" or a position object');
  }

  if (config.position && typeof config.position === 'object' && !isValidPosition(config.position)) {
    errors.push('Invalid position object format');
  }

  if (config.size && !isValidSize(config.size)) {
    errors.push('Invalid size. Must be "auto", a positive number, or a valid CSS size');
  }

  if (
    config.movableColors &&
    !['white', 'black', 'w', 'b', 'both', 'none'].includes(config.movableColors)
  ) {
    errors.push('Invalid movableColors. Must be "white", "black", "w", "b", "both", or "none"');
  }

  if (config.dropOffBoard && !['snapback', 'trash'].includes(config.dropOffBoard)) {
    errors.push('Invalid dropOffBoard. Must be "snapback" or "trash"');
  }

  // Validate callback functions
  const callbacks = [
    'onMove',
    'onMoveEnd',
    'onChange',
    'onDragStart',
    'onDragMove',
    'onDrop',
    'onSnapbackEnd',
  ];
  for (const callback of callbacks) {
    if (config[callback] && typeof config[callback] !== 'function') {
      errors.push(`Invalid ${callback}. Must be a function`);
    }
  }

  // Validate color values
  const colorFields = ['whiteSquare', 'blackSquare', 'highlight', 'hintColor'];
  for (const field of colorFields) {
    if (config[field] && !isValidColor(config[field])) {
      errors.push(`Invalid ${field}. Must be a valid CSS color`);
    }
  }

  // Validate animation settings
  if (config.moveAnimation && !isValidEasing(config.moveAnimation)) {
    errors.push('Invalid moveAnimation. Must be a valid easing function');
  }

  if (config.animationStyle && !['sequential', 'simultaneous'].includes(config.animationStyle)) {
    errors.push('Invalid animationStyle. Must be "sequential" or "simultaneous"');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

/**
 * Validates size value
 * @param {number|string} size - Size value
 * @returns {boolean} True if valid
 */
function isValidSize(size) {
  if (size === 'auto') {
    return true;
  }

  if (typeof size === 'number') {
    return size > 0 && size <= 5000; // Reasonable upper limit
  }

  if (typeof size === 'string') {
    // Check for CSS size values
    return /^\d+(px|em|rem|%|vh|vw)$/.test(size);
  }

  return false;
}

/**
 * Validates CSS color value
 * @param {string} color - Color value
 * @returns {boolean} True if valid
 */
function isValidColor(color) {
  if (typeof color !== 'string') {
    return false;
  }

  // Hex colors
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    return true;
  }

  // RGB/RGBA
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[0-1](\.\d+)?)?\s*\)$/.test(color)) {
    return true;
  }

  // HSL/HSLA
  if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[0-1](\.\d+)?)?\s*\)$/.test(color)) {
    return true;
  }

  // Named colors (basic set)
  const namedColors = [
    'white',
    'black',
    'red',
    'green',
    'blue',
    'yellow',
    'cyan',
    'magenta',
    'transparent',
    'gray',
    'grey',
    'brown',
    'orange',
    'purple',
    'pink',
  ];

  return namedColors.includes(color.toLowerCase());
}

/**
 * Validates easing function
 * @param {string} easing - Easing function name
 * @returns {boolean} True if valid
 */
function isValidEasing(easing) {
  const validEasing = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier'];

  return (
    validEasing.includes(easing) ||
    /^cubic-bezier\(\s*[\d.-]+\s*,\s*[\d.-]+\s*,\s*[\d.-]+\s*,\s*[\d.-]+\s*\)$/.test(easing)
  );
}

/**
 * Batch validates multiple items
 * @param {Array} items - Array of validation items
 * @returns {Array} Array of validation results
 */
export function batchValidate(items) {
  return items.map((item) => {
    const { type, value } = item;

    switch (type) {
      case 'piece':
        return { ...item, valid: isValidPiece(value) };
      case 'square':
        return { ...item, valid: isValidSquare(value) };
      case 'position':
        return { ...item, valid: isValidPosition(value) };
      case 'fen': {
        const fenResult = validateFenFormat(value);
        return { ...item, valid: fenResult.success, error: fenResult.error };
      }
      case 'move': {
        const moveResult = validateMove(value);
        return { ...item, valid: moveResult.success, error: moveResult.error };
      }
      case 'config': {
        const configResult = validateConfig(value);
        return { ...item, valid: configResult.success, errors: configResult.errors };
      }
      default:
        return { ...item, valid: false, error: 'Unknown validation type' };
    }
  });
}

/**
 * Clears validation cache
 */
export function clearValidationCache() {
  validationCache.clear();
}

/**
 * Gets validation cache statistics
 * @returns {Object} Cache statistics
 */
export function getValidationCacheStats() {
  return {
    size: validationCache.size,
    maxSize: CACHE_MAX_SIZE,
  };
}
