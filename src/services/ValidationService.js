/**
 * Service for input validation and data sanitization
 * @module services/ValidationService
 * @since 2.0.0
 */

import { PIECE_TYPES, PIECE_COLORS, BOARD_LETTERS } from '../constants/positions.js';
import { ValidationError } from '../errors/ChessboardError.js';
import { ERROR_MESSAGES, ERROR_CODES } from '../errors/messages.js';

/**
 * Validation patterns compiled for performance
 * @constant
 * @type {Object}
 */
const VALIDATION_PATTERNS = Object.freeze({
    square: /^[a-h][1-8]$/,
    piece: /^[prnbqkPRNBQK][wb]$/,
    fen: /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+\s[wb]\s[KQkq-]+\s[a-h1-8-]+\s\d+\s\d+$/,
    move: /^[a-h][1-8][a-h][1-8][qrnb]?$/,
    color: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
});

/**
 * Valid values for various configuration options
 * @constant
 * @type {Object}
 */
const VALID_VALUES = Object.freeze({
    orientations: ['w', 'b', 'white', 'black'],
    colors: ['w', 'b', 'white', 'black'],
    movableColors: ['w', 'b', 'white', 'black', 'both', 'none'],
    dropOffBoard: ['snapback', 'trash'],
    easingTypes: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
    animationStyles: ['sequential', 'simultaneous'],
    modes: ['normal', 'creative', 'analysis'],
    promotionPieces: ['q', 'r', 'b', 'n', 'Q', 'R', 'B', 'N']
});

/**
 * Size constraints for validation
 * @constant
 * @type {Object}
 */
const SIZE_CONSTRAINTS = Object.freeze({
    min: 50,
    max: 2000,
    maxTime: 10000,
    maxDelay: 5000
});

/**
 * Service responsible for validating inputs and data
 * Implements caching for performance optimization
 * @class
 */
export class ValidationService {
    /**
     * Creates a new ValidationService instance
     */
    constructor() {
        // Cache for validation results to improve performance
        this._validationCache = new Map();
        this._cacheMaxSize = 1000;
        
        // Compile patterns for reuse
        this._patterns = VALIDATION_PATTERNS;
        this._validValues = VALID_VALUES;
        this._constraints = SIZE_CONSTRAINTS;
    }

    /**
     * Validates a square identifier with caching
     * @param {string} square - Square to validate (e.g., 'e4')
     * @returns {boolean} True if valid
     */
    isValidSquare(square) {
        const cacheKey = `square:${square}`;
        
        if (this._validationCache.has(cacheKey)) {
            return this._validationCache.get(cacheKey);
        }
        
        const isValid = typeof square === 'string' && 
                        square.length === 2 && 
                        this._patterns.square.test(square);
        
        this._cacheValidationResult(cacheKey, isValid);
        return isValid;
    }

    /**
     * Validates a piece identifier with enhanced format support
     * @param {string} piece - Piece to validate (e.g., 'wK', 'bp')
     * @returns {boolean} True if valid
     */
    isValidPiece(piece) {
        if (typeof piece !== 'string' || piece.length !== 2) {
            return false;
        }
        
        const cacheKey = `piece:${piece}`;
        
        if (this._validationCache.has(cacheKey)) {
            return this._validationCache.get(cacheKey);
        }
        
        const [first, second] = piece.split('');
        
        // Check both formats: [type][color] and [color][type]
        const format1 = PIECE_TYPES.includes(first.toLowerCase()) && 
                       PIECE_COLORS.includes(second);
        const format2 = PIECE_COLORS.includes(first) && 
                       PIECE_TYPES.includes(second.toLowerCase());
        
        const isValid = format1 || format2;
        this._cacheValidationResult(cacheKey, isValid);
        return isValid;
    }

