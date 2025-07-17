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
export const ERROR_CODES = Object.freeze({
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
export const ERROR_MESSAGES = Object.freeze({
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
export const ERROR_SEVERITY = Object.freeze({
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
export const ERROR_SEVERITY_MAP = Object.freeze({
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
 * Utility function to get error severity
 * @param {string} errorCode - Error code
 * @returns {string} Error severity level
 */
export function getErrorSeverity(errorCode) {
    return ERROR_SEVERITY_MAP[errorCode] || ERROR_SEVERITY.MEDIUM;
}

/**
 * Utility function to format error message
 * @param {string} messageKey - Message key from ERROR_MESSAGES
 * @param {string} [details] - Additional details
 * @returns {string} Formatted error message
 */
export function formatErrorMessage(messageKey, details = '') {
    const message = ERROR_MESSAGES[messageKey];
    if (!message) {
        return `Unknown error: ${messageKey}${details ? ` - ${details}` : ''}`;
    }
    return `${message}${details}`;
}

/**
 * Utility function to create error context
 * @param {string} operation - Operation that failed
 * @param {Object} [data] - Additional context data
 * @returns {Object} Error context object
 */
export function createErrorContext(operation, data = {}) {
    return {
        operation,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
        ...data
    };
}
