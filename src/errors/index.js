/**
 * Error handling module exports
 * @module errors
 * @since 2.0.0
 */

export { ERROR_MESSAGES, ERROR_CODES } from './messages.js';
export {
  ChessboardError,
  ValidationError,
  ConfigurationError,
  MoveError,
  DOMError,
  PieceError,
} from './ChessboardError.js';
