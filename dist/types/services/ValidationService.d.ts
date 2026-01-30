/**
 * Service responsible for validating inputs and data
 * Implements caching for performance optimization
 * @class
 */
export class ValidationService {
    _validationCache: Map<any, any>;
    _cacheMaxSize: number;
    _patterns: Object;
    _validValues: Object;
    _constraints: Object;
    /**
     * Validates a square identifier with caching
     * @param {string} square - Square to validate (e.g., 'e4')
     * @returns {boolean} True if valid
     */
    isValidSquare(square: string): boolean;
    /**
     * Validates a piece identifier with enhanced format support
     * @param {string} piece - Piece to validate (e.g., 'wK', 'bp')
     * @returns {boolean} True if valid
     */
    isValidPiece(piece: string): boolean;
    /**
     * Validates a FEN string with comprehensive checks
     * @param {string} fen - FEN string to validate
     * @returns {boolean} True if valid
     */
    isValidFen(fen: string): boolean;
    /**
     * Validates FEN structure in detail
     * @private
     * @param {string} fen - FEN string to validate
     * @returns {boolean} True if valid
     */
    private _validateFenStructure;
    /**
     * Validates a single rank in FEN notation
     * @private
     * @param {string} rank - Rank to validate
     * @returns {boolean} True if valid
     */
    private _validateRank;
    /**
     * Validates a move string with comprehensive format support
     * @param {string} move - Move string to validate (e.g., 'e2e4', 'e7e8q')
     * @returns {boolean} True if valid
     */
    isValidMove(move: string): boolean;
    /**
     * Validates move format in detail
     * @private
     * @param {string} move - Move string to validate
     * @returns {boolean} True if valid
     */
    private _validateMoveFormat;
    /**
     * Validates board orientation
     * @param {string} orientation - Orientation to validate
     * @returns {boolean} True if valid
     */
    isValidOrientation(orientation: string): boolean;
    /**
     * Validates a color value
     * @param {string} color - Color to validate
     * @returns {boolean} True if valid
     */
    isValidColor(color: string): boolean;
    /**
     * Validates a size value with constraints
     * @param {number|string} size - Size to validate
     * @returns {boolean} True if valid
     */
    isValidSize(size: number | string): boolean;
    /**
     * Validates a time value with constraints
     * @param {number} time - Time value to validate
     * @returns {boolean} True if valid
     */
    isValidTime(time: number): boolean;
    /**
     * Validates a callback function
     * @param {Function} callback - Callback to validate
     * @returns {boolean} True if valid
     */
    isValidCallback(callback: Function): boolean;
    /**
     * Validates a DOM element ID
     * @param {string} id - Element ID to validate
     * @returns {boolean} True if valid
     */
    isValidElementId(id: string): boolean;
    /**
     * Validates movable colors configuration
     * @param {string} colors - Colors value to validate
     * @returns {boolean} True if valid
     */
    isValidMovableColors(colors: string): boolean;
    /**
     * Validates drop off board configuration
     * @param {string} dropOff - Drop off board value to validate
     * @returns {boolean} True if valid
     */
    isValidDropOffBoard(dropOff: string): boolean;
    /**
     * Validates animation easing type
     * @param {string} easing - Easing type to validate
     * @returns {boolean} True if valid
     */
    isValidEasing(easing: string): boolean;
    /**
     * Validates animation style
     * @param {string} style - Animation style to validate
     * @returns {boolean} True if valid
     */
    isValidAnimationStyle(style: string): boolean;
    /**
     * Validates CSS color format
     * @param {string} color - Color string to validate
     * @returns {boolean} True if valid
     */
    isValidCSSColor(color: string): boolean;
    /**
     * Validates and sanitizes a square identifier
     * @param {string} square - Square to validate
     * @returns {string} Sanitized square
     * @throws {ValidationError} If square is invalid
     */
    validateSquare(square: string): string;
    /**
     * Validates and sanitizes a piece identifier
     * @param {string} piece - Piece to validate
     * @returns {string} Sanitized piece
     * @throws {ValidationError} If piece is invalid
     */
    validatePiece(piece: string): string;
    /**
     * Validates and sanitizes a FEN string
     * @param {string} fen - FEN to validate
     * @returns {string} Sanitized FEN
     * @throws {ValidationError} If FEN is invalid
     */
    validateFen(fen: string): string;
    /**
     * Validates and sanitizes a move string
     * @param {string} move - Move to validate
     * @returns {string} Sanitized move
     * @throws {ValidationError} If move is invalid
     */
    validateMove(move: string): string;
    /**
     * Validates and sanitizes orientation
     * @param {string} orientation - Orientation to validate
     * @returns {string} Sanitized orientation ('w' or 'b')
     * @throws {ValidationError} If orientation is invalid
     */
    validateOrientation(orientation: string): string;
    /**
     * Validates and sanitizes color
     * @param {string} color - Color to validate
     * @returns {string} Sanitized color ('w' or 'b')
     * @throws {ValidationError} If color is invalid
     */
    validateColor(color: string): string;
    /**
     * Validates and sanitizes size
     * @param {number|string} size - Size to validate
     * @returns {number|string} Sanitized size
     * @throws {ValidationError} If size is invalid
     */
    validateSize(size: number | string): number | string;
    /**
     * Validates configuration object with comprehensive checks
     * @param {Object} config - Configuration to validate
     * @returns {Object} Validated configuration
     * @throws {ValidationError} If configuration is invalid
     */
    validateConfig(config: Object): Object;
    /**
     * Caches validation result for performance
     * @private
     * @param {string} key - Cache key
     * @param {boolean} result - Validation result
     */
    private _cacheValidationResult;
    /**
     * Clears the validation cache
     */
    clearCache(): void;
    /**
     * Gets validation cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats(): Object;
    /**
     * Batch validates multiple values
     * @param {Array} validations - Array of validation objects
     * @returns {Array} Array of validation results
     */
    batchValidate(validations: any[]): any[];
    /**
     * Cleans up resources
     */
    destroy(): void;
}
//# sourceMappingURL=ValidationService.d.ts.map