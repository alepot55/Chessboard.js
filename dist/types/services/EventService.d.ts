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
    selectedSquare: any;
    isDragging: boolean;
    isProcessing: boolean;
    eventListeners: Map<any, any>;
    /**
     * Adds event listeners to all squares
     */
    addListeners(onSquareClick: any, onPieceHover: any, onPieceLeave: any): void;
    /**
     * Adds event listeners to a specific square
     * @private
     */
    private _addSquareListeners;
    /**
     * Creates a drag function for a piece
     */
    createDragFunction(square: any, piece: any, onDragStart: any, onDragMove: any, onDrop: any, onSnapback: any, onMove: any, onRemove: any): (event: any) => void;
    /**
     * Resets piece position after failed drag
     * @private
     */
    private _resetPiecePosition;
    /**
     * Handles a move attempt (from drag or click)
     * @private
     */
    private _handleMove;
    /**
     * Handles promotion move
     * @private
     */
    private _handlePromotion;
    /**
     * Handles square click events
     */
    onClick(square: any, onMove: any, onSelect: any, onDeselect: any, animate?: boolean): boolean;
    setClicked(square: any): void;
    getClicked(): any;
    setPromoting(_promotion: any): void;
    getPromoting(): boolean;
    setAnimating(_isAnimating: any): void;
    getAnimating(): boolean;
    /**
     * Removes all event listeners
     */
    removeListeners(): void;
    removeAllListeners(): void;
    /**
     * Cleans up resources
     */
    destroy(): void;
}
//# sourceMappingURL=EventService.d.ts.map