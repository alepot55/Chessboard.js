import { default as Piece } from '../components/Piece.js';
/**
 * Service responsible for piece management and operations
 * @class
 */
export class PieceService {
    /**
     * Creates a new PieceService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config: ChessboardConfig);
    config: ChessboardConfig;
    /**
     * Gets the path to a piece asset
     * @param {string} piece - Piece identifier (e.g., 'wK', 'bP')
     * @returns {string} Path to piece asset
     * @throws {ValidationError} When piecesPath configuration is invalid
     */
    getPiecePath(piece: string): string;
    /**
     * Converts various piece formats to a Piece instance
     * @param {string|Piece} piece - Piece in various formats
     * @returns {Piece} Piece instance
     * @throws {PieceError} When piece format is invalid
     */
    convertPiece(piece: string | Piece): Piece;
    /**
     * Adds a piece to a square with optional fade-in animation
     * @param {Square} square - Target square
     * @param {Piece} piece - Piece to add
     * @param {boolean} [fade=true] - Whether to fade in the piece
     * @param {Function} dragFunction - Function to handle drag events
     * @param {Function} [callback] - Callback when animation completes
     */
    addPieceOnSquare(square: Square, piece: Piece, fade?: boolean, dragFunction: Function, callback?: Function): void;
    /**
     * Removes a piece from a square with optional fade-out animation
     * @param {Square} square - Source square
     * @param {boolean} [fade=true] - Whether to fade out the piece
     * @param {Function} [callback] - Callback when animation completes
     * @returns {Piece} The removed piece
     * @throws {PieceError} When square has no piece to remove
     */
    removePieceFromSquare(square: Square, fade?: boolean, callback?: Function): Piece;
    /**
     * Moves a piece to a new position with animation
     * @param {Piece} piece - Piece to move
     * @param {Square} targetSquare - Target square
     * @param {number} duration - Animation duration
     * @param {Function} [callback] - Callback function when animation completes
     */
    movePiece(piece: Piece, targetSquare: Square, duration: number, callback?: Function): void;
    /**
     * Handles piece translation with optional capture
     * @param {Move} move - Move object containing from/to squares and piece
     * @param {boolean} removeTarget - Whether to remove piece from target square
     * @param {boolean} animate - Whether to animate the move
     * @param {Function} [dragFunction] - Function to create drag handlers
     * @param {Function} [callback] - Callback function when complete
     */
    translatePiece(move: Move, removeTarget: boolean, animate: boolean, dragFunction?: Function, callback?: Function): void;
    /**
     * Snaps a piece back to its original position
     * @param {Square} square - Square containing the piece
     * @param {boolean} [animate=true] - Whether to animate the snapback
     */
    snapbackPiece(square: Square, animate?: boolean): void;
    /**
     * Centers a piece in its square with animation (after successful drop)
     * @param {Square} square - Square containing the piece to center
     * @param {boolean} animate - Whether to animate the centering
     */
    centerPiece(square: Square, animate?: boolean): void;
    /**
     * Gets the transition timing function for animations
     * @private
     * @returns {Function} Timing function
     */
    private _getTransitionTimingFunction;
    /**
     * Cleans up resources
     */
    destroy(): void;
}
//# sourceMappingURL=PieceService.d.ts.map