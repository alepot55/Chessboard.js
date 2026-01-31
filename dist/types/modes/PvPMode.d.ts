import { BaseMode } from './BaseMode.js';
/**
 * @typedef {Object} TimeControl
 * @property {number} initial - Initial time in seconds
 * @property {number} increment - Increment per move in seconds
 */
/**
 * @typedef {Object} PvPModeConfig
 * @extends ModeConfig
 * @property {TimeControl|null} [timeControl=null] - Time control settings
 * @property {boolean} [allowTakeback=true] - Allow takeback requests
 * @property {boolean} [allowDrawOffer=true] - Allow draw offers
 * @property {boolean} [showLegalMoves=true] - Highlight legal moves
 * @property {boolean} [showLastMove=true] - Highlight last move
 * @property {boolean} [showCheck=true] - Highlight king when in check
 * @property {Function} [onGameEnd] - Callback when game ends
 * @property {Function} [onTakebackRequest] - Callback for takeback request
 * @property {Function} [onDrawOffer] - Callback for draw offer
 */
/**
 * Player vs Player mode with full rule enforcement
 */
export class PvPMode extends BaseMode {
    /**
     * @param {Object} chessboard - Reference to the chessboard instance
     * @param {PvPModeConfig} [config={}] - Mode configuration
     */
    constructor(chessboard: Object, config?: PvPModeConfig);
    players: {
        w: {
            name: string;
            timeRemaining: null;
            connected: boolean;
        };
        b: {
            name: string;
            timeRemaining: null;
            connected: boolean;
        };
    };
    gameStartTime: any;
    lastMoveTime: any;
    timerInterval: NodeJS.Timeout | null;
    pendingDrawOffer: any;
    pendingTakeback: any;
    moveNotations: any[];
    /**
     * Set player name
     * @param {'w'|'b'} color - Player color
     * @param {string} name - Player name
     */
    setPlayerName(color: "w" | "b", name: string): void;
    /**
     * Get player info
     * @param {'w'|'b'} color - Player color
     * @returns {Object}
     */
    getPlayer(color: "w" | "b"): Object;
    /**
     * Get move notation
     * @private
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @returns {string}
     */
    private _getMoveNotation;
    /**
     * Start the game timer
     * @private
     */
    private _startTimer;
    /**
     * Stop the game timer
     * @private
     */
    private _stopTimer;
    /**
     * Update player time after move
     * @private
     * @param {'w'|'b'} color - Player who just moved
     */
    private _updatePlayerTime;
    /**
     * Handle player timeout
     * @private
     * @param {'w'|'b'} loser - Player who ran out of time
     */
    private _handleTimeout;
    /**
     * Check for game end conditions
     * @private
     */
    private _checkGameEnd;
    /**
     * Offer a draw
     * @param {'w'|'b'} offerer - Player offering draw
     * @returns {boolean}
     */
    offerDraw(offerer: "w" | "b"): boolean;
    /**
     * Accept draw offer
     * @returns {boolean}
     */
    acceptDraw(): boolean;
    /**
     * Decline draw offer
     */
    declineDraw(): void;
    /**
     * Request takeback
     * @param {'w'|'b'} requester - Player requesting takeback
     * @returns {boolean}
     */
    requestTakeback(requester: "w" | "b"): boolean;
    /**
     * Accept takeback request
     * @returns {boolean}
     */
    acceptTakeback(): boolean;
    /**
     * Decline takeback request
     */
    declineTakeback(): void;
    /**
     * Resign the game
     * @param {'w'|'b'} resigner - Player resigning
     */
    resign(resigner: "w" | "b"): void;
    /**
     * Get move history in PGN format
     * @returns {string}
     */
    getPGN(): string;
    /**
     * Get formatted time string
     * @param {'w'|'b'} color - Player color
     * @returns {string}
     */
    getFormattedTime(color: "w" | "b"): string;
    /**
     * Get legal moves for a square
     * @param {string} square - Square to check
     * @returns {string[]} - Array of target squares
     */
    getLegalMoves(square: string): string[];
    /**
     * Check if player is in check
     * @returns {boolean}
     */
    isInCheck(): boolean;
}
export default PvPMode;
export type TimeControl = {
    /**
     * - Initial time in seconds
     */
    initial: number;
    /**
     * - Increment per move in seconds
     */
    increment: number;
};
export type PvPModeConfig = Object;
//# sourceMappingURL=PvPMode.d.ts.map