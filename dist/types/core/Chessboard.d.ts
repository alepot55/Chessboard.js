import { PerformanceMonitor } from '../utils/performance.js';
import { default as ChessboardConfig } from './ChessboardConfig.js';
import { ValidationService, CoordinateService, PositionService, BoardService, PieceService, AnimationService, MoveService, EventService } from '../services/index.js';
export default Chessboard;
/**
 * Main Chessboard class responsible for coordinating all services
 * Implements the Facade pattern to provide a unified interface
 * @class
 */
export class Chessboard {
    /**
     * Creates a new Chessboard instance
     * @param {Object} config - Configuration object
     * @throws {ConfigurationError} If configuration is invalid
     */
    constructor(config: Object);
    _performanceMonitor: PerformanceMonitor | undefined;
    _undoneMoves: any[];
    /**
     * Validates and initializes configuration
     * @private
     * @param {Object} config - Raw configuration object
     * @throws {ConfigurationError} If configuration is invalid
     */
    private _validateAndInitializeConfig;
    config: ChessboardConfig | undefined;
    /**
     * Handles constructor errors gracefully
     * @private
     * @param {Error} error - Error that occurred during construction
     */
    private _handleConstructorError;
    /**
     * Cleans up any partially initialized resources (safe to call multiple times)
     * @private
     */
    private _cleanup;
    _updateTimeout: any;
    validationService: ValidationService | null | undefined;
    coordinateService: CoordinateService | null | undefined;
    positionService: PositionService | null | undefined;
    boardService: BoardService | null | undefined;
    pieceService: PieceService | null | undefined;
    animationService: AnimationService | null | undefined;
    moveService: MoveService | null | undefined;
    eventService: EventService | null | undefined;
    /**
     * Initializes all services
     * @private
     */
    private _initializeServices;
    _isAnimating: boolean | undefined;
    _boundUpdateBoardPieces: ((animation?: boolean, isPositionLoad?: boolean) => void) | null | undefined;
    _boundOnSquareClick: ((square: Square, animate?: boolean, dragged?: boolean) => boolean) | null | undefined;
    _boundOnPieceHover: ((square: Square) => void) | null | undefined;
    _boundOnPieceLeave: ((square: Square) => void) | null | undefined;
    /**
     * Initializes the board
     * @private
     */
    private _initialize;
    /**
     * Initializes parameters and state
     * @private
     */
    private _initParams;
    /**
     * Sets up the game with initial position
     * @private
     * @param {string|Object} position - Initial position
     */
    private _setGame;
    /**
     * Builds the board DOM structure
     * @private
     * Best practice: always remove squares (destroy JS/DOM) before clearing the board container.
     */
    private _buildBoard;
    /**
     * Builds all squares on the board
     * @private
     */
    private _buildSquares;
    /**
     * Adds event listeners to squares
     * @private
     */
    private _addListeners;
    /**
     * Handles square click events
     * @private
     * @param {Square} square - Clicked square
     * @param {boolean} [animate=true] - Whether to animate
     * @param {boolean} [dragged=false] - Whether triggered by drag
     * @returns {boolean} True if successful
     */
    private _onSquareClick;
    /**
     * Handles piece hover events
     * @private
     * @param {Square} square - Hovered square
     */
    private _onPieceHover;
    /**
     * Handles piece leave events
     * @private
     * @param {Square} square - Left square
     */
    private _onPieceLeave;
    /**
     * Handles move execution
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Square} toSquare - Target square
     * @param {string} [promotion] - Promotion piece
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if move was successful
     */
    private _onMove;
    /**
     * Handles square selection
     * @private
     * @param {Square} square - Selected square
     */
    private _onSelect;
    /**
     * Handles square deselection
     * @private
     * @param {Square} square - Deselected square
     */
    private _onDeselect;
    /**
     * Shows legal move hints for a square
     * @private
     * @param {Square} square - Square to show hints for
     */
    private _hintMoves;
    /**
     * Removes legal move hints for a square
     * @private
     * @param {Square} square - Square to remove hints for
     */
    private _dehintMoves;
    /**
     * Checks if a move requires promotion
     * @private
     * @param {Move} move - Move to check
     * @returns {boolean} True if promotion is required
     */
    private _requiresPromotion;
    /**
     * Executes a move
     * @private
     * @param {Move} move - Move to execute
     * @param {boolean} [animate=true] - Whether to animate
     */
    private _executeMove;
    /**
     * Handles special moves (castle, en passant) without animation
     * @private
     * @param {Object} gameMove - Game move object
     */
    private _handleSpecialMove;
    /**
     * Handles special moves (castle, en passant) with animation
     * @private
     * @param {Object} gameMove - Game move object
     */
    private _handleSpecialMoveAnimation;
    /**
     * Handles castle move by moving the rook
     * @private
     * @param {Object} gameMove - Game move object
     * @param {boolean} animate - Whether to animate
     */
    private _handleCastleMove;
    /**
     * Handles en passant move by removing the captured pawn
     * @private
     * @param {Object} gameMove - Game move object
     * @param {boolean} animate - Whether to animate
     */
    private _handleEnPassantMove;
    /**
     * Updates board pieces to match game state
     * @private
     * @param {boolean} [animation=false] - Whether to animate
     * @param {boolean} [isPositionLoad=false] - Whether this is a position load
     */
    private _updateBoardPieces;
    /**
     * Ensures hints are available for the current turn
     * @private
     */
    private _ensureHintsAvailable;
    /**
     * Updates board pieces after a delayed move
     * @private
     */
    private _updateBoardPiecesDelayed;
    /**
     * Performs the actual board update
     * @private
     * @param {boolean} [animation=false] - Whether to animate
     * @param {boolean} [isPositionLoad=false] - Whether this is a position load (affects delay)
     */
    private _doUpdateBoardPieces;
    /**
     * Performs sequential piece updates (original behavior)
     * @private
     * @param {Object} squares - All squares
     * @param {string} gameStateBefore - Game state before update
     * @param {boolean} animation - Whether to animate
     */
    private _doSequentialUpdate;
    /**
     * Performs simultaneous piece updates
     * @private
     * @param {Object} squares - All squares
     * @param {string} gameStateBefore - Game state before update
     * @param {boolean} [isPositionLoad=false] - Whether this is a position load
     */
    private _doSimultaneousUpdate;
    /**
     * Analyzes position changes to determine optimal animation strategy
     * @private
     * @param {Object} squares - All squares
     * @returns {Object} Analysis of changes
     */
    private _analyzePositionChanges;
    /**
     * Executes simultaneous changes based on analysis
     * @private
     * @param {Object} changeAnalysis - Analysis of changes
     * @param {string} gameStateBefore - Game state before update
     * @param {boolean} [isPositionLoad=false] - Whether this is a position load
     */
    private _executeSimultaneousChanges;
    /**
     * Animates a piece moving from one square to another
     * @private
     * @param {Object} move - Move information
     * @param {Function} onComplete - Callback when animation completes
     */
    private _animatePieceMove;
    /**
     * Animates a piece being removed
     * @private
     * @param {Object} remove - Remove information
     * @param {Function} onComplete - Callback when animation completes
     */
    private _animatePieceRemoval;
    /**
     * Animates a piece being added
     * @private
     * @param {Object} add - Add information
     * @param {Function} onComplete - Callback when animation completes
     */
    private _animatePieceAddition;
    /**
     * Creates a drag function for a piece
     * @private
     * @param {Square} square - Square containing the piece
     * @param {Piece} piece - Piece to create drag function for
     * @returns {Function} Drag function
     */
    private _createDragFunction;
    /**
     * Handles snapback animation
     * @private
     * @param {Square} square - Square containing the piece
     * @param {Piece} piece - Piece to snapback
     */
    private _onSnapback;
    /**
     * Handles piece removal
     * @private
     * @param {Square} square - Square containing the piece to remove
     */
    private _onRemove;
    /**
     * Clears all visual state (selections, hints, highlights)
     * @private
     */
    private _clearVisualState;
    /**
     * Get the current position as FEN
     * @returns {string}
     */
    getPosition(): string;
    /**
     * Set the board position (FEN or object)
     * @param {string|Object} position
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    setPosition(position: string | Object, opts?: {
        animate?: boolean | undefined;
    }): boolean;
    /**
     * Reset the board to the starting position
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    reset(opts?: {
        animate?: boolean | undefined;
    }): boolean;
    /**
     * Clear the board
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    clear(opts?: {
        animate?: boolean | undefined;
    }): boolean;
    /**
     * Undo last move
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    undoMove(opts?: {
        animate?: boolean | undefined;
    }): boolean;
    /**
     * Redo last undone move
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    redoMove(opts?: {
        animate?: boolean | undefined;
    }): boolean;
    /**
     * Get legal moves for a square
     * @param {string} square
     * @returns {Array}
     */
    getLegalMoves(square: string): any[];
    /**
     * Get the piece at a square
     * @param {string} square
     * @returns {string|null}
     */
    getPiece(square: string): string | null;
    /**
     * Put a piece on a square
     * @param {string} piece
     * @param {string} square
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {boolean}
     */
    putPiece(piece: string, square: string, opts?: {
        animate?: boolean | undefined;
    }): boolean;
    /**
     * Remove a piece from a square
     * @param {string} square
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {string|null}
     */
    removePiece(square: string, opts?: {
        animate?: boolean | undefined;
    }): string | null;
    /**
     * Flip the board orientation
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     */
    flipBoard(opts?: {
        animate?: boolean | undefined;
    }): void;
    /**
     * Set the board orientation
     * @param {'w'|'b'} color
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     */
    setOrientation(color: "w" | "b", opts?: {
        animate?: boolean | undefined;
    }): string;
    /**
     * Get the current orientation
     * @returns {'w'|'b'}
     */
    getOrientation(): "w" | "b";
    /**
     * Resize the board
     * @param {number|string} size
     */
    resizeBoard(size: number | string): boolean;
    /**
     * Highlight a square
     * @param {string} square
     * @param {Object} [opts]
     */
    highlight(square: string, opts?: Object): void;
    /**
     * Remove highlight from a square
     * @param {string} square
     * @param {Object} [opts]
     */
    dehighlight(square: string, opts?: Object): void;
    /**
     * Get FEN string
     * @returns {string}
     */
    fen(): string;
    /**
     * Get current turn
     * @returns {'w'|'b'}
     */
    turn(): "w" | "b";
    /**
     * Is the game over?
     * @returns {boolean}
     */
    isGameOver(): boolean;
    /**
     * Is it checkmate?
     * @returns {boolean}
     */
    isCheckmate(): boolean;
    /**
     * Is it draw?
     * @returns {boolean}
     */
    isDraw(): boolean;
    /**
     * Get move history
     * @returns {Array}
     */
    getHistory(): any[];
    /**
     * Destroy the board and cleanup all resources
     */
    destroyBoard(): void;
    /**
     * Rebuild the board
     */
    rebuild(): void;
    /**
     * Get current config
     * @returns {Object}
     */
    getConfig(): Object;
    /**
     * Set new config
     * @param {Object} newConfig
     */
    updateConfig(newConfig: Object): void;
    /**
     * Alias for move (deprecated)
     */
    move(move: any, animate?: boolean): any;
    /**
     * Alias for clear (deprecated)
     */
    clearBoard(animate?: boolean): boolean;
    /**
     * Alias for reset (deprecated)
     */
    start(animate?: boolean): boolean;
    /**
     * Alias for flipBoard (for backward compatibility)
     */
    flip(opts?: {}): void;
    /**
     * Gets or sets the current position
     * @param {string|Object} [newPosition] - New position (optional)
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {Object|void} Position object if getter, void if setter
     */
    getOrSetPosition(newPosition?: string | Object, animate?: boolean): Object | void;
    /**
     * Undoes the last move
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if undo was successful
     */
    undo(animate?: boolean): boolean;
    /**
     * Redoes the last undone move
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if redo was successful
     */
    redo(animate?: boolean): boolean;
    /**
     * Gets the game history
     * @returns {Array} Array of moves
     */
    history(): any[];
    /**
     * Gets the current game state
     * @returns {Object} Game state object
     */
    game(): Object;
    /**
     * Gets or sets the orientation
     * @param {string} [orientation] - New orientation
     * @returns {string} Current orientation
     */
    orientation(orientation?: string): string;
    /**
     * Gets or sets the size
     * @param {number|string} [size] - New size
     * @returns {number|string} Current size
     */
    size(size?: number | string): number | string;
    /**
     * Gets legal moves for a square
     * @param {string} square - Square to get moves for
     * @returns {Array} Array of legal moves
     */
    legalMoves(square: string): any[];
    /**
     * Checks if a move is legal
     * @param {string|Object} move - Move to check
     * @returns {boolean} True if move is legal
     */
    isLegal(move: string | Object): boolean;
    /**
     * Checks if the current player is in check
     * @returns {boolean} True if in check
     */
    inCheck(): boolean;
    /**
     * Checks if the current player is in checkmate
     * @returns {boolean} True if in checkmate
     */
    inCheckmate(): boolean;
    /**
     * Checks if the game is in stalemate
     * @returns {boolean} True if in stalemate
     */
    inStalemate(): boolean;
    /**
     * Checks if the game is drawn
     * @returns {boolean} True if drawn
     */
    inDraw(): boolean;
    /**
     * Checks if position is threefold repetition
     * @returns {boolean} True if threefold repetition
     */
    inThreefoldRepetition(): boolean;
    /**
     * Gets the PGN representation of the game
     * @returns {string} PGN string
     */
    pgn(): string;
    /**
     * Loads a PGN string
     * @param {string} pgn - PGN string to load
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if loaded successfully
     */
    loadPgn(pgn: string, animate?: boolean): boolean;
    /**
     * Gets configuration options (alias for getConfig)
     * @returns {Object} Configuration object
     */
    getConfigOptions(): Object;
    /**
     * Updates configuration options (alias for updateConfig)
     * @param {Object} newConfig - New configuration options
     */
    setConfigOptions(newConfig: Object): void;
    /**
     * Gets or sets the animation style
     * @param {string} [style] - New animation style ('sequential' or 'simultaneous')
     * @returns {string} Current animation style
     */
    animationStyle(style?: string): string;
    /**
     * Gets or sets the simultaneous animation delay
     * @param {number} [delay] - New delay in milliseconds
     * @returns {number} Current delay
     */
    simultaneousAnimationDelay(delay?: number): number;
    insert(square: any, piece: any): boolean;
    get(square: any): string | null;
    /**
     * Legacy position method - use getPosition/setPosition instead
     * @deprecated
     */
    position(positionArg: any, colorOrAnimate: any): boolean | Object;
    destroy(): void;
    build(): void;
    resize(value: any): boolean;
    piece(square: any): string | null;
    ascii(): string;
    board(): ({
        square: string;
        type: any;
        color: any;
    } | null)[][];
    getCastlingRights(color: any): {
        k: boolean;
        q: boolean;
    };
    getComment(): any;
    getComments(): {
        fen: string;
        comment: any;
    }[];
    lastMove(): any;
    moveNumber(): number;
    moves(options?: {}): string[] | import('../utils/chess.js').Move[];
    squareColor(squareId: any): "light" | "dark";
    isDrawByFiftyMoves(): boolean;
    isInsufficientMaterial(): boolean;
    isStalemate(): boolean;
    isThreefoldRepetition(): boolean;
    load(fen: any, options?: {}, animation?: boolean): boolean;
    put(pieceId: any, squareId: any, animation?: boolean): boolean;
    remove(squareId: any, animation?: boolean): string | null;
    removeComment(): any;
    removeComments(): {
        fen: string;
        comment: any;
    }[];
    removeHeader(field: any): boolean;
    setCastlingRights(color: any, rights: any): boolean;
    setComment(comment: any): void;
    setHeader(key: any, value: any): {};
    validateFen(fen: any): any;
    highlightSquare(square: any): any;
    dehighlightSquare(square: any): any;
    forceSync(): void;
}
//# sourceMappingURL=Chessboard.d.ts.map