    /**
     * Validates a FEN string with comprehensive checks
     * @param {string} fen - FEN string to validate
     * @returns {boolean} True if valid
     */
    isValidFen(fen) {
        if (typeof fen !== 'string') {
            return false;
        }
        
        const cacheKey = `fen:${fen}`;
        
        if (this._validationCache.has(cacheKey)) {
            return this._validationCache.get(cacheKey);
        }
        
        // Basic pattern check
        if (!this._patterns.fen.test(fen)) {
            this._cacheValidationResult(cacheKey, false);
            return false;
        }
        
        // Additional FEN validation
        const isValid = this._validateFenStructure(fen);
        this._cacheValidationResult(cacheKey, isValid);
        return isValid;
    }

    /**
     * Validates FEN structure in detail
     * @private
     * @param {string} fen - FEN string to validate
     * @returns {boolean} True if valid
     */
    _validateFenStructure(fen) {
        const parts = fen.split(' ');
        
        if (parts.length !== 6) {
            return false;
        }
        
        // Validate piece placement
        const ranks = parts[0].split('/');
        if (ranks.length !== 8) {
            return false;
        }
        
        // Validate each rank
        for (const rank of ranks) {
            if (!this._validateRank(rank)) {
                return false;
            }
        }
        
        // Validate active color
        if (!['w', 'b'].includes(parts[1])) {
            return false;
        }
        
        // Validate castling rights
        if (!/^[KQkq-]*$/.test(parts[2])) {
            return false;
        }
        
        // Validate en passant target
        if (parts[3] !== '-' && !this.isValidSquare(parts[3])) {
            return false;
        }
        
        // Validate halfmove clock and fullmove number
        const halfmove = parseInt(parts[4], 10);
        const fullmove = parseInt(parts[5], 10);
        
        return !isNaN(halfmove) && !isNaN(fullmove) && 
               halfmove >= 0 && fullmove >= 1;
    }

    /**
     * Validates a single rank in FEN notation
     * @private
     * @param {string} rank - Rank to validate
     * @returns {boolean} True if valid
     */
    _validateRank(rank) {
        let squares = 0;
        
        for (let i = 0; i < rank.length; i++) {
            const char = rank[i];
            
            if (/[1-8]/.test(char)) {
                squares += parseInt(char, 10);
            } else if (/[prnbqkPRNBQK]/.test(char)) {
                squares += 1;
            } else {
                return false;
            }
        }
        
        return squares === 8;
    }

    /**
     * Validates a move string with comprehensive format support
     * @param {string} move - Move string to validate (e.g., 'e2e4', 'e7e8q')
     * @returns {boolean} True if valid
     */
    isValidMove(move) {
        if (typeof move !== 'string') {
            return false;
        }
        
        const cacheKey = `move:${move}`;
        
        if (this._validationCache.has(cacheKey)) {
            return this._validationCache.get(cacheKey);
        }
        
        const isValid = this._validateMoveFormat(move);
        this._cacheValidationResult(cacheKey, isValid);
        return isValid;
    }

    /**
     * Validates move format in detail
     * @private
     * @param {string} move - Move string to validate
     * @returns {boolean} True if valid
     */
    _validateMoveFormat(move) {
        if (move.length < 4 || move.length > 5) {
            return false;
        }
        
        const from = move.slice(0, 2);
        const to = move.slice(2, 4);
        const promotion = move.slice(4, 5);
        
        if (!this.isValidSquare(from) || !this.isValidSquare(to)) {
            return false;
        }
        
        if (promotion && !this._validValues.promotionPieces.includes(promotion)) {
            return false;
        }
        
        // Additional move validation (e.g., source and target different)
        return from !== to;
    }

    /**
     * Validates board orientation
     * @param {string} orientation - Orientation to validate
     * @returns {boolean} True if valid
     */
    isValidOrientation(orientation) {
        return this._validValues.orientations.includes(orientation);
    }

    /**
     * Validates a color value
     * @param {string} color - Color to validate
     * @returns {boolean} True if valid
     */
    isValidColor(color) {
        return this._validValues.colors.includes(color);
    }

    /**
     * Validates a size value with constraints
     * @param {number|string} size - Size to validate
     * @returns {boolean} True if valid
     */
    isValidSize(size) {
        if (size === 'auto') {
            return true;
        }
        
        if (typeof size === 'number') {
            return size >= this._constraints.min && size <= this._constraints.max;
        }
        
        return false;
    }

