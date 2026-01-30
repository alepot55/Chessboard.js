/**
 * Base error class for all chessboard-related errors
 * @class
 * @extends Error
 */
export class ChessboardError extends Error {
    /**
     * Creates a new ChessboardError instance
     * @param {string} message - Error message
     * @param {string} code - Error code from ERROR_CODES
     * @param {Object} [context={}] - Additional context information
     */
    constructor(message: string, code: string, context?: Object);
    code: string;
    context: Object;
    timestamp: string;
}
/**
 * Error thrown when validation fails
 * @class
 * @extends ChessboardError
 */
export class ValidationError extends ChessboardError {
    /**
     * Creates a new ValidationError instance
     * @param {string} message - Error message
     * @param {string} field - Field that failed validation
     * @param {*} value - Value that failed validation
     */
    constructor(message: string, field: string, value: any);
    field: string;
    value: any;
}
/**
 * Error thrown when configuration is invalid
 * @class
 * @extends ChessboardError
 */
export class ConfigurationError extends ChessboardError {
    /**
     * Creates a new ConfigurationError instance
     * @param {string} message - Error message
     * @param {string} configKey - Configuration key that is invalid
     * @param {*} configValue - Configuration value that is invalid
     */
    constructor(message: string, configKey: string, configValue: any);
    configKey: string;
    configValue: any;
}
/**
 * Error thrown when a move is invalid or fails
 * @class
 * @extends ChessboardError
 */
export class MoveError extends ChessboardError {
    /**
     * Creates a new MoveError instance
     * @param {string} message - Error message
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @param {string} [piece] - Piece being moved
     */
    constructor(message: string, from: string, to: string, piece?: string);
    from: string;
    to: string;
    piece: string | undefined;
}
/**
 * Error thrown when DOM operations fail
 * @class
 * @extends ChessboardError
 */
export class DOMError extends ChessboardError {
    /**
     * Creates a new DOMError instance
     * @param {string} message - Error message
     * @param {string} elementId - Element ID that caused the error
     */
    constructor(message: string, elementId: string);
    elementId: string;
}
/**
 * Error thrown when piece operations fail
 * @class
 * @extends ChessboardError
 */
export class PieceError extends ChessboardError {
    /**
     * Creates a new PieceError instance
     * @param {string} message - Error message
     * @param {string} pieceId - Piece ID that caused the error
     * @param {string} [square] - Square where the error occurred
     */
    constructor(message: string, pieceId: string, square?: string);
    pieceId: string;
    square: string | undefined;
}
//# sourceMappingURL=ChessboardError.d.ts.map