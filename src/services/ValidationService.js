/**
 * Service for input validation and data sanitization
 * @module services/ValidationService
 * @since 2.0.0
 */

import { PIECE_TYPES, PIECE_COLORS, BOARD_LETTERS } from '../constants/positions.js';
import { ValidationError } from '../errors/ChessboardError.js';
import { ERROR_MESSAGES } from '../errors/messages.js';

/**
 * Service responsible for validating inputs and data
 * @class
 */
export class ValidationService {
    /**
     * Creates a new ValidationService instance
     */
    constructor() {
        this.validSquarePattern = /^[a-h][1-8]$/;
        this.validPiecePattern = /^[prnbqkPRNBQK][wb]$/;
        this.validFenPattern = /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+\s[wb]\s[KQkq-]+\s[a-h1-8-]+\s\d+\s\d+$/;
    }

    /**
     * Validates a square identifier
     * @param {string} square - Square to validate (e.g., 'e4')
     * @returns {boolean} True if valid
     */
    isValidSquare(square) {
        return typeof square === 'string' && this.validSquarePattern.test(square);
    }

    /**
     * Validates a piece identifier
     * @param {string} piece - Piece to validate (e.g., 'wK', 'bp')
     * @returns {boolean} True if valid
     */
    isValidPiece(piece) {
        if (typeof piece !== 'string' || piece.length !== 2) {
            return false;
        }
        
        const [type, color] = piece.split('');
        return PIECE_TYPES.includes(type.toLowerCase()) && PIECE_COLORS.includes(color);
    }

    /**
     * Validates a FEN string
     * @param {string} fen - FEN string to validate
     * @returns {boolean} True if valid
     */
    isValidFen(fen) {
        if (typeof fen !== 'string') {
            return false;
        }
        
        // Basic pattern check
        if (!this.validFenPattern.test(fen)) {
            return false;
        }
        
        // Additional FEN validation logic could be added here
        return true;
    }

    /**
     * Validates a move string
     * @param {string} move - Move string to validate (e.g., 'e2e4', 'e7e8q')
     * @returns {boolean} True if valid
     */
    isValidMove(move) {
        if (typeof move !== 'string' || move.length < 4 || move.length > 5) {
            return false;
        }
        
        const from = move.slice(0, 2);
        const to = move.slice(2, 4);
        const promotion = move.slice(4, 5);
        
        if (!this.isValidSquare(from) || !this.isValidSquare(to)) {
            return false;
        }
        
        if (promotion && !['q', 'r', 'b', 'n'].includes(promotion.toLowerCase())) {
            return false;
        }
        
        return true;
    }

    /**
     * Validates board orientation
     * @param {string} orientation - Orientation to validate
     * @returns {boolean} True if valid
     */
    isValidOrientation(orientation) {
        return orientation === 'w' || orientation === 'b' || 
               orientation === 'white' || orientation === 'black';
    }

    /**
     * Validates a color value
     * @param {string} color - Color to validate
     * @returns {boolean} True if valid
     */
    isValidColor(color) {
        return color === 'w' || color === 'b' || 
               color === 'white' || color === 'black';
    }

    /**
     * Validates a size value
     * @param {number|string} size - Size to validate
     * @returns {boolean} True if valid
     */
    isValidSize(size) {
        if (size === 'auto') {
            return true;
        }
        
        if (typeof size === 'number') {
            return size > 0 && size <= 2000; // Reasonable limits
        }
        
        return false;
    }

    /**
     * Validates a time value (for animations)
     * @param {number} time - Time value to validate
     * @returns {boolean} True if valid
     */
    isValidTime(time) {
        return typeof time === 'number' && time >= 0 && time <= 10000;
    }

    /**
     * Validates a callback function
     * @param {Function} callback - Callback to validate
     * @returns {boolean} True if valid
     */
    isValidCallback(callback) {
        return typeof callback === 'function';
    }

    /**
     * Validates a DOM element ID
     * @param {string} id - Element ID to validate
     * @returns {boolean} True if valid
     */
    isValidElementId(id) {
        return typeof id === 'string' && id.length > 0;
    }

    /**
     * Validates movable colors configuration
     * @param {string} colors - Colors value to validate
     * @returns {boolean} True if valid
     */
    isValidMovableColors(colors) {
        return ['w', 'b', 'white', 'black', 'both', 'none'].includes(colors);
    }

