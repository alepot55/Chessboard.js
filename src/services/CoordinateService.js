/**
 * Service for managing coordinate conversions and board orientation
 * @module services/CoordinateService
 * @since 2.0.0
 */

import { BOARD_LETTERS } from '../constants/positions.js';
import { ValidationError } from '../errors/ChessboardError.js';
import { ERROR_MESSAGES } from '../errors/messages.js';

/**
 * Service responsible for coordinate conversions and board orientation
 * @class
 */
export class CoordinateService {
    /**
     * Creates a new CoordinateService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Converts logical coordinates to real coordinates based on board orientation
     * @param {number} row - Row index (0-7)
     * @param {number} col - Column index (0-7)
     * @returns {Array<number>} Real coordinates [row, col] (1-8)
     */
    realCoord(row, col) {
        let realRow = row;
        let realCol = col;
        
        if (this.isWhiteOriented()) {
            realRow = 7 - row;
        } else {
            realCol = 7 - col;
        }
        
        return [realRow + 1, realCol + 1];
    }

    /**
     * Converts board coordinates to square ID
     * @param {number} row - Row index (0-7)
     * @param {number} col - Column index (0-7)
     * @returns {string} Square ID (e.g., 'e4')
     */
    getSquareID(row, col) {
        row = parseInt(row);
        col = parseInt(col);
        
        if (this.isWhiteOriented()) {
            row = 8 - row;
            col = col + 1;
        } else {
            row = row + 1;
            col = 8 - col;
        }
        
        if (col < 1 || col > 8 || row < 1 || row > 8) {
            throw new ValidationError(
                `Invalid board coordinates: row=${row}, col=${col}`,
                'coordinates',
                { row, col }
            );
        }
        
        const letter = BOARD_LETTERS[col - 1];
        return letter + row;
    }

    /**
     * Converts square ID to board coordinates
     * @param {string} squareId - Square ID (e.g., 'e4')
     * @returns {Array<number>} Board coordinates [row, col] (0-7)
     */
    getCoordinatesFromSquareID(squareId) {
        if (typeof squareId !== 'string' || squareId.length !== 2) {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_square + squareId,
                'squareId',
                squareId
            );
        }
        
        const letter = squareId[0];
        const number = parseInt(squareId[1]);
        
