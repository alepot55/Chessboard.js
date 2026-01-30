import { default as Piece } from '../components/Piece.js';
/**
 * Service responsible for event handling and user interactions
 * @class
 */
export class EventService {
    /**
     * Creates a new EventService instance
     * @param {ChessboardConfig} config - Board configuration
     * @param {BoardService} boardService - Board service instance
     * @param {MoveService} moveService - Move service instance
     * @param {CoordinateService} coordinateService - Coordinate service instance
     * @param {Chessboard} chessboard - Chessboard instance
     */
    constructor(config: ChessboardConfig, boardService: BoardService, moveService: MoveService, coordinateService: CoordinateService, chessboard: Chessboard);
    config: ChessboardConfig;
    boardService: BoardService;
    moveService: MoveService;
    coordinateService: CoordinateService;
    chessboard: Chessboard;
    clicked: any;
    isDragging: boolean;
    isAnimating: boolean;
    promoting: boolean;
    _isProcessingDrop: boolean;
    eventListeners: Map<any, any>;
    /**
     * Adds event listeners to all squares
     * @param {Function} onSquareClick - Callback for square clicks
     * @param {Function} onPieceHover - Callback for piece hover
     * @param {Function} onPieceLeave - Callback for piece leave
     */
    addListeners(onSquareClick: Function, onPieceHover: Function, onPieceLeave: Function): void;
    /**
     * Adds event listeners to a specific square
     * @private
     * @param {Square} square - Square to add listeners to
     * @param {Function} onSquareClick - Click callback
     * @param {Function} onPieceHover - Hover callback
     * @param {Function} onPieceLeave - Leave callback
     */
    private _addSquareListeners;
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
    createDragFunction(square: Square, piece: Piece, onDragStart: Function, onDragMove: Function, onDrop: Function, onSnapback: Function, onMove: Function, onRemove: Function): Function;
    /**
     * Handles trash drop (piece removal)
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Function} onRemove - Callback to remove piece
     */
    private _handleTrashDrop;
    /**
     * Handles snapback animation
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Piece} piece - Piece to snapback
     * @param {Function} onSnapback - Snapback callback
     */
    private _handleSnapback;
    /**
     * Handles successful drop
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Square} toSquare - Target square
     * @param {Piece} piece - Piece being dropped
     * @param {Function} onMove - Move callback
     * @param {Function} onSnapback - Snapback callback
     */
    private _handleDrop;
    /**
     * Cleans up visual state after a SUCCESSFUL move
     * @private
     * @param {Square} fromSquare - Source square
     */
    private _cleanupAfterSuccessfulMove;
    /**
     * Cleans up visual state after a FAILED move (snapback, invalid move)
     * @private
     * @param {Square} fromSquare - Source square
     */
    private _cleanupAfterFailedMove;
    /**
     * Animates piece to center of target square (visual only)
     * @private
     * @param {Piece} piece - Piece to animate
     * @param {Square} targetSquare - Target square
     * @param {Function} callback - Callback when animation completes
     */
    private _animatePieceToCenter;
    /**
     * Handles square click events
     * @param {Square} square - Clicked square
     * @param {Function} onMove - Move callback
     * @param {Function} onSelect - Select callback
     * @param {Function} onDeselect - Deselect callback
     * @param {boolean} [animate=true] - Whether to animate the move
     * @returns {boolean} True if move was successful
     */
    onClick(square: Square, onMove: Function, onSelect: Function, onDeselect: Function, animate?: boolean): boolean;
    /**
     * Schedules piece replacement after promotion animation
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     */
    private _schedulePromotionPieceReplacement;
    /**
     * Waits for piece to be present and then replaces it
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     * @param {number} attempt - Current attempt number
     */
    private _waitForPieceAndReplace;
    /**
     * Replaces the piece on the square with the promotion piece
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     */
    private _replacePromotionPiece;
    /**
     * Sets the clicked square
     * @param {Square|null} square - Square to set as clicked
     */
    setClicked(square: Square | null): void;
    /**
     * Gets the currently clicked square
     * @returns {Square|null} Currently clicked square
     */
    getClicked(): Square | null;
    /**
     * Sets the promotion state
     * @param {string|boolean} promotion - Promotion piece type or false
     */
    setPromoting(promotion: string | boolean): void;
    /**
     * Gets the promotion state
     * @returns {string|boolean} Current promotion state
     */
    getPromoting(): string | boolean;
    /**
     * Sets the animation state
     * @param {boolean} isAnimating - Whether animations are in progress
     */
    setAnimating(isAnimating: boolean): void;
    /**
     * Gets the animation state
     * @returns {boolean} Whether animations are in progress
     */
    getAnimating(): boolean;
    /**
     * Removes all existing event listeners
     */
    removeListeners(): void;
    /**
     * Removes all event listeners
     */
    removeAllListeners(): void;
    /**
     * Cleans up resources
     */
    destroy(): void;
}
//# sourceMappingURL=EventService.d.ts.map