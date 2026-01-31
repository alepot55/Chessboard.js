import { BaseMode } from './BaseMode.js';
import { ChessAI } from '../ai/ChessAI.js';
/**
 * @typedef {Object} VsBotModeConfig
 * @extends ModeConfig
 * @property {'w'|'b'} [playerColor='w'] - Human player's color
 * @property {number} [botDifficulty=5] - Bot difficulty (1-10)
 * @property {number} [botThinkingTime=1000] - Minimum bot thinking time in ms
 * @property {boolean} [showBotThinking=true] - Show thinking indicator
 * @property {boolean} [allowHints=true] - Allow hint requests
 * @property {boolean} [allowTakeback=true] - Allow takeback
 * @property {boolean} [autoMove=true] - Bot moves automatically
 * @property {Object} [engine=null] - External engine instance (StockfishEngine, UCIEngine, CloudEngine)
 * @property {number} [engineDepth=20] - Search depth for external engine
 * @property {number} [engineMoveTime=1000] - Move time for external engine in ms
 * @property {Function} [onBotMove] - Callback when bot moves
 * @property {Function} [onBotThinking] - Callback when bot starts thinking
 * @property {Function} [onEngineInfo] - Callback for engine analysis info
 */
/**
 * Player vs Bot mode
 */
export class VsBotMode extends BaseMode {
    /**
     * Difficulty level descriptions
     * @static
     */
    static DIFFICULTY_NAMES: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
        7: string;
        8: string;
        9: string;
        10: string;
    };
    /**
     * @param {Object} chessboard - Reference to the chessboard instance
     * @param {VsBotModeConfig} [config={}] - Mode configuration
     */
    constructor(chessboard: Object, config?: VsBotModeConfig);
    ai: ChessAI | null;
    engine: any;
    botColor: string;
    isThinking: boolean;
    thinkingTimeout: NodeJS.Timeout | null;
    hintsUsed: number;
    lastBotMove: any;
    useExternalEngine: boolean;
    /**
     * Initialize AI engine
     * @private
     */
    private _initializeAI;
    /**
     * Set bot difficulty
     * @param {number} level - Difficulty (1-10)
     */
    setDifficulty(level: number): void;
    /**
     * Get difficulty name
     * @returns {string}
     */
    getDifficultyName(): string;
    /**
     * Set player color
     * @param {'w'|'b'} color - Player color
     */
    setPlayerColor(color: "w" | "b"): void;
    /**
     * Set external engine for bot moves
     * @param {Object} engine - Engine instance (StockfishEngine, UCIEngine, CloudEngine)
     * @param {Object} [options={}] - Engine options
     * @param {number} [options.depth=20] - Search depth
     * @param {number} [options.moveTime=1000] - Move time in ms
     */
    setEngine(engine: Object, options?: {
        depth?: number | undefined;
        moveTime?: number | undefined;
    }): void;
    /**
     * Remove external engine and use built-in AI
     */
    removeEngine(): void;
    /**
     * Check if using external engine
     * @returns {boolean}
     */
    isUsingExternalEngine(): boolean;
    /**
     * Check if it's the human player's turn
     * @returns {boolean}
     */
    isPlayerTurn(): boolean;
    /**
     * Check if it's the bot's turn
     * @returns {boolean}
     */
    isBotTurn(): boolean;
    /**
     * Schedule bot move with thinking time
     * @private
     */
    private _scheduleBotMove;
    /**
     * Cancel pending bot move
     * @private
     */
    private _cancelBotMove;
    /**
     * Execute bot move
     * @private
     */
    private _makeBotMove;
    /**
     * Get best move from external engine
     * @private
     * @returns {Promise<Object>}
     */
    private _getEngineBestMove;
    /**
     * Trigger bot move manually (if autoMove is disabled)
     */
    triggerBotMove(): void;
    /**
     * Get hint for player
     * @returns {Promise<Object|null>} - Suggested move
     */
    getHint(): Promise<Object | null>;
    /**
     * Request takeback
     * @returns {boolean}
     */
    requestTakeback(): boolean;
    /**
     * Resign the game
     */
    resign(): void;
    /**
     * Check for game end conditions
     * @private
     * @returns {boolean}
     */
    private _checkGameEnd;
    /**
     * Analyze current position
     * @returns {Promise<Object>}
     */
    analyzePosition(): Promise<Object>;
}
export default VsBotMode;
export type VsBotModeConfig = Object;
//# sourceMappingURL=VsBotMode.d.ts.map