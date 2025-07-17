'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Standard chess positions and FEN constants
 * @module constants/positions
 * @since 2.0.0
 */

/**
 * Standard chess positions used throughout the application
 * @type {Object.<string, string>}
 * @readonly
 */
const STANDARD_POSITIONS = {
    'start': 'start',
    'default': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    'empty': '8/8/8/8/8/8/8/8 w - - 0 1'
};

/**
 * Default starting position FEN string
 * @type {string}
 * @readonly
 */
const DEFAULT_STARTING_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Chess piece types
 * @type {string[]}
 * @readonly
 */
const PIECE_TYPES = ['p', 'r', 'n', 'b', 'q', 'k'];

/**
 * Chess piece colors
 * @type {string[]}
 * @readonly
 */
const PIECE_COLORS = ['w', 'b'];

/**
 * Valid promotion pieces
 * @type {string[]}
 * @readonly
 */
const PROMOTION_PIECES = ['q', 'r', 'b', 'n'];

/**
 * Board coordinates letters
 * @type {string}
 * @readonly
 */
const BOARD_LETTERS = 'abcdefgh';

/**
 * Board size constants
 * @type {Object}
 * @readonly
 */
const BOARD_SIZE = {
    ROWS: 8,
    COLS: 8,
    TOTAL_SQUARES: 64
};

/**
 * Error messages and error handling utilities
 * @module errors/messages
 * @since 2.0.0
 */

/**
 * Error codes for categorizing different types of errors
 * @type {Object.<string, string>}
 * @readonly
 */
const ERROR_CODES = Object.freeze({
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    CONFIG_ERROR: 'CONFIG_ERROR',
    MOVE_ERROR: 'MOVE_ERROR',
    DOM_ERROR: 'DOM_ERROR',
    ANIMATION_ERROR: 'ANIMATION_ERROR',
    PIECE_ERROR: 'PIECE_ERROR',
    INITIALIZATION_ERROR: 'INITIALIZATION_ERROR',
    POSITION_ERROR: 'POSITION_ERROR',
    FEN_ERROR: 'FEN_ERROR',
    SQUARE_ERROR: 'SQUARE_ERROR',
    THEME_ERROR: 'THEME_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR'
});

/**
 * Standardized error messages for the chessboard application
 * @type {Object.<string, string>}
 * @readonly
 */
const ERROR_MESSAGES = Object.freeze({
    // Position and FEN related
    invalid_position: 'Invalid position: ',
    invalid_fen: 'Invalid FEN string: ',
    position_load_failed: 'Failed to load position: ',
    
    // DOM and UI related
    invalid_id_div: 'Board container not found: ',
    invalid_value: 'Invalid value: ',
    dom_operation_failed: 'DOM operation failed: ',
    element_not_found: 'Element not found: ',
    
    // Piece related
    invalid_piece: 'Invalid piece notation: ',
    invalid_square: 'Invalid square notation: ',
    invalid_piecesPath: 'Invalid pieces path: ',
    piece_operation_failed: 'Piece operation failed: ',
    
    // Board configuration
    invalid_orientation: 'Invalid orientation: ',
    invalid_color: 'Invalid color: ',
    invalid_mode: 'Invalid mode: ',
    invalid_dropOffBoard: 'Invalid dropOffBoard setting: ',
    invalid_size: 'Invalid size: ',
    invalid_movableColors: 'Invalid movableColors setting: ',
    
    // Animation related
    invalid_snapbackTime: 'Invalid snapbackTime: ',
    invalid_snapbackAnimation: 'Invalid snapbackAnimation: ',
    invalid_fadeTime: 'Invalid fadeTime: ',
    invalid_fadeAnimation: 'Invalid fadeAnimation: ',
    invalid_ratio: 'Invalid ratio: ',
    animation_failed: 'Animation failed: ',
    
    // Event handlers
    invalid_onMove: 'Invalid onMove callback: ',
    invalid_onMoveEnd: 'Invalid onMoveEnd callback: ',
    invalid_onChange: 'Invalid onChange callback: ',
    invalid_onDragStart: 'Invalid onDragStart callback: ',
    invalid_onDragMove: 'Invalid onDragMove callback: ',
    invalid_onDrop: 'Invalid onDrop callback: ',
    invalid_onSnapbackEnd: 'Invalid onSnapbackEnd callback: ',
    callback_execution_failed: 'Callback execution failed: ',
    
    // Visual styling
    invalid_whiteSquare: 'Invalid whiteSquare color: ',
    invalid_blackSquare: 'Invalid blackSquare color: ',
    invalid_highlight: 'Invalid highlight color: ',
    invalid_selectedSquareWhite: 'Invalid selectedSquareWhite color: ',
    invalid_selectedSquareBlack: 'Invalid selectedSquareBlack color: ',
    invalid_movedSquareWhite: 'Invalid movedSquareWhite color: ',
    invalid_movedSquareBlack: 'Invalid movedSquareBlack color: ',
    invalid_choiceSquare: 'Invalid choiceSquare color: ',
    invalid_coverSquare: 'Invalid coverSquare color: ',
    invalid_hintColor: 'Invalid hintColor: ',
    
    // Move related
    invalid_move: 'Invalid move: ',
    invalid_move_format: 'Invalid move format: ',
    move_execution_failed: 'Move execution failed: ',
    illegal_move: 'Illegal move: ',
    square_no_piece: 'No piece found on square: ',
    move_validation_failed: 'Move validation failed: ',
    
    // Game state
    game_over: 'Game is over',
    invalid_turn: 'Invalid turn: ',
    position_validation_failed: 'Position validation failed: ',
    
    // Theme and assets
    theme_load_failed: 'Theme loading failed: ',
    asset_load_failed: 'Asset loading failed: ',
    invalid_theme: 'Invalid theme: ',
    
    // Network and resources
    network_error: 'Network error: ',
    resource_not_found: 'Resource not found: ',
    timeout_error: 'Operation timed out: ',
    
    // General errors
    initialization_failed: 'Initialization failed: ',
    operation_failed: 'Operation failed: ',
    invalid_state: 'Invalid state: ',
    memory_limit_exceeded: 'Memory limit exceeded',
    performance_degraded: 'Performance degraded: '
});

/**
 * Error severity levels
 * @type {Object.<string, string>}
 * @readonly
 */
const ERROR_SEVERITY = Object.freeze({
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
});

/**
 * Maps error codes to their severity levels
 * @type {Object.<string, string>}
 * @readonly
 */
Object.freeze({
    [ERROR_CODES.VALIDATION_ERROR]: ERROR_SEVERITY.MEDIUM,
    [ERROR_CODES.CONFIG_ERROR]: ERROR_SEVERITY.HIGH,
    [ERROR_CODES.MOVE_ERROR]: ERROR_SEVERITY.LOW,
    [ERROR_CODES.DOM_ERROR]: ERROR_SEVERITY.HIGH,
    [ERROR_CODES.ANIMATION_ERROR]: ERROR_SEVERITY.LOW,
    [ERROR_CODES.PIECE_ERROR]: ERROR_SEVERITY.MEDIUM,
    [ERROR_CODES.INITIALIZATION_ERROR]: ERROR_SEVERITY.CRITICAL,
    [ERROR_CODES.POSITION_ERROR]: ERROR_SEVERITY.MEDIUM,
    [ERROR_CODES.FEN_ERROR]: ERROR_SEVERITY.MEDIUM,
    [ERROR_CODES.SQUARE_ERROR]: ERROR_SEVERITY.MEDIUM,
    [ERROR_CODES.THEME_ERROR]: ERROR_SEVERITY.LOW,
    [ERROR_CODES.NETWORK_ERROR]: ERROR_SEVERITY.MEDIUM
});

/**
 * Custom error classes for better error handling
 * @module errors/ChessboardError
 * @since 2.0.0
 */


/**
 * Base error class for all chessboard-related errors
 * @class
 * @extends Error
 */
class ChessboardError extends Error {
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
class ValidationError extends ChessboardError {
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
class ConfigurationError extends ChessboardError {
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
class MoveError extends ChessboardError {
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
class DOMError extends ChessboardError {
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
class PieceError extends ChessboardError {
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

/**
 * Service for input validation and data sanitization
 * @module services/ValidationService
 * @since 2.0.0
 */


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
class ValidationService {
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

/**
 * Configuration management for Chessboard.js
 * @module core/ChessboardConfig
 * @since 2.0.0
 */


/**
 * Animation timing constants
 * @constant
 * @type {Object}
 */
const ANIMATION_TIMES = Object.freeze({
    fast: 200,
    slow: 600,
    normal: 400,
    verySlow: 1000,
    veryFast: 100
});

/**
 * Boolean value mappings
 * @constant
 * @type {Object}
 */
const BOOLEAN_VALUES = Object.freeze({
    true: true,
    false: false,
    none: false,
    1: true,
    0: false
});

/**
 * CSS transition functions
 * @constant
 * @type {Object}
 */
const TRANSITION_FUNCTIONS = Object.freeze({
    ease: 'ease',
    linear: 'linear',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    none: null
});

/**
 * Default configuration values
 * @constant
 * @type {Object}
 */
const DEFAULT_CONFIG$1 = Object.freeze({
    id: 'board',
    position: 'start',
    orientation: 'w',
    mode: 'normal',
    size: 'auto',
    draggable: true,
    hints: true,
    clickable: true,
    movableColors: 'both',
    moveHighlight: true,
    overHighlight: true,
    moveAnimation: 'ease',
    moveTime: 'fast',
    dropOffBoard: 'snapback',
    snapbackTime: 'fast',
    snapbackAnimation: 'ease',
    dropCenterTime: 'veryFast',
    dropCenterAnimation: 'ease',
    fadeTime: 'fast',
    fadeAnimation: 'ease',
    ratio: 0.9,
    piecesPath: '../assets/themes/default',
    simultaneousAnimationDelay: 100,
    onMove: () => true,
    onMoveEnd: () => true,
    onChange: () => true,
    onDragStart: () => true,
    onDragMove: () => true,
    onDrop: () => true,
    onSnapbackEnd: () => true,
    whiteSquare: '#f0d9b5',
    blackSquare: '#b58863',
    highlight: 'yellow',
    selectedSquareWhite: '#ababaa',
    selectedSquareBlack: '#ababaa',
    movedSquareWhite: '#f1f1a0',
    movedSquareBlack: '#e9e981',
    choiceSquare: 'white',
    coverSquare: 'black',
    hintColor: '#ababaa'
});

/**
 * Configuration management class for Chessboard.js
 * Handles validation, normalization, and CSS property management
 * @class
 */
class ChessboardConfig {
    /**
     * Creates a new ChessboardConfig instance
     * @param {Object} settings - User-provided configuration
     * @throws {ConfigurationError} If configuration is invalid
     */
    constructor(settings = {}) {
        // Initialize validation service
        this._validationService = new ValidationService();

        // Validate input
        this._validateInput(settings);

        // Merge with defaults
        const config = this._mergeWithDefaults(settings);

        // Process and validate configuration
        this._processConfiguration(config);

        // Set CSS properties
        this._setCSSProperties(config);

        // Configure mode-specific settings
        this._configureModeSettings();
    }

    /**
     * Validates input configuration
     * @private
     * @param {Object} settings - Input settings
     * @throws {ConfigurationError} If input is invalid
     */
    _validateInput(settings) {
        if (settings !== null && typeof settings !== 'object') {
            throw new ConfigurationError('Settings must be an object', 'settings', settings);
        }

        // Validate using validation service
        try {
            this._validationService.validateConfig(settings);
        } catch (error) {
            throw new ConfigurationError(error.message, error.field, error.value);
        }
    }

    /**
     * Merges user settings with defaults
     * @private
     * @param {Object} settings - User settings
     * @returns {Object} Merged configuration
     */
    _mergeWithDefaults(settings) {
        return Object.assign({}, DEFAULT_CONFIG$1, settings);
    }

    /**
     * Processes and validates configuration values
     * @private
     * @param {Object} config - Configuration object
     */
    _processConfiguration(config) {
        // Basic properties
        this.id_div = config.id;
        this.position = config.position;
        this.orientation = config.orientation;
        this.mode = config.mode;
        this.dropOffBoard = config.dropOffBoard;
        this.size = config.size;
        this.movableColors = config.movableColors;
        this.piecesPath = config.piecesPath;

        // Event handlers
        this.onMove = this._validateCallback(config.onMove);
        this.onMoveEnd = this._validateCallback(config.onMoveEnd);
        this.onChange = this._validateCallback(config.onChange);
        this.onDragStart = this._validateCallback(config.onDragStart);
        this.onDragMove = this._validateCallback(config.onDragMove);
        this.onDrop = this._validateCallback(config.onDrop);
        this.onSnapbackEnd = this._validateCallback(config.onSnapbackEnd);

        // Animation properties
        this.moveAnimation = this._setTransitionFunction(config.moveAnimation);
        this.snapbackAnimation = this._setTransitionFunction(config.snapbackAnimation);
        this.dropCenterAnimation = this._setTransitionFunction(config.dropCenterAnimation);
        this.fadeAnimation = this._setTransitionFunction(config.fadeAnimation);

        // Boolean properties
        this.hints = this._setBoolean(config.hints);
        this.clickable = this._setBoolean(config.clickable);
        this.draggable = this._setBoolean(config.draggable);
        this.moveHighlight = this._setBoolean(config.moveHighlight);
        this.overHighlight = this._setBoolean(config.overHighlight);

        // Timing properties
        this.moveTime = this._setTime(config.moveTime);
        this.snapbackTime = this._setTime(config.snapbackTime);
        this.dropCenterTime = this._setTime(config.dropCenterTime);
        this.fadeTime = this._setTime(config.fadeTime);

        // Animation style properties
        this.simultaneousAnimationDelay = this._validateDelay(config.simultaneousAnimationDelay);
    }

    /**
     * Sets CSS custom properties
     * @private
     * @param {Object} config - Configuration object
     */
    _setCSSProperties(config) {
        const cssProperties = {
            pieceRatio: config.ratio,
            whiteSquare: config.whiteSquare,
            blackSquare: config.blackSquare,
            highlightSquare: config.highlight,
            selectedSquareWhite: config.selectedSquareWhite,
            selectedSquareBlack: config.selectedSquareBlack,
            movedSquareWhite: config.movedSquareWhite,
            movedSquareBlack: config.movedSquareBlack,
            choiceSquare: config.choiceSquare,
            coverSquare: config.coverSquare,
            hintColor: config.hintColor
        };

        Object.entries(cssProperties).forEach(([property, value]) => {
            this._setCSSProperty(property, value);
        });
    }

    /**
     * Configures mode-specific settings
     * @private
     */
    _configureModeSettings() {
        switch (this.mode) {
            case 'creative':
                this.onlyLegalMoves = false;
                this.hints = false;
                break;
            case 'normal':
                this.onlyLegalMoves = true;
                break;
            default:
                this.onlyLegalMoves = true;
        }
    }

    /**
     * Validates a callback function
     * @private
     * @param {Function} callback - Callback to validate
     * @returns {Function} Validated callback
     * @throws {ConfigurationError} If callback is invalid
     */
    _validateCallback(callback) {
        if (!this._validationService.isValidCallback(callback)) {
            throw new ConfigurationError('Callback must be a function', 'callback', callback);
        }
        return callback;
    }


    /**
     * Validates animation delay
     * @private
     * @param {number} delay - Animation delay
     * @returns {number} Validated delay
     * @throws {ConfigurationError} If delay is invalid
     */
    _validateDelay(delay) {
        if (typeof delay !== 'number' || delay < 0 || delay > 5000) {
            throw new ConfigurationError('Invalid animation delay', 'simultaneousAnimationDelay', delay);
        }
        return delay;
    }

    /**
     * Sets a CSS custom property
     * @private
     * @param {string} property - Property name
     * @param {string} value - Property value
     */
    _setCSSProperty(property, value) {
        try {
            if (typeof document !== 'undefined' && document.documentElement) {
                document.documentElement.style.setProperty(`--${property}`, value);
            }
        } catch (error) {
            console.warn(`Failed to set CSS property ${property}:`, error.message);
        }
    }

    /**
     * Sets orientation with validation
     * @param {string} orientation - Orientation value
     * @returns {ChessboardConfig} This instance for chaining
     * @throws {ConfigurationError} If orientation is invalid
     */
    setOrientation(orientation) {
        const validatedOrientation = this._validationService.validateOrientation(orientation);
        this.orientation = validatedOrientation;
        return this;
    }

    /**
     * Validates and sets time value
     * @private
     * @param {string|number} value - Time value
     * @returns {number} Validated time value
     * @throws {ConfigurationError} If time value is invalid
     */
    _setTime(value) {
        if (typeof value === 'number') {
            if (!this._validationService.isValidTime(value)) {
                throw new ConfigurationError('Invalid time value', 'time', value);
            }
            return value;
        }

        if (typeof value === 'string' && value in ANIMATION_TIMES) {
            return ANIMATION_TIMES[value];
        }

        throw new ConfigurationError('Invalid time value', 'time', value);
    }

    /**
     * Validates and sets boolean value
     * @private
     * @param {*} value - Boolean value
     * @returns {boolean} Validated boolean value
     * @throws {ConfigurationError} If boolean value is invalid
     */
    _setBoolean(value) {
        if (typeof value === 'boolean') {
            return value;
        }

        if (value in BOOLEAN_VALUES) {
            return BOOLEAN_VALUES[value];
        }

        throw new ConfigurationError('Invalid boolean value', 'boolean', value);
    }

    /**
     * Validates and sets transition function
     * @private
     * @param {string|boolean|null} value - Transition function value
     * @returns {string|null} Validated transition function
     * @throws {ConfigurationError} If transition function is invalid
     */
    _setTransitionFunction(value) {
        // Handle boolean values - true means use default 'ease', false/null means no animation
        if (typeof value === 'boolean') {
            return value ? TRANSITION_FUNCTIONS.ease : null;
        }

        // Handle string values
        if (typeof value === 'string' && value in TRANSITION_FUNCTIONS) {
            return TRANSITION_FUNCTIONS[value];
        }

        // Handle null/undefined
        if (value === null || value === undefined) {
            return null;
        }

        throw new ConfigurationError('Invalid transition function', 'transitionFunction', value);
    }

    /**
     * Gets the current configuration as a plain object
     * @returns {Object} Configuration object
     */
    toObject() {
        return {
            id_div: this.id_div,
            position: this.position,
            orientation: this.orientation,
            mode: this.mode,
            size: this.size,
            draggable: this.draggable,
            hints: this.hints,
            clickable: this.clickable,
            movableColors: this.movableColors,
            moveHighlight: this.moveHighlight,
            overHighlight: this.overHighlight,
            moveAnimation: this.moveAnimation,
            moveTime: this.moveTime,
            dropOffBoard: this.dropOffBoard,
            snapbackTime: this.snapbackTime,
            snapbackAnimation: this.snapbackAnimation,
            dropCenterTime: this.dropCenterTime,
            dropCenterAnimation: this.dropCenterAnimation,
            fadeTime: this.fadeTime,
            fadeAnimation: this.fadeAnimation,
            piecesPath: this.piecesPath,
            simultaneousAnimationDelay: this.simultaneousAnimationDelay,
            onlyLegalMoves: this.onlyLegalMoves
        };
    }

    /**
     * Updates configuration with new values
     * @param {Object} updates - Configuration updates
     * @returns {ChessboardConfig} This instance for chaining
     * @throws {ConfigurationError} If updates are invalid
     */
    update(updates) {
        if (!updates || typeof updates !== 'object') {
            throw new ConfigurationError('Updates must be an object', 'updates', updates);
        }

        // Validate updates
        this._validationService.validateConfig(updates);

        // Apply updates
        const newConfig = Object.assign({}, this.toObject(), updates);

        // Re-process configuration
        this._processConfiguration(newConfig);
        this._setCSSProperties(newConfig);
        this._configureModeSettings();

        return this;
    }

    /**
     * Cleans up resources
     */
    destroy() {
        if (this._validationService) {
            this._validationService.destroy();
            this._validationService = null;
        }
    }
}

class Piece {
    constructor(color, type, src, opacity = 1) {
        this.color = color;
        this.type = type;
        this.id = this.getId();
        this.src = src;
        this.element = this.createElement(src, opacity);
        console.debug(`[Piece] Constructed: ${this.id}`);
        this.check();
    }

    getId() { return this.type + this.color }

    createElement(src, opacity = 1) {
        let element = document.createElement("img");
        element.classList.add("piece");
        element.id = this.id;
        element.src = src || this.src;
        element.style.opacity = opacity;

        // Ensure the image loads properly
        element.onerror = () => {
            console.warn('Failed to load piece image:', element.src);
        };

        return element;
    }

    visible() { if (this.element) { this.element.style.opacity = 1; console.debug(`[Piece] visible: ${this.id}`); } }

    invisible() { if (this.element) { this.element.style.opacity = 0; console.debug(`[Piece] invisible: ${this.id}`); } }

    /**
     * Updates the piece image source
     * @param {string} newSrc - New image source
     */
    updateSrc(newSrc) {
        this.src = newSrc;
        if (this.element) {
            this.element.src = newSrc;
        }
    }

    /**
     * Transforms the piece to a new type with smooth animation
     * @param {string} newType - New piece type
     * @param {string} newSrc - New image source
     * @param {number} [duration=200] - Animation duration in milliseconds
     * @param {Function} [callback] - Callback when transformation is complete
     */
    transformTo(newType, newSrc, duration = 200, callback = null) {
        if (!this.element) { console.debug(`[Piece] transformTo: ${this.id} - element is null`); if (callback) callback(); return; }
        const element = this.element;
        element.src;

        // Add transformation class to disable all transitions temporarily
        element.classList.add('transforming');

        // Create a smooth scale animation for the transformation
        const scaleDown = [
            { transform: 'scale(1)', opacity: '1' },
            { transform: 'scale(0.8)', opacity: '0.7' }
        ];

        const scaleUp = [
            { transform: 'scale(0.8)', opacity: '0.7' },
            { transform: 'scale(1)', opacity: '1' }
        ];

        const halfDuration = duration / 2;

        // First animation: scale down
        if (element.animate) {
            const scaleDownAnimation = element.animate(scaleDown, {
                duration: halfDuration,
                easing: 'ease-in',
                fill: 'forwards'
            });

            scaleDownAnimation.onfinish = () => {
                if (!this.element) { console.debug(`[Piece] transformTo.scaleDown.onfinish: ${this.id} - element is null`); if (callback) callback(); return; }
                // Change the piece type and source at the smallest scale
                this.type = newType;
                this.id = this.getId();
                this.src = newSrc;
                element.src = newSrc;
                element.id = this.id;

                // Second animation: scale back up
                const scaleUpAnimation = element.animate(scaleUp, {
                    duration: halfDuration,
                    easing: 'ease-out',
                    fill: 'forwards'
                });

                scaleUpAnimation.onfinish = () => {
                    if (!this.element) { console.debug(`[Piece] transformTo.scaleUp.onfinish: ${this.id} - element is null`); if (callback) callback(); return; }
                    // Reset transform and remove transformation class
                    element.style.transform = '';
                    element.style.opacity = '';
                    element.classList.remove('transforming');

                    // Add a subtle bounce effect
                    element.classList.add('transform-complete');

                    // Remove bounce class after animation
                    setTimeout(() => {
                        if (!this.element) return;
                        element.classList.remove('transform-complete');
                    }, 400);

                    console.debug(`[Piece] transformTo complete: ${this.id}`);
                    if (callback) callback();
                };
            };
        } else {
            // Fallback for browsers without Web Animations API
            element.style.transition = `transform ${halfDuration}ms ease-in, opacity ${halfDuration}ms ease-in`;
            element.style.transform = 'scale(0.8)';
            element.style.opacity = '0.7';

            setTimeout(() => {
                if (!this.element) { console.debug(`[Piece] transformTo (fallback): ${this.id} - element is null`); if (callback) callback(); return; }
                // Change the piece
                this.type = newType;
                this.id = this.getId();
                this.src = newSrc;
                element.src = newSrc;
                element.id = this.id;

                // Scale back up
                element.style.transition = `transform ${halfDuration}ms ease-out, opacity ${halfDuration}ms ease-out`;
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';

                setTimeout(() => {
                    if (!this.element) { console.debug(`[Piece] transformTo (fallback, cleanup): ${this.id} - element is null`); if (callback) callback(); return; }
                    // Clean up
                    element.style.transition = '';
                    element.style.transform = '';
                    element.style.opacity = '';
                    element.classList.remove('transforming');

                    // Add bounce effect
                    element.classList.add('transform-complete');
                    setTimeout(() => {
                        if (!this.element) return;
                        element.classList.remove('transform-complete');
                    }, 400);

                    console.debug(`[Piece] transformTo complete (fallback): ${this.id}`);
                    if (callback) callback();
                }, halfDuration);
            }, halfDuration);
        }
    }

    fadeIn(duration, speed, transition_f, callback) {
        let start = performance.now();
        let opacity = 0;
        let piece = this;
        let fade = function () {
            if (!piece.element) { console.debug(`[Piece] fadeIn: ${piece.id} - element is null`); if (callback) callback(); return; }
            let elapsed = performance.now() - start;
            opacity = transition_f(elapsed, duration, speed);
            piece.element.style.opacity = opacity;
            if (elapsed < duration) {
                requestAnimationFrame(fade);
            } else {
                if (!piece.element) { console.debug(`[Piece] fadeIn: ${piece.id} - element is null (end)`); if (callback) callback(); return; }
                piece.element.style.opacity = 1;
                console.debug(`[Piece] fadeIn complete: ${piece.id}`);
                if (callback) callback();
            }
        };
        fade();
    }

    fadeOut(duration, speed, transition_f, callback) {
        let start = performance.now();
        let opacity = 1;
        let piece = this;
        let fade = function () {
            if (!piece.element) { console.debug(`[Piece] fadeOut: ${piece.id} - element is null`); if (callback) callback(); return; }
            let elapsed = performance.now() - start;
            opacity = 1 - transition_f(elapsed, duration, speed);
            piece.element.style.opacity = opacity;
            if (elapsed < duration) {
                requestAnimationFrame(fade);
            } else {
                if (!piece.element) { console.debug(`[Piece] fadeOut: ${piece.id} - element is null (end)`); if (callback) callback(); return; }
                piece.element.style.opacity = 0;
                console.debug(`[Piece] fadeOut complete: ${piece.id}`);
                if (callback) callback();
            }
        };
        // Se l'elemento è già stato rimosso, esci subito
        if (!this.element) { console.debug(`[Piece] fadeOut: ${this.id} - element is null (init)`); if (callback) callback(); return; }
        fade();
    }

    setDrag(f) {
        if (!this.element) { console.debug(`[Piece] setDrag: ${this.id} - element is null`); return; }
        this.element.ondragstart = (e) => { e.preventDefault(); };
        this.element.onmousedown = f;
        this.element.ontouchstart = f; // Drag touch
        console.debug(`[Piece] setDrag: ${this.id}`);
    }

    destroy() {
        if (!this.element) return; // Idempotente: già rimosso
        console.debug(`[Piece] Destroy: ${this.id}`);
        // Remove all event listeners
        this.element.onmousedown = null;
        this.element.ondragstart = null;
        // Remove from DOM
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        // Clear references
        this.element = null;
    }

    translate(to, duration, transition_f, speed, callback = null) {
        if (!this.element) { console.debug(`[Piece] translate: ${this.id} - element is null`); if (callback) callback(); return; }
        let sourceRect = this.element.getBoundingClientRect();
        let targetRect = to.getBoundingClientRect();
        let x_start = sourceRect.left + sourceRect.width / 2;
        let y_start = sourceRect.top + sourceRect.height / 2;
        let x_end = targetRect.left + targetRect.width / 2;
        let y_end = targetRect.top + targetRect.height / 2;
        let dx = x_end - x_start;
        let dy = y_end - y_start;

        let keyframes = [
            { transform: 'translate(0, 0)' },
            { transform: `translate(${dx}px, ${dy}px)` }
        ];

        if (this.element.animate) {
            let animation = this.element.animate(keyframes, {
                duration: duration,
                easing: 'ease',
                fill: 'none'
            });

            animation.onfinish = () => {
                if (!this.element) { console.debug(`[Piece] translate.onfinish: ${this.id} - element is null`); if (callback) callback(); return; }
                if (callback) callback();
                if (this.element) this.element.style = '';
                console.debug(`[Piece] translate complete: ${this.id}`);
            };
        } else {
            this.element.style.transition = `transform ${duration}ms ease`;
            this.element.style.transform = `translate(${dx}px, ${dy}px)`;
            if (callback) callback();
            if (this.element) this.element.style = '';
            console.debug(`[Piece] translate complete (no animate): ${this.id}`);
        }
    }

    check() {
        if (['p', 'r', 'n', 'b', 'q', 'k'].indexOf(this.type) === -1) {
            throw new Error("Invalid piece type");
        }

        if (['w', 'b'].indexOf(this.color) === -1) {
            throw new Error("Invalid piece color");
        }
    }
}

class Square {

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.id = this.getId();
        this.element = this.createElement();
        this.piece = null;
    }

    getPiece() {
        return this.piece;
    }

    opposite() {
        this.row = 9 - this.row;
        this.col = 9 - this.col;
        this.id = this.getId();
        this.element = this.resetElement();
    }

    isWhite() {
        return (this.row + this.col) % 2 === 0;
    }

    getId() {
        let letters = 'abcdefgh';
        let letter = letters[this.col - 1];
        return letter + this.row;
    }

    resetElement() {
        this.element.id = this.id;
        this.element.className = '';
        this.element.classList.add('square');
        this.element.classList.add(this.isWhite() ? 'whiteSquare' : 'blackSquare');
    }

    createElement() {
        let element = document.createElement('div');
        element.id = this.id;
        element.classList.add('square');
        element.classList.add(this.isWhite() ? 'whiteSquare' : 'blackSquare');
        return element;
    }

    getElement() {
        return this.element;
    }

    getBoundingClientRect() {
        return this.element.getBoundingClientRect();
    }

    removePiece(preserve = false) {
        if (!this.piece) {
            return null;
        }
        // Only destroy the piece if not preserving (i.e., not moving)
        if (!preserve && typeof this.piece.destroy === 'function') {
            this.piece.destroy();
        }
        this.piece = null;
        return null;
    }