        const col = BOARD_LETTERS.indexOf(letter);
        if (col === -1) {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_square + squareId,
                'squareId',
                squareId
            );
        }
        
        if (number < 1 || number > 8) {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_square + squareId,
                'squareId',
                squareId
            );
        }
        
        let row, boardCol;
        
        if (this.isWhiteOriented()) {
            row = 8 - number;
            boardCol = col;
        } else {
            row = number - 1;
            boardCol = 7 - col;
        }
        
        return [row, boardCol];
    }

    /**
     * Converts pixel coordinates to square ID
     * @param {number} x - X coordinate in pixels
     * @param {number} y - Y coordinate in pixels
     * @param {HTMLElement} boardElement - Board DOM element
     * @returns {string|null} Square ID or null if outside board
     */
    pixelToSquareID(x, y, boardElement) {
        if (!boardElement) return null;
        
        const rect = boardElement.getBoundingClientRect();
        const { width, height } = rect;
        
        // Check if coordinates are within board bounds
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return null;
        }
        
        const squareWidth = width / 8;
        const squareHeight = height / 8;
        
        const col = Math.floor(x / squareWidth);
        const row = Math.floor(y / squareHeight);
        
        try {
            return this.getSquareID(row, col);
        } catch (error) {
            return null;
        }
    }

    /**
     * Converts square ID to pixel coordinates
     * @param {string} squareId - Square ID (e.g., 'e4')
     * @param {HTMLElement} boardElement - Board DOM element
     * @returns {Object|null} Pixel coordinates {x, y} or null if invalid
     */
    squareIDToPixel(squareId, boardElement) {
        if (!boardElement) return null;
        
        try {
            const [row, col] = this.getCoordinatesFromSquareID(squareId);
            const rect = boardElement.getBoundingClientRect();
            const { width, height } = rect;
            
            const squareWidth = width / 8;
            const squareHeight = height / 8;
            
            const x = col * squareWidth;
            const y = row * squareHeight;
            
            return { x, y };
        } catch (error) {
            return null;
        }
    }

    /**
     * Gets the center pixel coordinates of a square
     * @param {string} squareId - Square ID (e.g., 'e4')
     * @param {HTMLElement} boardElement - Board DOM element
     * @returns {Object|null} Center coordinates {x, y} or null if invalid
     */
    getSquareCenter(squareId, boardElement) {
        const coords = this.squareIDToPixel(squareId, boardElement);
        if (!coords) return null;
        
        const rect = boardElement.getBoundingClientRect();
        const squareWidth = rect.width / 8;
        const squareHeight = rect.height / 8;
        
        return {
            x: coords.x + squareWidth / 2,
            y: coords.y + squareHeight / 2
        };
    }

    /**
     * Calculates the distance between two squares
     * @param {string} fromSquare - Source square ID
     * @param {string} toSquare - Target square ID
     * @returns {number} Distance between squares
     */
    getSquareDistance(fromSquare, toSquare) {
        try {
            const [fromRow, fromCol] = this.getCoordinatesFromSquareID(fromSquare);
            const [toRow, toCol] = this.getCoordinatesFromSquareID(toSquare);
            
            const rowDiff = Math.abs(toRow - fromRow);
            const colDiff = Math.abs(toCol - fromCol);
            
            return Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);
        } catch (error) {
            return 0;
        }
    }

    /**
     * Checks if the board is oriented from white's perspective
     * @returns {boolean} True if white-oriented
     */
    isWhiteOriented() {
        return this.config.orientation === 'w';
    }

    /**
     * Checks if the board is oriented from black's perspective
     * @returns {boolean} True if black-oriented
     */
    isBlackOriented() {
        return this.config.orientation === 'b';
    }

    /**
     * Flips the board orientation
     */
    flipOrientation() {
        this.config.orientation = this.isWhiteOriented() ? 'b' : 'w';
    }

    /**
     * Sets the board orientation
     * @param {string} orientation - 'w' for white, 'b' for black
     * @throws {ValidationError} When orientation is invalid
     */
    setOrientation(orientation) {
        if (orientation !== 'w' && orientation !== 'b') {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_orientation + orientation,
                'orientation',
                orientation
            );
        }
        
        this.config.orientation = orientation;
    }

    /**
     * Gets all square IDs in order
     * @returns {Array<string>} Array of all square IDs
     */
    getAllSquareIDs() {
        const squares = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                squares.push(this.getSquareID(row, col));
            }
        }
        
        return squares;
    }

    /**
     * Gets squares in a specific rank (row)
     * @param {number} rank - Rank number (1-8)
     * @returns {Array<string>} Array of square IDs in the rank
     */
    getSquaresByRank(rank) {
        if (rank < 1 || rank > 8) {
            throw new ValidationError(
                `Invalid rank: ${rank}`,
                'rank',
                rank
            );
        }
        
        const squares = [];
        
        for (let col = 0; col < 8; col++) {
            const row = this.isWhiteOriented() ? 8 - rank : rank - 1;
            squares.push(this.getSquareID(row, col));
        }
        
        return squares;
    }

    /**
     * Gets squares in a specific file (column)
     * @param {string} file - File letter (a-h)
     * @returns {Array<string>} Array of square IDs in the file
     */
    getSquaresByFile(file) {
        const col = BOARD_LETTERS.indexOf(file);
        if (col === -1) {
            throw new ValidationError(
                `Invalid file: ${file}`,
                'file',
                file
            );
        }
        
        const squares = [];
        
        for (let row = 0; row < 8; row++) {
            squares.push(this.getSquareID(row, col));
        }
        
        return squares;
    }
}
