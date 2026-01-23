/**
 * Custom error classes for better error handling
 * @module errors/ChessboardError
 * @since 2.0.0
 */

import { ERROR_CODES } from './messages.js';

/**
 * Base error class for all chessboard-related errors
 * @class
 * @extends Error
 */
export class ChessboardError extends Error {
  /**
     * Creates a new ChessboardError instance
     * @param {string} message - Error message
     * @param {string} code - Error code from ERROR_CODES
     * @param {Object} [context={}] - Additional context information
     */
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'ChessboardError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();

    // Maintain stack trace for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChessboardError);
    }
  }
}

/**
 * Error thrown when validation fails
 * @class
 * @extends ChessboardError
 */
export class ValidationError extends ChessboardError {
  /**
     * Creates a new ValidationError instance
     * @param {string} message - Error message
     * @param {string} field - Field that failed validation
     * @param {*} value - Value that failed validation
     */
  constructor(message, field, value) {
    super(message, ERROR_CODES.VALIDATION_ERROR, { field, value });
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

/**
 * Error thrown when configuration is invalid
 * @class
 * @extends ChessboardError
 */
export class ConfigurationError extends ChessboardError {
  /**
     * Creates a new ConfigurationError instance
     * @param {string} message - Error message
     * @param {string} configKey - Configuration key that is invalid
     * @param {*} configValue - Configuration value that is invalid
     */
  constructor(message, configKey, configValue) {
    super(message, ERROR_CODES.CONFIG_ERROR, { configKey, configValue });
    this.name = 'ConfigurationError';
    this.configKey = configKey;
    this.configValue = configValue;
  }
}

/**
 * Error thrown when a move is invalid or fails
 * @class
 * @extends ChessboardError
 */
export class MoveError extends ChessboardError {
  /**
     * Creates a new MoveError instance
     * @param {string} message - Error message
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @param {string} [piece] - Piece being moved
     */
  constructor(message, from, to, piece) {
    super(message, ERROR_CODES.MOVE_ERROR, { from, to, piece });
    this.name = 'MoveError';
    this.from = from;
    this.to = to;
    this.piece = piece;
  }
}

/**
 * Error thrown when DOM operations fail
 * @class
 * @extends ChessboardError
 */
export class DOMError extends ChessboardError {
  /**
     * Creates a new DOMError instance
     * @param {string} message - Error message
     * @param {string} elementId - Element ID that caused the error
     */
  constructor(message, elementId) {
    super(message, ERROR_CODES.DOM_ERROR, { elementId });
    this.name = 'DOMError';
    this.elementId = elementId;
  }
}

/**
 * Error thrown when piece operations fail
 * @class
 * @extends ChessboardError
 */
export class PieceError extends ChessboardError {
  /**
     * Creates a new PieceError instance
     * @param {string} message - Error message
     * @param {string} pieceId - Piece ID that caused the error
     * @param {string} [square] - Square where the error occurred
     */
  constructor(message, pieceId, square) {
    super(message, ERROR_CODES.PIECE_ERROR, { pieceId, square });
    this.name = 'PieceError';
    this.pieceId = pieceId;
    this.square = square;
  }
}