    /**
     * Forcefully removes all pieces from this square
     */
    forceRemoveAllPieces() {
        // Best practice: destroy the piece object if present
        if (this.piece && typeof this.piece.destroy === 'function') {
            this.piece.destroy();
        }
        this.piece = null;
        // Remove any orphaned img.piece elements from the DOM
        const pieceElements = this.element.querySelectorAll('img.piece');
        pieceElements.forEach(element => {
            if (element.parentNode === this.element) {
                this.element.removeChild(element);
            }
        });
    }

    /**
     * Replaces the current piece with a new one efficiently
     * @param {Piece} newPiece - The new piece to place
     */
    replacePiece(newPiece) {
        // If there's an existing piece, remove it first
        if (this.piece) {
            this.removePiece();
        }

        // Add the new piece
        this.putPiece(newPiece);

        // Ensure the piece is properly displayed
        newPiece.element.style.opacity = '1';
    }

    addEventListener(event, callback) {
        this.element.addEventListener(event, callback);
    }

    putPiece(piece) {
        // If there's already a piece, remove it first, but preserve if moving
        if (this.piece) {
            this.removePiece(true);
        }
        this.piece = piece;
        if (piece && piece.element) {
            this.element.appendChild(piece.element);
        }
    }

    putHint(catchable) {
        if (this.element.querySelector('.hint')) {
            return;
        }
        let hint = document.createElement("div");
        hint.classList.add('hint');
        this.element.appendChild(hint);
        if (catchable) {
            hint.classList.add('catchable');
        }
    }

    removeHint() {
        let hint = this.element.querySelector('.hint');
        if (hint) {
            this.element.removeChild(hint);
        }
    }

    select() {
        this.element.classList.add(this.isWhite() ? 'selectedSquareWhite' : 'selectedSquareBlack');
    }

    deselect() {
        this.element.classList.remove('selectedSquareWhite');
        this.element.classList.remove('selectedSquareBlack');
    }

    moved() {
        this.element.classList.add(this.isWhite() ? 'movedSquareWhite' : 'movedSquareBlack');
    }

    unmoved() {
        this.element.classList.remove('movedSquareWhite');
        this.element.classList.remove('movedSquareBlack');
    }

    highlight() {
        this.element.classList.add('highlighted');
    }

    dehighlight() {
        this.element.classList.remove('highlighted');
    }

    putCover(callback) {
        let cover = document.createElement("div");
        cover.classList.add('square');
        cover.classList.add('cover');
        this.element.appendChild(cover);
        cover.addEventListener('click', (e) => {
            e.stopPropagation();
            callback();
        });
    }

    removeCover() {
        let cover = this.element.querySelector('.cover');
        if (cover) {
            this.element.removeChild(cover);
        }
    }

    putPromotion(src, callback) {
        let choice = document.createElement("div");
        choice.classList.add('square');
        choice.classList.add('choice');
        this.element.appendChild(choice);
        let img = document.createElement("img");
        img.classList.add("piece");
        img.classList.add("choicable");
        img.src = src;
        choice.appendChild(img);
        choice.addEventListener('click', (e) => {
            e.stopPropagation();
            callback();
        });

    }

    hasPromotion() {
        return this.element.querySelector('.choice') !== null;
    }

    removePromotion() {
        let choice = this.element.querySelector('.choice');
        if (choice) {
            choice.removeChild(choice.firstChild);
            this.element.removeChild(choice);
        }
    }

    destroy() {
        // Remove all piece DOM nodes and clear reference
        this.forceRemoveAllPieces();
        this.element.remove();
        this.piece = null;
    }

    hasPiece() {
        return this.piece !== null;
    }

    getColor() {
        return this.piece.getColor();
    }

    check() {
        if (this.row < 1 || this.row > 8) {
            throw new Error("Invalid square: row is out of bounds");
        }
        if (this.col < 1 || this.col > 8) {
            throw new Error("Invalid square: col is out of bounds");
        }

    }
}

let Move$1 = class Move {

    constructor(from, to, promotion = null, check = false) {
        this.piece = from ? from.getPiece() : null;
        this.from = from;
        this.to = to;
        this.promotion = promotion;

        if (check) this.check();
    }

    hasPromotion() {
        return this.promotion !== null;
    }

    setPromotion(promotion) {
        this.promotion = promotion;
    }

    check() {
        if (this.piece === null) return false;
        if (!(this.piece instanceof Piece)) return false;
        if (['q', 'r', 'b', 'n', null].indexOf(this.promotion) === -1) return false;
        if (!(this.from instanceof Square)) return false;
        if (!(this.to instanceof Square)) return false;
        if (!this.to) return false;
        if (!this.from) return false;
        if (this.from === this.to) return false;
        return true;
    }

    isLegal(game) {
        let destinations = game.moves({ square: this.from.id, verbose: true }).map(move => move.to);
        return destinations.indexOf(this.to.id) !== -1;
    }


};

/**
 * Service for managing animations and transitions
 * @module services/AnimationService
 * @since 2.0.0
 */

/**
 * Service responsible for coordinating animations and transitions
 * @class
 */
class AnimationService {
    /**
     * Creates a new AnimationService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config) {
        this.config = config;
        this.activeAnimations = new Map();
        this.animationId = 0;
    }

    /**
     * Creates a timing function for animations
     * @param {string} [type='ease'] - Animation type
     * @returns {Function} Timing function
     */
    createTimingFunction(type = 'ease') {
        return (elapsed, duration) => {
            const x = elapsed / duration;

            switch (type) {
                case 'linear':
                    return x;
                case 'ease':
                    return (x ** 2) * (3 - 2 * x);
                case 'ease-in':
                    return x ** 2;
                case 'ease-out':
                    return -1 * (x - 1) ** 2 + 1;
                case 'ease-in-out':
                    return (x < 0.5) ? 2 * x ** 2 : 4 * x - 2 * x ** 2 - 1;
                default:
                    return x;
            }
        };
    }

    /**
     * Animates an element with given properties
     * @param {HTMLElement} element - Element to animate
     * @param {Object} properties - Properties to animate
     * @param {number} duration - Animation duration in milliseconds
     * @param {string} [easing='ease'] - Easing function
     * @param {Function} [callback] - Callback when animation completes
     * @returns {number} Animation ID
     */
    animate(element, properties, duration, easing = 'ease', callback) {
        const animationId = ++this.animationId;
        const timingFunction = this.createTimingFunction(easing);
        const startTime = performance.now();
        const startValues = {};

        // Store initial values
        Object.keys(properties).forEach(prop => {
            startValues[prop] = this._getInitialValue(element, prop);
        });

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = timingFunction(elapsed, duration);

            // Apply animated values
            Object.keys(properties).forEach(prop => {
                const startValue = startValues[prop];
                const endValue = properties[prop];
                const currentValue = this._interpolateValue(startValue, endValue, easedProgress);
                this._applyValue(element, prop, currentValue);
            });

            if (progress < 1 && this.activeAnimations.has(animationId)) {
                requestAnimationFrame(animate);
            } else {
                this.activeAnimations.delete(animationId);
                if (callback) callback();
            }
        };

        this.activeAnimations.set(animationId, { element, animate, callback });
        requestAnimationFrame(animate);

        return animationId;
    }

    /**
     * Cancels an animation
     * @param {number} animationId - Animation ID to cancel
     */
    cancel(animationId) {
        if (this.activeAnimations.has(animationId)) {
            this.activeAnimations.delete(animationId);
        }
    }

    /**
     * Cancels all animations
     */
    cancelAll() {
        this.activeAnimations.clear();
    }

    /**
     * Gets initial value for a property
     * @private
     * @param {HTMLElement} element - Element
     * @param {string} property - Property name
     * @returns {number} Initial value
     */
    _getInitialValue(element, property) {
        if (!element || !element.style) return 0;
        switch (property) {
            case 'opacity':
                return parseFloat(getComputedStyle(element).opacity) || 1;
            case 'left':
                return parseFloat(element.style.left) || 0;
            case 'top':
                return parseFloat(element.style.top) || 0;
            case 'scale':
                return 1;
            default:
                return 0;
        }
    }

    /**
     * Interpolates between two values
     * @private
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} progress - Progress (0-1)
     * @returns {number} Interpolated value
     */
    _interpolateValue(start, end, progress) {
        return start + (end - start) * progress;
    }

    /**
     * Applies animated value to element
     * @private
     * @param {HTMLElement} element - Element
     * @param {string} property - Property name
     * @param {number} value - Value to apply
     */
    _applyValue(element, property, value) {
        if (!element || !element.style) return;
        switch (property) {
            case 'opacity':
                element.style.opacity = value;
                break;
            case 'left':
                element.style.left = value + 'px';
                break;
            case 'top':
                element.style.top = value + 'px';
                break;
            case 'scale':
                element.style.transform = `scale(${value})`;
                break;
            default:
                element.style[property] = value;
        }
    }

    /**
     * Cleans up resources
     */
    destroy() {
        this.cancelAll();
    }
}

/**
 * Service for managing board setup and DOM operations
 * @module services/BoardService
 * @since 2.0.0
 */


/**
 * Service responsible for board DOM manipulation and setup
 * @class
 */
class BoardService {
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
        this.element.className = "board";
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
            document.documentElement.style.setProperty('--dimBoard', value + 'px');
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
        } else {
            return Math.min(offsetWidth, offsetHeight);
        }
    }

    /**
     * Gets a square by its ID
     * @param {string} squareId - Square identifier (API pubblica)
     * @returns {Square|null} The square or null if not found
     */
    getSquare(squareId) {
        return this.squares[squareId] || null;
    }

    /**
     * Highlight a square (solo oggetto)
     * @param {Square} square
     * @param {Object} [opts]
     */
    highlightSquare(square, opts = {}) {
        if (!square) throw new Error('highlightSquare richiede oggetto Square');
        // ... logica esistente ...
    }
    /**
     * Dehighlight a square (solo oggetto)
     * @param {Square} square
     * @param {Object} [opts]
     */
    dehighlightSquare(square, opts = {}) {
        if (!square) throw new Error('dehighlightSquare richiede oggetto Square');
        // ... logica esistente ...
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

/**
 * Service for managing coordinate conversions and board orientation
 * @module services/CoordinateService
 * @since 2.0.0
 */


/**
 * Service responsible for coordinate conversions and board orientation
 * @class
 */
class CoordinateService {
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
     * Gets the current orientation
     * @returns {string} Current orientation ('w' or 'b')
     */
    getOrientation() {
        return this.config.orientation;
    }

    /**
     * Sets the orientation
     * @param {string} orientation - New orientation ('w', 'b', 'white', 'black')
     */
    setOrientation(orientation) {
        // Normalize orientation
        const normalizedOrientation = orientation === 'white' ? 'w' : 
                                     orientation === 'black' ? 'b' : orientation;
        
        if (normalizedOrientation !== 'w' && normalizedOrientation !== 'b') {
            throw new ValidationError(
                ERROR_MESSAGES.invalid_orientation + orientation,
                'orientation',
                orientation
            );
        }
        
        this.config.orientation = normalizedOrientation;
    }

    /**
     * Flips the board orientation
     */
    flipOrientation() {
        this.config.orientation = this.isWhiteOriented() ? 'b' : 'w';
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

/**
 * Performance utilities for smooth interactions and monitoring
 * @module utils/performance
 * @since 2.0.0
 */

/**
 * Performance monitoring class for measuring and tracking performance metrics
 * @class
 */
class PerformanceMonitor {
    /**
     * Creates a new PerformanceMonitor instance
     */
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.isEnabled = typeof performance !== 'undefined' && performance.mark;
        
        if (this.isEnabled) {
            this._setupObservers();
        }
    }
    
    /**
     * Sets up performance observers for automatic metrics collection
     * @private
     */
    _setupObservers() {
        try {
            // Performance Observer for paint metrics
            if (typeof PerformanceObserver !== 'undefined') {
                const paintObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.recordMetric(entry.name, entry.startTime);
                    }
                });
                
                paintObserver.observe({ entryTypes: ['paint'] });
                this.observers.set('paint', paintObserver);
            }
        } catch (error) {
            console.warn('Performance observers not available:', error.message);
        }
    }
    
    /**
     * Starts measuring performance for a given operation
     * @param {string} name - Name of the operation
     */
    startMeasure(name) {
        if (!this.isEnabled) return;
        
        try {
            performance.mark(`${name}-start`);
        } catch (error) {
            console.warn(`Failed to start performance measure for ${name}:`, error.message);
        }
    }
    
    /**
     * Ends measuring performance for a given operation
     * @param {string} name - Name of the operation
     * @returns {number} Duration in milliseconds
     */
    endMeasure(name) {
        if (!this.isEnabled) return 0;
        
        try {
            performance.mark(`${name}-end`);
            const measure = performance.measure(name, `${name}-start`, `${name}-end`);
            
            this.recordMetric(name, measure.duration);
            
            // Clean up marks
            performance.clearMarks(`${name}-start`);
            performance.clearMarks(`${name}-end`);
            performance.clearMeasures(name);
            
            return measure.duration;
        } catch (error) {
            console.warn(`Failed to end performance measure for ${name}:`, error.message);
            return 0;
        }
    }
    
    /**
     * Records a metric value
     * @param {string} name - Metric name
     * @param {number} value - Metric value
     */
    recordMetric(name, value) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, {
                count: 0,
                total: 0,
                min: Infinity,
                max: -Infinity,
                values: []
            });
        }
        
        const metric = this.metrics.get(name);
        metric.count++;
        metric.total += value;
        metric.min = Math.min(metric.min, value);
        metric.max = Math.max(metric.max, value);
        metric.values.push(value);
        
        // Keep only last 100 values to prevent memory leaks
        if (metric.values.length > 100) {
            metric.values.shift();
        }
    }
    
    /**
     * Gets metrics summary
     * @returns {Object} Metrics summary
     */
    getMetrics() {
        const summary = {};
        
        for (const [name, metric] of this.metrics) {
            summary[name] = {
                count: metric.count,
                average: metric.total / metric.count,
                min: metric.min,
                max: metric.max,
                total: metric.total,
                p95: this._calculatePercentile(metric.values, 95),
                p99: this._calculatePercentile(metric.values, 99)
            };
        }
        
        return summary;
    }
    
    /**
     * Calculates percentile for a set of values
     * @private
     * @param {Array<number>} values - Array of values
     * @param {number} percentile - Percentile to calculate (0-100)
     * @returns {number} Percentile value
     */
    _calculatePercentile(values, percentile) {
        if (values.length === 0) return 0;
        
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, index)];
    }
    
    /**
     * Clears all metrics
     */
    clearMetrics() {
        this.metrics.clear();
    }
    
    /**
     * Destroys the performance monitor and cleans up resources
     */
    destroy() {
        // Disconnect observers
        for (const observer of this.observers.values()) {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        }
        
        this.observers.clear();
        this.metrics.clear();
    }
}

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function to delay function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * Request animation frame throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF throttled function
 */
function rafThrottle(func) {
    let isThrottled = false;
    return function(...args) {
        if (isThrottled) return;
        
        const context = this;
        
        isThrottled = true;
        requestAnimationFrame(() => {
            func.apply(context, args);
            isThrottled = false;
        });
    };
}

/**
 * High performance transform utility with hardware acceleration
 * @param {HTMLElement} element - Element to transform
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} [scale=1] - Scale factor
 */
function setTransform(element, x, y, scale = 1) {
    if (!element || !element.style) return;
    
    // Use transform3d for hardware acceleration
    element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    
    // Promote to composite layer for better performance
    element.style.willChange = 'transform';
}

/**
 * Reset element position efficiently
 * @param {HTMLElement} element - Element to reset
 */
function resetTransform(element) {
    if (!element || !element.style) return;
    
    element.style.transform = '';
    element.style.left = '';
    element.style.top = '';
    element.style.willChange = '';
}

/**
 * Memory-efficient batch DOM operations
 * @param {Function} callback - Callback containing DOM operations
 * @returns {*} Result of the callback
 */
function batchDOMOperations(callback) {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            const result = callback();
            resolve(result);
        });
    });
}

/**
 * Optimized element visibility check
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is visible
 */
function isElementVisible(element) {
    if (!element || !element.getBoundingClientRect) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Memory usage tracking utility
 * @returns {Object} Memory usage information
 */
function getMemoryUsage() {
    if (typeof performance !== 'undefined' && performance.memory) {
        return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
        };
    }
    
    return {
        used: 0,
        total: 0,
        limit: 0,
        supported: false
    };
}

/**
 * Cross-browser utilities for consistent drag & drop behavior
 */

/**
 * Detect browser type and version
 * @returns {Object} Browser information
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    const isChrome = ua.includes('Chrome') && !ua.includes('Edg');
    const isFirefox = ua.includes('Firefox');
    const isSafari = ua.includes('Safari') && !ua.includes('Chrome');
    const isEdge = ua.includes('Edg');
    
    return {
        isChrome,
        isFirefox,
        isSafari,
        isEdge,
        devicePixelRatio: window.devicePixelRatio || 1,
        userAgent: ua
    };
}

/**
 * Browser-specific drag optimizations
 */
const DragOptimizations = {
    /**
     * Apply browser-specific optimizations to an element
     * @param {HTMLElement} element - Element to optimize
     */
    enableForDrag(element) {
        const browserInfo = getBrowserInfo();
        
        // Base optimizations for all browsers
        element.style.willChange = 'left, top';
        element.style.pointerEvents = 'none'; // Prevent conflicts
        
        // Chrome-specific optimizations
        if (browserInfo.isChrome) {
            element.style.transform = 'translateZ(0)'; // Force hardware acceleration
        }
        
        // Firefox-specific optimizations
        if (browserInfo.isFirefox) {
            element.style.backfaceVisibility = 'hidden';
        }
    },
    
    /**
     * Clean up optimizations after drag
     * @param {HTMLElement} element - Element to clean up
     */
    cleanupAfterDrag(element) {
        element.style.willChange = 'auto';
        element.style.pointerEvents = '';
        element.style.transform = '';
        element.style.backfaceVisibility = '';
    }
};

/**
 * Service for managing events and user interactions
 * @module services/EventService
 * @since 2.0.0
 */


/**
 * Service responsible for event handling and user interactions
 * @class
 */
class EventService {
    /**
     * Creates a new EventService instance
     * @param {ChessboardConfig} config - Board configuration
     * @param {BoardService} boardService - Board service instance
     * @param {MoveService} moveService - Move service instance
     * @param {CoordinateService} coordinateService - Coordinate service instance
     * @param {Chessboard} chessboard - Chessboard instance
     */
    constructor(config, boardService, moveService, coordinateService, chessboard) {
        this.config = config;
        this.boardService = boardService;
        this.moveService = moveService;
        this.coordinateService = coordinateService;
        this.chessboard = chessboard;

        // State management
        this.clicked = null;
        this.promoting = false;
        this.isAnimating = false;

        // Event listeners storage for cleanup
        this.eventListeners = new Map();
    }

    /**
     * Adds event listeners to all squares
     * @param {Function} onSquareClick - Callback for square clicks
     * @param {Function} onPieceHover - Callback for piece hover
     * @param {Function} onPieceLeave - Callback for piece leave
     */
    addListeners(onSquareClick, onPieceHover, onPieceLeave) {
        // Remove existing listeners to avoid duplicates
        this.removeListeners();

        const squares = this.boardService.getAllSquares();

        Object.values(squares).forEach(square => {
            this._addSquareListeners(square, onSquareClick, onPieceHover, onPieceLeave);
        });
    }

    /**
     * Adds event listeners to a specific square
     * @private
     * @param {Square} square - Square to add listeners to
     * @param {Function} onSquareClick - Click callback
     * @param {Function} onPieceHover - Hover callback
     * @param {Function} onPieceLeave - Leave callback
     */
    _addSquareListeners(square, onSquareClick, onPieceHover, onPieceLeave) {
        const listeners = [];

        // Throttled hover handlers for performance
        const throttledHover = rafThrottle((e) => {
            if (!this.clicked && this.config.hints) {
                onPieceHover(square);
            }
        });

        const throttledLeave = rafThrottle((e) => {
            if (!this.clicked && this.config.hints) {
                onPieceLeave(square);
            }
        });

        // Click handler
        const handleClick = (e) => {
            // Ghost click prevention: ignora il click se appena gestito un touch
            if (square._ignoreNextClick) {
                square._ignoreNextClick = false;
                return;
            }
            e.stopPropagation();
            if (this.config.clickable && !this.isAnimating) {
                onSquareClick(square);
            }
        };

        // --- Touch tap/drag separation ---
        let touchMoved = false;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchTimeout = null;

        const handleTouchStart = (e) => {
            if (!e.touches || e.touches.length > 1) return; // solo primo dito
            touchMoved = false;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            // Timeout: se il dito non si muove, dopo 150ms sarà considerato tap
            touchTimeout = setTimeout(() => {
                if (!touchMoved) {
                    // Prevenzione ghost click: ignora il prossimo click
                    square._ignoreNextClick = true;
                    setTimeout(() => { square._ignoreNextClick = false; }, 400);
                    handleClick(e); // Tap breve = selezione
                }
            }, 150);
        };

        const handleTouchMove = (e) => {
            if (!e.touches || e.touches.length > 1) return;
            const dx = Math.abs(e.touches[0].clientX - touchStartX);
            const dy = Math.abs(e.touches[0].clientY - touchStartY);
            if (dx > 5 || dy > 5) {
                touchMoved = true;
                if (touchTimeout) {
                    clearTimeout(touchTimeout);
                    touchTimeout = null;
                }
                // Il drag vero e proprio è gestito da createDragFunction sul pezzo
            }
        };

        const handleTouchEnd = (e) => {
            if (touchTimeout) {
                clearTimeout(touchTimeout);
                touchTimeout = null;
            }
        };

        // Add listeners
        square.element.addEventListener('mouseover', throttledHover);
        square.element.addEventListener('mouseout', throttledLeave);
        square.element.addEventListener('click', handleClick);
        // Touch: separa tap e drag
        square.element.addEventListener('touchstart', handleTouchStart);
        square.element.addEventListener('touchmove', handleTouchMove);
        square.element.addEventListener('touchend', handleTouchEnd);

        // Store listeners for cleanup
        listeners.push(
            { element: square.element, type: 'mouseover', handler: throttledHover },
            { element: square.element, type: 'mouseout', handler: throttledLeave },
            { element: square.element, type: 'click', handler: handleClick },
            { element: square.element, type: 'touchstart', handler: handleTouchStart },
            { element: square.element, type: 'touchmove', handler: handleTouchMove },
            { element: square.element, type: 'touchend', handler: handleTouchEnd }
        );

        this.eventListeners.set(square.id, listeners);
    }

