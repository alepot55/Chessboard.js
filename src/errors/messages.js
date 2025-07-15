/**
 * Error messages and error handling utilities
 * @module errors/messages
 * @since 2.0.0
 */

/**
 * Standardized error messages for the chessboard application
 * @type {Object.<string, string>}
 * @readonly
 */
export const ERROR_MESSAGES = {
    // Position and FEN related
    'invalid_position': 'Invalid position - ',
    'invalid_fen': 'Invalid fen - ',
    
    // DOM and UI related
    'invalid_id_div': 'Board id not found - ',
    'invalid_value': 'Invalid value - ',
    
    // Piece related
    'invalid_piece': 'Invalid piece - ',
    'invalid_square': 'Invalid square - ',
    'invalid_piecesPath': 'Invalid piecesPath - ',
    
    // Board configuration
    'invalid_orientation': 'Invalid orientation - ',
    'invalid_color': 'Invalid color - ',
    'invalid_mode': 'Invalid mode - ',
    'invalid_dropOffBoard': 'Invalid dropOffBoard - ',
    
    // Animation related
    'invalid_snapbackTime': 'Invalid snapbackTime - ',
    'invalid_snapbackAnimation': 'Invalid snapbackAnimation - ',
    'invalid_fadeTime': 'Invalid fadeTime - ',
    'invalid_fadeAnimation': 'Invalid fadeAnimation - ',
    'invalid_ratio': 'Invalid ratio - ',
    
    // Event handlers
    'invalid_onMove': 'Invalid onMove - ',
    'invalid_onMoveEnd': 'Invalid onMoveEnd - ',
    'invalid_onChange': 'Invalid onChange - ',
    'invalid_onDragStart': 'Invalid onDragStart - ',
    'invalid_onDragMove': 'Invalid onDragMove - ',
    'invalid_onDrop': 'Invalid onDrop - ',
    'invalid_onSnapbackEnd': 'Invalid onSnapbackEnd - ',
    
    // Visual styling
    'invalid_whiteSquare': 'Invalid whiteSquare - ',
    'invalid_blackSquare': 'Invalid blackSquare - ',
    'invalid_highlight': 'Invalid highlight - ',
    'invalid_selectedSquareWhite': 'Invalid selectedSquareWhite - ',
    'invalid_selectedSquareBlack': 'Invalid selectedSquareBlack - ',
    'invalid_movedSquareWhite': 'Invalid movedSquareWhite - ',
    'invalid_movedSquareBlack': 'Invalid movedSquareBlack - ',
    'invalid_choiceSquare': 'Invalid choiceSquare - ',
    'invalid_coverSquare': 'Invalid coverSquare - ',
    'invalid_hintColor': 'Invalid hintColor - ',
    
    // Move related
    'invalid_move': 'Invalid move - ',
    'move_execution_failed': 'Move execution failed - ',
    'square_no_piece': 'Square has no piece to remove.',
    'invalid_move_format': 'Invalid move format'
};

/**
 * Error codes for categorizing different types of errors
 * @type {Object.<string, string>}
 * @readonly
 */
export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    CONFIG_ERROR: 'CONFIG_ERROR',
    MOVE_ERROR: 'MOVE_ERROR',
    DOM_ERROR: 'DOM_ERROR',
    ANIMATION_ERROR: 'ANIMATION_ERROR',
    PIECE_ERROR: 'PIECE_ERROR'
};
