import { Chess } from '../utils/chess.js';
/**
 * Service responsible for position management and FEN operations
 * @class
 */
export class PositionService {
    /**
     * Creates a new PositionService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config: ChessboardConfig);
    config: ChessboardConfig;
    game: Chess | null;
    /**
     * Converts various position formats to FEN string
     * @param {string|Object} position - Position in various formats
     * @returns {string} FEN string representation
     * @throws {ValidationError} When position format is invalid
     */
    convertFen(position: string | Object): string;
    /**
     * Converts string position to FEN
     * @private
     * @param {string} position - String position
     * @returns {string} FEN string
     */
    private _convertStringPosition;
    /**
     * Converts object position to FEN
     * @private
     * @param {Object} position - Object with square->piece mapping
     * @returns {string} FEN string
     */
    private _convertObjectPosition;
    /**
     * Sets up the game with the given position
     * @param {string|Object} position - Position to set
     * @param {Object} [options] - Additional options for game setup
     */
    setGame(position: string | Object, options?: Object): void;
    /**
     * Gets the current game instance
     * @returns {Chess} Current chess.js game instance
     */
    getGame(): Chess;
    /**
     * Validates a FEN string
     * @param {string} fen - FEN string to validate
     * @returns {boolean} True if valid, false otherwise
     */
    validateFen(fen: string): boolean;
    /**
     * Gets piece information for a specific square
     * @param {string} squareId - Square identifier
     * @returns {string|null} Piece ID or null if no piece
     */
    getGamePieceId(squareId: string): string | null;
    /**
     * Checks if a specific piece is on a specific square
     * @param {string} piece - Piece ID to check
     * @param {string} square - Square to check
     * @returns {boolean} True if piece is on square
     */
    isPiece(piece: string, square: string): boolean;
    /**
     * Converts board coordinates to square ID
     * @private
     * @param {number} row - Row index (0-7)
     * @param {number} col - Column index (0-7)
     * @returns {string} Square ID (e.g., 'e4')
     */
    private _getSquareID;
    /**
     * Changes the turn in a FEN string
     * @param {string} fen - Original FEN string
     * @param {string} color - New turn color ('w' or 'b')
     * @returns {string} Modified FEN string
     */
    changeFenTurn(fen: string, color: string): string;
    /**
     * Gets the current position as an object
     * @returns {Object} Position object with piece placements
     */
    getPosition(): Object;
    /**
     * Toggles the turn in a FEN string
     * @param {string} fen - Original FEN string
     * @returns {string} Modified FEN string
     */
    changeFenColor(fen: string): string;
    /**
     * Cleans up resources
     */
    destroy(): void;
}
//# sourceMappingURL=PositionService.d.ts.map