    /**
     * Creates a drag function for a piece
     * @param {Square} square - Square containing the piece
     * @param {Piece} piece - Piece to create drag function for
     * @param {Function} onDragStart - Drag start callback
     * @param {Function} onDragMove - Drag move callback
     * @param {Function} onDrop - Drop callback
     * @param {Function} onSnapback - Snapback callback
     * @param {Function} onMove - Move execution callback
     * @param {Function} onRemove - Remove piece callback
     * @returns {Function} Drag event handler
     */
    createDragFunction(square, piece, onDragStart, onDragMove, onDrop, onSnapback, onMove, onRemove) {
        return (event) => {
            event.preventDefault();

            if (!this.config.draggable || !piece || this.isAnimating) {
                return;
            }

            const originalFrom = square;
            let isDragging = false;
            let from = originalFrom;
            let to = square;
            let previousHighlight = null;

            const img = piece.element;

            if (!this.moveService.canMove(from)) {
                return;
            }

            // Track initial position for drag threshold
            const isTouch = event.type && event.type.startsWith('touch');
            const startX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
            const startY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;

            // --- Touch scroll lock helper ---
            const addScrollLock = () => {
                document.body.classList.add('chessboardjs-dragging');
            };
            const removeScrollLock = () => {
                document.body.classList.remove('chessboardjs-dragging');
            };

            // --- MOVE HANDLER (mouse + touch unified) ---
            const moveAt = (event) => {
                const boardElement = this.boardService.element;
                const squareSize = boardElement.offsetWidth / 8;

                // Get mouse/touch coordinates
                let clientX, clientY;
                if (event.touches && event.touches[0]) {
                    clientX = event.touches[0].clientX;
                    clientY = event.touches[0].clientY;
                } else {
                    clientX = event.clientX;
                    clientY = event.clientY;
                }

                // Calculate position relative to board
                const boardRect = boardElement.getBoundingClientRect();
                const x = clientX - boardRect.left - (squareSize / 2);
                const y = clientY - boardRect.top - (squareSize / 2);

                img.style.left = x + 'px';
                img.style.top = y + 'px';

                return true;
            };

            // --- DRAG MOVE (mouse + touch) ---
            const onPointerMove = (event) => {
                // For touch, only handle the first finger
                if (event.touches && event.touches.length > 1) return;
                if (event.touches && !event.touches[0]) return;
                if (event.type && event.type.startsWith('touch')) event.preventDefault();

                const currentX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
                const currentY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);

                // Start dragging if mouse/touch moved enough
                if (!isDragging && (deltaX > 3 || deltaY > 3)) {
                    isDragging = true;
                    // Inizio drag: blocca update board
                    if (this.chessboard) this.chessboard._isDragging = true;

                    // Mostra hint all'inizio del drag se attivi
                    if (this.config.hints && typeof this.chessboard._boundOnPieceHover === 'function') {
                        this.chessboard._boundOnPieceHover(from);
                    }

                    // Set up drag state
                    if (!this.config.clickable) {
                        this.clicked = null;
                        this.clicked = from;
                    } else if (!this.clicked) {
                        this.clicked = from;
                    }

                    // Visual feedback
                    if (this.config.clickable) {
                        from.select();
                    }

                    // Prepare piece for dragging
                    img.style.position = 'absolute';
                    img.style.zIndex = '100';
                    img.classList.add('dragging');

                    DragOptimizations.enableForDrag(img);

                    // Lock scroll for touch
                    if (isTouch) addScrollLock();

                    // Call drag start callback
                    if (!onDragStart(square, piece)) {
                        return;
                    }
                }

                if (!isDragging) return;

                if (!moveAt(event)) ;

                // Update target square
                const boardElement = this.boardService.element;
                const boardRect = boardElement.getBoundingClientRect();
                let clientX, clientY;
                if (event.touches && event.touches[0]) {
                    clientX = event.touches[0].clientX;
                    clientY = event.touches[0].clientY;
                } else {
                    clientX = event.clientX;
                    clientY = event.clientY;
                }
                const x = clientX - boardRect.left;
                const y = clientY - boardRect.top;

                let newTo = null;
                if (x >= 0 && x <= boardRect.width && y >= 0 && y <= boardRect.height) {
                    const squareId = this.coordinateService.pixelToSquareID(x, y, boardElement);
                    newTo = squareId ? this.boardService.getSquare(squareId) : null;
                }

                to = newTo;
                onDragMove(from, to, piece);

                // Update visual feedback
                if (to !== previousHighlight) {
                    to?.highlight();
                    previousHighlight?.dehighlight();
                    previousHighlight = to;
                }
            };

            // --- DRAG END (mouse + touch) ---
            const onPointerUp = (event) => {
                previousHighlight?.dehighlight();
                document.removeEventListener('mousemove', onPointerMove);
                window.removeEventListener('mouseup', onPointerUp);
                document.removeEventListener('touchmove', onPointerMove);
                window.removeEventListener('touchend', onPointerUp);
                if (isTouch) removeScrollLock();
                // Fine drag: sblocca update board
                if (this.chessboard) this.chessboard._isDragging = false;

                // Rimuovi hint alla fine del drag se attivi
                if (this.config.hints && typeof this.chessboard._boundOnPieceLeave === 'function') {
                    this.chessboard._boundOnPieceLeave(from);
                }

                if (!isDragging) {
                    return;
                }

                img.style.zIndex = '20';
                img.classList.remove('dragging');
                img.style.willChange = 'auto';

                // Handle drop
                const dropResult = onDrop(originalFrom, to, piece);
                const isTrashDrop = !to && (this.config.dropOffBoard === 'trash' || dropResult === 'trash');

                if (isTrashDrop) {
                    this._handleTrashDrop(originalFrom, onRemove);
                } else if (!to) {
                    img.style.position = '';
                    img.style.left = '';
                    img.style.top = '';
                    img.style.transform = '';
                    this._handleSnapback(originalFrom, piece, onSnapback);
                } else {
                    this._handleDrop(originalFrom, to, piece, onMove, onSnapback);
                }
            };

            // --- Attach listeners (mouse + touch) ---
            window.addEventListener('mouseup', onPointerUp, { once: true });
            document.addEventListener('mousemove', onPointerMove);
            img.addEventListener('mouseup', onPointerUp, { once: true });
            // Touch events
            window.addEventListener('touchend', onPointerUp, { once: true });
            document.addEventListener('touchmove', onPointerMove, { passive: false });

            // Per robustezza: se il drag parte da touch, blocca subito lo scroll
            if (isTouch) addScrollLock();
        };
    }

    /**
     * Handles trash drop (piece removal)
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Function} onRemove - Callback to remove piece
     */
    _handleTrashDrop(fromSquare, onRemove) {
        this.boardService.applyToAllSquares('unmoved');
        this.boardService.applyToAllSquares('removeHint');
        fromSquare.deselect();

        if (onRemove) {
            onRemove(fromSquare.getId());
        }
    }

    /**
     * Handles snapback animation
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Piece} piece - Piece to snapback
     * @param {Function} onSnapback - Snapback callback
     */
    _handleSnapback(fromSquare, piece, onSnapback) {
        if (fromSquare && fromSquare.piece) {
            if (onSnapback) {
                onSnapback(fromSquare, piece);
            }
        }
    }

    /**
     * Handles successful drop
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Square} toSquare - Target square
     * @param {Piece} piece - Piece being dropped
     * @param {Function} onMove - Move callback
     * @param {Function} onSnapback - Snapback callback
     */
    _handleDrop(fromSquare, toSquare, piece, onMove, onSnapback) {
        this.clicked = fromSquare;

        // Check if move requires promotion
        if (this.moveService.requiresPromotion(new Move$1(fromSquare, toSquare))) {
            console.log('Drag move requires promotion:', fromSquare.id, '->', toSquare.id);

            // Set up promotion UI - use the same logic as click
            this.moveService.setupPromotion(
                new Move$1(fromSquare, toSquare),
                this.boardService.squares,
                (selectedPromotion) => {
                    console.log('Drag promotion selected:', selectedPromotion);

                    // Clear promotion UI first
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');

                    // Execute the move with promotion
                    const moveResult = onMove(fromSquare, toSquare, selectedPromotion, true);

                    if (moveResult) {
                        // After a successful promotion move, we need to replace the piece
                        // after the drop animation completes
                        this._schedulePromotionPieceReplacement(toSquare, selectedPromotion);

                        this.clicked = null;
                    } else {
                        // Move failed - snapback
                        this._handleSnapback(fromSquare, piece, onSnapback);
                    }
                },
                () => {
                    console.log('Drag promotion cancelled');

                    // Clear promotion UI on cancel
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');

                    // Snapback the piece
                    this._handleSnapback(fromSquare, piece, onSnapback);
                }
            );
        } else {
            // Regular move - no promotion needed
            const moveSuccess = onMove(fromSquare, toSquare, null, true);

            if (moveSuccess) {
                // Move successful - reset clicked state
                this.clicked = null;
            } else {
                // Move failed - snapback
                this._handleSnapback(fromSquare, piece, onSnapback);
            }
        }
    }

    /**
     * Animates piece to center of target square (visual only)
     * @private
     * @param {Piece} piece - Piece to animate
     * @param {Square} targetSquare - Target square
     * @param {Function} callback - Callback when animation completes
     */
    _animatePieceToCenter(piece, targetSquare, callback = null) {
        if (!piece || !targetSquare) {
            if (callback) callback();
            return;
        }

        const duration = this.config.dropCenterTime;

        // Get current position of piece element
        const sourceRect = piece.element.getBoundingClientRect();
        const targetRect = targetSquare.element.getBoundingClientRect();

        const x_start = sourceRect.left + sourceRect.width / 2;
        const y_start = sourceRect.top + sourceRect.height / 2;
        const x_end = targetRect.left + targetRect.width / 2;
        const y_end = targetRect.top + targetRect.height / 2;
        const dx = x_end - x_start;
        const dy = y_end - y_start;

        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
            // Already centered, just reset styles
            piece.element.style.position = '';
            piece.element.style.left = '';
            piece.element.style.top = '';
            piece.element.style.transform = '';
            piece.element.style.zIndex = '';
            if (callback) callback();
            return;
        }

        const keyframes = [
            { transform: 'translate(0, 0)' },
            { transform: `translate(${dx}px, ${dy}px)` }
        ];

        if (piece.element.animate) {
            const animation = piece.element.animate(keyframes, {
                duration: duration,
                easing: 'ease',
                fill: 'none'  // Don't keep the final position
            });

            animation.onfinish = () => {
                // Defensive: check if element still exists
                if (!piece.element) {
                    if (callback) callback();
                    return;
                }
                // Reset all drag-related styles to let default CSS handle positioning
                piece.element.style.position = '';
                piece.element.style.left = '';
                piece.element.style.top = '';
                piece.element.style.transform = '';
                piece.element.style.zIndex = '';
                piece.element.style.transition = '';

                if (callback) callback();
            };
        } else {
            // Fallback for browsers without Web Animations API
            piece.element.style.transition = `transform ${duration}ms ease`;
            piece.element.style.transform = `translate(${dx}px, ${dy}px)`;

            setTimeout(() => {
                // Defensive: check if element still exists
                if (!piece.element) {
                    if (callback) callback();
                    return;
                }
                // After animation, reset ALL positioning styles and let CSS handle centering
                piece.element.style.position = 'relative';
                piece.element.style.left = '0';
                piece.element.style.top = '0';
                piece.element.style.transform = 'translate(-50%, -50%)';
                piece.element.style.zIndex = '20';
                piece.element.style.transition = 'none';

                if (callback) callback();
            }, duration);
        }
    }

    /**
     * Handles square click events
     * @param {Square} square - Clicked square
     * @param {Function} onMove - Move callback
     * @param {Function} onSelect - Select callback
     * @param {Function} onDeselect - Deselect callback
     * @param {boolean} [animate=true] - Whether to animate the move
     * @param {boolean} [dragged=false] - Whether this was triggered by drag
     * @returns {boolean} True if move was successful
     */
    onClick(square, onMove, onSelect, onDeselect, animate = true, dragged = false) {
        console.log('EventService.onClick: square =', square.id, 'clicked =', this.clicked?.id || 'none');

        let from = this.clicked;
        let promotion = null;

        // Handle promotion state
        if (this.promoting) {
            if (this.promoting === 'none') {
                from = null;
            } else {
                promotion = this.promoting;
            }

            this.promoting = false;
            this.boardService.applyToAllSquares('removePromotion');
            this.boardService.applyToAllSquares('removeCover');
        }

        // No source square selected
        if (!from) {
            if (this.moveService.canMove(square)) {
                if (this.config.clickable) {
                    this.boardService.applyToAllSquares('removeHint'); // Rimuovi hint prima di selezionare
                    onSelect(square);
                }
                this.clicked = square;
                return false;
            } else {
                return false;
            }
        }

        // --- Touch: non deselezionare su doppio tap sulla stessa casella ---
        if (this.clicked === square) {
            if (window.event && window.event.type && window.event.type.startsWith('touch')) {
                return false;
            }
            onDeselect(square);
            this.boardService.applyToAllSquares('removeHint');
            this.clicked = null;
            return false;
        }

        // Check if move requires promotion
        if (!promotion && this.moveService.requiresPromotion(new Move$1(from, square))) {
            console.log('Move requires promotion:', from.id, '->', square.id);

            this.moveService.setupPromotion(
                new Move$1(from, square),
                this.boardService.squares,
                (selectedPromotion) => {
                    console.log('Promotion selected:', selectedPromotion);
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');
                    const moveResult = onMove(from, square, selectedPromotion, animate);
                    if (moveResult) {
                        this._schedulePromotionPieceReplacement(square, selectedPromotion);
                        onDeselect(from);
                        this.boardService.applyToAllSquares('removeHint');
                        this.clicked = null;
                    }
                },
                () => {
                    console.log('Promotion cancelled');
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');
                    onDeselect(from);
                    this.boardService.applyToAllSquares('removeHint');
                    this.clicked = null;
                }
            );
            return false;
        }

        const moveResult = onMove(from, square, promotion, animate);

        if (moveResult) {
            onDeselect(from);
            this.boardService.applyToAllSquares('removeHint');
            this.clicked = null;
            return true;
        } else {
            if (this.moveService.canMove(square)) {
                onDeselect(from);
                this.boardService.applyToAllSquares('removeHint');
                if (this.config.clickable) {
                    onSelect(square);
                }
                this.clicked = square;
                return false;
            } else {
                onDeselect(from);
                this.boardService.applyToAllSquares('removeHint');
                this.clicked = null;
                return false;
            }
        }
    }

    /**
     * Schedules piece replacement after promotion animation
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     */
    _schedulePromotionPieceReplacement(square, promotionPiece) {
        // Mark that we're doing a promotion to prevent interference
        this.chessboard._isPromoting = true;

        // Use a more robust approach: poll for the piece to be present
        this._waitForPieceAndReplace(square, promotionPiece, 0);
    }

    /**
     * Waits for piece to be present and then replaces it
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     * @param {number} attempt - Current attempt number
     */
    _waitForPieceAndReplace(square, promotionPiece, attempt) {
        const maxAttempts = 20; // Maximum 1 second of waiting (20 * 50ms)
        const targetSquare = this.boardService.getSquare(square.id);

        if (!targetSquare) {
            console.warn('Target square not found:', square.id);
            this.chessboard._isPromoting = false;
            return;
        }

        // Check if piece is present and ready
        if (targetSquare.piece && targetSquare.piece.element) {
            console.log('Piece found on', square.id, 'after', attempt, 'attempts');
            this._replacePromotionPiece(square, promotionPiece);

            // Allow normal updates again after transformation
            setTimeout(() => {
                this.chessboard._isPromoting = false;
                console.log('Promotion protection ended');
                // Force a board update to ensure everything is correctly synchronized
                this.chessboard._updateBoardPieces(false);
            }, 400); // Wait for transformation animation to complete

            return;
        }

        // If piece not found and we haven't exceeded max attempts, try again
        if (attempt < maxAttempts) {
            setTimeout(() => {
                this._waitForPieceAndReplace(square, promotionPiece, attempt + 1);
            }, 50);
        } else {
            console.warn('Failed to find piece for promotion after', maxAttempts, 'attempts');
            this.chessboard._isPromoting = false;

            // Force a board update to recover from the failed promotion
            this.chessboard._updateBoardPieces(false);
        }
    }

    /**
     * Replaces the piece on the square with the promotion piece
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     */
    _replacePromotionPiece(square, promotionPiece) {
        console.log('Replacing piece on', square.id, 'with', promotionPiece);

        // Get the target square from the board service
        const targetSquare = this.boardService.getSquare(square.id);
        if (!targetSquare) {
            console.log('Target square not found:', square.id);
            return;
        }

        // Get the game state to determine the correct piece color
        const gameState = this.chessboard.positionService.getGame();
        const gamePiece = gameState.get(targetSquare.id);

        if (!gamePiece) {
            console.log('No piece found in game state for', targetSquare.id);
            return;
        }

        // Get the current piece on the square
        const currentPiece = targetSquare.piece;

        if (!currentPiece) {
            console.warn('No piece found on target square for promotion');

            // Try to recover by creating a new piece
            const pieceId = promotionPiece + gamePiece.color;
            const piecePath = this.chessboard.pieceService.getPiecePath(pieceId);

            const newPiece = new Piece(
                gamePiece.color,
                promotionPiece,
                piecePath
            );

            // Place the new piece on the square
            targetSquare.putPiece(newPiece);

            // Set up drag functionality
            const dragFunction = this.chessboard._createDragFunction.bind(this.chessboard);
            newPiece.setDrag(dragFunction(targetSquare, newPiece));

            console.log('Created new promotion piece:', pieceId, 'on', targetSquare.id);
            return;
        }

        // Create the piece ID and get the path
        const pieceId = promotionPiece + gamePiece.color;
        const piecePath = this.chessboard.pieceService.getPiecePath(pieceId);

        console.log('Transforming piece to:', pieceId, 'with path:', piecePath);

        // Use the new smooth transformation animation
        currentPiece.transformTo(
            promotionPiece,
            piecePath,
            300, // Duration of the transformation animation
            () => {
                // After transformation, set up drag functionality
                const dragFunction = this.chessboard._createDragFunction.bind(this.chessboard);
                currentPiece.setDrag(dragFunction(targetSquare, currentPiece));

                // Ensure hints are properly updated after promotion
                if (this.config.hints && this.chessboard.moveService) {
                    setTimeout(() => {
                        this.chessboard.moveService.clearCache();
                    }, 100);
                }

                console.log('Successfully transformed piece on', targetSquare.id, 'to', pieceId);
            }
        );
    }

    /**
     * Sets the clicked square
     * @param {Square|null} square - Square to set as clicked
     */
    setClicked(square) {
        this.clicked = square;
    }

    /**
     * Gets the currently clicked square
     * @returns {Square|null} Currently clicked square
     */
    getClicked() {
        return this.clicked;
    }

    /**
     * Sets the promotion state
     * @param {string|boolean} promotion - Promotion piece type or false
     */
    setPromoting(promotion) {
        this.promoting = promotion;
    }

    /**
     * Gets the promotion state
     * @returns {string|boolean} Current promotion state
     */
    getPromoting() {
        return this.promoting;
    }

    /**
     * Sets the animation state
     * @param {boolean} isAnimating - Whether animations are in progress
     */
    setAnimating(isAnimating) {
        this.isAnimating = isAnimating;
    }

    /**
     * Gets the animation state
     * @returns {boolean} Whether animations are in progress
     */
    getAnimating() {
        return this.isAnimating;
    }

    /**
     * Removes all existing event listeners
     */
    removeListeners() {
        this.eventListeners.forEach((listeners, squareId) => {
            listeners.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
        });

        this.eventListeners.clear();
    }

    /**
     * Removes all event listeners
     */
    removeAllListeners() {
        this.eventListeners.forEach((listeners, squareId) => {
            listeners.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
        });

        this.eventListeners.clear();
    }

    /**
     * Cleans up resources
     */
    destroy() {
        this.removeAllListeners();
        this.clicked = null;
        this.promoting = false;
        this.isAnimating = false;
    }
}

/**
 * Service for managing chess moves and move validation
 * @module services/MoveService
 * @since 2.0.0
 */


/**
 * Service responsible for move management and validation
 * @class
 */
class MoveService {
    /**
     * Creates a new MoveService instance
     * @param {ChessboardConfig} config - Board configuration
     * @param {PositionService} positionService - Position service instance
     */
    constructor(config, positionService) {
        this.config = config;
        this.positionService = positionService;
        this._movesCache = new Map();
        this._cacheTimeout = null;
    }

    /**
     * Checks if a piece on a square can move
     * @param {Square} square - Square to check
     * @returns {boolean} True if piece can move
     */
    canMove(square) {
        if (!square.piece) return false;

        const { movableColors, onlyLegalMoves } = this.config;

        if (movableColors === 'none') return false;
        if (movableColors === 'w' && square.piece.color === 'b') return false;
        if (movableColors === 'b' && square.piece.color === 'w') return false;

        if (!onlyLegalMoves) return true;

        // Check if position service and game are available
        if (!this.positionService || !this.positionService.getGame()) {
            return false;
        }

        const game = this.positionService.getGame();
        return square.piece.color === game.turn();
    }

    /**
     * Converts various move formats to a Move instance
     * @param {string|Move|Object} move - Move in various formats
     * @param {Object} squares - All board squares
     * @returns {Move} Move instance
     * @throws {MoveError} When move format is invalid
     */
    convertMove(move, squares) {
        if (move instanceof Move$1) {
            return move;
        }
        if (typeof move === 'object' && move.from && move.to) {
            // Se sono id, converto in oggetti; se sono già oggetti, li uso direttamente
            const fromSquare = typeof move.from === 'string' ? squares[move.from] : move.from;
            const toSquare = typeof move.to === 'string' ? squares[move.to] : move.to;
            if (!fromSquare || !toSquare) throw new MoveError(ERROR_MESSAGES.invalid_move_format, move.from, move.to);
            return new Move$1(fromSquare, toSquare, move.promotion);
        }
        if (typeof move === 'string' && move.length >= 4) {
            const fromId = move.slice(0, 2);
            const toId = move.slice(2, 4);
            const promotion = move.slice(4, 5) || null;
            if (!squares[fromId] || !squares[toId]) {
                throw new MoveError(ERROR_MESSAGES.invalid_move_format, fromId, toId);
            }
            return new Move$1(squares[fromId], squares[toId], promotion);
        }
        throw new MoveError(ERROR_MESSAGES.invalid_move_format, 'unknown', 'unknown');
    }

    /**
     * Checks if a move is legal
     * @param {Move} move - Move to check
     * @returns {boolean} True if move is legal
     */
    isLegalMove(move) {
        const legalMoves = this.getLegalMoves(move.from.id);

        return legalMoves.some(legalMove =>
            legalMove.to === move.to.id &&
            move.promotion === legalMove.promotion
        );
    }

    /**
     * Gets all legal moves for a square or the entire position
     * @param {string} [from] - Square to get moves from (optional)
     * @param {boolean} [verbose=true] - Whether to return verbose move objects
     * @returns {Array} Array of legal moves
     */
    getLegalMoves(from = null, verbose = true) {
        // Check if position service and game are available
        if (!this.positionService || !this.positionService.getGame()) {
            return [];
        }

        const game = this.positionService.getGame();

        if (!game) return [];

        const options = { verbose };
        if (from) {
            options.square = from;
        }

        return game.moves(options);
    }

    /**
     * Gets legal moves with caching for performance
     * @param {Square} square - Square to get moves from
     * @returns {Array} Array of legal moves
     */
    getCachedLegalMoves(square) {
        // Check if position service and game are available
        if (!this.positionService || !this.positionService.getGame()) {
            return [];
        }

        const game = this.positionService.getGame();
        if (!game) return [];

        const cacheKey = `${square.id}-${game.fen()}`;
        let moves = this._movesCache.get(cacheKey);

        if (!moves) {
            moves = game.moves({ square: square.id, verbose: true });
            this._movesCache.set(cacheKey, moves);

            // Clear cache after a short delay to prevent memory buildup
            if (this._cacheTimeout) {
                clearTimeout(this._cacheTimeout);
            }

            this._cacheTimeout = setTimeout(() => {
                this._movesCache.clear();
            }, 1000);
        }

        return moves;
    }

    /**
     * Executes a move on the game
     * @param {Move} move - Move to execute (deve essere oggetto Move)
     * @returns {Object|null} Move result from chess.js or null if invalid
     */
    executeMove(move) {
        if (!(move instanceof Move$1)) throw new Error('executeMove richiede un oggetto Move');
        if (!this.positionService || !this.positionService.getGame()) {
            return null;
        }
        const game = this.positionService.getGame();
        if (!game) return null;
        const moveOptions = {
            from: move.from.id,
            to: move.to.id
        };
        if (move.hasPromotion()) {
            moveOptions.promotion = move.promotion;
        }
        const result = game.move(moveOptions);
        return result;
    }

    /**
     * Determina se una mossa richiede promozione
     * @param {Move} move - Deve essere oggetto Move
     * @returns {boolean}
     */
    requiresPromotion(move) {
        if (!(move instanceof Move$1)) throw new Error('requiresPromotion richiede un oggetto Move');
        console.log('Checking if move requires promotion:', move.from.id, '->', move.to.id);

        if (!this.config.onlyLegalMoves) {
            console.log('Not in legal moves mode, no promotion required');
            return false;
        }

        const game = this.positionService.getGame();
        if (!game) {
            console.log('No game instance available');
            return false;
        }

        const piece = game.get(move.from.id);
        if (!piece || piece.type !== 'p') {
            console.log('Not a pawn move, no promotion required');
            return false;
        }

        const targetRank = move.to.row;
        if (targetRank !== 1 && targetRank !== 8) {
            console.log('Not reaching promotion rank, no promotion required');
            return false;
        }

        console.log('Pawn reaching promotion rank, validating move...');

        // Additional validation: check if the pawn can actually reach this square
        if (!this._isPawnMoveValid(move.from, move.to, piece.color)) {
            console.log('Pawn move not valid, no promotion required');
            return false;
        }

        // First check if the move is legal without promotion
        const simpleMoveObj = {
            from: move.from.id,
            to: move.to.id
        };

        try {
            console.log('Testing move without promotion:', simpleMoveObj);
            // Test if the move is legal without promotion first
            const testMove = game.move(simpleMoveObj);
            if (testMove) {
                // Move was successful, but check if it was a promotion
                const wasPromotion = testMove.promotion;

                // Undo the test move
                game.undo();

                console.log('Move successful without promotion, was promotion:', wasPromotion !== undefined);

                // If it was a promotion, return true
                return wasPromotion !== undefined;
            }
        } catch (error) {
            console.log('Move failed without promotion, trying with promotion:', error.message);

            // If simple move fails, try with promotion
            const promotionMoveObj = {
                from: move.from.id,
                to: move.to.id,
                promotion: 'q' // test with queen
            };

            try {
                console.log('Testing move with promotion:', promotionMoveObj);
                const testMove = game.move(promotionMoveObj);
                if (testMove) {
                    // Undo the test move
                    game.undo();
                    console.log('Move successful with promotion, promotion required');
                    return true;
                }
            } catch (promotionError) {
                console.log('Move failed even with promotion:', promotionError.message);
                // Move is not legal even with promotion
                return false;
            }
        }

        console.log('Move validation complete, no promotion required');
        return false;
    }

    /**
     * Validates if a pawn move is theoretically possible
     * @private
     * @param {Square} from - Source square
     * @param {Square} to - Target square
     * @param {string} color - Pawn color ('w' or 'b')
     * @returns {boolean} True if the move is valid for a pawn
     */
    _isPawnMoveValid(from, to, color) {
        const fromRank = from.row;
        const toRank = to.row;
        const fromFile = from.col;
        const toFile = to.col;

        console.log(`Validating pawn move: ${from.id} -> ${to.id} (${color})`);
        console.log(`Ranks: ${fromRank} -> ${toRank}, Files: ${fromFile} -> ${toFile}`);

        // Direction of pawn movement
        const direction = color === 'w' ? 1 : -1;
        const rankDiff = toRank - fromRank;
        const fileDiff = Math.abs(toFile - fromFile);

        // Pawn can only move forward
        if (rankDiff * direction <= 0) {
            console.log('Invalid: Pawn cannot move backward or stay in place');
            return false;
        }

        // Pawn can only move 1 rank at a time (except for double move from starting position)
        if (Math.abs(rankDiff) > 2) {
            console.log('Invalid: Pawn cannot move more than 2 ranks');
            return false;
        }

        // If moving 2 ranks, must be from starting position
        if (Math.abs(rankDiff) === 2) {
            const startingRank = color === 'w' ? 2 : 7;
            if (fromRank !== startingRank) {
                console.log(`Invalid: Pawn cannot move 2 ranks from rank ${fromRank}`);
                return false;
            }
        }

        // Pawn can only move to adjacent files (diagonal capture) or same file (forward move)
        if (fileDiff > 1) {
            console.log('Invalid: Pawn cannot move more than 1 file');
            return false;
        }

        console.log('Pawn move validation passed');
        return true;
    }

    /**
     * Handles promotion UI setup
     * @param {Move} move - Move requiring promotion
     * @param {Object} squares - All board squares
     * @param {Function} onPromotionSelect - Callback when promotion piece is selected
     * @param {Function} onPromotionCancel - Callback when promotion is cancelled
     * @returns {boolean} True if promotion UI was set up
     */
    setupPromotion(move, squares, onPromotionSelect, onPromotionCancel) {
        if (!this.requiresPromotion(move)) return false;

        // Check if position service and game are available
        if (!this.positionService || !this.positionService.getGame()) {
            return false;
        }

        const game = this.positionService.getGame();
        const piece = game.get(move.from.id);
        const targetSquare = move.to;

        // Clear any existing promotion UI
        Object.values(squares).forEach(square => {
            square.removePromotion();
            square.removeCover();
        });

        // Always show promotion choices in a column
        this._showPromotionInColumn(targetSquare, piece, squares, onPromotionSelect, onPromotionCancel);

        return true;
    }

    /**
     * Shows promotion choices in a column
     * @private
     */
    _showPromotionInColumn(targetSquare, piece, squares, onPromotionSelect, onPromotionCancel) {
        console.log('Setting up promotion for', targetSquare.id, 'piece color:', piece.color);

        // Set up promotion choices starting from border row
        PROMOTION_PIECES.forEach((pieceType, index) => {
            const choiceSquare = this._findPromotionSquare(targetSquare, index, squares);

            if (choiceSquare) {
                const pieceId = pieceType + piece.color;
                const piecePath = this._getPiecePathForPromotion(pieceId);

                console.log('Setting up promotion choice:', pieceType, 'on square:', choiceSquare.id);

                choiceSquare.putPromotion(piecePath, () => {
                    console.log('Promotion choice selected:', pieceType);
                    onPromotionSelect(pieceType);
                });
            } else {
                console.log('Could not find square for promotion choice:', pieceType, 'index:', index);
            }
        });

        // Set up cover squares (for cancellation)
        Object.values(squares).forEach(square => {
            if (!square.hasPromotion()) {
                square.putCover(() => {
                    onPromotionCancel();
                });
            }
        });

        return true;
    }

    /**
     * Finds the appropriate square for a promotion piece
     * @private
     * @param {Square} targetSquare - Target square of the promotion move
     * @param {number} distance - Distance from target square
     * @param {Object} squares - All board squares
     * @returns {Square|null} Square for promotion piece or null
     */
    _findPromotionSquare(targetSquare, index, squares) {
        const col = targetSquare.col;
        const baseRow = targetSquare.row;

        console.log('Looking for promotion square - target:', targetSquare.id, 'index:', index, 'col:', col, 'baseRow:', baseRow);

        // Calculate row based on index and promotion direction
        // Start from the border row (1 or 8) and go inward
        let row;
        if (baseRow === 8) {
            // White promotion: start from row 8 and go down
            row = 8 - index;
        } else if (baseRow === 1) {
            // Black promotion: start from row 1 and go up
            row = 1 + index;
        } else {
            console.log('Invalid promotion row:', baseRow);
            return null;
        }

        console.log('Calculated row:', row);

        // Ensure row is within bounds
        if (row < 1 || row > 8) {
            console.log('Row out of bounds:', row);
            return null;
        }

        // Find square by row/col
        for (const square of Object.values(squares)) {
            if (square.col === col && square.row === row) {
                console.log('Found promotion square:', square.id);
                return square;
            }
        }

        console.log('No square found for col:', col, 'row:', row);
        return null;
    }

    /**
     * Gets piece path for promotion UI
     * @private
     * @param {string} pieceId - Piece identifier
     * @returns {string} Path to piece asset
     */
    _getPiecePathForPromotion(pieceId) {
        // This would typically use the PieceService
        // For now, we'll use a simple implementation
        const { piecesPath } = this.config;

        if (typeof piecesPath === 'string') {
            return `${piecesPath}/${pieceId}.svg`;
        }

        // Fallback for other path types
        return `assets/pieces/${pieceId}.svg`;
    }

    /**
     * Parses a move string into a move object
     * @param {string} moveString - Move string (e.g., 'e2e4', 'e7e8q')
     * @returns {Object|null} Move object or null if invalid
     */
    parseMove(moveString) {
        if (typeof moveString !== 'string' || moveString.length < 4 || moveString.length > 5) {
            return null;
        }

        const from = moveString.slice(0, 2);
        const to = moveString.slice(2, 4);
        const promotion = moveString.slice(4, 5);

        // Basic validation
        if (!/^[a-h][1-8]$/.test(from) || !/^[a-h][1-8]$/.test(to)) {
            return null;
        }

        if (promotion && !['q', 'r', 'b', 'n'].includes(promotion.toLowerCase())) {
            return null;
        }

        return {
            from: from,
            to: to,
            promotion: promotion || null
        };
    }

    /**
     * Checks if a move is a castle move
     * @param {Object} gameMove - Game move object from chess.js
     * @returns {boolean} True if move is castle
     */
    isCastle(gameMove) {
        return gameMove && (gameMove.isKingsideCastle() || gameMove.isQueensideCastle());
    }

    /**
     * Gets the rook move for a castle move
     * @param {Object} gameMove - Game move object from chess.js
     * @returns {Object|null} Rook move object or null if not castle
     */
    getCastleRookMove(gameMove) {
        if (!this.isCastle(gameMove)) {
            return null;
        }

        const isKingSide = gameMove.isKingsideCastle();
        const isWhite = gameMove.color === 'w';

        if (isKingSide) {
            // King side castle
            if (isWhite) {
                return { from: 'h1', to: 'f1' };
            } else {
                return { from: 'h8', to: 'f8' };
            }
        } else {
            // Queen side castle
            if (isWhite) {
                return { from: 'a1', to: 'd1' };
            } else {
                return { from: 'a8', to: 'd8' };
            }
        }
    }

    /**
     * Checks if a move is en passant
     * @param {Object} gameMove - Game move object from chess.js
     * @returns {boolean} True if move is en passant
     */
    isEnPassant(gameMove) {
        return gameMove && gameMove.isEnPassant();
    }

    /**
     * Gets the captured pawn square for en passant
     * @param {Object} gameMove - Game move object from chess.js
     * @returns {string|null} Square of captured pawn or null if not en passant
     */
    getEnPassantCapturedSquare(gameMove) {
        if (!this.isEnPassant(gameMove)) {
            return null;
        }

        const toSquare = gameMove.to;
        const rank = parseInt(toSquare[1]);
        const file = toSquare[0];

        // The captured pawn is on the same file but different rank
        if (gameMove.color === 'w') {
            // White captures black pawn one rank below
            return file + (rank - 1);
        } else {
            // Black captures white pawn one rank above
            return file + (rank + 1);
        }
    }

    /**
     * Clears the moves cache
     */
    clearCache() {
        this._movesCache.clear();
        if (this._cacheTimeout) {
            clearTimeout(this._cacheTimeout);
            this._cacheTimeout = null;
        }
    }

    /**
     * Cleans up resources
     */
    destroy() {
        this.clearCache();
        this.positionService = null;
    }
}

/**
 * Service for managing chess pieces and their operations
 * @module services/PieceService
 * @since 2.0.0
 */


/**
 * Service responsible for piece management and operations
 * @class
 */
class PieceService {
    /**
     * Creates a new PieceService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Gets the path to a piece asset
     * @param {string} piece - Piece identifier (e.g., 'wK', 'bP')
     * @returns {string} Path to piece asset
     * @throws {ValidationError} When piecesPath configuration is invalid
     */
    getPiecePath(piece) {
        const { piecesPath } = this.config;

        if (typeof piecesPath === 'string') {
            return `${piecesPath}/${piece}.svg`;
        } else if (typeof piecesPath === 'object' && piecesPath !== null) {
            return piecesPath[piece];
        } else if (typeof piecesPath === 'function') {
            return piecesPath(piece);
        } else {
            throw new ValidationError(ERROR_MESSAGES.invalid_piecesPath, 'piecesPath', piecesPath);
        }
    }

    /**
     * Converts various piece formats to a Piece instance
     * @param {string|Piece} piece - Piece in various formats
     * @returns {Piece} Piece instance
     * @throws {PieceError} When piece format is invalid
     */
    convertPiece(piece) {
        if (piece instanceof Piece) {
            return piece;
        }

        if (typeof piece === 'string' && piece.length === 2) {
            const [first, second] = piece.split('');
            let type, color;

            // Check format: [type][color] (e.g., 'pw')
            if (PIECE_TYPES.includes(first.toLowerCase()) && PIECE_COLORS.includes(second)) {
                type = first.toLowerCase();
                color = second;
            }
            // Check format: [color][type] (e.g., 'wP')
            else if (PIECE_COLORS.includes(first) && PIECE_TYPES.includes(second.toLowerCase())) {
                color = first;
                type = second.toLowerCase();
            } else {
                throw new PieceError(ERROR_MESSAGES.invalid_piece + piece, piece);
            }

            const piecePath = this.getPiecePath(type + color);
            return new Piece(color, type, piecePath);
        }

        throw new PieceError(ERROR_MESSAGES.invalid_piece + piece, piece);
    }

