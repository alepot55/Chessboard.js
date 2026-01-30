/**
 * Service for managing chess positions and FEN conversion
 * @module services/PositionService
 * @since 2.0.0
 */

import { Chess, validateFen } from '../utils/chess.js';
import {
  STANDARD_POSITIONS,
  DEFAULT_STARTING_POSITION,
  BOARD_LETTERS,
} from '../constants/positions.js';
import { ValidationError } from '../errors/ChessboardError.js';
import { ERROR_MESSAGES } from '../errors/messages.js';

/**
 * Service responsible for position management and FEN operations
 * @class
 */
export class PositionService {
  /**
   * Creates a new PositionService instance
   * @param {ChessboardConfig} config - Board configuration
   */
  constructor(config) {
    this.config = config;
    this.game = null;
  }

  /**
   * Converts various position formats to FEN string
   * @param {string|Object} position - Position in various formats
   * @returns {string} FEN string representation
   * @throws {ValidationError} When position format is invalid
   */
  convertFen(position) {
    if (typeof position === 'string') {
      return this._convertStringPosition(position);
    } else if (typeof position === 'object' && position !== null) {
      return this._convertObjectPosition(position);
    }
    throw new ValidationError(ERROR_MESSAGES.invalid_position + position, 'position', position);
  }

  /**
   * Converts string position to FEN
   * @private
   * @param {string} position - String position
   * @returns {string} FEN string
   */
  _convertStringPosition(position) {
    if (position === 'start') {
      return DEFAULT_STARTING_POSITION;
    }

    if (this.validateFen(position)) {
      return position;
    }

    if (STANDARD_POSITIONS[position]) {
      return STANDARD_POSITIONS[position];
    }

    throw new ValidationError(ERROR_MESSAGES.invalid_position + position, 'position', position);
  }

  /**
   * Converts object position to FEN
   * @private
   * @param {Object} position - Object with square->piece mapping
   * @returns {string} FEN string
   */
  _convertObjectPosition(position) {
    const parts = [];

    for (let row = 0; row < 8; row++) {
      const rowParts = [];
      let empty = 0;

      for (let col = 0; col < 8; col++) {
        const square = this._getSquareID(row, col);
        const piece = position[square];

        if (piece) {
          if (empty > 0) {
            rowParts.push(empty);
            empty = 0;
          }
          // Convert piece notation: white pieces become uppercase, black remain lowercase
          const fenPiece = piece[1] === 'w' ? piece[0].toUpperCase() : piece[0].toLowerCase();
          rowParts.push(fenPiece);
        } else {
          empty++;
        }
      }

      if (empty > 0) {
        rowParts.push(empty);
      }

      parts.push(rowParts.join(''));
    }

    return `${parts.join('/')} w KQkq - 0 1`;
  }

  /**
   * Sets up the game with the given position
   * @param {string|Object} position - Position to set
   * @param {Object} [options] - Additional options for game setup
   */
  setGame(position, options = {}) {
    const fen = this.convertFen(position);

    if (this.game) {
      this.game.load(fen, options);
    } else {
      this.game = new Chess(fen);
    }
  }

  /**
   * Gets the current game instance
   * @returns {Chess} Current chess.js game instance
   */
  getGame() {
    return this.game;
  }

  /**
   * Validates a FEN string
   * @param {string} fen - FEN string to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validateFen(fen) {
    return validateFen(fen);
  }

  /**
   * Gets piece information for a specific square
   * @param {string} squareId - Square identifier
   * @returns {string|null} Piece ID or null if no piece
   */
  getGamePieceId(squareId) {
    if (!this.game) return null;
    const piece = this.game.get(squareId);
    return piece ? piece.color + piece.type : null;
  }

  /**
   * Checks if a specific piece is on a specific square
   * @param {string} piece - Piece ID to check
   * @param {string} square - Square to check
   * @returns {boolean} True if piece is on square
   */
  isPiece(piece, square) {
    return this.getGamePieceId(square) === piece;
  }

  /**
   * Converts board coordinates to square ID
   * @private
   * @param {number} row - Row index (0-7)
   * @param {number} col - Column index (0-7)
   * @returns {string} Square ID (e.g., 'e4')
   */
  _getSquareID(row, col) {
    row = parseInt(row);
    col = parseInt(col);

    if (this.config.orientation === 'w') {
      row = 8 - row;
      col = col + 1;
    } else {
      row = row + 1;
      col = 8 - col;
    }

    const letter = BOARD_LETTERS[col - 1];
    return letter + row;
  }

  /**
   * Changes the turn in a FEN string
   * @param {string} fen - Original FEN string
   * @param {string} color - New turn color ('w' or 'b')
   * @returns {string} Modified FEN string
   */
  changeFenTurn(fen, color) {
    const parts = fen.split(' ');
    parts[1] = color;
    return parts.join(' ');
  }

  /**
   * Gets the current position as an object
   * @returns {Object} Position object with piece placements
   */
  getPosition() {
    const position = {};
    const game = this.getGame();

    // Convert chess.js board to position object
    const squares = [
      'a1',
      'b1',
      'c1',
      'd1',
      'e1',
      'f1',
      'g1',
      'h1',
      'a2',
      'b2',
      'c2',
      'd2',
      'e2',
      'f2',
      'g2',
      'h2',
      'a3',
      'b3',
      'c3',
      'd3',
      'e3',
      'f3',
      'g3',
      'h3',
      'a4',
      'b4',
      'c4',
      'd4',
      'e4',
      'f4',
      'g4',
      'h4',
      'a5',
      'b5',
      'c5',
      'd5',
      'e5',
      'f5',
      'g5',
      'h5',
      'a6',
      'b6',
      'c6',
      'd6',
      'e6',
      'f6',
      'g6',
      'h6',
      'a7',
      'b7',
      'c7',
      'd7',
      'e7',
      'f7',
      'g7',
      'h7',
      'a8',
      'b8',
      'c8',
      'd8',
      'e8',
      'f8',
      'g8',
      'h8',
    ];

    for (const square of squares) {
      const piece = game.get(square);
      if (piece) {
        position[square] = piece.type + piece.color;
      }
    }

    return position;
  }

  /**
   * Toggles the turn in a FEN string
   * @param {string} fen - Original FEN string
   * @returns {string} Modified FEN string
   */
  changeFenColor(fen) {
    const parts = fen.split(' ');
    parts[1] = parts[1] === 'w' ? 'b' : 'w';
    return parts.join(' ');
  }

  /**
   * Cleans up resources
   */
  destroy() {
    this.game = null;
  }
}
