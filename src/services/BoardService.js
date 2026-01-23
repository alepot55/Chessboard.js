/**
 * Service for managing board state, squares, and DOM interactions
 * @module services/BoardService
 * @since 2.0.0
 */

import Square from '../components/Square.js';
import { logger } from '../utils/logger.js';

/**
 * Service responsible for board management and DOM operations
 * @class
 */
export class BoardService {
  /**
   * Creates a new BoardService instance
   * @param {ChessboardConfig} config - Board configuration
   */
  constructor(config) {
    this.config = config;
    this.squares = {};
    this.boardElement = null;
  }

  /**
   * Builds the board DOM structure
   * @throws {Error} If container element is not found
   */
  buildBoard() {
    logger.debug('BoardService.buildBoard: Looking for element with ID:', this.config.id_div);
    const container = document.getElementById(this.config.id_div);

    if (!container) {
      throw new Error(`Element with id "${this.config.id_div}" not found`);
    }

    // Set CSS variable for board size
    const size = this.config.size === 'auto' ? 'auto' : `${this.config.size}px`;
    document.documentElement.style.setProperty('--dimBoard', size);

    // Create board element
    this.boardElement = document.createElement('div');
    this.boardElement.classList.add('chessboard');
    this.boardElement.setAttribute('role', 'grid');
    this.boardElement.setAttribute('aria-label', 'Chessboard');

    // Add to container
    container.appendChild(this.boardElement);
  }

  /**
   * Builds all squares on the board
   * @param {Function} coordinateMapper - Function to map (row, col) to real coordinates
   */
  buildSquares(coordinateMapper) {
    if (!this.boardElement) {
      throw new Error('Board element not initialized. Call buildBoard() first.');
    }

    this.squares = {};

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        // Calculate real coordinates based on orientation
        const [realRow, realCol] = coordinateMapper(r, c);

        // Create square
        const square = new Square(realRow, realCol);
        this.squares[square.id] = square;

        // Add to board
        this.boardElement.appendChild(square.element);
      }
    }
  }

  /**
   * Gets a square by ID
   * @param {string} squareId - Square ID (e.g., 'e4')
   * @returns {Square|null} Square instance or null if not found
   */
  getSquare(squareId) {
    return this.squares[squareId] || null;
  }

  /**
   * Gets all squares
   * @returns {Object} Map of square IDs to Square instances
   */
  getAllSquares() {
    return this.squares;
  }

  /**
   * Removes all squares from the board
   */
  removeSquares() {
    Object.values(this.squares).forEach((square) => {
      if (square.element && square.element.parentNode) {
        square.element.parentNode.removeChild(square.element);
      }
    });
    this.squares = {};
  }

  /**
   * Removes the board from the DOM
   */
  removeBoard() {
    if (this.boardElement && this.boardElement.parentNode) {
      this.boardElement.parentNode.removeChild(this.boardElement);
    }
    this.boardElement = null;
  }

  /**
   * Applies an action to all squares
   * @param {string} method - Method name to call on each square
   * @param {...any} args - Arguments to pass to the method
   */
  applyToAllSquares(method, ...args) {
    Object.values(this.squares).forEach((square) => {
      if (typeof square[method] === 'function') {
        square[method](...args);
      }
    });
  }

  /**
   * Highlights a specific square
   * @param {string} squareId - Square ID to highlight
   * @param {Object} [options] - Highlight options
   */
  highlight(squareId, options = {}) {
    const square = this.getSquare(squareId);
    if (square) {
      square.highlight(options);
    }
  }

  /**
   * Removes highlight from a specific square
   * @param {string} squareId - Square ID to dehighlight
   */
  dehighlight(squareId) {
    const square = this.getSquare(squareId);
    if (square) {
      square.dehighlight();
    }
  }

  /**
   * Clears all highlights from the board
   */
  clearHighlights() {
    this.applyToAllSquares('dehighlight');
  }
}