    /**
     * Adds a piece to a square with optional fade-in animation
     * @param {Square} square - Target square (oggetto)
     * @param {Piece} piece - Piece to add (oggetto)
     * @param {boolean} [fade=true] - Whether to fade in the piece
     * @param {Function} dragFunction - Function to handle drag events
     * @param {Function} [callback] - Callback when animation completes
     */
    addPieceOnSquare(square, piece, fade = true, dragFunction, callback) {
        if (!square || !piece) throw new Error('addPieceOnSquare richiede oggetti Square e Piece');
        console.debug(`[PieceService] addPieceOnSquare: ${piece.id} to ${square.id}`);
        square.putPiece(piece);

        // Imposta sempre il drag (touch e mouse)
        if (dragFunction) {
            piece.setDrag(dragFunction(square, piece));
        }
        // Forza il drag touch se manca (debug/robustezza)
        if (!piece.element.ontouchstart) {
            piece.element.ontouchstart = dragFunction ? dragFunction(square, piece) : () => { };
            console.debug(`[PieceService] Forzato ontouchstart su ${piece.id}`);
        }

        if (fade && this.config.fadeTime > 0) {
            piece.fadeIn(
                this.config.fadeTime,
                this.config.fadeAnimation,
                this._getTransitionTimingFunction(),
                callback
            );
        } else {
            if (callback) callback();
        }

        piece.visible();
    }

    /**
     * Rimuove un pezzo da una casella
     * @param {Square} square - Oggetto Square
     * @param {boolean} [fade=true]
     * @param {Function} [callback]
     * @returns {Piece} Il pezzo rimosso
     */
    removePieceFromSquare(square, fade = true, callback) {
        if (!square) throw new Error('removePieceFromSquare richiede oggetto Square');
        console.debug(`[PieceService] removePieceFromSquare: ${square.id}`);
        square.check();

        const piece = square.piece;
        if (!piece) {
            if (callback) callback();
            throw new PieceError(ERROR_MESSAGES.square_no_piece, null, square.getId());
        }

        if (fade && this.config.fadeTime > 0) {
            piece.fadeOut(
                this.config.fadeTime,
                this.config.fadeAnimation,
                this._getTransitionTimingFunction(),
                callback
            );
        } else {
            if (callback) callback();
        }

        square.removePiece();
        return piece;
    }

    /**
     * Moves a piece to a new position with animation
     * @param {Piece} piece - Piece to move
     * @param {Square} targetSquare - Target square
     * @param {number} duration - Animation duration
     * @param {Function} [callback] - Callback function when animation completes
     */
    movePiece(piece, targetSquare, duration, callback) {
        console.debug(`[PieceService] movePiece: ${piece.id} to ${targetSquare.id}`);
        if (!piece || !piece.element) {
            console.warn(`[PieceService] movePiece: piece or element is null, skipping animation`);
            if (callback) callback();
            return;
        }

        piece.translate(
            targetSquare,
            duration,
            this._getTransitionTimingFunction(),
            this.config.moveAnimation,
            callback
        );
    }

    /**
     * Handles piece translation with optional capture
     * @param {Move} move - Move object containing from/to squares and piece
     * @param {boolean} removeTarget - Whether to remove piece from target square
     * @param {boolean} animate - Whether to animate the move
     * @param {Function} [dragFunction] - Function to create drag handlers
     * @param {Function} [callback] - Callback function when complete
     */
    translatePiece(move, removeTarget, animate, dragFunction = null, callback = null) {
        console.debug(`[PieceService] translatePiece: ${move.piece.id} from ${move.from.id} to ${move.to.id}`);
        if (!move.piece) {
            console.warn('PieceService.translatePiece: move.piece is null, skipping translation');
            if (callback) callback();
            return;
        }

        if (removeTarget) {
            // Deselect the captured piece before removing it
            move.to.deselect();
            this.removePieceFromSquare(move.to, false);
        }

        const changeSquareCallback = () => {
            // Check if piece still exists and is on the source square
            if (move.from.piece === move.piece) {
                move.from.removePiece(true); // Preserve the piece when moving
            }

            // Only put piece if destination square doesn't already have it
            if (move.to.piece !== move.piece) {
                move.to.putPiece(move.piece);

                // Re-attach drag handler if provided
                if (dragFunction && this.config.draggable && move.piece.element) {
                    move.piece.setDrag(dragFunction(move.to, move.piece));
                }
            }

            if (callback) callback();
        };

        // Check if piece is currently being dragged
        const isDragging = move.piece.element && move.piece.element.classList.contains('dragging');

        if (isDragging) {
            // If piece is being dragged, don't animate - just move it immediately
            // The piece is already visually in the correct position from the drag
            changeSquareCallback();
        } else {
            // Normal animation
            const duration = animate ? this.config.moveTime : 0;
            this.movePiece(move.piece, move.to, duration, changeSquareCallback);
        }
    }

    /**
     * Snaps a piece back to its original position
     * @param {Square} square - Square containing the piece
     * @param {boolean} [animate=true] - Whether to animate the snapback
     */
    snapbackPiece(square, animate = true) {
        if (!square || !square.piece) {
            return;
        }
        const piece = square.piece;
        const duration = animate ? this.config.snapbackTime : 0;
        console.debug(`[PieceService] snapbackPiece: ${piece.id} on ${square.id}`);
        piece.translate(
            square,
            duration,
            this._getTransitionTimingFunction(),
            this.config.snapbackAnimation
        );
    }

    /**
     * Centers a piece in its square with animation (after successful drop)
     * @param {Square} square - Square containing the piece to center
     * @param {boolean} animate - Whether to animate the centering
     */
    centerPiece(square, animate = true) {
        if (!square || !square.piece) {
            return;
        }
        const piece = square.piece;
        const duration = animate ? this.config.dropCenterTime : 0;
        console.debug(`[PieceService] centerPiece: ${piece.id} on ${square.id}`);
        piece.translate(
            square,
            duration,
            this._getTransitionTimingFunction(),
            this.config.dropCenterAnimation,
            () => {
                // After animation, reset all drag-related styles
                if (!piece.element) return;
                piece.element.style.position = '';
                piece.element.style.left = '';
                piece.element.style.top = '';
                piece.element.style.transform = '';
                piece.element.style.zIndex = '';
            }
        );
    }

    /**
     * Gets the transition timing function for animations
     * @private
     * @returns {Function} Timing function
     */
    _getTransitionTimingFunction() {
        return (elapsed, duration, type = 'ease') => {
            const x = elapsed / duration;

            switch (type) {
                case 'linear':
                    return x;
                case 'ease':
                    return (x ** 2) * (3 - 2 * x);
                case 'ease-in':
                    return x ** 2;
                case 'ease-out':
                    return -1 * (x - 1) ** 2 + 1;
                case 'ease-in-out':
                    return (x < 0.5) ? 2 * x ** 2 : 4 * x - 2 * x ** 2 - 1;
                default:
                    return x;
            }
        };
    }

    /**
     * Cleans up resources
     */
    destroy() {
        // Cleanup any cached pieces or references
    }
}

/**
 * @license
 * Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
const WHITE = 'w';
const BLACK = 'b';
const PAWN = 'p';
const KNIGHT = 'n';
const BISHOP = 'b';
const ROOK = 'r';
const QUEEN = 'q';
const KING = 'k';
const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
class Move {
    color;
    from;
    to;
    piece;
    captured;
    promotion;
    /**
     * @deprecated This field is deprecated and will be removed in version 2.0.0.
     * Please use move descriptor functions instead: `isCapture`, `isPromotion`,
     * `isEnPassant`, `isKingsideCastle`, `isQueensideCastle`, `isCastle`, and
     * `isBigPawn`
     */
    flags;
    san;
    lan;
    before;
    after;
    constructor(chess, internal) {
        const { color, piece, from, to, flags, captured, promotion } = internal;
        const fromAlgebraic = algebraic(from);
        const toAlgebraic = algebraic(to);
        this.color = color;
        this.piece = piece;
        this.from = fromAlgebraic;
        this.to = toAlgebraic;
        /*
         * HACK: The chess['_method']() calls below invoke private methods in the
         * Chess class to generate SAN and FEN. It's a bit of a hack, but makes the
         * code cleaner elsewhere.
         */
        this.san = chess['_moveToSan'](internal, chess['_moves']({ legal: true }));
        this.lan = fromAlgebraic + toAlgebraic;
        this.before = chess.fen();
        // Generate the FEN for the 'after' key
        chess['_makeMove'](internal);
        this.after = chess.fen();
        chess['_undoMove']();
        // Build the text representation of the move flags
        this.flags = '';
        for (const flag in BITS) {
            if (BITS[flag] & flags) {
                this.flags += FLAGS[flag];
            }
        }
        if (captured) {
            this.captured = captured;
        }
        if (promotion) {
            this.promotion = promotion;
            this.lan += promotion;
        }
    }
    isCapture() {
        return this.flags.indexOf(FLAGS['CAPTURE']) > -1;
    }
    isPromotion() {
        return this.flags.indexOf(FLAGS['PROMOTION']) > -1;
    }
    isEnPassant() {
        return this.flags.indexOf(FLAGS['EP_CAPTURE']) > -1;
    }
    isKingsideCastle() {
        return this.flags.indexOf(FLAGS['KSIDE_CASTLE']) > -1;
    }
    isQueensideCastle() {
        return this.flags.indexOf(FLAGS['QSIDE_CASTLE']) > -1;
    }
    isBigPawn() {
        return this.flags.indexOf(FLAGS['BIG_PAWN']) > -1;
    }
}
const EMPTY = -1;
const FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q',
};
const BITS = {
    NORMAL: 1,
    CAPTURE: 2,
    BIG_PAWN: 4,
    EP_CAPTURE: 8,
    PROMOTION: 16,
    KSIDE_CASTLE: 32,
    QSIDE_CASTLE: 64,
};
/*
 * NOTES ABOUT 0x88 MOVE GENERATION ALGORITHM
 * ----------------------------------------------------------------------------
 * From https://github.com/jhlywa/chess.js/issues/230
 *
 * A lot of people are confused when they first see the internal representation
 * of chess.js. It uses the 0x88 Move Generation Algorithm which internally
 * stores the board as an 8x16 array. This is purely for efficiency but has a
 * couple of interesting benefits:
 *
 * 1. 0x88 offers a very inexpensive "off the board" check. Bitwise AND (&) any
 *    square with 0x88, if the result is non-zero then the square is off the
 *    board. For example, assuming a knight square A8 (0 in 0x88 notation),
 *    there are 8 possible directions in which the knight can move. These
 *    directions are relative to the 8x16 board and are stored in the
 *    PIECE_OFFSETS map. One possible move is A8 - 18 (up one square, and two
 *    squares to the left - which is off the board). 0 - 18 = -18 & 0x88 = 0x88
 *    (because of two-complement representation of -18). The non-zero result
 *    means the square is off the board and the move is illegal. Take the
 *    opposite move (from A8 to C7), 0 + 18 = 18 & 0x88 = 0. A result of zero
 *    means the square is on the board.
 *
 * 2. The relative distance (or difference) between two squares on a 8x16 board
 *    is unique and can be used to inexpensively determine if a piece on a
 *    square can attack any other arbitrary square. For example, let's see if a
 *    pawn on E7 can attack E2. The difference between E7 (20) - E2 (100) is
 *    -80. We add 119 to make the ATTACKS array index non-negative (because the
 *    worst case difference is A8 - H1 = -119). The ATTACKS array contains a
 *    bitmask of pieces that can attack from that distance and direction.
 *    ATTACKS[-80 + 119=39] gives us 24 or 0b11000 in binary. Look at the
 *    PIECE_MASKS map to determine the mask for a given piece type. In our pawn
 *    example, we would check to see if 24 & 0x1 is non-zero, which it is
 *    not. So, naturally, a pawn on E7 can't attack a piece on E2. However, a
 *    rook can since 24 & 0x8 is non-zero. The only thing left to check is that
 *    there are no blocking pieces between E7 and E2. That's where the RAYS
 *    array comes in. It provides an offset (in this case 16) to add to E7 (20)
 *    to check for blocking pieces. E7 (20) + 16 = E6 (36) + 16 = E5 (52) etc.
 */
// prettier-ignore
// eslint-disable-next-line
const Ox88 = {
    a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
    a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
    a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
    a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
    a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
    a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
    a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};
const PAWN_OFFSETS = {
    b: [16, 32, 17, 15],
    w: [-16, -32, -17, -15],
};
const PIECE_OFFSETS = {
    n: [-18, -33, -31, -14, 18, 33, 31, 14],
    b: [-17, -15, 17, 15],
    r: [-16, 1, 16, -1],
    q: [-17, -16, -15, 1, 17, 16, 15, -1],
    k: [-17, -16, -15, 1, 17, 16, 15, -1],
};
// prettier-ignore
const ATTACKS = [
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0,
    0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
    0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
    0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
    0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20
];
// prettier-ignore
const RAYS = [
    17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0,
    0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0,
    0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0,
    0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0,
    0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0,
    0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
    0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
    0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
    0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
    -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
];
const PIECE_MASKS = { p: 0x1, n: 0x2, b: 0x4, r: 0x8, q: 0x10, k: 0x20 };
const SYMBOLS = 'pnbrqkPNBRQK';
const PROMOTIONS = [KNIGHT, BISHOP, ROOK, QUEEN];
const RANK_1 = 7;
const RANK_2 = 6;
/*
 * const RANK_3 = 5
 * const RANK_4 = 4
 * const RANK_5 = 3
 * const RANK_6 = 2
 */