    /**
     * Validates a time value with constraints
     * @param {number} time - Time value to validate
     * @returns {boolean} True if valid
     */
    isValidTime(time) {
        return typeof time === 'number' && 
               time >= 0 && 
               time <= this._constraints.maxTime;
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
        return typeof id === 'string' && 
               id.length > 0 && 
               id.length <= 100 && // Reasonable length limit
               /^[a-zA-Z][\w:-]*$/.test(id); // Valid HTML ID format
    }

    /**
     * Validates movable colors configuration
     * @param {string} colors - Colors value to validate
     * @returns {boolean} True if valid
     */
    isValidMovableColors(colors) {
        return this._validValues.movableColors.includes(colors);
    }

    /**
     * Validates drop off board configuration
     * @param {string} dropOff - Drop off board value to validate
     * @returns {boolean} True if valid
     */
    isValidDropOffBoard(dropOff) {
        return this._validValues.dropOffBoard.includes(dropOff);
    }

    /**
     * Validates animation easing type
     * @param {string} easing - Easing type to validate
     * @returns {boolean} True if valid
     */
    isValidEasing(easing) {
        return this._validValues.easingTypes.includes(easing);
    }

    /**
     * Validates animation style
     * @param {string} style - Animation style to validate
     * @returns {boolean} True if valid
     */
    isValidAnimationStyle(style) {
        return this._validValues.animationStyles.includes(style);
    }

