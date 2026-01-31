/**
 * Base Mode - Abstract class for all chess board modes
 * @module modes/BaseMode
 * @since 3.1.0
 */
/**
 * @typedef {Object} ModeConfig
 * @property {string} name - Mode name
 * @property {boolean} enforceRules - Whether to enforce chess rules
 * @property {boolean} allowFreeMovement - Allow moving any piece anywhere
 * @property {boolean} allowPieceCreation - Allow adding pieces to the board
 * @property {boolean} allowPieceRemoval - Allow removing pieces from the board
 * @property {boolean} trackTurns - Track whose turn it is
 * @property {boolean} detectGameEnd - Detect checkmate/stalemate
 * @property {Function} [onModeStart] - Callback when mode starts
 * @property {Function} [onModeEnd] - Callback when mode ends
 * @property {Function} [onMove] - Callback after each move
 * @property {Function} [onTurnChange] - Callback when turn changes
 */
/**
 * Abstract base class for all game modes
 * @abstract
 */
export class BaseMode {
    /**
     * @param {Object} chessboard - Reference to the chessboard instance
     * @param {ModeConfig} [config={}] - Mode configuration
     */
    constructor(chessboard: Object, config?: ModeConfig);
    chessboard: Object;
    config: {
        /**
         * - Mode name
         */
        name: string;
        /**
         * - Whether to enforce chess rules
         */
        enforceRules: boolean;
        /**
         * - Allow moving any piece anywhere
         */
        allowFreeMovement: boolean;
        /**
         * - Allow adding pieces to the board
         */
        allowPieceCreation: boolean;
        /**
         * - Allow removing pieces from the board
         */
        allowPieceRemoval: boolean;
        /**
         * - Track whose turn it is
         */
        trackTurns: boolean;
        /**
         * - Detect checkmate/stalemate
         */
        detectGameEnd: boolean;
        /**
         * - Callback when mode starts
         */
        onModeStart?: Function;
        /**
         * - Callback when mode ends
         */
        onModeEnd?: Function;
        /**
         * - Callback after each move
         */
        onMove?: Function;
        /**
         * - Callback when turn changes
         */
        onTurnChange?: Function;
    };
    isActive: boolean;
    moveHistory: any[];
    listeners: Map<any, any>;
    /**
     * Get mode name
     * @returns {string}
     */
    getName(): string;
    /**
     * Start the mode
     * @virtual
     */
    start(): void;
    /**
     * Stop the mode
     * @virtual
     */
    stop(): void;
    /**
     * Check if a move is allowed in this mode
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @param {Object} [options={}] - Additional options
     * @returns {boolean}
     * @virtual
     */
    canMove(from: string, to: string, options?: Object): boolean;
    /**
     * Execute a move
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @param {Object} [options={}] - Additional options
     * @returns {boolean} - Whether the move was successful
     * @virtual
     */
    executeMove(from: string, to: string, options?: Object): boolean;
    /**
     * Check if piece creation is allowed
     * @returns {boolean}
     */
    canCreatePiece(): boolean;
    /**
     * Check if piece removal is allowed
     * @returns {boolean}
     */
    canRemovePiece(): boolean;
    /**
     * Get current turn
     * @returns {'w'|'b'|null}
     */
    getCurrentTurn(): "w" | "b" | null;
    /**
     * Check if game is over
     * @returns {boolean}
     */
    isGameOver(): boolean;
    /**
     * Get game result
     * @returns {Object|null}
     */
    getGameResult(): Object | null;
    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event: string, callback: Function): void;
    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event: string, callback: Function): void;
    /**
     * Emit event
     * @protected
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    protected _emit(event: string, data: Object): void;
    /**
     * Validate move according to chess rules
     * @protected
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @returns {boolean}
     */
    protected _validateMove(from: string, to: string): boolean;
    /**
     * Get mode statistics
     * @returns {Object}
     */
    getStats(): Object;
    /**
     * Reset the mode
     * @virtual
     */
    reset(): void;
    /**
     * Serialize mode state
     * @returns {Object}
     */
    serialize(): Object;
    /**
     * Restore mode state
     * @param {Object} state - Serialized state
     */
    restore(state: Object): void;
}
export default BaseMode;
export type ModeConfig = {
    /**
     * - Mode name
     */
    name: string;
    /**
     * - Whether to enforce chess rules
     */
    enforceRules: boolean;
    /**
     * - Allow moving any piece anywhere
     */
    allowFreeMovement: boolean;
    /**
     * - Allow adding pieces to the board
     */
    allowPieceCreation: boolean;
    /**
     * - Allow removing pieces from the board
     */
    allowPieceRemoval: boolean;
    /**
     * - Track whose turn it is
     */
    trackTurns: boolean;
    /**
     * - Detect checkmate/stalemate
     */
    detectGameEnd: boolean;
    /**
     * - Callback when mode starts
     */
    onModeStart?: Function;
    /**
     * - Callback when mode ends
     */
    onModeEnd?: Function;
    /**
     * - Callback after each move
     */
    onMove?: Function;
    /**
     * - Callback when turn changes
     */
    onTurnChange?: Function;
};
//# sourceMappingURL=BaseMode.d.ts.map