const RANK_7 = 1;
const RANK_8 = 0;
const SIDES = {
    [KING]: BITS.KSIDE_CASTLE,
    [QUEEN]: BITS.QSIDE_CASTLE,
};
const ROOKS = {
    w: [
        { square: Ox88.a1, flag: BITS.QSIDE_CASTLE },
        { square: Ox88.h1, flag: BITS.KSIDE_CASTLE },
    ],
    b: [
        { square: Ox88.a8, flag: BITS.QSIDE_CASTLE },
        { square: Ox88.h8, flag: BITS.KSIDE_CASTLE },
    ],
};
const SECOND_RANK = { b: RANK_7, w: RANK_2 };
const TERMINATION_MARKERS = ['1-0', '0-1', '1/2-1/2', '*'];
// Extracts the zero-based rank of an 0x88 square.
function rank(square) {
    return square >> 4;
}
// Extracts the zero-based file of an 0x88 square.
function file(square) {
    return square & 0xf;
}
function isDigit(c) {
    return '0123456789'.indexOf(c) !== -1;
}
// Converts a 0x88 square to algebraic notation.
function algebraic(square) {
    const f = file(square);
    const r = rank(square);
    return ('abcdefgh'.substring(f, f + 1) +
        '87654321'.substring(r, r + 1));
}
function swapColor(color) {
    return color === WHITE ? BLACK : WHITE;
}
function validateFen(fen) {
    // 1st criterion: 6 space-seperated fields?
    const tokens = fen.split(/\s+/);
    if (tokens.length !== 6) {
        return {
            ok: false,
            error: 'Invalid FEN: must contain six space-delimited fields',
        };
    }
    // 2nd criterion: move number field is a integer value > 0?
    const moveNumber = parseInt(tokens[5], 10);
    if (isNaN(moveNumber) || moveNumber <= 0) {
        return {
            ok: false,
            error: 'Invalid FEN: move number must be a positive integer',
        };
    }
    // 3rd criterion: half move counter is an integer >= 0?
    const halfMoves = parseInt(tokens[4], 10);
    if (isNaN(halfMoves) || halfMoves < 0) {
        return {
            ok: false,
            error: 'Invalid FEN: half move counter number must be a non-negative integer',
        };
    }
    // 4th criterion: 4th field is a valid e.p.-string?
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
        return { ok: false, error: 'Invalid FEN: en-passant square is invalid' };
    }
    // 5th criterion: 3th field is a valid castle-string?
    if (/[^kKqQ-]/.test(tokens[2])) {
        return { ok: false, error: 'Invalid FEN: castling availability is invalid' };
    }
    // 6th criterion: 2nd field is "w" (white) or "b" (black)?
    if (!/^(w|b)$/.test(tokens[1])) {
        return { ok: false, error: 'Invalid FEN: side-to-move is invalid' };
    }
    // 7th criterion: 1st field contains 8 rows?
    const rows = tokens[0].split('/');
    if (rows.length !== 8) {
        return {
            ok: false,
            error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows",
        };
    }
    // 8th criterion: every row is valid?
    for (let i = 0; i < rows.length; i++) {
        // check for right sum of fields AND not two numbers in succession
        let sumFields = 0;
        let previousWasNumber = false;
        for (let k = 0; k < rows[i].length; k++) {
            if (isDigit(rows[i][k])) {
                if (previousWasNumber) {
                    return {
                        ok: false,
                        error: 'Invalid FEN: piece data is invalid (consecutive number)',
                    };
                }
                sumFields += parseInt(rows[i][k], 10);
                previousWasNumber = true;
            }
            else {
                if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                    return {
                        ok: false,
                        error: 'Invalid FEN: piece data is invalid (invalid piece)',
                    };
                }
                sumFields += 1;
                previousWasNumber = false;
            }
        }
        if (sumFields !== 8) {
            return {
                ok: false,
                error: 'Invalid FEN: piece data is invalid (too many squares in rank)',
            };
        }
    }
    // 9th criterion: is en-passant square legal?
    if ((tokens[3][1] == '3' && tokens[1] == 'w') ||
        (tokens[3][1] == '6' && tokens[1] == 'b')) {
        return { ok: false, error: 'Invalid FEN: illegal en-passant square' };
    }
    // 10th criterion: does chess position contain exact two kings?
    const kings = [
        { color: 'white', regex: /K/g },
        { color: 'black', regex: /k/g },
    ];
    for (const { color, regex } of kings) {
        if (!regex.test(tokens[0])) {
            return { ok: false, error: `Invalid FEN: missing ${color} king` };
        }
        if ((tokens[0].match(regex) || []).length > 1) {
            return { ok: false, error: `Invalid FEN: too many ${color} kings` };
        }
    }
    // 11th criterion: are any pawns on the first or eighth rows?
    if (Array.from(rows[0] + rows[7]).some((char) => char.toUpperCase() === 'P')) {
        return {
            ok: false,
            error: 'Invalid FEN: some pawns are on the edge rows',
        };
    }
    return { ok: true };
}
// this function is used to uniquely identify ambiguous moves
function getDisambiguator(move, moves) {
    const from = move.from;
    const to = move.to;
    const piece = move.piece;
    let ambiguities = 0;
    let sameRank = 0;
    let sameFile = 0;
    for (let i = 0, len = moves.length; i < len; i++) {
        const ambigFrom = moves[i].from;
        const ambigTo = moves[i].to;
        const ambigPiece = moves[i].piece;
        /*
         * if a move of the same piece type ends on the same to square, we'll need
         * to add a disambiguator to the algebraic notation
         */
        if (piece === ambigPiece && from !== ambigFrom && to === ambigTo) {
            ambiguities++;
            if (rank(from) === rank(ambigFrom)) {
                sameRank++;
            }
            if (file(from) === file(ambigFrom)) {
                sameFile++;
            }
        }
    }
    if (ambiguities > 0) {
        if (sameRank > 0 && sameFile > 0) {
            /*
             * if there exists a similar moving piece on the same rank and file as
             * the move in question, use the square as the disambiguator
             */
            return algebraic(from);
        }
        else if (sameFile > 0) {
            /*
             * if the moving piece rests on the same file, use the rank symbol as the
             * disambiguator
             */
            return algebraic(from).charAt(1);
        }
        else {
            // else use the file symbol
            return algebraic(from).charAt(0);
        }
    }
    return '';
}
function addMove(moves, color, from, to, piece, captured = undefined, flags = BITS.NORMAL) {
    const r = rank(to);
    if (piece === PAWN && (r === RANK_1 || r === RANK_8)) {
        for (let i = 0; i < PROMOTIONS.length; i++) {
            const promotion = PROMOTIONS[i];
            moves.push({
                color,
                from,
                to,
                piece,
                captured,
                promotion,
                flags: flags | BITS.PROMOTION,
            });
        }
    }
    else {
        moves.push({
            color,
            from,
            to,
            piece,
            captured,
            flags,
        });
    }
}
function inferPieceType(san) {
    let pieceType = san.charAt(0);
    if (pieceType >= 'a' && pieceType <= 'h') {
        const matches = san.match(/[a-h]\d.*[a-h]\d/);
        if (matches) {
            return undefined;
        }
        return PAWN;
    }
    pieceType = pieceType.toLowerCase();
    if (pieceType === 'o') {
        return KING;
    }
    return pieceType;
}
// parses all of the decorators out of a SAN string
function strippedSan(move) {
    return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
}
function trimFen(fen) {
    /*
     * remove last two fields in FEN string as they're not needed when checking
     * for repetition
     */
    return fen.split(' ').slice(0, 4).join(' ');
}
class Chess {
    _board = new Array(128);
    _turn = WHITE;
    _header = {};
    _kings = { w: EMPTY, b: EMPTY };
    _epSquare = -1;
    _halfMoves = 0;
    _moveNumber = 0;
    _history = [];
    _comments = {};
    _castling = { w: 0, b: 0 };
    // tracks number of times a position has been seen for repetition checking
    _positionCount = {};
    constructor(fen = DEFAULT_POSITION) {
        this.load(fen);
    }
    clear({ preserveHeaders = false } = {}) {
        this._board = new Array(128);
        this._kings = { w: EMPTY, b: EMPTY };
        this._turn = WHITE;
        this._castling = { w: 0, b: 0 };
        this._epSquare = EMPTY;
        this._halfMoves = 0;
        this._moveNumber = 1;
        this._history = [];
        this._comments = {};
        this._header = preserveHeaders ? this._header : {};
        this._positionCount = {};
        /*
         * Delete the SetUp and FEN headers (if preserved), the board is empty and
         * these headers don't make sense in this state. They'll get added later
         * via .load() or .put()
         */
        delete this._header['SetUp'];
        delete this._header['FEN'];
    }
    load(fen, { skipValidation = false, preserveHeaders = false } = {}) {
        let tokens = fen.split(/\s+/);
        // append commonly omitted fen tokens
        if (tokens.length >= 2 && tokens.length < 6) {
            const adjustments = ['-', '-', '0', '1'];
            fen = tokens.concat(adjustments.slice(-(6 - tokens.length))).join(' ');
        }
        tokens = fen.split(/\s+/);
        if (!skipValidation) {
            const { ok, error } = validateFen(fen);
            if (!ok) {
                throw new Error(error);
            }
        }
        const position = tokens[0];
        let square = 0;
        this.clear({ preserveHeaders });
        for (let i = 0; i < position.length; i++) {
            const piece = position.charAt(i);
            if (piece === '/') {
                square += 8;
            }
            else if (isDigit(piece)) {
                square += parseInt(piece, 10);
            }
            else {
                const color = piece < 'a' ? WHITE : BLACK;
                this._put({ type: piece.toLowerCase(), color }, algebraic(square));
                square++;
            }
        }
        this._turn = tokens[1];
        if (tokens[2].indexOf('K') > -1) {
            this._castling.w |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf('Q') > -1) {
            this._castling.w |= BITS.QSIDE_CASTLE;
        }
        if (tokens[2].indexOf('k') > -1) {
            this._castling.b |= BITS.KSIDE_CASTLE;
        }
        if (tokens[2].indexOf('q') > -1) {
            this._castling.b |= BITS.QSIDE_CASTLE;
        }
        this._epSquare = tokens[3] === '-' ? EMPTY : Ox88[tokens[3]];
        this._halfMoves = parseInt(tokens[4], 10);
        this._moveNumber = parseInt(tokens[5], 10);
        this._updateSetup(fen);
        this._incPositionCount(fen);
    }
    fen() {
        let empty = 0;
        let fen = '';
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            if (this._board[i]) {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                const { color, type: piece } = this._board[i];
                fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
            }
            else {
                empty++;
            }
            if ((i + 1) & 0x88) {
                if (empty > 0) {
                    fen += empty;
                }
                if (i !== Ox88.h1) {
                    fen += '/';
                }
                empty = 0;
                i += 8;
            }
        }
        let castling = '';
        if (this._castling[WHITE] & BITS.KSIDE_CASTLE) {
            castling += 'K';
        }
        if (this._castling[WHITE] & BITS.QSIDE_CASTLE) {
            castling += 'Q';
        }
        if (this._castling[BLACK] & BITS.KSIDE_CASTLE) {
            castling += 'k';
        }
        if (this._castling[BLACK] & BITS.QSIDE_CASTLE) {
            castling += 'q';
        }
        // do we have an empty castling flag?
        castling = castling || '-';
        let epSquare = '-';
        /*
         * only print the ep square if en passant is a valid move (pawn is present
         * and ep capture is not pinned)
         */
        if (this._epSquare !== EMPTY) {
            const bigPawnSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
            const squares = [bigPawnSquare + 1, bigPawnSquare - 1];
            for (const square of squares) {
                // is the square off the board?
                if (square & 0x88) {
                    continue;
                }
                const color = this._turn;
                // is there a pawn that can capture the epSquare?
                if (this._board[square]?.color === color &&
                    this._board[square]?.type === PAWN) {
                    // if the pawn makes an ep capture, does it leave it's king in check?
                    this._makeMove({
                        color,
                        from: square,
                        to: this._epSquare,
                        piece: PAWN,
                        captured: PAWN,
                        flags: BITS.EP_CAPTURE,
                    });
                    const isLegal = !this._isKingAttacked(color);
                    this._undoMove();
                    // if ep is legal, break and set the ep square in the FEN output
                    if (isLegal) {
                        epSquare = algebraic(this._epSquare);
                        break;
                    }
                }
            }
        }
        return [
            fen,
            this._turn,
            castling,
            epSquare,
            this._halfMoves,
            this._moveNumber,
        ].join(' ');
    }
    /*
     * Called when the initial board setup is changed with put() or remove().
     * modifies the SetUp and FEN properties of the header object. If the FEN
     * is equal to the default position, the SetUp and FEN are deleted the setup
     * is only updated if history.length is zero, ie moves haven't been made.
     */
    _updateSetup(fen) {
        if (this._history.length > 0)
            return;
        if (fen !== DEFAULT_POSITION) {
            this._header['SetUp'] = '1';
            this._header['FEN'] = fen;
        }
        else {
            delete this._header['SetUp'];
            delete this._header['FEN'];
        }
    }
    reset() {
        this.load(DEFAULT_POSITION);
    }
    get(square) {
        return this._board[Ox88[square]];
    }
    put({ type, color }, square) {
        if (this._put({ type, color }, square)) {
            this._updateCastlingRights();
            this._updateEnPassantSquare();
            this._updateSetup(this.fen());
            return true;
        }
        return false;
    }
    _put({ type, color }, square) {
        // check for piece
        if (SYMBOLS.indexOf(type.toLowerCase()) === -1) {
            return false;
        }
        // check for valid square
        if (!(square in Ox88)) {
            return false;
        }
        const sq = Ox88[square];
        // don't let the user place more than one king
        if (type == KING &&
            !(this._kings[color] == EMPTY || this._kings[color] == sq)) {
            return false;
        }
        const currentPieceOnSquare = this._board[sq];
        // if one of the kings will be replaced by the piece from args, set the `_kings` respective entry to `EMPTY`
        if (currentPieceOnSquare && currentPieceOnSquare.type === KING) {
            this._kings[currentPieceOnSquare.color] = EMPTY;
        }
        this._board[sq] = { type: type, color: color };
        if (type === KING) {
            this._kings[color] = sq;
        }
        return true;
    }
    remove(square) {
        const piece = this.get(square);
        delete this._board[Ox88[square]];
        if (piece && piece.type === KING) {
            this._kings[piece.color] = EMPTY;
        }
        this._updateCastlingRights();
        this._updateEnPassantSquare();
        this._updateSetup(this.fen());
        return piece;
    }
    _updateCastlingRights() {
        const whiteKingInPlace = this._board[Ox88.e1]?.type === KING &&
            this._board[Ox88.e1]?.color === WHITE;
        const blackKingInPlace = this._board[Ox88.e8]?.type === KING &&
            this._board[Ox88.e8]?.color === BLACK;
        if (!whiteKingInPlace ||
            this._board[Ox88.a1]?.type !== ROOK ||
            this._board[Ox88.a1]?.color !== WHITE) {
            this._castling.w &= -65;
        }
        if (!whiteKingInPlace ||
            this._board[Ox88.h1]?.type !== ROOK ||
            this._board[Ox88.h1]?.color !== WHITE) {
            this._castling.w &= -33;
        }
        if (!blackKingInPlace ||
            this._board[Ox88.a8]?.type !== ROOK ||
            this._board[Ox88.a8]?.color !== BLACK) {
            this._castling.b &= -65;
        }
        if (!blackKingInPlace ||
            this._board[Ox88.h8]?.type !== ROOK ||
            this._board[Ox88.h8]?.color !== BLACK) {
            this._castling.b &= -33;
        }
    }
    _updateEnPassantSquare() {
        if (this._epSquare === EMPTY) {
            return;
        }
        const startSquare = this._epSquare + (this._turn === WHITE ? -16 : 16);
        const currentSquare = this._epSquare + (this._turn === WHITE ? 16 : -16);
        const attackers = [currentSquare + 1, currentSquare - 1];
        if (this._board[startSquare] !== null ||
            this._board[this._epSquare] !== null ||
            this._board[currentSquare]?.color !== swapColor(this._turn) ||
            this._board[currentSquare]?.type !== PAWN) {
            this._epSquare = EMPTY;
            return;
        }
        const canCapture = (square) => !(square & 0x88) &&
            this._board[square]?.color === this._turn &&
            this._board[square]?.type === PAWN;
        if (!attackers.some(canCapture)) {
            this._epSquare = EMPTY;
        }
    }
    _attacked(color, square, verbose) {
        const attackers = [];
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            // did we run off the end of the board
            if (i & 0x88) {
                i += 7;
                continue;
            }
            // if empty square or wrong color
            if (this._board[i] === undefined || this._board[i].color !== color) {
                continue;
            }
            const piece = this._board[i];
            const difference = i - square;
            // skip - to/from square are the same
            if (difference === 0) {
                continue;
            }
            const index = difference + 119;
            if (ATTACKS[index] & PIECE_MASKS[piece.type]) {
                if (piece.type === PAWN) {
                    if ((difference > 0 && piece.color === WHITE) ||
                        (difference <= 0 && piece.color === BLACK)) {
                        if (!verbose) {
                            return true;
                        }
                        else {
                            attackers.push(algebraic(i));
                        }
                    }
                    continue;
                }
                // if the piece is a knight or a king
                if (piece.type === 'n' || piece.type === 'k') {
                    if (!verbose) {
                        return true;
                    }
                    else {
                        attackers.push(algebraic(i));
                        continue;
                    }
                }
                const offset = RAYS[index];
                let j = i + offset;
                let blocked = false;
                while (j !== square) {
                    if (this._board[j] != null) {
                        blocked = true;
                        break;
                    }
                    j += offset;
                }
                if (!blocked) {
                    if (!verbose) {
                        return true;
                    }
                    else {
                        attackers.push(algebraic(i));
                        continue;
                    }
                }
            }
        }
        if (verbose) {
            return attackers;
        }
        else {
            return false;
        }
    }
    attackers(square, attackedBy) {
        if (!attackedBy) {
            return this._attacked(this._turn, Ox88[square], true);
        }
        else {
            return this._attacked(attackedBy, Ox88[square], true);
        }
    }
    _isKingAttacked(color) {
        const square = this._kings[color];
        return square === -1 ? false : this._attacked(swapColor(color), square);
    }
    isAttacked(square, attackedBy) {
        return this._attacked(attackedBy, Ox88[square]);
    }
    isCheck() {
        return this._isKingAttacked(this._turn);
    }
    inCheck() {
        return this.isCheck();
    }
    isCheckmate() {
        return this.isCheck() && this._moves().length === 0;
    }
    isStalemate() {
        return !this.isCheck() && this._moves().length === 0;
    }
    isInsufficientMaterial() {
        /*
         * k.b. vs k.b. (of opposite colors) with mate in 1:
         * 8/8/8/8/1b6/8/B1k5/K7 b - - 0 1
         *
         * k.b. vs k.n. with mate in 1:
         * 8/8/8/8/1n6/8/B7/K1k5 b - - 2 1
         */
        const pieces = {
            b: 0,
            n: 0,
            r: 0,
            q: 0,
            k: 0,
            p: 0,
        };
        const bishops = [];
        let numPieces = 0;
        let squareColor = 0;
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            squareColor = (squareColor + 1) % 2;
            if (i & 0x88) {
                i += 7;
                continue;
            }
            const piece = this._board[i];
            if (piece) {
                pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
                if (piece.type === BISHOP) {
                    bishops.push(squareColor);
                }
                numPieces++;
            }
        }
        // k vs. k
        if (numPieces === 2) {
            return true;
        }
        else if (
            // k vs. kn .... or .... k vs. kb
            numPieces === 3 &&
            (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)) {
            return true;
        }
        else if (numPieces === pieces[BISHOP] + 2) {
            // kb vs. kb where any number of bishops are all on the same color
            let sum = 0;
            const len = bishops.length;
            for (let i = 0; i < len; i++) {
                sum += bishops[i];
            }
            if (sum === 0 || sum === len) {
                return true;
            }
        }
        return false;
    }
    isThreefoldRepetition() {
        return this._getPositionCount(this.fen()) >= 3;
    }
    isDrawByFiftyMoves() {
        return this._halfMoves >= 100; // 50 moves per side = 100 half moves
    }
    isDraw() {
        return (this.isDrawByFiftyMoves() ||
            this.isStalemate() ||
            this.isInsufficientMaterial() ||
            this.isThreefoldRepetition());
    }
    isGameOver() {
        return this.isCheckmate() || this.isStalemate() || this.isDraw();
    }
    moves({ verbose = false, square = undefined, piece = undefined, } = {}) {
        const moves = this._moves({ square, piece });
        if (verbose) {
            return moves.map((move) => new Move(this, move));
        }
        else {
            return moves.map((move) => this._moveToSan(move, moves));
        }
    }
    _moves({ legal = true, piece = undefined, square = undefined, } = {}) {
        const forSquare = square ? square.toLowerCase() : undefined;
        const forPiece = piece?.toLowerCase();
        const moves = [];
        const us = this._turn;
        const them = swapColor(us);
        let firstSquare = Ox88.a8;
        let lastSquare = Ox88.h1;
        let singleSquare = false;
        // are we generating moves for a single square?
        if (forSquare) {
            // illegal square, return empty moves
            if (!(forSquare in Ox88)) {
                return [];
            }
            else {
                firstSquare = lastSquare = Ox88[forSquare];
                singleSquare = true;
            }
        }
        for (let from = firstSquare; from <= lastSquare; from++) {
            // did we run off the end of the board
            if (from & 0x88) {
                from += 7;
                continue;
            }
            // empty square or opponent, skip
            if (!this._board[from] || this._board[from].color === them) {
                continue;
            }
            const { type } = this._board[from];
            let to;
            if (type === PAWN) {
                if (forPiece && forPiece !== type)
                    continue;
                // single square, non-capturing
                to = from + PAWN_OFFSETS[us][0];
                if (!this._board[to]) {
                    addMove(moves, us, from, to, PAWN);
                    // double square
                    to = from + PAWN_OFFSETS[us][1];
                    if (SECOND_RANK[us] === rank(from) && !this._board[to]) {
                        addMove(moves, us, from, to, PAWN, undefined, BITS.BIG_PAWN);
                    }
                }
                // pawn captures
                for (let j = 2; j < 4; j++) {
                    to = from + PAWN_OFFSETS[us][j];
                    if (to & 0x88)
                        continue;
                    if (this._board[to]?.color === them) {
                        addMove(moves, us, from, to, PAWN, this._board[to].type, BITS.CAPTURE);
                    }
                    else if (to === this._epSquare) {
                        addMove(moves, us, from, to, PAWN, PAWN, BITS.EP_CAPTURE);
                    }
                }
            }
            else {
                if (forPiece && forPiece !== type)
                    continue;
                for (let j = 0, len = PIECE_OFFSETS[type].length; j < len; j++) {
                    const offset = PIECE_OFFSETS[type][j];
                    to = from;
                    while (true) {
                        to += offset;
                        if (to & 0x88)
                            break;
                        if (!this._board[to]) {
                            addMove(moves, us, from, to, type);
                        }
                        else {
                            // own color, stop loop
                            if (this._board[to].color === us)
                                break;
                            addMove(moves, us, from, to, type, this._board[to].type, BITS.CAPTURE);
                            break;
                        }
                        /* break, if knight or king */
                        if (type === KNIGHT || type === KING)
                            break;
                    }
                }
            }
        }
        /*
         * check for castling if we're:
         *   a) generating all moves, or
         *   b) doing single square move generation on the king's square
         */
        if (forPiece === undefined || forPiece === KING) {
            if (!singleSquare || lastSquare === this._kings[us]) {
                // king-side castling
                if (this._castling[us] & BITS.KSIDE_CASTLE) {
                    const castlingFrom = this._kings[us];
                    const castlingTo = castlingFrom + 2;
                    if (!this._board[castlingFrom + 1] &&
                        !this._board[castlingTo] &&
                        !this._attacked(them, this._kings[us]) &&
                        !this._attacked(them, castlingFrom + 1) &&
                        !this._attacked(them, castlingTo)) {
                        addMove(moves, us, this._kings[us], castlingTo, KING, undefined, BITS.KSIDE_CASTLE);
                    }
                }
                // queen-side castling
                if (this._castling[us] & BITS.QSIDE_CASTLE) {
                    const castlingFrom = this._kings[us];
                    const castlingTo = castlingFrom - 2;
                    if (!this._board[castlingFrom - 1] &&
                        !this._board[castlingFrom - 2] &&
                        !this._board[castlingFrom - 3] &&
                        !this._attacked(them, this._kings[us]) &&
                        !this._attacked(them, castlingFrom - 1) &&
                        !this._attacked(them, castlingTo)) {
                        addMove(moves, us, this._kings[us], castlingTo, KING, undefined, BITS.QSIDE_CASTLE);
                    }
                }
            }
        }
        /*
         * return all pseudo-legal moves (this includes moves that allow the king
         * to be captured)
         */
        if (!legal || this._kings[us] === -1) {
            return moves;
        }
        // filter out illegal moves
        const legalMoves = [];
        for (let i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._isKingAttacked(us)) {
                legalMoves.push(moves[i]);
            }
            this._undoMove();
        }
        return legalMoves;
    }
    move(move, { strict = false } = {}) {
        /*
         * The move function can be called with in the following parameters:
         *
         * .move('Nxb7')       <- argument is a case-sensitive SAN string
         *
         * .move({ from: 'h7', <- argument is a move object
         *         to :'h8',
         *         promotion: 'q' })
         *
         *
         * An optional strict argument may be supplied to tell chess.js to
         * strictly follow the SAN specification.
         */
        let moveObj = null;
        if (typeof move === 'string') {
            moveObj = this._moveFromSan(move, strict);
        }
        else if (typeof move === 'object') {
            const moves = this._moves();
            // convert the pretty move object to an ugly move object
            for (let i = 0, len = moves.length; i < len; i++) {
                if (move.from === algebraic(moves[i].from) &&
                    move.to === algebraic(moves[i].to) &&
                    (!('promotion' in moves[i]) || move.promotion === moves[i].promotion)) {
                    moveObj = moves[i];
                    break;
                }
            }
        }
        // failed to find move
        if (!moveObj) {
            if (typeof move === 'string') {
                throw new Error(`Invalid move: ${move}`);
            }
            else {
                throw new Error(`Invalid move: ${JSON.stringify(move)}`);
            }
        }
        /*
         * need to make a copy of move because we can't generate SAN after the move
         * is made
         */
        const prettyMove = new Move(this, moveObj);
        this._makeMove(moveObj);
        this._incPositionCount(prettyMove.after);
        return prettyMove;
    }
    _push(move) {
        this._history.push({
            move,
            kings: { b: this._kings.b, w: this._kings.w },
            turn: this._turn,
            castling: { b: this._castling.b, w: this._castling.w },
            epSquare: this._epSquare,
            halfMoves: this._halfMoves,
            moveNumber: this._moveNumber,
        });
    }
    _makeMove(move) {
        const us = this._turn;
        const them = swapColor(us);
        this._push(move);
        this._board[move.to] = this._board[move.from];
        delete this._board[move.from];
        // if ep capture, remove the captured pawn
        if (move.flags & BITS.EP_CAPTURE) {
            if (this._turn === BLACK) {
                delete this._board[move.to - 16];
            }
            else {
                delete this._board[move.to + 16];
            }
        }
        // if pawn promotion, replace with new piece
        if (move.promotion) {
            this._board[move.to] = { type: move.promotion, color: us };
        }
        // if we moved the king
        if (this._board[move.to].type === KING) {
            this._kings[us] = move.to;
            // if we castled, move the rook next to the king
            if (move.flags & BITS.KSIDE_CASTLE) {
                const castlingTo = move.to - 1;
                const castlingFrom = move.to + 1;
                this._board[castlingTo] = this._board[castlingFrom];
                delete this._board[castlingFrom];
            }
            else if (move.flags & BITS.QSIDE_CASTLE) {
                const castlingTo = move.to + 1;
                const castlingFrom = move.to - 2;
                this._board[castlingTo] = this._board[castlingFrom];
                delete this._board[castlingFrom];
            }
            // turn off castling
            this._castling[us] = 0;
        }
        // turn off castling if we move a rook
        if (this._castling[us]) {
            for (let i = 0, len = ROOKS[us].length; i < len; i++) {
                if (move.from === ROOKS[us][i].square &&
                    this._castling[us] & ROOKS[us][i].flag) {
                    this._castling[us] ^= ROOKS[us][i].flag;
                    break;
                }
            }
        }
        // turn off castling if we capture a rook
        if (this._castling[them]) {
            for (let i = 0, len = ROOKS[them].length; i < len; i++) {
                if (move.to === ROOKS[them][i].square &&
                    this._castling[them] & ROOKS[them][i].flag) {
                    this._castling[them] ^= ROOKS[them][i].flag;
                    break;
                }
            }
        }
        // if big pawn move, update the en passant square
        if (move.flags & BITS.BIG_PAWN) {
            if (us === BLACK) {
                this._epSquare = move.to - 16;
            }
            else {
                this._epSquare = move.to + 16;
            }
        }
        else {
            this._epSquare = EMPTY;
        }
        // reset the 50 move counter if a pawn is moved or a piece is captured
        if (move.piece === PAWN) {
            this._halfMoves = 0;
        }
        else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
            this._halfMoves = 0;
        }
        else {
            this._halfMoves++;
        }
        if (us === BLACK) {
            this._moveNumber++;
        }
        this._turn = them;
    }
    undo() {
        const move = this._undoMove();
        if (move) {
            const prettyMove = new Move(this, move);
            this._decPositionCount(prettyMove.after);
            return prettyMove;
        }
        return null;
    }
    _undoMove() {
        const old = this._history.pop();
        if (old === undefined) {
            return null;
        }
        const move = old.move;
        this._kings = old.kings;
        this._turn = old.turn;
        this._castling = old.castling;
        this._epSquare = old.epSquare;
        this._halfMoves = old.halfMoves;
        this._moveNumber = old.moveNumber;
        const us = this._turn;
        const them = swapColor(us);
        this._board[move.from] = this._board[move.to];
        this._board[move.from].type = move.piece; // to undo any promotions
        delete this._board[move.to];
        if (move.captured) {
            if (move.flags & BITS.EP_CAPTURE) {
                // en passant capture
                let index;
                if (us === BLACK) {
                    index = move.to - 16;
                }
                else {
                    index = move.to + 16;
                }
                this._board[index] = { type: PAWN, color: them };
            }
            else {
                // regular capture
                this._board[move.to] = { type: move.captured, color: them };
            }
        }
        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
            let castlingTo, castlingFrom;
            if (move.flags & BITS.KSIDE_CASTLE) {
                castlingTo = move.to + 1;
                castlingFrom = move.to - 1;
            }
            else {
                castlingTo = move.to - 2;
                castlingFrom = move.to + 1;
            }
            this._board[castlingTo] = this._board[castlingFrom];
            delete this._board[castlingFrom];
        }
        return move;
    }
    pgn({ newline = '\n', maxWidth = 0, } = {}) {
        /*
         * using the specification from http://www.chessclub.com/help/PGN-spec
         * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
         */
        const result = [];
        let headerExists = false;
        /* add the PGN header information */
        for (const i in this._header) {
            /*
             * TODO: order of enumerated properties in header object is not
             * guaranteed, see ECMA-262 spec (section 12.6.4)
             */
            result.push('[' + i + ' "' + this._header[i] + '"]' + newline);
            headerExists = true;
        }
        if (headerExists && this._history.length) {
            result.push(newline);
        }
        const appendComment = (moveString) => {
            const comment = this._comments[this.fen()];
            if (typeof comment !== 'undefined') {
                const delimiter = moveString.length > 0 ? ' ' : '';
                moveString = `${moveString}${delimiter}{${comment}}`;
            }
            return moveString;
        };
        // pop all of history onto reversed_history
        const reversedHistory = [];
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        const moves = [];
        let moveString = '';
        // special case of a commented starting position with no moves
        if (reversedHistory.length === 0) {
            moves.push(appendComment(''));
        }
        // build the list of moves.  a move_string looks like: "3. e3 e6"
        while (reversedHistory.length > 0) {
            moveString = appendComment(moveString);
            const move = reversedHistory.pop();
            // make TypeScript stop complaining about move being undefined
            if (!move) {
                break;
            }
            // if the position started with black to move, start PGN with #. ...
            if (!this._history.length && move.color === 'b') {
                const prefix = `${this._moveNumber}. ...`;
                // is there a comment preceding the first move?
                moveString = moveString ? `${moveString} ${prefix}` : prefix;
            }
            else if (move.color === 'w') {
                // store the previous generated move_string if we have one
                if (moveString.length) {
                    moves.push(moveString);
                }
                moveString = this._moveNumber + '.';
            }
            moveString =
                moveString + ' ' + this._moveToSan(move, this._moves({ legal: true }));
            this._makeMove(move);
        }
        // are there any other leftover moves?
        if (moveString.length) {
            moves.push(appendComment(moveString));
        }
        // is there a result?
        if (typeof this._header.Result !== 'undefined') {
            moves.push(this._header.Result);
        }
        /*
         * history should be back to what it was before we started generating PGN,
         * so join together moves
         */
        if (maxWidth === 0) {
            return result.join('') + moves.join(' ');
        }
        // TODO (jah): huh?
        const strip = function () {
            if (result.length > 0 && result[result.length - 1] === ' ') {
                result.pop();
                return true;
            }
            return false;
        };
        // NB: this does not preserve comment whitespace.
        const wrapComment = function (width, move) {
            for (const token of move.split(' ')) {
                if (!token) {
                    continue;
                }
                if (width + token.length > maxWidth) {
                    while (strip()) {
                        width--;
                    }
                    result.push(newline);
                    width = 0;
                }
                result.push(token);
                width += token.length;
                result.push(' ');
                width++;
            }
            if (strip()) {
                width--;
            }
            return width;
        };
        // wrap the PGN output at max_width
        let currentWidth = 0;
        for (let i = 0; i < moves.length; i++) {
            if (currentWidth + moves[i].length > maxWidth) {
                if (moves[i].includes('{')) {
                    currentWidth = wrapComment(currentWidth, moves[i]);
                    continue;
                }
            }
            // if the current move will push past max_width
            if (currentWidth + moves[i].length > maxWidth && i !== 0) {
                // don't end the line with whitespace
                if (result[result.length - 1] === ' ') {
                    result.pop();
                }
                result.push(newline);
                currentWidth = 0;
            }
            else if (i !== 0) {
                result.push(' ');
                currentWidth++;
            }
            result.push(moves[i]);
            currentWidth += moves[i].length;
        }
        return result.join('');
    }
    /*
     * @deprecated Use `setHeader` and `getHeaders` instead.
     */
    header(...args) {
        for (let i = 0; i < args.length; i += 2) {
            if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
                this._header[args[i]] = args[i + 1];
            }
        }
        return this._header;
    }
    setHeader(key, value) {
        this._header[key] = value;
        return this._header;
    }
    removeHeader(key) {
        if (key in this._header) {
            delete this._header[key];
            return true;
        }
        return false;
    }
    getHeaders() {
        return this._header;
    }
    loadPgn(pgn, { strict = false, newlineChar = '\r?\n', } = {}) {
        function mask(str) {
            return str.replace(/\\/g, '\\');
        }
        function parsePgnHeader(header) {
            const headerObj = {};
            const headers = header.split(new RegExp(mask(newlineChar)));
            let key = '';
            let value = '';
            for (let i = 0; i < headers.length; i++) {
                const regex = /^\s*\[\s*([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;
                key = headers[i].replace(regex, '$1');
                value = headers[i].replace(regex, '$2');
                if (key.trim().length > 0) {
                    headerObj[key] = value;
                }
            }
            return headerObj;
        }
        // strip whitespace from head/tail of PGN block
        pgn = pgn.trim();
        /*
         * RegExp to split header. Takes advantage of the fact that header and movetext
         * will always have a blank line between them (ie, two newline_char's). Handles
         * case where movetext is empty by matching newlineChar until end of string is
         * matched - effectively trimming from the end extra newlineChar.
         *
         * With default newline_char, will equal:
         * /^(\[((?:\r?\n)|.)*\])((?:\s*\r?\n){2}|(?:\s*\r?\n)*$)/
         */
        const headerRegex = new RegExp('^(\\[((?:' +
            mask(newlineChar) +
            ')|.)*\\])' +
            '((?:\\s*' +
            mask(newlineChar) +
            '){2}|(?:\\s*' +
            mask(newlineChar) +
            ')*$)');
        // If no header given, begin with moves.
        const headerRegexResults = headerRegex.exec(pgn);
        const headerString = headerRegexResults
            ? headerRegexResults.length >= 2
                ? headerRegexResults[1]
                : ''
            : '';
        // Put the board in the starting position
        this.reset();
        // parse PGN header
        const headers = parsePgnHeader(headerString);
        let fen = '';
        for (const key in headers) {
            // check to see user is including fen (possibly with wrong tag case)
            if (key.toLowerCase() === 'fen') {
                fen = headers[key];
            }
            this.header(key, headers[key]);
        }
        /*
         * the permissive parser should attempt to load a fen tag, even if it's the
         * wrong case and doesn't include a corresponding [SetUp "1"] tag
         */
        if (!strict) {
            if (fen) {
                this.load(fen, { preserveHeaders: true });
            }
        }
        else {
            /*
             * strict parser - load the starting position indicated by [Setup '1']
             * and [FEN position]
             */
            if (headers['SetUp'] === '1') {
                if (!('FEN' in headers)) {
                    throw new Error('Invalid PGN: FEN tag must be supplied with SetUp tag');
                }
                // don't clear the headers when loading
                this.load(headers['FEN'], { preserveHeaders: true });
            }
        }
        /*
         * NB: the regexes below that delete move numbers, recursive annotations,
         * and numeric annotation glyphs may also match text in comments. To
         * prevent this, we transform comments by hex-encoding them in place and
         * decoding them again after the other tokens have been deleted.
         *
         * While the spec states that PGN files should be ASCII encoded, we use
         * {en,de}codeURIComponent here to support arbitrary UTF8 as a convenience
         * for modern users
         */
        function toHex(s) {
            return Array.from(s)
                .map(function (c) {
                    /*
                     * encodeURI doesn't transform most ASCII characters, so we handle
                     * these ourselves
                     */
                    return c.charCodeAt(0) < 128
                        ? c.charCodeAt(0).toString(16)
                        : encodeURIComponent(c).replace(/%/g, '').toLowerCase();
                })
                .join('');
        }
        function fromHex(s) {
            return s.length == 0
                ? ''
                : decodeURIComponent('%' + (s.match(/.{1,2}/g) || []).join('%'));
        }
        const encodeComment = function (s) {
            s = s.replace(new RegExp(mask(newlineChar), 'g'), ' ');
            return `{${toHex(s.slice(1, s.length - 1))}}`;
        };
        const decodeComment = function (s) {
            if (s.startsWith('{') && s.endsWith('}')) {
                return fromHex(s.slice(1, s.length - 1));
            }
        };
        // delete header to get the moves
        let ms = pgn
            .replace(headerString, '')
            .replace(
                // encode comments so they don't get deleted below
                new RegExp(`({[^}]*})+?|;([^${mask(newlineChar)}]*)`, 'g'), function (_match, bracket, semicolon) {
                    return bracket !== undefined
                        ? encodeComment(bracket)
                        : ' ' + encodeComment(`{${semicolon.slice(1)}}`);
                })
            .replace(new RegExp(mask(newlineChar), 'g'), ' ');
        // delete recursive annotation variations
        const ravRegex = /(\([^()]+\))+?/g;
        while (ravRegex.test(ms)) {
            ms = ms.replace(ravRegex, '');
        }
        // delete move numbers
        ms = ms.replace(/\d+\.(\.\.)?/g, '');
        // delete ... indicating black to move
        ms = ms.replace(/\.\.\./g, '');
        /* delete numeric annotation glyphs */
        ms = ms.replace(/\$\d+/g, '');
        // trim and get array of moves
        let moves = ms.trim().split(new RegExp(/\s+/));
        // delete empty entries
        moves = moves.filter((move) => move !== '');
        let result = '';
        for (let halfMove = 0; halfMove < moves.length; halfMove++) {
            const comment = decodeComment(moves[halfMove]);
            if (comment !== undefined) {
                this._comments[this.fen()] = comment;
                continue;
            }
            const move = this._moveFromSan(moves[halfMove], strict);
            // invalid move
            if (move == null) {
                // was the move an end of game marker
                if (TERMINATION_MARKERS.indexOf(moves[halfMove]) > -1) {
                    result = moves[halfMove];
                }
                else {
                    throw new Error(`Invalid move in PGN: ${moves[halfMove]}`);
                }
            }
            else {
                // reset the end of game marker if making a valid move
                result = '';
                this._makeMove(move);
                this._incPositionCount(this.fen());
            }
        }
        /*
         * Per section 8.2.6 of the PGN spec, the Result tag pair must match match
         * the termination marker. Only do this when headers are present, but the
         * result tag is missing
         */
        if (result && Object.keys(this._header).length && !this._header['Result']) {
            this.header('Result', result);
        }
    }
    /*
     * Convert a move from 0x88 coordinates to Standard Algebraic Notation
     * (SAN)
     *
     * @param {boolean} strict Use the strict SAN parser. It will throw errors
     * on overly disambiguated moves (see below):
     *
     * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
     * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
     * 4. ... Ne7 is technically the valid SAN
     */
    _moveToSan(move, moves) {
        let output = '';
        if (move.flags & BITS.KSIDE_CASTLE) {
            output = 'O-O';
        }
        else if (move.flags & BITS.QSIDE_CASTLE) {
            output = 'O-O-O';
        }
        else {
            if (move.piece !== PAWN) {
                const disambiguator = getDisambiguator(move, moves);
                output += move.piece.toUpperCase() + disambiguator;
            }
            if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
                if (move.piece === PAWN) {
                    output += algebraic(move.from)[0];
                }
                output += 'x';
            }
            output += algebraic(move.to);
            if (move.promotion) {
                output += '=' + move.promotion.toUpperCase();
            }
        }
        this._makeMove(move);
        if (this.isCheck()) {
            if (this.isCheckmate()) {
                output += '#';
            }
            else {
                output += '+';
            }
        }
        this._undoMove();
        return output;
    }
    // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
    _moveFromSan(move, strict = false) {
        // strip off any move decorations: e.g Nf3+?! becomes Nf3
        const cleanMove = strippedSan(move);
        let pieceType = inferPieceType(cleanMove);
        let moves = this._moves({ legal: true, piece: pieceType });
        // strict parser
        for (let i = 0, len = moves.length; i < len; i++) {
            if (cleanMove === strippedSan(this._moveToSan(moves[i], moves))) {
                return moves[i];
            }
        }
        // the strict parser failed
        if (strict) {
            return null;
        }
        let piece = undefined;
        let matches = undefined;
        let from = undefined;
        let to = undefined;
        let promotion = undefined;
        /*
         * The default permissive (non-strict) parser allows the user to parse
         * non-standard chess notations. This parser is only run after the strict
         * Standard Algebraic Notation (SAN) parser has failed.
         *
         * When running the permissive parser, we'll run a regex to grab the piece, the
         * to/from square, and an optional promotion piece. This regex will
         * parse common non-standard notation like: Pe2-e4, Rc1c4, Qf3xf7,
         * f7f8q, b1c3
         *
         * NOTE: Some positions and moves may be ambiguous when using the permissive
         * parser. For example, in this position: 6k1/8/8/B7/8/8/8/BN4K1 w - - 0 1,
         * the move b1c3 may be interpreted as Nc3 or B1c3 (a disambiguated bishop
         * move). In these cases, the permissive parser will default to the most
         * basic interpretation (which is b1c3 parsing to Nc3).
         */
        let overlyDisambiguated = false;
        matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);
        if (matches) {
            piece = matches[1];
            from = matches[2];
            to = matches[3];
            promotion = matches[4];
            if (from.length == 1) {
                overlyDisambiguated = true;
            }
        }
        else {
            /*
             * The [a-h]?[1-8]? portion of the regex below handles moves that may be
             * overly disambiguated (e.g. Nge7 is unnecessary and non-standard when
             * there is one legal knight move to e7). In this case, the value of
             * 'from' variable will be a rank or file, not a square.
             */
            matches = cleanMove.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/);
            if (matches) {
                piece = matches[1];
                from = matches[2];
                to = matches[3];
                promotion = matches[4];
                if (from.length == 1) {
                    overlyDisambiguated = true;
                }
            }
        }
        pieceType = inferPieceType(cleanMove);
        moves = this._moves({
            legal: true,
            piece: piece ? piece : pieceType,
        });
        if (!to) {
            return null;
        }
        for (let i = 0, len = moves.length; i < len; i++) {
            if (!from) {
                // if there is no from square, it could be just 'x' missing from a capture
                if (cleanMove ===
                    strippedSan(this._moveToSan(moves[i], moves)).replace('x', '')) {
                    return moves[i];
                }
                // hand-compare move properties with the results from our permissive regex
            }
            else if ((!piece || piece.toLowerCase() == moves[i].piece) &&
                Ox88[from] == moves[i].from &&
                Ox88[to] == moves[i].to &&
                (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                return moves[i];
            }
            else if (overlyDisambiguated) {
                /*
                 * SPECIAL CASE: we parsed a move string that may have an unneeded
                 * rank/file disambiguator (e.g. Nge7).  The 'from' variable will
                 */
                const square = algebraic(moves[i].from);
                if ((!piece || piece.toLowerCase() == moves[i].piece) &&
                    Ox88[to] == moves[i].to &&
                    (from == square[0] || from == square[1]) &&
                    (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
                    return moves[i];
                }
            }
        }
        return null;
    }
    ascii() {
        let s = '   +------------------------+\n';
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            // display the rank
            if (file(i) === 0) {
                s += ' ' + '87654321'[rank(i)] + ' |';
            }
            if (this._board[i]) {
                const piece = this._board[i].type;
                const color = this._board[i].color;
                const symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
                s += ' ' + symbol + ' ';
            }
            else {
                s += ' . ';
            }
            if ((i + 1) & 0x88) {
                s += '|\n';
                i += 8;
            }
        }
        s += '   +------------------------+\n';
        s += '     a  b  c  d  e  f  g  h';
        return s;
    }
    perft(depth) {
        const moves = this._moves({ legal: false });
        let nodes = 0;
        const color = this._turn;
        for (let i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._isKingAttacked(color)) {
                if (depth - 1 > 0) {
                    nodes += this.perft(depth - 1);
                }
                else {
                    nodes++;
                }
            }
            this._undoMove();
        }
        return nodes;
    }
    turn() {
        return this._turn;
    }
    board() {
        const output = [];
        let row = [];
        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            if (this._board[i] == null) {
                row.push(null);
            }
            else {
                row.push({
                    square: algebraic(i),
                    type: this._board[i].type,
                    color: this._board[i].color,
                });
            }
            if ((i + 1) & 0x88) {
                output.push(row);
                row = [];
                i += 8;
            }
        }
        return output;
    }
    squareColor(square) {
        if (square in Ox88) {
            const sq = Ox88[square];
            return (rank(sq) + file(sq)) % 2 === 0 ? 'light' : 'dark';
        }
        return null;
    }
    history({ verbose = false } = {}) {
        const reversedHistory = [];
        const moveHistory = [];
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        while (true) {
            const move = reversedHistory.pop();
            if (!move) {
                break;
            }
            if (verbose) {
                moveHistory.push(new Move(this, move));
            }
            else {
                moveHistory.push(this._moveToSan(move, this._moves()));
            }
            this._makeMove(move);
        }
        return moveHistory;
    }
    /*
     * Keeps track of position occurrence counts for the purpose of repetition
     * checking. All three methods (`_inc`, `_dec`, and `_get`) trim the
     * irrelevent information from the fen, initialising new positions, and
     * removing old positions from the record if their counts are reduced to 0.
     */
    _getPositionCount(fen) {
        const trimmedFen = trimFen(fen);
        return this._positionCount[trimmedFen] || 0;
    }
    _incPositionCount(fen) {
        const trimmedFen = trimFen(fen);
        if (this._positionCount[trimmedFen] === undefined) {
            this._positionCount[trimmedFen] = 0;
        }
        this._positionCount[trimmedFen] += 1;
    }
    _decPositionCount(fen) {
        const trimmedFen = trimFen(fen);
        if (this._positionCount[trimmedFen] === 1) {
            delete this._positionCount[trimmedFen];
        }
        else {
            this._positionCount[trimmedFen] -= 1;
        }
    }
    _pruneComments() {
        const reversedHistory = [];
        const currentComments = {};
        const copyComment = (fen) => {
            if (fen in this._comments) {
                currentComments[fen] = this._comments[fen];
            }
        };
        while (this._history.length > 0) {
            reversedHistory.push(this._undoMove());
        }
        copyComment(this.fen());
        while (true) {
            const move = reversedHistory.pop();
            if (!move) {
                break;
            }
            this._makeMove(move);
            copyComment(this.fen());
        }
        this._comments = currentComments;
    }
    getComment() {
        return this._comments[this.fen()];
    }
    setComment(comment) {
        this._comments[this.fen()] = comment.replace('{', '[').replace('}', ']');
    }
    /**
     * @deprecated Renamed to `removeComment` for consistency
     */
    deleteComment() {
        return this.removeComment();
    }
    removeComment() {
        const comment = this._comments[this.fen()];
        delete this._comments[this.fen()];
        return comment;
    }
    getComments() {
        this._pruneComments();
        return Object.keys(this._comments).map((fen) => {
            return { fen: fen, comment: this._comments[fen] };
        });
    }
    /**
     * @deprecated Renamed to `removeComments` for consistency
     */
    deleteComments() {
        return this.removeComments();
    }
    removeComments() {
        this._pruneComments();
        return Object.keys(this._comments).map((fen) => {
            const comment = this._comments[fen];
            delete this._comments[fen];
            return { fen: fen, comment: comment };
        });
    }
    setCastlingRights(color, rights) {
        for (const side of [KING, QUEEN]) {
            if (rights[side] !== undefined) {
                if (rights[side]) {
                    this._castling[color] |= SIDES[side];
                }
                else {
                    this._castling[color] &= ~SIDES[side];
                }
            }
        }
        this._updateCastlingRights();
        const result = this.getCastlingRights(color);
        return ((rights[KING] === undefined || rights[KING] === result[KING]) &&
            (rights[QUEEN] === undefined || rights[QUEEN] === result[QUEEN]));
    }
    getCastlingRights(color) {
        return {
            [KING]: (this._castling[color] & SIDES[KING]) !== 0,
            [QUEEN]: (this._castling[color] & SIDES[QUEEN]) !== 0,
        };
    }
    moveNumber() {
        return this._moveNumber;
    }
}

