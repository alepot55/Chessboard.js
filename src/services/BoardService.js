/**
 * Board management service for handling board layout and squares
 * @module BoardService
 */

import { BOARD } from '../core/constants.js';
import { ValidationService } from './ValidationService.js';
import Square from '../components/Square.js';

/**
 * Service for managing board layout and square operations
 * @class BoardService
 */
export class BoardService {
    /**
     * Creates a new BoardService
     * @param {object} config - Configuration object
     */
    constructor(config) {
        this.config = config;
        this.element = null;
        this.squares = {};
    }

    /**
     * Builds the board DOM structure
     * @throws {Error} If board element not found
     */
    buildBoard() {
        ValidationService.validateElementId(this.config.id_div);
        
        this.element = document.getElementById(this.config.id_div);
        this.resize(this.config.size);
        this.element.className = "board";
    }

    /**
     * Builds all squares on the board
     */
    buildSquares() {
        for (let row = 0; row < BOARD.ROWS; row++) {
            for (let col = 0; col < BOARD.COLS; col++) {
                const [squareRow, squareCol] = this._getRealCoordinates(row, col);
                const square = new Square(squareRow, squareCol);
                
                this.squares[square.getId()] = square;
                this.element.appendChild(square.element);
            }
        }
    }

    /**
     * Removes the board content
     */
    removeBoard() {
        if (this.element) {
            this.element.innerHTML = '';
        }
    }

    /**
     * Removes all squares from the board
     */
    removeSquares() {
        for (const square of Object.values(this.squares)) {
            if (this.element && square.element.parentNode === this.element) {
                this.element.removeChild(square.element);
            }
            square.destroy();
        }
        this.squares = {};
    }

    /**
     * Resizes the board
     * @param {number|string} value - Size value or 'auto'
     */
    resize(value) {
        if (value === 'auto') {
            const size = this._calculateAutoSize();
            this.resize(size);
        } else if (typeof value === 'number') {
            document.documentElement.style.setProperty('--dimBoard', value + 'px');
        } else {
            ValidationService.validateNumericValue(value);
        }
    }

    /**
     * Gets a square by ID
     * @param {string} squareId - Square identifier
     * @returns {object} Square object
     */
    getSquare(squareId) {
        ValidationService.validateSquareId(squareId);
        return this.squares[squareId];
    }

    /**
     * Gets all squares
     * @returns {object} All squares
     */
    getAllSquares() {
        return { ...this.squares };
    }

    /**
     * Applies a method to all squares
     * @param {string} method - Method name to call on each square
     */
    applyToAllSquares(method) {
        for (const square of Object.values(this.squares)) {
            if (typeof square[method] === 'function') {
                square[method]();
            }
        }
    }

    /**
     * Gets square ID from row and column coordinates
     * @param {number} row - Row number
     * @param {number} col - Column number
     * @returns {string} Square ID
     */
    getSquareID(row, col) {
        row = parseInt(row);
        col = parseInt(col);
        
        if (this._isWhiteOriented()) {
            row = 8 - row;
            col = col + 1;
        } else {
            row = row + 1;
            col = 8 - col;
        }
        
        const letters = 'abcdefgh';
        const letter = letters[col - 1];
        return letter + row;
    }

    /**
     * Converts square notation to Square object
     * @param {string|object} square - Square identifier or Square object
     * @returns {object} Square object
     */
    convertSquare(square) {
        if (square instanceof Square) {
            return square;
        }
        
        if (typeof square === 'string' && this.squares[square]) {
            return this.squares[square];
        }
        
        throw new Error(`Invalid square: ${square}`);
    }

    /**
     * Gets the board DOM element
     * @returns {HTMLElement} Board element
     */
    getElement() {
        return this.element;
    }

    /**
     * Destroys the board service
     */
    destroy() {
        this.removeSquares();
        this.removeBoard();
        this.element = null;
    }

    /**
     * Calculates auto size based on container dimensions
     * @private
     * @returns {number} Calculated size
     */
    _calculateAutoSize() {
        if (!this.element) return 400; // Default size

        let size;
        if (this.element.offsetWidth === 0) {
            size = this.element.offsetHeight;
        } else if (this.element.offsetHeight === 0) {
            size = this.element.offsetWidth;
        } else {
            size = Math.min(this.element.offsetWidth, this.element.offsetHeight);
        }
        
        return size || 400; // Default fallback
    }

    /**
     * Gets real coordinates based on orientation
     * @private
     * @param {number} row - Row number
     * @param {number} col - Column number
     * @returns {Array<number>} Real coordinates
     */
    _getRealCoordinates(row, col) {
        if (this._isWhiteOriented()) {
            row = 7 - row;
        } else {
            col = 7 - col;
        }
        return [row + 1, col + 1];
    }

    /**
     * Checks if board is white-oriented
     * @private
     * @returns {boolean} True if white-oriented
     */
    _isWhiteOriented() {
        return this.config.orientation === 'w';
    }

    /**
     * Gets the DOM element for a specific square
     * @param {string} squareId - The square ID (e.g., 'e4')
     * @returns {HTMLElement|null} The square element or null if not found
     */
    getSquareElement(squareId) {
        const square = this.squares[squareId];
        return square ? square.element : null;
    }

    /**
     * Flips the board orientation
     */
    flip() {
        if (this.element) {
            this.element.classList.toggle('flipped');
        }
    }
}