    /**
     * Validates drop off board configuration
     * @param {string} dropOff - Drop off board value to validate
     * @returns {boolean} True if valid
     */
    isValidDropOffBoard(dropOff) {
        return ['snapback', 'trash'].includes(dropOff);
    }

    /**
     * Validates animation easing type
     * @param {string} easing - Easing type to validate
     * @returns {boolean} True if valid
     */
    isValidEasing(easing) {
        return ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'].includes(easing);
    }

    /**
     * Validates animation style
     * @param {string} style - Animation style to validate
     * @returns {boolean} True if valid
     */
    isValidAnimationStyle(style) {
        return ['sequential', 'simultaneous'].includes(style);
    }

    /**
     * Validates and sanitizes a square identifier
     * @param {string} square - Square to validate
     * @returns {string} Sanitized square
     * @throws {ValidationError} If square is invalid
     */
    validateSquare(square) {
        if (!this.isValidSquare(square)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_square + square, 'square', square);
        }
        return square.toLowerCase();
    }

    /**
     * Validates and sanitizes a piece identifier
     * @param {string} piece - Piece to validate
     * @returns {string} Sanitized piece
     * @throws {ValidationError} If piece is invalid
     */
    validatePiece(piece) {
        if (!this.isValidPiece(piece)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_piece + piece, 'piece', piece);
        }
        return piece.toLowerCase();
    }

    /**
     * Validates and sanitizes a FEN string
     * @param {string} fen - FEN to validate
     * @returns {string} Sanitized FEN
     * @throws {ValidationError} If FEN is invalid
     */
    validateFen(fen) {
        if (!this.isValidFen(fen)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_fen + fen, 'fen', fen);
        }
        return fen.trim();
    }

    /**
     * Validates and sanitizes a move string
     * @param {string} move - Move to validate
     * @returns {string} Sanitized move
     * @throws {ValidationError} If move is invalid
     */
    validateMove(move) {
        if (!this.isValidMove(move)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_move + move, 'move', move);
        }
        return move.toLowerCase();
    }

    /**
     * Validates and sanitizes orientation
     * @param {string} orientation - Orientation to validate
     * @returns {string} Sanitized orientation ('w' or 'b')
     * @throws {ValidationError} If orientation is invalid
     */
    validateOrientation(orientation) {
        if (!this.isValidOrientation(orientation)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_orientation + orientation, 'orientation', orientation);
        }
        
        // Normalize to 'w' or 'b'
        return orientation === 'white' ? 'w' : orientation === 'black' ? 'b' : orientation;
    }

    /**
     * Validates and sanitizes color
     * @param {string} color - Color to validate
     * @returns {string} Sanitized color ('w' or 'b')
     * @throws {ValidationError} If color is invalid
     */
    validateColor(color) {
        if (!this.isValidColor(color)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_color + color, 'color', color);
        }
        
        // Normalize to 'w' or 'b'
        return color === 'white' ? 'w' : color === 'black' ? 'b' : color;
    }

    /**
     * Validates and sanitizes size
     * @param {number|string} size - Size to validate
     * @returns {number|string} Sanitized size
     * @throws {ValidationError} If size is invalid
     */
    validateSize(size) {
        if (!this.isValidSize(size)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_value + size, 'size', size);
        }
        return size;
    }

    /**
     * Validates configuration object
     * @param {Object} config - Configuration to validate
     * @returns {Object} Validated configuration
     * @throws {ValidationError} If configuration is invalid
     */
    validateConfig(config) {
        if (!config || typeof config !== 'object') {
            throw new ValidationError('Configuration must be an object', 'config', config);
        }
        
        // Validate required fields
        if (!config.id && !config.id_div) {
            throw new ValidationError('Configuration must include id or id_div', 'id', config.id);
        }
        
        // Validate optional fields
        if (config.orientation && !this.isValidOrientation(config.orientation)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_orientation + config.orientation, 'orientation', config.orientation);
        }
        
        if (config.size && !this.isValidSize(config.size)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_value + config.size, 'size', config.size);
        }
        
        if (config.movableColors && !this.isValidMovableColors(config.movableColors)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_color + config.movableColors, 'movableColors', config.movableColors);
        }
        
        if (config.dropOffBoard && !this.isValidDropOffBoard(config.dropOffBoard)) {
            throw new ValidationError(ERROR_MESSAGES.invalid_dropOffBoard + config.dropOffBoard, 'dropOffBoard', config.dropOffBoard);
        }
        
        return config;
    }

    /**
     * Cleans up resources
     */
    destroy() {
        // No cleanup needed for this service
    }
}