/**
 * Service for managing chess positions and FEN conversion
 * @module services/PositionService
 * @since 2.0.0
 */


/**
 * Service responsible for position management and FEN operations
 * @class
 */
class PositionService {
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
        } else {
            throw new ValidationError(ERROR_MESSAGES.invalid_position + position, 'position', position);
        }
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
        
        return parts.join('/') + ' w KQkq - 0 1';
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
        const squares = ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
                        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
                        'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
                        'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
                        'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
                        'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
                        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
                        'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'];
        
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

/**
 * Main Chessboard class - Orchestrates all services and components
 * @module core/Chessboard
 * @since 2.0.0
 */


/**
 * Main Chessboard class responsible for coordinating all services
 * Implements the Facade pattern to provide a unified interface
 * @class
 */
let Chessboard$1 = class Chessboard {
    /**
     * Creates a new Chessboard instance
     * @param {Object} config - Configuration object
     * @throws {ConfigurationError} If configuration is invalid
     */
    constructor(config) {
        try {
            // Initialize performance monitoring
            this._performanceMonitor = new PerformanceMonitor();
            this._performanceMonitor.startMeasure('chessboard-initialization');

            // Validate and initialize configuration
            this._validateAndInitializeConfig(config);

            // Initialize services
            this._initializeServices();

            // Initialize the board
            this._initialize();

            this._performanceMonitor.endMeasure('chessboard-initialization');
        } catch (error) {
            this._handleConstructorError(error);
        }
        this._undoneMoves = [];
        this._updateBoardPieces(true, true); // Forza popolamento DOM subito
    }

    /**
     * Validates and initializes configuration
     * @private
     * @param {Object} config - Raw configuration object
     * @throws {ConfigurationError} If configuration is invalid
     */
    _validateAndInitializeConfig(config) {
        if (!config || typeof config !== 'object') {
            throw new ConfigurationError('Configuration must be an object', 'config', config);
        }

        this.config = new ChessboardConfig(config);

        // Validate required configuration
        if (!this.config.id_div) {
            throw new ConfigurationError('Configuration must include id_div', 'id_div', this.config.id_div);
        }
    }

    /**
     * Handles constructor errors gracefully
     * @private
     * @param {Error} error - Error that occurred during construction
     */
    _handleConstructorError(error) {
        console.error('Chessboard initialization failed:', error);

        // Clean up any partially initialized resources
        this._cleanup();

        // Re-throw with additional context
        if (error instanceof ChessboardError) {
            throw error;
        } else {
            throw new ChessboardError('Failed to initialize chessboard', 'INITIALIZATION_ERROR', {
                originalError: error.message,
                stack: error.stack
            });
        }
    }

    /**
     * Cleans up any partially initialized resources (safe to call multiple times)
     * @private
     */
    _cleanup() {
        // Remove event listeners if present
        if (this.eventService && typeof this.eventService.removeListeners === 'function') {
            this.eventService.removeListeners();
        }
        // Clear timeouts
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
        }
        // Null all services
        this.validationService = null;
        this.coordinateService = null;
        this.positionService = null;
        this.boardService = null;
        this.pieceService = null;
        this.animationService = null;
        this.moveService = null;
        this.eventService = null;
    }

    /**
     * Initializes all services
     * @private
     */
    _initializeServices() {
        // Core services
        this.validationService = new ValidationService();
        this.coordinateService = new CoordinateService(this.config);
        this.positionService = new PositionService(this.config);
        this.boardService = new BoardService(this.config);
        this.pieceService = new PieceService(this.config);
        this.animationService = new AnimationService(this.config);
        this.moveService = new MoveService(this.config, this.positionService);
        this.eventService = new EventService(
            this.config,
            this.boardService,
            this.moveService,
            this.coordinateService,
            this
        );

        // State management
        this._updateTimeout = null;
        this._isAnimating = false;

        // Bind methods to preserve context
        this._boundUpdateBoardPieces = this._updateBoardPieces.bind(this);
        this._boundOnSquareClick = this._onSquareClick.bind(this);
        this._boundOnPieceHover = this._onPieceHover.bind(this);
        this._boundOnPieceLeave = this._onPieceLeave.bind(this);
    }

    /**
     * Initializes the board
     * @private
     */
    _initialize() {
        this._initParams();
        this._setGame(this.config.position);
        this._buildBoard();
        this._buildSquares();
        this._addListeners();
        this._updateBoardPieces(true, true); // Initial position load
    }

    /**
     * Initializes parameters and state
     * @private
     */
    _initParams() {
        // Reset state
        this.eventService.setClicked(null);
        this.eventService.setPromoting(false);
        this.eventService.setAnimating(false);
    }

    /**
     * Sets up the game with initial position
     * @private
     * @param {string|Object} position - Initial position
     */
    _setGame(position) {
        this.positionService.setGame(position);
    }

    /**
     * Builds the board DOM structure
     * @private
     * Best practice: always remove squares (destroy JS/DOM) before clearing the board container.
     */
    _buildBoard() {
        console.log('CHIAMATO: _buildBoard');
        if (this._isUndoRedo) {
            console.log('SKIP _buildBoard per undo/redo');
            return;
        }
        // Forza la pulizia completa del contenitore board (DOM)
        const boardContainer = document.getElementById(this.config.id_div);
        if (boardContainer) boardContainer.innerHTML = '';
        // Force remove all pieces from all squares (no animation, best practice)
        if (this.boardService && this.boardService.squares) {
            Object.values(this.boardService.squares).forEach(sq => sq && sq.forceRemoveAllPieces && sq.forceRemoveAllPieces());
        }
        if (this.boardService && this.boardService.removeSquares) this.boardService.removeSquares();
        if (this.boardService && this.boardService.removeBoard) this.boardService.removeBoard();
        this.boardService.buildBoard();
    }

    /**
     * Builds all squares on the board
     * @private
     */
    _buildSquares() {
        console.log('CHIAMATO: _buildSquares');
        if (this._isUndoRedo) {
            console.log('SKIP _buildSquares per undo/redo');
            return;
        }
        if (this.boardService && this.boardService.removeSquares) {
            this.boardService.removeSquares();
        }
        this.boardService.buildSquares((row, col) => {
            return this.coordinateService.realCoord(row, col);
        });
    }

    /**
     * Adds event listeners to squares
     * @private
     */
    _addListeners() {
        this.eventService.addListeners(
            this._boundOnSquareClick,
            this._boundOnPieceHover,
            this._boundOnPieceLeave
        );
    }

    /**
     * Handles square click events
     * @private
     * @param {Square} square - Clicked square
     * @param {boolean} [animate=true] - Whether to animate
     * @param {boolean} [dragged=false] - Whether triggered by drag
     * @returns {boolean} True if successful
     */
    _onSquareClick(square, animate = true, dragged = false) {
        return this.eventService.onClick(
            square,
            this._onMove.bind(this),
            this._onSelect.bind(this),
            this._onDeselect.bind(this),
            animate,
            dragged
        );
    }

    /**
     * Handles piece hover events
     * @private
     * @param {Square} square - Hovered square
     */
    _onPieceHover(square) {
        if (this.config.hints && !this.eventService.getClicked()) {
            // Only show hints if no square is selected
            this._hintMoves(square);
        }
    }

    /**
     * Handles piece leave events
     * @private
     * @param {Square} square - Left square
     */
    _onPieceLeave(square) {
        if (this.config.hints && !this.eventService.getClicked()) {
            // Only remove hints if no square is selected
            this._dehintMoves(square);
        }
    }

    /**
     * Handles move execution
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Square} toSquare - Target square
     * @param {string} [promotion] - Promotion piece
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if move was successful
     */
    _onMove(fromSquare, toSquare, promotion = null, animate = true) {
        const move = new Move$1(fromSquare, toSquare, promotion);

        if (!move.check()) {
            // Clear state on failed move
            this._clearVisualState();
            return false;
        }

        if (this.config.onlyLegalMoves && !move.isLegal(this.positionService.getGame())) {
            // Clear state on illegal move
            this._clearVisualState();
            return false;
        }

        if (!move.hasPromotion() && this._requiresPromotion(move)) {
            // Don't clear state for promotion - it's handled elsewhere
            return false;
        }

        if (this.config.onMove(move)) {
            // Clear state before executing move
            this._clearVisualState();
            this._executeMove(move, animate);
            return true;
        }

        // Clear state on rejected move
        this._clearVisualState();
        return false;
    }

    /**
     * Handles square selection
     * @private
     * @param {Square} square - Selected square
     */
    _onSelect(square) {
        if (this.config.clickable) {
            square.select();
            this._hintMoves(square);
        }
    }

    /**
     * Handles square deselection
     * @private
     * @param {Square} square - Deselected square
     */
    _onDeselect(square) {
        this._clearVisualState();
    }

    /**
     * Shows legal move hints for a square
     * @private
     * @param {Square} square - Square to show hints for
     */
    _hintMoves(square) {
        if (!this.moveService.canMove(square)) return;

        // Clear existing hints first
        this.boardService.applyToAllSquares('removeHint');

        const moves = this.moveService.getCachedLegalMoves(square);

        for (const move of moves) {
            if (move.to && move.to.length === 2) {
                const targetSquare = this.boardService.getSquare(move.to);
                if (targetSquare) {
                    const hasEnemyPiece = targetSquare.piece &&
                        targetSquare.piece.color !== this.positionService.getGame().turn();
                    targetSquare.putHint(hasEnemyPiece);
                }
            }
        }
    }

    /**
     * Removes legal move hints for a square
     * @private
     * @param {Square} square - Square to remove hints for
     */
    _dehintMoves(square) {
        const moves = this.moveService.getCachedLegalMoves(square);

        for (const move of moves) {
            if (move.to && move.to.length === 2) {
                const targetSquare = this.boardService.getSquare(move.to);
                if (targetSquare) {
                    targetSquare.removeHint();
                }
            }
        }
    }

    /**
     * Checks if a move requires promotion
     * @private
     * @param {Move} move - Move to check
     * @returns {boolean} True if promotion is required
     */
    _requiresPromotion(move) {
        return this.moveService.requiresPromotion(move);
    }

    /**
     * Executes a move
     * @private
     * @param {Move} move - Move to execute
     * @param {boolean} [animate=true] - Whether to animate
     */
    _executeMove(move, animate = true) {
        this.positionService.getGame().fen();

        if (this.config.onlyLegalMoves) {
            this.boardService.applyToAllSquares('unmoved');

            const gameMove = this.moveService.executeMove(move);
            if (!gameMove) {
                throw new Error('Move execution failed');
            }

            move.from.moved();
            move.to.moved();

            // Check for special moves that need additional handling
            const isCastleMove = this.moveService.isCastle(gameMove);
            const isEnPassantMove = this.moveService.isEnPassant(gameMove);

            // Animate the move if requested
            if (animate && move.from.piece) {
                const capturedPiece = move.to.piece;

                // For castle moves in simultaneous mode, we need to coordinate both animations
                if (isCastleMove) {
                    // Start king animation
                    this.pieceService.translatePiece(
                        move,
                        !!capturedPiece,
                        animate,
                        this._createDragFunction.bind(this),
                        () => {
                            // King animation completed, trigger change event
                            this.config.onMoveEnd(gameMove);
                        }
                    );

                    // Start rook animation simultaneously (with small delay)
                    setTimeout(() => {
                        this._handleCastleMove(gameMove, true);
                    }, this.config.simultaneousAnimationDelay);
                } else {
                    // Regular move or sequential castle
                    this.pieceService.translatePiece(
                        move,
                        !!capturedPiece,
                        animate,
                        this._createDragFunction.bind(this),
                        () => {
                            // After animation, handle special moves and trigger change event
                            if (isCastleMove) {
                                this._handleSpecialMoveAnimation(gameMove);
                            } else if (isEnPassantMove) {
                                this._handleSpecialMoveAnimation(gameMove);
                            }
                            this.config.onMoveEnd(gameMove);
                        }
                    );
                }
            } else {
                // For non-animated moves, handle special moves immediately
                if (isCastleMove) {
                    this._handleSpecialMove(gameMove);
                } else if (isEnPassantMove) {
                    this._handleSpecialMove(gameMove);
                }
                this._updateBoardPieces(false);
                this.config.onMoveEnd(gameMove);
            }
        } else {
            // Handle non-legal mode
            const piece = this.positionService.getGamePieceId(move.from.id);
            const game = this.positionService.getGame();

            game.remove(move.from.id);
            game.remove(move.to.id);
            game.put({
                type: move.hasPromotion() ? move.promotion : piece[0],
                color: piece[1]
            }, move.to.id);

            // Update board for non-legal mode
            this._updateBoardPieces(animate);
        }
    }

    /**
     * Handles special moves (castle, en passant) without animation
     * @private
     * @param {Object} gameMove - Game move object
     */
    _handleSpecialMove(gameMove) {
        if (this.moveService.isCastle(gameMove)) {
            this._handleCastleMove(gameMove, false);
        } else if (this.moveService.isEnPassant(gameMove)) {
            this._handleEnPassantMove(gameMove, false);
        }
    }

    /**
     * Handles special moves (castle, en passant) with animation
     * @private
     * @param {Object} gameMove - Game move object
     */
    _handleSpecialMoveAnimation(gameMove) {
        if (this.moveService.isCastle(gameMove)) {
            this._handleCastleMove(gameMove, true);
        } else if (this.moveService.isEnPassant(gameMove)) {
            this._handleEnPassantMove(gameMove, true);
        }
    }

    /**
     * Handles castle move by moving the rook
     * @private
     * @param {Object} gameMove - Game move object
     * @param {boolean} animate - Whether to animate
     */
    _handleCastleMove(gameMove, animate) {
        const rookMove = this.moveService.getCastleRookMove(gameMove);
        if (!rookMove) return;

        const rookFromSquare = this.boardService.getSquare(rookMove.from);
        const rookToSquare = this.boardService.getSquare(rookMove.to);

        if (!rookFromSquare || !rookToSquare || !rookFromSquare.piece) {
            console.warn('Castle rook move failed - squares or piece not found');
            return;
        }

        console.log(`Castle: moving rook from ${rookMove.from} to ${rookMove.to}`);

        if (animate) {
            // Always use translatePiece for smooth sliding animation
            const rookPiece = rookFromSquare.piece;
            this.pieceService.translatePiece(
                { from: rookFromSquare, to: rookToSquare, piece: rookPiece },
                false, // No capture for rook in castle
                animate,
                this._createDragFunction.bind(this),
                () => {
                    // After rook animation, update board state
                    this._updateBoardPieces(false);
                }
            );
        } else {
            // Just update the board state
            this._updateBoardPieces(false);
        }
    }

    /**
     * Handles en passant move by removing the captured pawn
     * @private
     * @param {Object} gameMove - Game move object
     * @param {boolean} animate - Whether to animate
     */
    _handleEnPassantMove(gameMove, animate) {
        const capturedSquare = this.moveService.getEnPassantCapturedSquare(gameMove);
        if (!capturedSquare) return;

        const capturedSquareObj = this.boardService.getSquare(capturedSquare);
        if (!capturedSquareObj || !capturedSquareObj.piece) {
            console.warn('En passant captured square not found or empty');
            return;
        }

        console.log(`En passant: removing captured pawn from ${capturedSquare}`);

        if (animate) {
            // Animate the captured pawn removal
            this.pieceService.removePieceFromSquare(capturedSquareObj, true);
            // Update board state after animation
            setTimeout(() => {
                this._updateBoardPieces(false);
            }, this.config.moveTime);
        } else {
            // Just update the board state
            this._updateBoardPieces(false);
        }
    }

    /**
     * Updates board pieces to match game state
     * @private
     * @param {boolean} [animation=false] - Whether to animate
     * @param {boolean} [isPositionLoad=false] - Whether this is a position load
     */
    _updateBoardPieces(animation = false, isPositionLoad = false) {
        console.log('CHIAMATO: _updateBoardPieces', { animation, isPositionLoad, isUndoRedo: this._isUndoRedo });
        // Check if services are available
        if (!this.positionService || !this.moveService || !this.eventService) {
            console.log('Cannot update board pieces - services not available');
            return;
        }

        // Clear any pending update
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
        }

        // Clear moves cache
        this.moveService.clearCache();

        // Add small delay for click-to-move to avoid lag
        if (animation && !this.eventService.getClicked()) {
            this._updateTimeout = setTimeout(() => {
                this._doUpdateBoardPieces(animation, isPositionLoad);
                this._updateTimeout = null;

                // Ensure hints are available for the next turn
                this._ensureHintsAvailable();
            }, 10);
        } else {
            this._doUpdateBoardPieces(animation, isPositionLoad);

            // Ensure hints are available for the next turn
            this._ensureHintsAvailable();
        }
    }

    /**
     * Ensures hints are available for the current turn
     * @private
     */
    _ensureHintsAvailable() {
        if (!this.config.hints) return;

        // Small delay to ensure the board state is fully updated
        setTimeout(() => {
            // Clear any existing hints
            this.boardService.applyToAllSquares('removeHint');

            // The hints will be shown when the user hovers over pieces
            // This just ensures the cache is ready
            this.moveService.clearCache();
        }, 50);
    }

    /**
     * Updates board pieces after a delayed move
     * @private
     */
    _updateBoardPiecesDelayed() {
        this._updateBoardPieces(false);
    }

    /**
     * Aggiorna i pezzi sulla scacchiera con animazione e delay configurabile (greedy matching)
     * @private
     * @param {boolean} [animation=false] - Se animare
     * @param {boolean} [isPositionLoad=false] - Se è un caricamento posizione (delay 0)
     */
    _doUpdateBoardPieces(animation = false, isPositionLoad = false) {
        if (this._isDragging) return;
        if (this._isPromoting) return;
        if (!this.positionService || !this.positionService.getGame()) return;
        const squares = this.boardService.getAllSquares();
        const gameStateBefore = this.positionService.getGame().fen();
        if (/^8\/8\/8\/8\/8\/8\/8\/8/.test(gameStateBefore)) {
            const boardContainer = document.getElementById(this.config.id_div);
            if (boardContainer) {
                const pieceElements = boardContainer.querySelectorAll('.piece');
                pieceElements.forEach(element => element.remove());
            }
            Object.values(squares).forEach(sq => { if (sq && sq.piece) sq.piece = null; });
            this._clearVisualState();
            this._addListeners();
            if (this.config.onChange) this.config.onChange(gameStateBefore);
            return;
        }

        // --- Matching greedy tra attuale e atteso ---
        const currentMap = {};
        const expectedMap = {};
        Object.values(squares).forEach(square => {
            const currentPiece = square.piece;
            const expectedPieceId = this.positionService.getGamePieceId(square.id);
            if (currentPiece) {
                const key = (currentPiece.color + currentPiece.type).toLowerCase();
                if (!currentMap[key]) currentMap[key] = [];
                currentMap[key].push({ square, id: square.id, piece: currentPiece });
            }
            if (expectedPieceId) {
                const key = expectedPieceId.toLowerCase();
                if (!expectedMap[key]) expectedMap[key] = [];
                expectedMap[key].push({ square, id: square.id });
            }
        });
        const animationDelay = isPositionLoad ? 0 : this.config.simultaneousAnimationDelay || 0;
        let totalAnimations = 0;
        let animationsCompleted = 0;

        // 1. Matching greedy: trova i movimenti
        const moves = [];
        const fromMatched = {};
        const toMatched = {};
        const unchanged = [];
        Object.keys(expectedMap).forEach(key => {
            const fromList = (currentMap[key] || []).slice();
            const toList = expectedMap[key].slice();
            const localFromMatched = new Array(fromList.length).fill(false);
            const localToMatched = new Array(toList.length).fill(false);
            // Matrice delle distanze
            const distances = [];
            for (let i = 0; i < fromList.length; i++) {
                distances[i] = [];
                for (let j = 0; j < toList.length; j++) {
                    distances[i][j] = Math.abs(fromList[i].square.row - toList[j].square.row) +
                        Math.abs(fromList[i].square.col - toList[j].square.col);
                }
            }
            while (true) {
                let minDist = Infinity, minI = -1, minJ = -1;
                for (let i = 0; i < fromList.length; i++) {
                    if (localFromMatched[i]) continue;
                    for (let j = 0; j < toList.length; j++) {
                        if (localToMatched[j]) continue;
                        if (distances[i][j] < minDist) {
                            minDist = distances[i][j];
                            minI = i;
                            minJ = j;
                        }
                    }
                }
                if (minI === -1 || minJ === -1) break;
                // Se la posizione è la stessa E il Piece è lo stesso oggetto, non fare nulla (pezzo unchanged)
                if (fromList[minI].square === toList[minJ].square && squares[toList[minJ].square.id].piece === fromList[minI].piece) {
                    unchanged.push({ square: fromList[minI].square, piece: fromList[minI].piece });
                    localFromMatched[minI] = true;
                    localToMatched[minJ] = true;
                    fromMatched[fromList[minI].square.id] = true;
                    toMatched[toList[minJ].square.id] = true;
                    continue;
                }
                // Altrimenti, sposta il pezzo
                moves.push({ from: fromList[minI].square, to: toList[minJ].square, piece: fromList[minI].piece });
                localFromMatched[minI] = true;
                localToMatched[minJ] = true;
                fromMatched[fromList[minI].square.id] = true;
                toMatched[toList[minJ].square.id] = true;
            }
        });

        // 2. Rimozione: pezzi presenti solo in attuale (non matched)
        const removes = [];
        Object.keys(currentMap).forEach(key => {
            currentMap[key].forEach(({ square, piece }) => {
                if (!fromMatched[square.id]) {
                    removes.push({ square, piece });
                }
            });
        });

        // 3. Aggiunta: pezzi presenti solo in atteso (non matched)
        const adds = [];
        Object.keys(expectedMap).forEach(key => {
            expectedMap[key].forEach(({ square, id }) => {
                if (!toMatched[square.id]) {
                    adds.push({ square, pieceId: key });
                }
            });
        });

        totalAnimations = moves.length + removes.length + adds.length;
        if (totalAnimations === 0) {
            this._addListeners();
            const gameStateAfter = this.positionService.getGame().fen();
            if (gameStateBefore !== gameStateAfter) {
                this.config.onChange(gameStateAfter);
            }
            return;
        }

        // Debug: logga i pezzi unchanged
        if (unchanged.length > 0) {
            console.debug('[Chessboard] Unchanged pieces:', unchanged.map(u => u.piece.id + '@' + u.square.id));
        }

        const onAnimationComplete = () => {
            animationsCompleted++;
            if (animationsCompleted === totalAnimations) {
                // Pulizia finale robusta: rimuovi tutti i pezzi orfani dal DOM e dal riferimento JS
                Object.values(this.boardService.getAllSquares()).forEach(square => {
                    const expectedPieceId = this.positionService.getGamePieceId(square.id);
                    if (!expectedPieceId && typeof square.forceRemoveAllPieces === 'function') {
                        square.forceRemoveAllPieces();
                    }
                });
                this._addListeners();
                const gameStateAfter = this.positionService.getGame().fen();
                if (gameStateBefore !== gameStateAfter) {
                    this.config.onChange(gameStateAfter);
                }
            }
        };

        // 4. Esegui tutte le animazioni con delay
        let idx = 0;
        moves.forEach(move => {
            setTimeout(() => {
                this.pieceService.translatePiece(
                    move,
                    false,
                    animation,
                    this._createDragFunction.bind(this),
                    onAnimationComplete
                );
            }, idx++ * animationDelay);
        });
        removes.forEach(op => {
            setTimeout(() => {
                if (typeof op.square.forceRemoveAllPieces === 'function') {
                    op.square.forceRemoveAllPieces();
                    onAnimationComplete();
                } else {
                    this.pieceService.removePieceFromSquare(op.square, animation, onAnimationComplete);
                }
            }, idx++ * animationDelay);
        });
        adds.forEach(op => {
            setTimeout(() => {
                const newPiece = this.pieceService.convertPiece(op.pieceId);
                this.pieceService.addPieceOnSquare(
                    op.square,
                    newPiece,
                    animation,
                    this._createDragFunction.bind(this),
                    onAnimationComplete
                );
            }, idx++ * animationDelay);
        });
    }

    /**
     * Analyzes position changes to determine optimal animation strategy
     * @private
     * @param {Object} squares - All squares
     * @returns {Object} Analysis of changes
     */
    _analyzePositionChanges(squares) {
        const currentPieces = new Map();
        const expectedPieces = new Map();

        // Map current and expected piece positions
        Object.values(squares).forEach(square => {
            const currentPiece = square.piece;
            const expectedPieceId = this.positionService.getGamePieceId(square.id);

            if (currentPiece) {
                currentPieces.set(square.id, currentPiece.getId());
            }

            if (expectedPieceId) {
                expectedPieces.set(square.id, expectedPieceId);
            }
        });

        console.log('Position Analysis:');
        console.log('Current pieces:', Array.from(currentPieces.entries()));
        console.log('Expected pieces:', Array.from(expectedPieces.entries()));

        // Identify different types of changes
        const moves = []; // Pieces that can slide to new positions
        const removes = []; // Pieces that need to be removed
        const adds = []; // Pieces that need to be added
        const unchanged = []; // Pieces that stay in place

        // First pass: identify pieces that don't need to move (same piece type on same square)
        const processedSquares = new Set();

        currentPieces.forEach((currentPieceId, square) => {
            const expectedPieceId = expectedPieces.get(square);

            if (currentPieceId === expectedPieceId) {
                // Same piece type on same square - no movement needed
                console.log(`UNCHANGED: ${currentPieceId} stays on ${square}`);
                unchanged.push({
                    piece: currentPieceId,
                    square: square
                });
                processedSquares.add(square);
            }
        });

        // Second pass: handle pieces that need to move or be removed
        currentPieces.forEach((currentPieceId, fromSquare) => {
            if (processedSquares.has(fromSquare)) {
                return; // Already processed as unchanged
            }

            // Try to find a destination for this piece
            const availableDestination = Array.from(expectedPieces.entries()).find(([toSquare, expectedId]) =>
                expectedId === currentPieceId && !processedSquares.has(toSquare)
            );

            if (availableDestination) {
                const [toSquare, expectedId] = availableDestination;
                console.log(`MOVE: ${currentPieceId} from ${fromSquare} to ${toSquare}`);
                moves.push({
                    piece: currentPieceId,
                    from: fromSquare,
                    to: toSquare,
                    fromSquare: squares[fromSquare],
                    toSquare: squares[toSquare]
                });
                processedSquares.add(toSquare);
            } else {
                // This piece needs to be removed
                console.log(`REMOVE: ${currentPieceId} from ${fromSquare}`);
                removes.push({
                    piece: currentPieceId,
                    square: fromSquare,
                    squareObj: squares[fromSquare]
                });
            }
        });

        // Third pass: handle pieces that need to be added
        expectedPieces.forEach((expectedPieceId, toSquare) => {
            if (!processedSquares.has(toSquare)) {
                console.log(`ADD: ${expectedPieceId} to ${toSquare}`);
                adds.push({
                    piece: expectedPieceId,
                    square: toSquare,
                    squareObj: squares[toSquare]
                });
            }
        });

        return {
            moves,
            removes,
            adds,
            unchanged,
            totalChanges: moves.length + removes.length + adds.length
        };
    }

    /**
     * Executes simultaneous changes based on analysis
     * @private
     * @param {Object} changeAnalysis - Analysis of changes
     * @param {string} gameStateBefore - Game state before update
     * @param {boolean} [isPositionLoad=false] - Whether this is a position load
     */
    _executeSimultaneousChanges(changeAnalysis, gameStateBefore, isPositionLoad = false) {
        const { moves, removes, adds, unchanged } = changeAnalysis;

        console.log(`Position changes analysis:`, {
            moves: moves.length,
            removes: removes.length,
            adds: adds.length,
            unchanged: unchanged.length
        });

        // Log unchanged pieces for debugging
        if (unchanged.length > 0) {
            console.log('Pieces staying in place:', unchanged.map(u => `${u.piece} on ${u.square}`));
        }

        let animationsCompleted = 0;
        const totalAnimations = moves.length + removes.length + adds.length;

        // If no animations are needed, complete immediately
        if (totalAnimations === 0) {
            console.log('No animations needed, completing immediately');
            this._addListeners();

            // Trigger change event if position changed
            const gameStateAfter = this.positionService.getGame().fen();
            if (gameStateBefore !== gameStateAfter) {
                this.config.onChange(gameStateAfter);
            }
            return;
        }

        const onAnimationComplete = () => {
            animationsCompleted++;
            console.log(`Animation completed: ${animationsCompleted}/${totalAnimations}`);
            if (animationsCompleted === totalAnimations) {
                console.log('All simultaneous animations completed');
                this._addListeners();

                // Trigger change event if position changed
                const gameStateAfter = this.positionService.getGame().fen();
                if (gameStateBefore !== gameStateAfter) {
                    this.config.onChange(gameStateAfter);
                }
            }
        };

        // Determine delay: 0 for position loads, configured delay for normal moves
        const animationDelay = isPositionLoad ? 0 : this.config.simultaneousAnimationDelay;
        console.log(`Using animation delay: ${animationDelay}ms (position load: ${isPositionLoad})`);

        let animationIndex = 0;

        // Process moves (pieces sliding to new positions)
        moves.forEach(move => {
            const delay = animationIndex * animationDelay;
            console.log(`Scheduling move ${move.piece} from ${move.from} to ${move.to} with delay ${delay}ms`);

            setTimeout(() => {
                this._animatePieceMove(move, onAnimationComplete);
            }, delay);

            animationIndex++;
        });

        // Process removes (pieces disappearing)
        removes.forEach(remove => {
            const delay = animationIndex * animationDelay;
            console.log(`Scheduling removal of ${remove.piece} from ${remove.square} with delay ${delay}ms`);

            setTimeout(() => {
                this._animatePieceRemoval(remove, onAnimationComplete);
            }, delay);

            animationIndex++;
        });

        // Process adds (pieces appearing)
        adds.forEach(add => {
            const delay = animationIndex * animationDelay;
            console.log(`Scheduling addition of ${add.piece} to ${add.square} with delay ${delay}ms`);

            setTimeout(() => {
                this._animatePieceAddition(add, onAnimationComplete);
            }, delay);

            animationIndex++;
        });
    }

    /**
     * Animates a piece moving from one square to another
     * @private
     * @param {Object} move - Move information
     * @param {Function} onComplete - Callback when animation completes
     */
    _animatePieceMove(move, onComplete) {
        const { fromSquare, toSquare } = move;
        const piece = fromSquare.piece;

        if (!piece) {
            console.warn(`No piece found on ${move.from} for move animation`);
            onComplete();
            return;
        }

        console.log(`Animating piece move: ${move.piece} from ${move.from} to ${move.to}`);

        // Use translatePiece for smooth sliding animation
        this.pieceService.translatePiece(
            { from: fromSquare, to: toSquare, piece: piece },
            false, // Assume no capture for now
            true, // Always animate
            this._createDragFunction.bind(this),
            () => {
                console.log(`Piece move animation completed: ${move.piece} to ${move.to}`);
                onComplete();
            }
        );
    }

    /**
     * Animates a piece being removed
     * @private
     * @param {Object} remove - Remove information
     * @param {Function} onComplete - Callback when animation completes
     */
    _animatePieceRemoval(remove, onComplete) {
        console.log(`Animating piece removal: ${remove.piece} from ${remove.square}`);

        this.pieceService.removePieceFromSquare(remove.squareObj, true, () => {
            console.log(`Piece removal animation completed: ${remove.piece} from ${remove.square}`);
            onComplete();
        });
    }

    /**
     * Animates a piece being added
     * @private
     * @param {Object} add - Add information
     * @param {Function} onComplete - Callback when animation completes
     */
    _animatePieceAddition(add, onComplete) {
        console.log(`Animating piece addition: ${add.piece} to ${add.square}`);

        const newPiece = this.pieceService.convertPiece(add.piece);
        this.pieceService.addPieceOnSquare(
            add.squareObj,
            newPiece,
            true,
            this._createDragFunction.bind(this),
            () => {
                console.log(`Piece addition animation completed: ${add.piece} to ${add.square}`);
                onComplete();
            }
        );
    }

    /**
     * Creates a drag function for a piece
     * @private
     * @param {Square} square - Square containing the piece
     * @param {Piece} piece - Piece to create drag function for
     * @returns {Function} Drag function
     */
    _createDragFunction(square, piece) {
        return this.eventService.createDragFunction(
            square,
            piece,
            this.config.onDragStart,
            this.config.onDragMove,
            this.config.onDrop,
            this._onSnapback.bind(this),
            this._onMove.bind(this),
            this._onRemove.bind(this)
        );
    }

    /**
     * Handles snapback animation
     * @private
     * @param {Square} square - Square containing the piece
     * @param {Piece} piece - Piece to snapback
     */
    _onSnapback(square, piece) {
        this.pieceService.snapbackPiece(square, this.config.snapbackAnimation);
        this.config.onSnapbackEnd(square, piece);
    }

    /**
     * Handles piece removal
     * @private
     * @param {Square} square - Square containing the piece to remove
     */
    _onRemove(square) {
        this.pieceService.removePieceFromSquare(square, true);
        this.positionService.getGame().remove(square.id);
        this._updateBoardPieces(true);
    }

    /**
     * Clears all visual state (selections, hints, highlights)
     * @private
     */
    _clearVisualState() {
        this.boardService.applyToAllSquares('deselect');
        this.boardService.applyToAllSquares('removeHint');
        this.boardService.applyToAllSquares('dehighlight');
        this.eventService.setClicked(null);
    }

    // -------------------
    // Public API Methods (Refactored)
    // -------------------

    // --- POSITION & STATE ---
    /**
     * Get the current position as FEN
     * @returns {string}
     */
    getPosition() { return this.fen(); }
    /**
     * Set the board position (FEN or object)
     * @param {string|Object} position
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    setPosition(position, opts = {}) {
        const animate = opts.animate !== undefined ? opts.animate : true;
        // Remove highlights and selections
        if (this.boardService && this.boardService.applyToAllSquares) {
            this.boardService.applyToAllSquares('removeHint');
            this.boardService.applyToAllSquares('deselect');
            this.boardService.applyToAllSquares('unmoved');
        }
        if (this.positionService && this.positionService.setGame) {
            this.positionService.setGame(position);
        }
        if (this._updateBoardPieces) {
            this._updateBoardPieces(animate, true);
        }
        // Forza la sincronizzazione dopo setPosition
        this._updateBoardPieces(true, false);
        return true;
    }
    /**
     * Reset the board to the starting position
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    reset(opts = {}) {
        const animate = opts.animate !== undefined ? opts.animate : true;
        // Use the default starting position from config or fallback
        const startPosition = this.config && this.config.position ? this.config.position : 'start';
        this._updateBoardPieces(animate);
        const result = this.setPosition(startPosition, { animate });
        // Forza la sincronizzazione dopo reset
        this._updateBoardPieces(true, false);
        return result;
    }
    /**
     * Clear the board
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    clear(opts = {}) {
        const animate = opts.animate !== undefined ? opts.animate : true;
        if (!this.positionService || !this.positionService.getGame()) {
            return false;
        }
        if (this._clearVisualState) this._clearVisualState();
        this.positionService.getGame().clear();
        // Forza la rimozione di tutti i pezzi dal DOM
        if (this.boardService && this.boardService.squares) {
            Object.values(this.boardService.squares).forEach(sq => {
                if (sq && sq.piece) sq.piece = null;
            });
        }
        if (this._updateBoardPieces) {
            this._updateBoardPieces(animate, true);
        }
        // Forza la sincronizzazione dopo clear
        this._updateBoardPieces(true, false);
        return true;
    }

    // --- MOVE MANAGEMENT ---
    /**
     * Undo last move
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    undoMove(opts = {}) {
        const undone = this.positionService.getGame().undo();
        if (undone) {
            this._undoneMoves.push(undone);
            // Forza refresh completo di tutti i pezzi dopo undo
            this._updateBoardPieces(true, true);
            return undone;
        }
        return null;
    }
    /**
     * Redo last undone move
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    redoMove(opts = {}) {
        if (this._undoneMoves && this._undoneMoves.length > 0) {
            const move = this._undoneMoves.pop();
            const moveObj = { from: move.from, to: move.to };
            if (move.promotion) moveObj.promotion = move.promotion;
            const result = this.positionService.getGame().move(moveObj);
            // Forza refresh completo di tutti i pezzi dopo redo
            this._updateBoardPieces(true, true);
            return result;
        }
        return false;
    }
    /**
     * Get legal moves for a square
     * @param {string} square
     * @returns {Array}
     */
    getLegalMoves(square) { return this.legalMoves(square); }

    // --- PIECE MANAGEMENT ---
    /**
     * Get the piece at a square
     * @param {string} square
     * @returns {string|null}
     */
    getPiece(square) {
        // Sempre leggi lo stato aggiornato dal boardService
        const squareObj = typeof square === 'string' ? this.boardService.getSquare(square) : square;
        if (!squareObj || typeof squareObj !== 'object' || !('id' in squareObj)) throw new Error('[getPiece] Parametro square non valido');
        // Forza sync prima di leggere
        this._updateBoardPieces(false, false);
        const piece = squareObj.piece;
        if (!piece) return null;
        return (piece.color + piece.type).toLowerCase();
    }
    /**
     * Put a piece on a square
     * @param {string|Piece} piece
     * @param {string|Square} square
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    putPiece(piece, square, opts = {}) {
        const animate = opts.animate !== undefined ? opts.animate : true;
        let pieceStr = piece;
        if (typeof piece === 'object' && piece.type && piece.color) {
            pieceStr = (piece.color + piece.type).toLowerCase();
        } else if (typeof piece === 'string' && piece.length === 2) {
            const a = piece[0].toLowerCase();
            const b = piece[1].toLowerCase();
            const types = 'kqrbnp';
            const colors = 'wb';
            if (types.includes(a) && colors.includes(b)) {
                pieceStr = b + a;
            } else if (colors.includes(a) && types.includes(b)) {
                pieceStr = a + b;
            } else {
                throw new Error(`[putPiece] Invalid piece: ${piece}`);
            }
        }
        const squareObj = typeof square === 'string' ? this.boardService.getSquare(square) : square;
        if (!squareObj || typeof squareObj !== 'object' || !('id' in squareObj)) throw new Error('[putPiece] Parametro square non valido');
        const pieceObj = this.pieceService.convertPiece(pieceStr);
        if (!pieceObj || typeof pieceObj !== 'object' || !('type' in pieceObj)) throw new Error('[putPiece] Parametro piece non valido');
        // Aggiorna solo il motore chess.js
        const chessJsPiece = { type: pieceObj.type, color: pieceObj.color };
        const game = this.positionService.getGame();
        const result = game.put(chessJsPiece, squareObj.id);
        if (!result) throw new Error(`[putPiece] Game.put failed for ${pieceStr} on ${squareObj.id}`);
        // Non aggiornare direttamente square.piece!
        // Riallinea la board JS allo stato del motore
        this._updateBoardPieces(animate);
        return true;
    }
    /**
     * Remove a piece from a square
     * @param {string|Square} square
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {string|null}
     */
    removePiece(square, opts = {}) {
        const animate = opts.animate !== undefined ? opts.animate : true;
        const squareObj = typeof square === 'string' ? this.boardService.getSquare(square) : square;
        if (!squareObj || typeof squareObj !== 'object' || !('id' in squareObj)) throw new Error('[removePiece] Parametro square non valido');
        // Aggiorna solo il motore chess.js
        const game = this.positionService.getGame();
        game.remove(squareObj.id);
        // Non aggiornare direttamente square.piece!
        // Riallinea la board JS allo stato del motore
        this._updateBoardPieces(animate);
        return true;
    }

    // --- BOARD CONTROL ---
    /**
     * Flip the board orientation
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     */
    flipBoard(opts = {}) {
        if (this.coordinateService && this.coordinateService.flipOrientation) {
            this.coordinateService.flipOrientation();
        }
        if (this._buildBoard) this._buildBoard();
        if (this._buildSquares) this._buildSquares();
        if (this._addListeners) this._addListeners();
        if (this._updateBoardPieces) this._updateBoardPieces(opts.animate !== false);
        console.log('FEN dopo flip:', this.fen(), 'Orientamento:', this.coordinateService.getOrientation());
    }
    /**
     * Set the board orientation
     * @param {'w'|'b'} color
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     */
    setOrientation(color, opts = {}) {
        if (this.validationService.isValidOrientation(color)) {
            this.coordinateService.setOrientation(color);
            if (this._buildBoard) this._buildBoard();
            if (this._buildSquares) this._buildSquares();
            if (this._addListeners) this._addListeners();
            if (this._updateBoardPieces) this._updateBoardPieces(opts.animate !== false);
        }
        return this.coordinateService.getOrientation();
    }
    /**
     * Get the current orientation
     * @returns {'w'|'b'}
     */
    getOrientation() { return this.orientation(); }
    /**
     * Resize the board
     * @param {number|string} size
     */
    resizeBoard(size) {
        if (size === 'auto') {
            this.config.size = 'auto';
            document.documentElement.style.setProperty('--dimBoard', 'auto');
            this._updateBoardPieces(false);
            return true;
        }
        if (typeof size !== 'number' || size < 50 || size > 3000) {
            throw new Error(`[resizeBoard] Invalid size: ${size}`);
        }
        this.config.size = size;
        document.documentElement.style.setProperty('--dimBoard', `${size}px`);
        this._updateBoardPieces(false);
        return true;
    }

    // --- HIGHLIGHTING & UI ---
    /**
     * Highlight a square
     * @param {string|Square} square
     * @param {Object} [opts]
     */
    highlight(square, opts = {}) {
        // API: accetta id, converte subito in oggetto
        const squareObj = typeof square === 'string' ? this.boardService.getSquare(square) : square;
        if (!squareObj || typeof squareObj !== 'object' || !('id' in squareObj)) throw new Error('[highlight] Parametro square non valido');
        if (this.boardService && this.boardService.highlightSquare) {
            this.boardService.highlightSquare(squareObj, opts);
        } else if (this.eventService && this.eventService.highlightSquare) {
            this.eventService.highlightSquare(squareObj, opts);
        }
    }
    /**
     * Remove highlight from a square
     * @param {string|Square} square
     * @param {Object} [opts]
     */
    dehighlight(square, opts = {}) {
        // API: accetta id, converte subito in oggetto
        const squareObj = typeof square === 'string' ? this.boardService.getSquare(square) : square;
        if (!squareObj || typeof squareObj !== 'object' || !('id' in squareObj)) throw new Error('[dehighlight] Parametro square non valido');
        if (this.boardService && this.boardService.dehighlightSquare) {
            this.boardService.dehighlightSquare(squareObj, opts);
        } else if (this.eventService && this.eventService.dehighlightSquare) {
            this.eventService.dehighlightSquare(squareObj, opts);
        }
    }

    // --- GAME INFO ---
    /**
     * Get FEN string
     * @returns {string}
     */
    fen() {
        // Avoid recursion: call the underlying game object's fen()
        const game = this.positionService.getGame();
        if (!game || typeof game.fen !== 'function') return '';
        return game.fen();
    }
    /**
     * Get current turn
     * @returns {'w'|'b'}
     */
    turn() { return this.positionService.getGame().turn(); }
    /**
     * Is the game over?
     * @returns {boolean}
     */
    isGameOver() {
        // Forza sync prima di interrogare il motore
        this._updateBoardPieces(false, false);
        const game = this.positionService.getGame();
        if (!game) return false;
        if (game.isGameOver) return game.isGameOver();
        // Fallback: checkmate or draw
        if (game.isCheckmate && game.isCheckmate()) return true;
        if (game.isDraw && game.isDraw()) return true;
        return false;
    }
    /**
     * Is it checkmate?
     * @returns {boolean}
     */
    isCheckmate() {
        const game = this.positionService.getGame();
        if (!game) return false;
        return game.isCheckmate ? game.isCheckmate() : false;
    }
    /**
     * Is it draw?
     * @returns {boolean}
     */
    isDraw() {
        const game = this.positionService.getGame();
        if (!game) return false;
        return game.isDraw ? game.isDraw() : false;
    }
    /**
     * Get move history
     * @returns {Array}
     */
    getHistory() {
        const game = this.positionService.getGame();
        if (!game) return [];
        return game.history ? game.history() : [];
    }

    // --- LIFECYCLE ---
    /**
     * Destroy the board and cleanup
     */
    destroy() { /* TODO: robust destroy logic */ }
    /**
     * Rebuild the board
     */
    rebuild() { this._initialize(); }

    // --- CONFIGURATION ---
    /**
     * Get current config
     * @returns {Object}
     */
    getConfig() { return this.config; }
    /**
     * Set new config
     * @param {Object} newConfig
     */
    setConfig(newConfig) { this.setConfig(newConfig); }

    // --- ALIASES/DEPRECATED ---
    // Note: These methods are now implemented as aliases at the end of the class

    /**
     * Alias for flipBoard (for backward compatibility)
     */
    flip(opts = {}) {
        this._updateBoardPieces(opts.animate !== false);
        return this.flipBoard(opts);
    }

    /**
     * Gets the current position as an object
     * @returns {Object} Position object
     */
    position() {
        return this.positionService.getPosition();
    }

    /**
     * Sets a new position
     * @param {string|Object} position - New position
     * @param {boolean} [animate=true] - Whether to animate
     */
    position(position, animate = true) {
        if (position === undefined) {
            return this.positionService.getPosition();
        }
        this.load(position, {}, animate); // load() already handles isPositionLoad=true
    }

    /**
     * Undoes the last move
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if undo was successful
     */
    undo(animate = true) {
        const undone = this.positionService.getGame().undo();
        if (undone) {
            this._undoneMoves.push(undone);
            this._updateBoardPieces(animate);
            return undone;
        }
        return null;
    }

    /**
     * Redoes the last undone move
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if redo was successful
     */
    redo(animate = true) {
        if (this._undoneMoves && this._undoneMoves.length > 0) {
            const move = this._undoneMoves.pop();
            const moveObj = { from: move.from, to: move.to };
            if (move.promotion) moveObj.promotion = move.promotion;
            const result = this.positionService.getGame().move(moveObj);
            this._updateBoardPieces(animate);
            return result;
        }
        return false;
    }

    /**
     * Gets the game history
     * @returns {Array} Array of moves
     */
    history() {
        return this.positionService.getGame().history();
    }

    /**
     * Gets the current game state
     * @returns {Object} Game state object
     */
    game() {
        return this.positionService.getGame();
    }

    /**
     * Gets or sets the orientation
     * @param {string} [orientation] - New orientation
     * @returns {string} Current orientation
     */
    orientation(orientation) {
        if (orientation === undefined) {
            return this.coordinateService.getOrientation();
        }

        if (this.validationService.isValidOrientation(orientation)) {
            this.coordinateService.setOrientation(orientation);
            this.flip();
        }

        return this.coordinateService.getOrientation();
    }

    /**
     * Gets or sets the size
     * @param {number|string} [size] - New size
     * @returns {number|string} Current size
     */
    size(size) {
        if (size === undefined) {
            return this.config.size;
        }

        if (this.validationService.isValidSize(size)) {
            this.config.size = size;
            this.resize(size);
        }

        return this.config.size;
    }

    /**
     * Gets legal moves for a square
     * @param {string} square - Square to get moves for
     * @returns {Array} Array of legal moves
     */
    legalMoves(square) {
        const squareObj = this.boardService.getSquare(square);
        if (!squareObj) return [];

        return this.moveService.getCachedLegalMoves(squareObj);
    }

    /**
     * Checks if a move is legal
     * @param {string|Object} move - Move to check
     * @returns {boolean} True if move is legal
     */
    isLegal(move) {
        const moveObj = typeof move === 'string' ? this.moveService.parseMove(move) : move;
        if (!moveObj) return false;

        const fromSquare = this.boardService.getSquare(moveObj.from);
        const toSquare = this.boardService.getSquare(moveObj.to);

        if (!fromSquare || !toSquare) return false;

        const moveInstance = new Move$1(fromSquare, toSquare, moveObj.promotion);
        return moveInstance.isLegal(this.positionService.getGame());
    }

    /**
     * Checks if the game is over
     * @returns {boolean} True if game is over
     */
    isGameOver() {
        return this.positionService.getGame().isGameOver();
    }

    /**
     * Checks if the current player is in check
     * @returns {boolean} True if in check
     */
    inCheck() {
        return this.positionService.getGame().inCheck();
    }

    /**
     * Checks if the current player is in checkmate
     * @returns {boolean} True if in checkmate
     */
    inCheckmate() {
        return this.positionService.getGame().isCheckmate();
    }

    /**
     * Checks if the game is in stalemate
     * @returns {boolean} True if in stalemate
     */
    inStalemate() {
        return this.positionService.getGame().isStalemate();
    }

    /**
     * Checks if the game is drawn
     * @returns {boolean} True if drawn
     */
    inDraw() {
        return this.positionService.getGame().isDraw();
    }

    /**
     * Checks if position is threefold repetition
     * @returns {boolean} True if threefold repetition
     */
    inThreefoldRepetition() {
        return this.positionService.getGame().isThreefoldRepetition();
    }

    /**
     * Gets the PGN representation of the game
     * @returns {string} PGN string
     */
    pgn() {
        return this.positionService.getGame().pgn();
    }

    /**
     * Loads a PGN string
     * @param {string} pgn - PGN string to load
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if loaded successfully
     */
    loadPgn(pgn, animate = true) {
        try {
            const success = this.positionService.getGame().loadPgn(pgn);
            if (success) {
                this._updateBoardPieces(animate, true); // Position load
            }
            return success;
        } catch (error) {
            console.error('Error loading PGN:', error);
            return false;
        }
    }

    /**
     * Gets configuration options
     * @returns {Object} Configuration object
     */
    getConfig() {
        return this.config.getConfig();
    }

    /**
     * Updates configuration options
     * @param {Object} newConfig - New configuration options
     */
    setConfig(newConfig) {
        this.config.update(newConfig);

        // Rebuild board if necessary
        if (newConfig.size !== undefined) {
            this.resize(newConfig.size);
        }

        if (newConfig.orientation !== undefined) {
            this.orientation(newConfig.orientation);
        }
    }

    /**
     * Gets or sets the simultaneous animation delay
     * @param {number} [delay] - New delay in milliseconds
     * @returns {number} Current delay
     */
    simultaneousAnimationDelay(delay) {
        if (delay === undefined) {
            return this.config.simultaneousAnimationDelay;
        }

        if (typeof delay === 'number' && delay >= 0) {
            this.config.simultaneousAnimationDelay = delay;
        }

        return this.config.simultaneousAnimationDelay;
    }

    // Additional API methods would be added here following the same pattern
    // This is a good starting point for the refactored architecture

    // Additional API methods and aliases for backward compatibility
    insert(square, piece) { return this.putPiece(piece, square); }
    build() { return this._initialize(); }
    ascii() { return this.positionService.getGame().ascii(); }
    board() { return this.positionService.getGame().board(); }
    getCastlingRights(color) { return this.positionService.getGame().getCastlingRights(color); }
    getComment() { return this.positionService.getGame().getComment(); }
    getComments() { return this.positionService.getGame().getComments(); }
    lastMove() { return this.positionService.getGame().lastMove(); }
    moveNumber() { return this.positionService.getGame().moveNumber(); }
    moves(options = {}) { return this.positionService.getGame().moves(options); }
    squareColor(squareId) { return this.boardService.getSquare(squareId).isWhite() ? 'light' : 'dark'; }
    isDrawByFiftyMoves() { return this.positionService.getGame().isDrawByFiftyMoves(); }
    isInsufficientMaterial() { return this.positionService.getGame().isInsufficientMaterial(); }
    removeComment() { return this.positionService.getGame().removeComment(); }
    removeComments() { return this.positionService.getGame().removeComments(); }
    removeHeader(field) { return this.positionService.getGame().removeHeader(field); }
    setCastlingRights(color, rights) { return this.positionService.getGame().setCastlingRights(color, rights); }
    setComment(comment) { return this.positionService.getGame().setComment(comment); }
    setHeader(key, value) { return this.positionService.getGame().setHeader(key, value); }
    validateFen(fen) { return this.positionService.getGame().validateFen(fen); }

    // Implementazioni reali per highlight/dehighlight
    highlightSquare(square) {
        return this.boardService.highlight(square);
    }
    dehighlightSquare(square) {
        return this.boardService.dehighlight(square);
    }
    forceSync() { this._updateBoardPieces(true, true); this._updateBoardPieces(true, false); }

    // Metodi mancanti che causano fallimenti nei test
    /**
     * Move a piece from one square to another
     * @param {string|Object} move - Move in format 'e2e4' or {from: 'e2', to: 'e4'}
     * @param {Object} [opts] - Options
     * @param {boolean} [opts.animate=true] - Whether to animate
     * @returns {boolean} True if move was successful
     */
    movePiece(move, opts = {}) {
        const animate = opts.animate !== undefined ? opts.animate : true;

        // --- API: accetta id/stringhe, ma converte subito in oggetti ---
        let fromSquareObj, toSquareObj, promotion;
        if (typeof move === 'string') {
            if (move.length === 4) {
                fromSquareObj = this.boardService.getSquare(move.substring(0, 2));
                toSquareObj = this.boardService.getSquare(move.substring(2, 4));
            } else if (move.length === 5) {
                fromSquareObj = this.boardService.getSquare(move.substring(0, 2));
                toSquareObj = this.boardService.getSquare(move.substring(2, 4));
                promotion = move.substring(4, 5);
            } else {
                throw new Error(`Invalid move format: ${move}`);
            }
        } else if (typeof move === 'object' && move.from && move.to) {
            // Se sono id, converto in oggetti; se sono già oggetti, li uso direttamente
            fromSquareObj = typeof move.from === 'string' ? this.boardService.getSquare(move.from) : move.from;
            toSquareObj = typeof move.to === 'string' ? this.boardService.getSquare(move.to) : move.to;
            promotion = move.promotion;
        } else {
            throw new Error(`Invalid move: ${move}`);
        }

        if (!fromSquareObj || !toSquareObj) {
            throw new Error(`Invalid squares: ${move.from || move.substring(0, 2)} or ${move.to || move.substring(2, 4)}`);
        }

        // --- Internamente: lavora solo con oggetti ---
        const result = this._onMove(fromSquareObj, toSquareObj, promotion, animate);
        // Dopo ogni mossa, forza la sincronizzazione della board
        this._updateBoardPieces(true, false);
        return result;
    }

    // Aliases for backward compatibility
    move(move, animate = true) {
        // On any new move, clear the redo stack
        this._undoneMoves = [];
        return this.movePiece(move, { animate });
    }
    get(square) { return this.getPiece(square); }
    piece(square) { return this.getPiece(square); }
    put(piece, square, opts = {}) { return this.putPiece(piece, square, opts); }
    remove(square, opts = {}) { return this.removePiece(square, opts); }
    load(position, opts = {}) { return this.setPosition(position, opts); }
    resize(size) { return this.resizeBoard(size); }
    start(opts = {}) { return this.reset(opts); }
    clearBoard(opts = {}) { return this.clear(opts); }
};

