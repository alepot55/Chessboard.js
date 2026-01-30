/**
 * Service for managing board setup and DOM operations
 * @module services/BoardService
 * @since 2.0.0
 */

import { BOARD_SIZE } from '../constants/positions.js';
import { DOMError, ValidationError } from '../errors/ChessboardError.js';
import { ERROR_MESSAGES } from '../errors/messages.js';
import Square from '../components/Square.js';

/**
 * Service responsible for board DOM manipulation and setup
 * @class
 */
export class BoardService {
  /**
   * Creates a new BoardService instance
   * @param {ChessboardConfig} config - Board configuration
   */
  constructor(config) {
    this.config = config;
    this.element = null;
    this.squares = {};
  }

  /**
   * Builds the board DOM element and attaches it to the configured container
   * @throws {DOMError} When the container element cannot be found
   */
  buildBoard() {
    console.log('BoardService.buildBoard: Looking for element with ID:', this.config.id_div);

    this.element = document.getElementById(this.config.id_div);
    if (!this.element) {
      throw new DOMError(ERROR_MESSAGES.invalid_id_div + this.config.id_div, this.config.id_div);
    }

    this.resize(this.config.size);
    this.element.className = 'board';
  }

  /**
   * Creates all 64 squares and adds them to the board
   * @param {Function} coordConverter - Function to convert row/col to real coordinates
   */
  buildSquares(coordConverter) {
    for (let row = 0; row < BOARD_SIZE.ROWS; row++) {
      for (let col = 0; col < BOARD_SIZE.COLS; col++) {
        const [squareRow, squareCol] = coordConverter(row, col);
        const square = new Square(squareRow, squareCol);

        this.squares[square.getId()] = square;
        this.element.appendChild(square.element);
      }
    }
  }

  /**
   * Removes all squares from the board and cleans up their resources
   * Best practice: always destroy JS objects and DOM nodes, and clear references.
   */
  removeSquares() {
    for (const square of Object.values(this.squares)) {
      // Always call destroy to remove DOM and clear piece reference
      square.destroy();
    }
    this.squares = {};
  }

  /**
   * Removes all content from the board element
   * Best practice: clear DOM and force element to be re-fetched on next build.
   */
  removeBoard() {
    if (this.element) {
      this.element.innerHTML = '';
      this.element = null;
    }
  }

  /**
   * Resizes the board to the specified size
   * @param {number|string} value - Size in pixels or 'auto'
   * @throws {ValidationError} When size value is invalid
   */
  resize(value) {
    if (value === 'auto') {
      const size = this._calculateAutoSize();
      this.resize(size);
    } else if (typeof value !== 'number') {
      throw new ValidationError(ERROR_MESSAGES.invalid_value + value, 'size', value);
    } else {
      document.documentElement.style.setProperty('--dimBoard', `${value}px`);
    }
  }

  /**
   * Calculates the optimal size when 'auto' is specified
   * @private
   * @returns {number} Calculated size in pixels
   */
  _calculateAutoSize() {
    if (!this.element) return 400; // Default fallback

    const { offsetWidth, offsetHeight } = this.element;

    if (offsetWidth === 0) {
      return offsetHeight || 400;
    } else if (offsetHeight === 0) {
      return offsetWidth;
    }
    return Math.min(offsetWidth, offsetHeight);
  }

  /**
   * Gets a square by its ID
   * @param {string} squareId - Square identifier (e.g., 'e4')
   * @returns {Square|null} The square or null if not found
   */
  getSquare(squareId) {
    return this.squares[squareId] || null;
  }

  /**
   * Gets all squares
   * @returns {Object.<string, Square>} All squares indexed by ID
   */
  getAllSquares() {
    return { ...this.squares };
  }

  /**
   * Applies a method to all squares
   * @param {string} methodName - Name of the method to call on each square
   * @param {...*} args - Arguments to pass to the method
   */
  applyToAllSquares(methodName, ...args) {
    for (const square of Object.values(this.squares)) {
      if (typeof square[methodName] === 'function') {
        square[methodName](...args);
      }
    }
  }

  /**
   * Cleans up all resources
   */
  destroy() {
    this.removeSquares();
    this.removeBoard();
    this.element = null;
    this.squares = {};
  }
}
