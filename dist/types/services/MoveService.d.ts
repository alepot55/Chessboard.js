import { default as Move } from '../components/Move.js';
/**
 * Service responsible for move management and validation
 * @class
 */
export class MoveService {
    /**
     * Creates a new MoveService instance
     * @param {ChessboardConfig} config - Board configuration
     * @param {PositionService} positionService - Position service instance
     */
    constructor(config: ChessboardConfig, positionService: PositionService);
    config: ChessboardConfig;
    positionService: PositionService;
    _movesCache: Map<any, any>;
    _cacheTimeout: NodeJS.Timeout | null;
    _lastPromotionCheck: any;
    _lastPromotionResult: boolean | null;
    _promotionCheckTimeout: NodeJS.Timeout | null;
    _recentMoves: Set<any>;
    _recentMovesTimeout: NodeJS.Timeout | null;
    /**
     * Checks if a piece on a square can move
     * @param {Square} square - Square to check
     * @returns {boolean} True if piece can move
     */
    canMove(square: Square): boolean;
    /**
     * Converts various move formats to a Move instance
     * @param {string|Move} move - Move in various formats
     * @param {Object} squares - All board squares
     * @returns {Move} Move instance
     * @throws {MoveError} When move format is invalid
     */
    convertMove(move: string | Move, squares: Object): Move;
    /**
     * Checks if a move is legal
     * @param {Move} move - Move to check
     * @returns {boolean} True if move is legal
     */
    isLegalMove(move: Move): boolean;
    /**
     * Gets all legal moves for a square or the entire position
     * @param {string} [from] - Square to get moves from (optional)
     * @param {boolean} [verbose=true] - Whether to return verbose move objects
     * @returns {Array} Array of legal moves
     */
    getLegalMoves(from?: string, verbose?: boolean): any[];
    /**
     * Gets legal moves with caching for performance
     * @param {Square} square - Square to get moves from
     * @returns {Array} Array of legal moves
     */
    getCachedLegalMoves(square: Square): any[];
    /**
     * Executes a move on the game
     * @param {Move} move - Move to execute
     * @returns {Object|null} Move result from chess.js or null if invalid
     */
    executeMove(move: Move): Object | null;
    /**
     * Checks if a move requires promotion
     * @param {Move} move - Move to check
     * @returns {boolean} True if promotion is required
     */
    requiresPromotion(move: Move): boolean;
    _lastPromotionTime: number | undefined;
    /**
     * Internal promotion check logic
     * @private
     * @param {Move} move - Move to check
     * @returns {boolean} True if promotion is required
     */
    private _doRequiresPromotion;
    /**
     * Validates if a pawn move is theoretically possible
     * @private
     * @param {Square} from - Source square
     * @param {Square} to - Target square
     * @param {string} color - Pawn color ('w' or 'b')
     * @returns {boolean} True if the move is valid for a pawn
     */
    private _isPawnMoveValid;
    /**
     * Handles promotion UI setup
     * @param {Move} move - Move requiring promotion
     * @param {Object} squares - All board squares
     * @param {Function} onPromotionSelect - Callback when promotion piece is selected
     * @param {Function} onPromotionCancel - Callback when promotion is cancelled
     * @returns {boolean} True if promotion UI was set up
     */
    setupPromotion(move: Move, squares: Object, onPromotionSelect: Function, onPromotionCancel: Function): boolean;
    /**
     * Shows promotion choices in a column
     * @private
     */
    private _showPromotionInColumn;
    /**
     * Finds the appropriate square for a promotion piece
     * @private
     * @param {Square} targetSquare - Target square of the promotion move
     * @param {number} distance - Distance from target square
     * @param {Object} squares - All board squares
     * @returns {Square|null} Square for promotion piece or null
     */
    private _findPromotionSquare;
    /**
     * Gets piece path for promotion UI
     * @private
     * @param {string} pieceId - Piece identifier
     * @returns {string} Path to piece asset
     */
    private _getPiecePathForPromotion;
    /**
     * Parses a move string into a move object
     * @param {string} moveString - Move string (e.g., 'e2e4', 'e7e8q')
     * @returns {Object|null} Move object or null if invalid
     */
    parseMove(moveString: string): Object | null;
    /**
     * Checks if a move is a castle move
     * @param {Object} gameMove - Game move object from chess.js
     * @returns {boolean} True if move is castle
     */
    isCastle(gameMove: Object): boolean;
    /**
     * Gets the rook move for a castle move
     * @param {Object} gameMove - Game move object from chess.js
     * @returns {Object|null} Rook move object or null if not castle
     */
    getCastleRookMove(gameMove: Object): Object | null;
    /**
     * Checks if a move is en passant
     * @param {Object} gameMove - Game move object from chess.js
     * @returns {boolean} True if move is en passant
     */
    isEnPassant(gameMove: Object): boolean;
    /**
     * Gets the captured pawn square for en passant
     * @param {Object} gameMove - Game move object from chess.js
     * @returns {string|null} Square of captured pawn or null if not en passant
     */
    getEnPassantCapturedSquare(gameMove: Object): string | null;
    /**
     * Clears the moves cache
     */
    clearCache(): void;
    /**
     * Cleans up resources
     */
    destroy(): void;
}
//# sourceMappingURL=MoveService.d.ts.map