/**
 * Structured logging system for Chessboard.js
 * @module utils/logger
 * @since 2.0.0
 */

/**
 * Log levels in order of severity
 * @constant
 * @type {Object}
 */
const LOG_LEVELS = Object.freeze({
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
});

/**
 * Default logger configuration
 * @constant
 * @type {Object}
 */
const DEFAULT_CONFIG = Object.freeze({
    level: LOG_LEVELS.INFO,
    enableColors: true,
    enableTimestamp: true,
    enableStackTrace: true,
    maxLogSize: 1000,
    enableConsole: true,
    enableStorage: false,
    storageKey: 'chessboard-logs'
});

/**
 * ANSI color codes for console output
 * @constant
 * @type {Object}
 */
const COLORS = Object.freeze({
    DEBUG: '\x1b[36m',    // Cyan
    INFO: '\x1b[32m',     // Green
    WARN: '\x1b[33m',     // Yellow
    ERROR: '\x1b[31m',    // Red
    RESET: '\x1b[0m'      // Reset
});

/**
 * Structured logger class with configurable output and filtering
 * @class
 */
class Logger {
    /**
     * Creates a new Logger instance
     * @param {Object} [config] - Logger configuration
     * @param {string} [name] - Logger name/namespace
     */
    constructor(config = {}, name = 'Chessboard') {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.name = name;
        this.logs = [];
        this.startTime = Date.now();
        
        // Create bound methods for better performance
        this.debug = this._createLogMethod('DEBUG');
        this.info = this._createLogMethod('INFO');
        this.warn = this._createLogMethod('WARN');
        this.error = this._createLogMethod('ERROR');
        
        // Performance tracking
        this.performances = new Map();
        
        // Initialize storage if enabled
        if (this.config.enableStorage) {
            this._initStorage();
        }
    }