    /**
     * Validates CSS color format
     * @param {string} color - Color string to validate
     * @returns {boolean} True if valid
     */
    isValidCSSColor(color) {
        if (typeof color !== 'string') {
            return false;
        }
        
        // Check for hex colors
        if (this._patterns.color.test(color)) {
            return true;
        }
        
        // Check for named colors (basic set)
        const namedColors = ['white', 'black', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta'];
        if (namedColors.includes(color.toLowerCase())) {
            return true;
        }
        
        // Check for rgb/rgba format
        if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color) ||
            /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-1](\.\d+)?\s*\)$/.test(color)) {
            return true;
        }
        
        return false;
    }

    /**
     * Validates and sanitizes a square identifier
     * @param {string} square - Square to validate
     * @returns {string} Sanitized square
     * @throws {ValidationError} If square is invalid
     */
    validateSquare(square) {
        if (!this.isValidSquare(square)) {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_square + square, 
                'square', 
                square
            );
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
            throw new ValidationError(
                ERROR_MESSAGES.invalid_piece + piece, 
                'piece', 
                piece
            );
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
            throw new ValidationError(
                ERROR_MESSAGES.invalid_fen + fen, 
                'fen', 
                fen
            );
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
            throw new ValidationError(
                ERROR_MESSAGES.invalid_move + move, 
                'move', 
                move
            );
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
            throw new ValidationError(
                ERROR_MESSAGES.invalid_orientation + orientation, 
                'orientation', 
                orientation
            );
        }
        
        // Normalize to 'w' or 'b'
        return orientation === 'white' ? 'w' : 
               orientation === 'black' ? 'b' : 
               orientation;
    }

    /**
     * Validates and sanitizes color
     * @param {string} color - Color to validate
     * @returns {string} Sanitized color ('w' or 'b')
     * @throws {ValidationError} If color is invalid
     */
    validateColor(color) {
        if (!this.isValidColor(color)) {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_color + color, 
                'color', 
                color
            );
        }
        
        // Normalize to 'w' or 'b'
        return color === 'white' ? 'w' : 
               color === 'black' ? 'b' : 
               color;
    }

    /**
     * Validates and sanitizes size
     * @param {number|string} size - Size to validate
     * @returns {number|string} Sanitized size
     * @throws {ValidationError} If size is invalid
     */
    validateSize(size) {
        if (!this.isValidSize(size)) {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_size + size, 
                'size', 
                size
            );
        }
        return size;
    }

    /**
     * Validates configuration object with comprehensive checks
     * @param {Object} config - Configuration to validate
     * @returns {Object} Validated configuration
     * @throws {ValidationError} If configuration is invalid
     */
    validateConfig(config) {
        if (!config || typeof config !== 'object') {
            throw new ValidationError(
                'Configuration must be an object', 
                'config', 
                config
            );
        }
        
        const errors = [];
        
        // Validate required fields
        if (!config.id && !config.id_div) {
            errors.push('Configuration must include id or id_div');
        }
        
        // Validate optional fields
        if (config.orientation && !this.isValidOrientation(config.orientation)) {
            errors.push(ERROR_MESSAGES.invalid_orientation + config.orientation);
        }
        
        if (config.size && !this.isValidSize(config.size)) {
            errors.push(ERROR_MESSAGES.invalid_size + config.size);
        }
        
        if (config.movableColors && !this.isValidMovableColors(config.movableColors)) {
            errors.push(ERROR_MESSAGES.invalid_color + config.movableColors);
        }
        
        if (config.dropOffBoard && !this.isValidDropOffBoard(config.dropOffBoard)) {
            errors.push(ERROR_MESSAGES.invalid_dropOffBoard + config.dropOffBoard);
        }
        
        if (config.animationStyle && !this.isValidAnimationStyle(config.animationStyle)) {
            errors.push(ERROR_MESSAGES.invalid_animationStyle + config.animationStyle);
        }
        
        // Validate callbacks
        const callbacks = ['onMove', 'onMoveEnd', 'onChange', 'onDragStart', 'onDragMove', 'onDrop', 'onSnapbackEnd'];
        for (const callback of callbacks) {
            if (config[callback] && !this.isValidCallback(config[callback])) {
                errors.push(`Invalid ${callback} callback`);
            }
        }
        
        // Validate colors
        const colorFields = ['whiteSquare', 'blackSquare', 'highlight', 'hintColor'];
        for (const field of colorFields) {
            if (config[field] && !this.isValidCSSColor(config[field])) {
                errors.push(`Invalid ${field} color: ${config[field]}`);
            }
        }
        
        if (errors.length > 0) {
            throw new ValidationError(
                `Configuration validation failed: ${errors.join(', ')}`, 
                'config', 
                config
            );
        }
        
        return config;
    }

    /**
     * Caches validation result for performance
     * @private
     * @param {string} key - Cache key
     * @param {boolean} result - Validation result
     */
    _cacheValidationResult(key, result) {
        if (this._validationCache.size >= this._cacheMaxSize) {
            // Remove oldest entry
            const firstKey = this._validationCache.keys().next().value;
            this._validationCache.delete(firstKey);
        }
        
        this._validationCache.set(key, result);
    }

    /**
     * Clears the validation cache
     */
    clearCache() {
        this._validationCache.clear();
    }

    /**
     * Gets validation cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this._validationCache.size,
            maxSize: this._cacheMaxSize,
            hitRate: this._cacheHits / (this._cacheHits + this._cacheMisses) || 0
        };
    }

    /**
     * Batch validates multiple values
     * @param {Array} validations - Array of validation objects
     * @returns {Array} Array of validation results
     */
    batchValidate(validations) {
        return validations.map(validation => {
            try {
                const { type, value } = validation;
                
                switch (type) {
                    case 'square':
                        return { valid: this.isValidSquare(value), value };
                    case 'piece':
                        return { valid: this.isValidPiece(value), value };
                    case 'fen':
                        return { valid: this.isValidFen(value), value };
                    case 'move':
                        return { valid: this.isValidMove(value), value };
                    default:
                        return { valid: false, value, error: 'Unknown validation type' };
                }
            } catch (error) {
                return { valid: false, value: validation.value, error: error.message };
            }
        });
    }

    /**
     * Cleans up resources
     */
    destroy() {
        this.clearCache();
        this._validationCache = null;
        this._patterns = null;
        this._validValues = null;
        this._constraints = null;
    }
}