    /**
     * Creates a log method for a specific level
     * @private
     * @param {string} level - Log level
     * @returns {Function} Log method
     */
    _createLogMethod(level) {
        return (message, data = {}, error = null) => {
            this._log(level, message, data, error);
        };
    }

    /**
     * Core logging method
     * @private
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} data - Additional data
     * @param {Error} error - Error object
     */
    _log(level, message, data, error) {
        const levelNumber = LOG_LEVELS[level];
        
        // Filter by level
        if (levelNumber < this.config.level) {
            return;
        }
        
        // Create log entry
        const entry = this._createLogEntry(level, message, data, error);
        
        // Store log entry
        this._storeLogEntry(entry);
        
        // Output to console
        if (this.config.enableConsole) {
            this._outputToConsole(entry);
        }
        
        // Store in localStorage if enabled
        if (this.config.enableStorage) {
            this._storeInStorage(entry);
        }
    }

    /**
     * Creates a structured log entry
     * @private
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} data - Additional data
     * @param {Error} error - Error object
     * @returns {Object} Log entry
     */
    _createLogEntry(level, message, data, error) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            logger: this.name,
            message,
            data: { ...data },
            runtime: Date.now() - this.startTime
        };
        
        // Add error details if provided
        if (error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: this.config.enableStackTrace ? error.stack : null
            };
        }
        
        // Add performance context if available
        if (typeof performance !== 'undefined' && performance.memory) {
            entry.memory = {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
            };
        }
        
        return entry;
    }

    /**
     * Stores log entry in memory
     * @private
     * @param {Object} entry - Log entry
     */
    _storeLogEntry(entry) {
        this.logs.push(entry);
        
        // Limit log size
        if (this.logs.length > this.config.maxLogSize) {
            this.logs.shift();
        }
    }

    /**
     * Outputs log entry to console
     * @private
     * @param {Object} entry - Log entry
     */
    _outputToConsole(entry) {
        const color = this.config.enableColors ? COLORS[entry.level] : '';
        const reset = this.config.enableColors ? COLORS.RESET : '';
        const timestamp = this.config.enableTimestamp ? 
            `[${new Date(entry.timestamp).toLocaleTimeString()}] ` : '';
        
        const prefix = `${color}${timestamp}[${entry.logger}:${entry.level}]${reset}`;
        const message = `${prefix} ${entry.message}`;
        
        // Choose console method based on level
        const consoleMethod = this._getConsoleMethod(entry.level);
        
        if (Object.keys(entry.data).length > 0 || entry.error) {
            consoleMethod(message, {
                data: entry.data,
                error: entry.error,
                runtime: `${entry.runtime}ms`
            });
        } else {
            consoleMethod(message);
        }
    }

    /**
     * Gets appropriate console method for log level
     * @private
     * @param {string} level - Log level
     * @returns {Function} Console method
     */
    _getConsoleMethod(level) {
        switch (level) {
            case 'DEBUG':
                return console.debug || console.log;
            case 'INFO':
                return console.info || console.log;
            case 'WARN':
                return console.warn || console.log;
            case 'ERROR':
                return console.error || console.log;
            default:
                return console.log;
        }
    }

    /**
     * Initializes localStorage for log storage
     * @private
     */
    _initStorage() {
        if (typeof localStorage === 'undefined') {
            this.config.enableStorage = false;
            return;
        }
        
        try {
            // Test localStorage availability
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (error) {
            this.config.enableStorage = false;
            console.warn('localStorage not available, disabling log storage');
        }
    }

    /**
     * Stores log entry in localStorage
     * @private
     * @param {Object} entry - Log entry
     */
    _storeInStorage(entry) {
        if (!this.config.enableStorage) {
            return;
        }
        
        try {
            const stored = JSON.parse(localStorage.getItem(this.config.storageKey) || '[]');
            stored.push(entry);
            
            // Limit stored logs
            if (stored.length > this.config.maxLogSize) {
                stored.shift();
            }
            
            localStorage.setItem(this.config.storageKey, JSON.stringify(stored));
        } catch (error) {
            console.warn('Failed to store log entry:', error);
        }
    }

    /**
     * Starts performance measurement
     * @param {string} name - Performance measurement name
     */
    startPerformance(name) {
        this.performances.set(name, {
            start: performance.now(),
            measurements: []
        });
        
        this.debug(`Started performance measurement: ${name}`);
    }

    /**
     * Ends performance measurement
     * @param {string} name - Performance measurement name
     * @returns {number} Duration in milliseconds
     */
    endPerformance(name) {
        const perf = this.performances.get(name);
        if (!perf) {
            this.warn(`Performance measurement not found: ${name}`);
            return 0;
        }
        
        const duration = performance.now() - perf.start;
        perf.measurements.push(duration);
        
        this.debug(`Performance measurement completed: ${name}`, {
            duration: `${duration.toFixed(2)}ms`,
            measurements: perf.measurements.length
        });
        
        return duration;
    }

    /**
     * Gets performance statistics
     * @param {string} name - Performance measurement name
     * @returns {Object} Performance statistics
     */
    getPerformanceStats(name) {
        const perf = this.performances.get(name);
        if (!perf || perf.measurements.length === 0) {
            return null;
        }
        
        const measurements = perf.measurements;
        const total = measurements.reduce((sum, m) => sum + m, 0);
        const avg = total / measurements.length;
        const min = Math.min(...measurements);
        const max = Math.max(...measurements);
        
        return {
            name,
            count: measurements.length,
            total: total.toFixed(2),
            average: avg.toFixed(2),
            min: min.toFixed(2),
            max: max.toFixed(2)
        };
    }

    /**
     * Creates a child logger with a specific namespace
     * @param {string} namespace - Child logger namespace
     * @returns {Logger} Child logger instance
     */
    child(namespace) {
        return new Logger(this.config, `${this.name}:${namespace}`);
    }

    /**
     * Sets log level
     * @param {string} level - Log level
     */
    setLevel(level) {
        if (LOG_LEVELS[level] !== undefined) {
            this.config.level = LOG_LEVELS[level];
        }
    }

    /**
     * Gets current log level
     * @returns {string} Current log level
     */
    getLevel() {
        return Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === this.config.level);
    }

    /**
     * Gets all stored logs
     * @returns {Array} Array of log entries
     */
    getLogs() {
        return [...this.logs];
    }

    /**
     * Clears all stored logs
     */
    clearLogs() {
        this.logs = [];
        
        if (this.config.enableStorage) {
            try {
                localStorage.removeItem(this.config.storageKey);
            } catch (error) {
                console.warn('Failed to clear stored logs:', error);
            }
        }
    }

    /**
     * Exports logs as JSON
     * @returns {string} JSON string of logs
     */
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    /**
     * Cleans up resources
     */
    destroy() {
        this.clearLogs();
        this.performances.clear();
    }
}

/**
 * Default logger instance
 * @type {Logger}
 */
const logger = new Logger();

/**
 * Creates a logger with specific configuration
 * @param {Object} config - Logger configuration
 * @param {string} name - Logger name
 * @returns {Logger} Logger instance
 */
function createLogger(config, name) {
    return new Logger(config, name);
}

/**
 * Chessboard factory for creating and managing chessboard instances
 * @module core/ChessboardFactory
 * @since 2.0.0
 */


/**
 * Factory class for creating and managing chessboard instances
 * Implements the Factory pattern with instance management
 * @class
 */
class ChessboardFactory {
    /**
     * Creates a new ChessboardFactory instance
     */
    constructor() {
        this.instances = new Map();
        this.validationService = new ValidationService();
        this.performanceMonitor = new PerformanceMonitor();
        this.logger = logger.child('ChessboardFactory');
        
        // Default configuration templates
        this.templates = new Map();
        this._initializeDefaultTemplates();
    }

    /**
     * Initializes default configuration templates
     * @private
     */
    _initializeDefaultTemplates() {
        // Basic template
        this.templates.set('basic', {
            size: 400,
            draggable: true,
            hints: true,
            clickable: true,
            moveHighlight: true,
        });

        // Tournament template
        this.templates.set('tournament', {
            size: 500,
            draggable: false,
            hints: false,
            clickable: true,
            moveHighlight: true,
            onlyLegalMoves: true,
        });

        // Analysis template
        this.templates.set('analysis', {
            size: 600,
            draggable: true,
            hints: true,
            clickable: true,
            moveHighlight: true,
            mode: 'analysis',
        });

        // Puzzle template
        this.templates.set('puzzle', {
            size: 450,
            draggable: true,
            hints: true,
            clickable: true,
            moveHighlight: true,
            onlyLegalMoves: true,
        });

        // Demo template
        this.templates.set('demo', {
            size: 'auto',
            draggable: false,
            hints: false,
            clickable: false,
            moveHighlight: true,
        });
    }

    /**
     * Creates a new chessboard instance
     * @param {string} containerId - Container element ID
     * @param {Object} [config={}] - Configuration options
     * @param {string} [template] - Template name to use
     * @returns {Chessboard} Chessboard instance
     * @throws {ConfigurationError} If configuration is invalid
     */
    create(containerId, config = {}, template = null) {
        this.performanceMonitor.startMeasure('chessboard-creation');
        
        try {
            // Validate container ID
            if (!containerId || typeof containerId !== 'string') {
                throw new ConfigurationError('Container ID must be a non-empty string', 'containerId', containerId);
            }

            // Check if container exists
            const container = document.getElementById(containerId);
            if (!container) {
                throw new ConfigurationError(`Container element not found: ${containerId}`, 'containerId', containerId);
            }

            // Merge configuration with template if specified
            let finalConfig = { ...config };
            if (template) {
                const templateConfig = this.templates.get(template);
                if (!templateConfig) {
                    this.logger.warn(`Template "${template}" not found, using default configuration`);
                } else {
                    finalConfig = { ...templateConfig, ...config };
                    this.logger.info(`Using template "${template}" for chessboard creation`);
                }
            }

            // Set container ID
            finalConfig.id = containerId;

            // Validate configuration
            this.validationService.validateConfig(finalConfig);

            // Create chessboard instance
            const chessboard = new Chessboard$1(finalConfig);

            // Store instance for management
            this.instances.set(containerId, {
                instance: chessboard,
                config: finalConfig,
                template,
                createdAt: new Date(),
                container
            });

            this.performanceMonitor.endMeasure('chessboard-creation');
            this.logger.info(`Created chessboard instance for container: ${containerId}`, {
                template,
                configKeys: Object.keys(finalConfig)
            });

            return chessboard;
        } catch (error) {
            this.performanceMonitor.endMeasure('chessboard-creation');
            this.logger.error('Failed to create chessboard instance', { containerId, error });
            throw error;
        }
    }

    /**
     * Creates a chessboard using a predefined template
     * @param {string} containerId - Container element ID
     * @param {string} templateName - Template name
     * @param {Object} [overrides={}] - Configuration overrides
     * @returns {Chessboard} Chessboard instance
     */
    createFromTemplate(containerId, templateName, overrides = {}) {
        return this.create(containerId, overrides, templateName);
    }

    /**
     * Gets an existing chessboard instance
     * @param {string} containerId - Container element ID
     * @returns {Chessboard|null} Chessboard instance or null if not found
     */
    getInstance(containerId) {
        const instance = this.instances.get(containerId);
        return instance ? instance.instance : null;
    }

    /**
     * Gets information about an instance
     * @param {string} containerId - Container element ID
     * @returns {Object|null} Instance information or null if not found
     */
    getInstanceInfo(containerId) {
        const instance = this.instances.get(containerId);
        if (!instance) {
            return null;
        }

        return {
            containerId,
            template: instance.template,
            createdAt: instance.createdAt,
            config: { ...instance.config }
        };
    }

    /**
     * Destroys a chessboard instance
     * @param {string} containerId - Container element ID
     * @returns {boolean} True if instance was destroyed, false if not found
     */
    destroy(containerId) {
        const instance = this.instances.get(containerId);
        if (!instance) {
            this.logger.warn(`Instance not found for destruction: ${containerId}`);
            return false;
        }

        try {
            // Destroy the chessboard instance
            instance.instance.destroy();
            
            // Remove from instances map
            this.instances.delete(containerId);
            
            this.logger.info(`Destroyed chessboard instance: ${containerId}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to destroy chessboard instance: ${containerId}`, { error });
            return false;
        }
    }

    /**
     * Destroys all chessboard instances
     */
    destroyAll() {
        const containerIds = Array.from(this.instances.keys());
        let destroyed = 0;

        for (const containerId of containerIds) {
            if (this.destroy(containerId)) {
                destroyed++;
            }
        }

        this.logger.info(`Destroyed ${destroyed} chessboard instances`);
    }

    /**
     * Lists all active chessboard instances
     * @returns {Array} Array of instance information
     */
    listInstances() {
        return Array.from(this.instances.keys()).map(containerId => 
            this.getInstanceInfo(containerId)
        );
    }

    /**
     * Registers a new configuration template
     * @param {string} name - Template name
     * @param {Object} config - Template configuration
     * @throws {ConfigurationError} If template name or config is invalid
     */
    registerTemplate(name, config) {
        if (!name || typeof name !== 'string') {
            throw new ConfigurationError('Template name must be a non-empty string', 'name', name);
        }

        if (!config || typeof config !== 'object') {
            throw new ConfigurationError('Template configuration must be an object', 'config', config);
        }

        // Validate template configuration
        this.validationService.validateConfig(config);

        this.templates.set(name, { ...config });
        this.logger.info(`Registered template: ${name}`, { configKeys: Object.keys(config) });
    }

    /**
     * Removes a configuration template
     * @param {string} name - Template name
     * @returns {boolean} True if template was removed, false if not found
     */
    removeTemplate(name) {
        const removed = this.templates.delete(name);
        if (removed) {
            this.logger.info(`Removed template: ${name}`);
        }
        return removed;
    }

    /**
     * Gets a configuration template
     * @param {string} name - Template name
     * @returns {Object|null} Template configuration or null if not found
     */
    getTemplate(name) {
        const template = this.templates.get(name);
        return template ? { ...template } : null;
    }

    /**
     * Lists all available templates
     * @returns {Array} Array of template names
     */
    listTemplates() {
        return Array.from(this.templates.keys());
    }

    /**
     * Creates multiple chessboard instances from a configuration array
     * @param {Array} configurations - Array of configuration objects
     * @returns {Array} Array of created chessboard instances
     */
    createMultiple(configurations) {
        const instances = [];
        const errors = [];

        for (const config of configurations) {
            try {
                const { containerId, template, ...options } = config;
                const instance = this.create(containerId, options, template);
                instances.push({ containerId, instance, success: true });
            } catch (error) {
                errors.push({ containerId: config.containerId, error, success: false });
                this.logger.error(`Failed to create instance for ${config.containerId}`, { error });
            }
        }

        if (errors.length > 0) {
            this.logger.warn(`Failed to create ${errors.length} out of ${configurations.length} instances`);
        }

        return { instances, errors };
    }

    /**
     * Gets factory statistics
     * @returns {Object} Factory statistics
     */
    getStats() {
        const stats = {
            activeInstances: this.instances.size,
            availableTemplates: this.templates.size,
            performance: this.performanceMonitor.getMetrics(),
            validation: this.validationService.getCacheStats()
        };

        return stats;
    }

    /**
     * Cleans up factory resources
     */
    destroy() {
        this.destroyAll();
        this.validationService.destroy();
        this.performanceMonitor.destroy();
        this.templates.clear();
    }
}

/**
 * Default factory instance
 * @type {ChessboardFactory}
 */
const chessboardFactory = new ChessboardFactory();

/**
 * Convenience method to create a chessboard instance
 * @param {string} containerId - Container element ID
 * @param {Object} [config={}] - Configuration options
 * @param {string} [template] - Template name to use
 * @returns {Chessboard} Chessboard instance
 */
function createChessboard(containerId, config = {}, template = null) {
    return chessboardFactory.create(containerId, config, template);
}

/**
 * Convenience method to create a chessboard from template
 * @param {string} containerId - Container element ID
 * @param {string} templateName - Template name
 * @param {Object} [overrides={}] - Configuration overrides
 * @returns {Chessboard} Chessboard instance
 */
function createChessboardFromTemplate(containerId, templateName, overrides = {}) {
    return chessboardFactory.createFromTemplate(containerId, templateName, overrides);
}

/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Entry point for the core library
 * @module core
 * @since 2.0.0
 */


/**
 * Main Chessboard factory function for backward compatibility
 * Supports both legacy and modern calling conventions
 * @param {string|Object} containerElm - Container element ID or configuration object
 * @param {Object} [config={}] - Configuration options (when first param is string)
 * @returns {ChessboardClass} Chessboard instance
 */
function Chessboard(containerElm, config = {}) {
    const factoryLogger = logger.child('ChessboardFactory');

    try {
        // If first parameter is an object, treat it as config
        if (typeof containerElm === 'object' && containerElm !== null) {
            factoryLogger.debug('Creating chessboard with config object');
            return new Chessboard$1(containerElm);
        }

        // Otherwise, treat first parameter as element ID
        if (typeof containerElm === 'string') {
            factoryLogger.debug('Creating chessboard with element ID', { elementId: containerElm });
            const fullConfig = { ...config, id: containerElm };
            return new Chessboard$1(fullConfig);
        }

        throw new Error('Invalid parameters: first parameter must be string or object');
    } catch (error) {
        factoryLogger.error('Failed to create chessboard instance', { error });
        throw error;
    }
}

/**
 * Wrapper class that handles both calling conventions
 * Provides enhanced error handling and logging
 * @class
 * @extends ChessboardClass
 */
class ChessboardWrapper extends Chessboard$1 {
    /**
     * Creates a new ChessboardWrapper instance
     * @param {string|Object} containerElm - Container element ID or configuration object
     * @param {Object} [config={}] - Configuration options
     */
    constructor(containerElm, config = {}) {
        const instanceLogger = logger.child('ChessboardWrapper');

        try {
            // If first parameter is an object, treat it as config
            if (typeof containerElm === 'object' && containerElm !== null) {
                instanceLogger.debug('Initializing with config object');
                super(containerElm);
            } else if (typeof containerElm === 'string') {
                // Otherwise, treat first parameter as element ID
                instanceLogger.debug('Initializing with element ID', { elementId: containerElm });
                const fullConfig = { ...config, id: containerElm };
                super(fullConfig);
            } else {
                throw new Error('Invalid constructor parameters');
            }
        } catch (error) {
            instanceLogger.error('Failed to initialize ChessboardWrapper', { error });
            throw error;
        }
    }
}

/**
 * Refactored Chessboard API - see Chessboard.js for full method docs
 * @typedef {import('./Chessboard.js').Chessboard} Chessboard
 */

// --- STATIC/FACTORY METHODS ---
/**
 * Create a new Chessboard instance
 * @param {string|Object} containerElm
 * @param {Object} [config]
 * @returns {Chessboard}
 */
Chessboard.create = createChessboard;
/**
 * Create a Chessboard from a template
 * @param {string|Object} containerElm
 * @param {string} templateName
 * @param {Object} [config]
 * @returns {Chessboard}
 */
Chessboard.fromTemplate = createChessboardFromTemplate;
Chessboard.factory = chessboardFactory;

// --- INSTANCE MANAGEMENT ---
Chessboard.getInstance = (containerId) => chessboardFactory.getInstance(containerId);
Chessboard.destroyInstance = (containerId) => chessboardFactory.destroy(containerId);
Chessboard.destroyAll = () => chessboardFactory.destroyAll();
Chessboard.listInstances = () => chessboardFactory.listInstances();

// --- TEMPLATE MANAGEMENT ---
Chessboard.registerTemplate = (name, config) => chessboardFactory.registerTemplate(name, config);
Chessboard.removeTemplate = (name) => chessboardFactory.removeTemplate(name);
Chessboard.getTemplate = (name) => chessboardFactory.getTemplate(name);
Chessboard.listTemplates = () => chessboardFactory.listTemplates();

// --- STATS & DEBUG ---
Chessboard.getStats = () => chessboardFactory.getStats();

// --- DEPRECATED/LEGACY ALIASES ---
/**
 * @deprecated Use Chessboard.create instead
 */
Chessboard.Class = ChessboardWrapper;
Chessboard.Chessboard = ChessboardWrapper;
Chessboard.Config = ChessboardConfig;
Chessboard.Factory = ChessboardFactory;

/**
 * Coordinate utilities for Chessboard.js
 */

/**
 * Convert algebraic notation to array coordinates
 * @param {string} square - Square in algebraic notation (e.g., 'a1', 'h8')
 * @returns {Object} Object with row and col properties
 */
function algebraicToCoords(square) {
  const file = square.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
  const rank = parseInt(square[1]) - 1;    // '1' = 0, '2' = 1, etc.
  
  return { row: 7 - rank, col: file };
}

/**
 * Convert array coordinates to algebraic notation
 * @param {number} row - Row index (0-7)
 * @param {number} col - Column index (0-7)
 * @returns {string} Square in algebraic notation
 */
function coordsToAlgebraic(row, col) {
  const file = String.fromCharCode(97 + col); // 0 = 'a', 1 = 'b', etc.
  const rank = (8 - row).toString();          // 0 = '8', 1 = '7', etc.
  
  return file + rank;
}

/**
 * Get the color of a square
 * @param {string} square - Square in algebraic notation
 * @returns {string} 'light' or 'dark'
 */
function getSquareColor(square) {
  const { row, col } = algebraicToCoords(square);
  return (row + col) % 2 === 0 ? 'dark' : 'light';
}

/**
 * Check if coordinates are valid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean} True if coordinates are valid
 */
function isValidCoords(row, col) {
  return row >= 0 && row <= 7 && col >= 0 && col <= 7;
}

/**
 * Check if algebraic notation is valid
 * @param {string} square - Square in algebraic notation
 * @returns {boolean} True if square notation is valid
 */
function isValidSquare$1(square) {
  if (typeof square !== 'string' || square.length !== 2) return false;
  
  const file = square[0];
  const rank = square[1];
  
  return file >= 'a' && file <= 'h' && rank >= '1' && rank <= '8';
}

/**
 * Validation utilities for Chessboard.js
 * @module utils/validation
 * @since 2.0.0
 */


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
function isValidPiece(piece) {
    if (typeof piece !== 'string' || piece.length !== 2) {
        return false;
    }
    
    const cacheKey = `piece:${piece}`;
    if (validationCache.has(cacheKey)) {
        return validationCache.get(cacheKey);
    }
    
    const color = piece[0];
    const type = piece[1];
    
    const isValid = ['w', 'b'].includes(color) && 
                   ['P', 'R', 'N', 'B', 'Q', 'K'].includes(type);
    
    cacheResult(cacheKey, isValid);
    return isValid;
}

/**
 * Validate position object with comprehensive checks
 * @param {Object} position - Position object with square-piece mappings
 * @returns {boolean} True if position is valid
 */
function isValidPosition(position) {
    if (typeof position !== 'object' || position === null) {
        return false;
    }
    
    // Check for circular references
    try {
        JSON.stringify(position);
    } catch (error) {
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
    const whiteKings = pieces.filter(p => p === 'wK').length;
    const blackKings = pieces.filter(p => p === 'bK').length;
    
    // Must have exactly one king of each color
    if (whiteKings !== 1 || blackKings !== 1) {
        return false;
    }
    
    // Count pawns (max 8 per side)
    const whitePawns = pieces.filter(p => p === 'wP').length;
    const blackPawns = pieces.filter(p => p === 'bP').length;
    
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
function validateFenFormat(fen) {
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
function validateMove(move) {
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
function validateConfig(config) {
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
    
    if (config.movableColors && !['white', 'black', 'w', 'b', 'both', 'none'].includes(config.movableColors)) {
        errors.push('Invalid movableColors. Must be "white", "black", "w", "b", "both", or "none"');
    }
    
    if (config.dropOffBoard && !['snapback', 'trash'].includes(config.dropOffBoard)) {
        errors.push('Invalid dropOffBoard. Must be "snapback" or "trash"');
    }
    
    // Validate callback functions
    const callbacks = ['onMove', 'onMoveEnd', 'onChange', 'onDragStart', 'onDragMove', 'onDrop', 'onSnapbackEnd'];
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
        
    return {
        success: errors.length === 0,
        errors
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
        'white', 'black', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta',
        'transparent', 'gray', 'grey', 'brown', 'orange', 'purple', 'pink'
    ];
    
    return namedColors.includes(color.toLowerCase());
}

/**
 * Validates easing function
 * @param {string} easing - Easing function name
 * @returns {boolean} True if valid
 */
function isValidEasing(easing) {
    const validEasing = [
        'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out',
        'cubic-bezier'
    ];
    
    return validEasing.includes(easing) || 
           /^cubic-bezier\(\s*[\d.-]+\s*,\s*[\d.-]+\s*,\s*[\d.-]+\s*,\s*[\d.-]+\s*\)$/.test(easing);
}

/**
 * Batch validates multiple items
 * @param {Array} items - Array of validation items
 * @returns {Array} Array of validation results
 */
function batchValidate(items) {
    return items.map(item => {
        const { type, value } = item;
        
        switch (type) {
            case 'piece':
                return { ...item, valid: isValidPiece(value) };
            case 'square':
                return { ...item, valid: isValidSquare(value) };
            case 'position':
                return { ...item, valid: isValidPosition(value) };
            case 'fen':
                const fenResult = validateFenFormat(value);
                return { ...item, valid: fenResult.success, error: fenResult.error };
            case 'move':
                const moveResult = validateMove(value);
                return { ...item, valid: moveResult.success, error: moveResult.error };
            case 'config':
                const configResult = validateConfig(value);
                return { ...item, valid: configResult.success, errors: configResult.errors };
            default:
                return { ...item, valid: false, error: 'Unknown validation type' };
        }
    });
}

/**
 * Clears validation cache
 */
function clearValidationCache() {
    validationCache.clear();
}

/**
 * Gets validation cache statistics
 * @returns {Object} Cache statistics
 */
function getValidationCacheStats() {
    return {
        size: validationCache.size,
        maxSize: CACHE_MAX_SIZE
    };
}

/**
 * Animation utilities for Chessboard.js
 */

/**
 * Get the CSS transition duration in milliseconds
 * @param {string|number} time - Time value ('fast', 'slow', or number in ms)
 * @returns {number} Duration in milliseconds
 */
function parseTime(time) {
  if (typeof time === 'number') return time;
  
  switch (time) {
    case 'fast': return 150;
    case 'slow': return 500;
    default: return 200;
  }
}

/**
 * Get the CSS transition function
 * @param {string} animation - Animation type ('ease', 'linear', etc.)
 * @returns {string} CSS transition function
 */
function parseAnimation(animation) {
  const validAnimations = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'];
  return validAnimations.includes(animation) ? animation : 'ease';
}

/**
 * Create a promise that resolves after animation completion
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise} Promise that resolves after the duration
 */
function animationPromise(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Chessboard.js - A beautiful, customizable chessboard widget
 * Main entry point for the library
 * 
 * @version 2.2.1
 * @author alepot55
 * @license ISC
 */


// Version information
const version = '2.2.1';
const build = 'dev';
const buildDate = new Date().toISOString();

// Library information
const info = {
    name: 'Chessboard.js',
    version,
    build,
    buildDate,
    author: 'alepot55',
    license: 'ISC',
    repository: 'https://github.com/alepot55/Chessboardjs',
    homepage: 'https://chessboardjs.com'
};

exports.AnimationService = AnimationService;
exports.BOARD_LETTERS = BOARD_LETTERS;
exports.BOARD_SIZE = BOARD_SIZE;
exports.BoardService = BoardService;
exports.Chess = Chess;
exports.Chessboard = Chessboard;
exports.ChessboardConfig = ChessboardConfig;
exports.ChessboardError = ChessboardError;
exports.ChessboardFactory = ChessboardFactory;
exports.ConfigurationError = ConfigurationError;
exports.CoordinateService = CoordinateService;
exports.DEFAULT_STARTING_POSITION = DEFAULT_STARTING_POSITION;
exports.DOMError = DOMError;
exports.EventService = EventService;
exports.LOG_LEVELS = LOG_LEVELS;
exports.Logger = Logger;
exports.Move = Move$1;
exports.MoveError = MoveError;
exports.MoveService = MoveService;
exports.PIECE_COLORS = PIECE_COLORS;
exports.PIECE_TYPES = PIECE_TYPES;
exports.PROMOTION_PIECES = PROMOTION_PIECES;
exports.PerformanceMonitor = PerformanceMonitor;
exports.Piece = Piece;
exports.PieceError = PieceError;
exports.PieceService = PieceService;
exports.PositionService = PositionService;
exports.STANDARD_POSITIONS = STANDARD_POSITIONS;
exports.Square = Square;
exports.ValidationError = ValidationError;
exports.ValidationService = ValidationService;
exports.algebraicToCoords = algebraicToCoords;
exports.animationPromise = animationPromise;
exports.batchDOMOperations = batchDOMOperations;
exports.batchValidate = batchValidate;
exports.build = build;
exports.buildDate = buildDate;
exports.chessboardFactory = chessboardFactory;
exports.clearValidationCache = clearValidationCache;
exports.coordsToAlgebraic = coordsToAlgebraic;
exports.createChessboard = createChessboard;
exports.createChessboardFromTemplate = createChessboardFromTemplate;
exports.createLogger = createLogger;
exports.debounce = debounce;
exports.default = Chessboard;
exports.getMemoryUsage = getMemoryUsage;
exports.getSquareColor = getSquareColor;
exports.getValidationCacheStats = getValidationCacheStats;
exports.info = info;
exports.isElementVisible = isElementVisible;
exports.isValidCoords = isValidCoords;
exports.isValidPiece = isValidPiece;
exports.isValidPosition = isValidPosition;
exports.isValidSquare = isValidSquare$1;
exports.logger = logger;
exports.parseAnimation = parseAnimation;
exports.parseTime = parseTime;
exports.rafThrottle = rafThrottle;
exports.resetTransform = resetTransform;
exports.setTransform = setTransform;
exports.throttle = throttle;
exports.validateConfig = validateConfig;
exports.validateFen = validateFen;
exports.validateFenFormat = validateFenFormat;
exports.validateMove = validateMove;
exports.version = version;
