/**
 * @typedef {Object} AIConfig
 * @property {number} [difficulty=5] - Difficulty level (1-10)
 * @property {number} [maxDepth=4] - Maximum search depth
 * @property {number} [maxTime=5000] - Maximum thinking time in ms
 * @property {boolean} [useOpeningBook=true] - Use opening book
 * @property {boolean} [randomizeEquivalent=true] - Randomize equivalent moves
 * @property {string} [strategy='alphabeta'] - Search strategy
 */
/**
 * Chess AI engine
 */
export class ChessAI {
    /**
     * @param {Object} game - Chess.js game instance
     * @param {AIConfig} [config={}] - AI configuration
     */
    constructor(game: Object, config?: AIConfig);
    game: Object;
    config: {
        /**
         * - Difficulty level (1-10)
         */
        difficulty: number;
        /**
         * - Maximum search depth
         */
        maxDepth: number;
        /**
         * - Maximum thinking time in ms
         */
        maxTime: number;
        /**
         * - Use opening book
         */
        useOpeningBook: boolean;
        /**
         * - Randomize equivalent moves
         */
        randomizeEquivalent: boolean;
        /**
         * - Search strategy
         */
        strategy: string;
    };
    nodesSearched: number;
    startTime: number;
    /**
     * Adjust search parameters based on difficulty
     * @private
     */
    private _adjustDifficulty;
    mistakeProbability: number | undefined;
    /**
     * Set difficulty level
     * @param {number} level - Difficulty (1-10)
     */
    setDifficulty(level: number): void;
    /**
     * Get best move for current position
     * @returns {Object|null} - Move object { from, to, promotion }
     */
    getBestMove(): Object | null;
    /**
     * Get move from opening book
     * @private
     * @returns {Object|null}
     */
    private _getBookMove;
    /**
     * Get random legal move
     * @private
     * @param {Object[]} moves - Legal moves
     * @returns {Object}
     */
    private _getRandomMove;
    /**
     * Minimax root function
     * @private
     * @param {Object[]} moves - Legal moves
     * @returns {Object}
     */
    private _minimaxRoot;
    /**
     * Minimax algorithm
     * @private
     * @param {number} depth - Remaining depth
     * @param {boolean} isMaximizing - Maximizing player
     * @returns {number} - Position evaluation
     */
    private _minimax;
    /**
     * Alpha-beta root function
     * @private
     * @param {Object[]} moves - Legal moves
     * @returns {Object}
     */
    private _alphabetaRoot;
    /**
     * Alpha-beta pruning algorithm (negamax variant)
     * @private
     * @param {number} depth - Remaining depth
     * @param {number} alpha - Alpha value
     * @param {number} beta - Beta value
     * @param {boolean} isWhite - White to move
     * @returns {number} - Position evaluation
     */
    private _alphabeta;
    /**
     * Quiescence search - search captures to avoid horizon effect
     * @private
     * @param {number} alpha - Alpha value
     * @param {number} beta - Beta value
     * @param {boolean} isWhite - White to move
     * @returns {number}
     */
    private _quiesce;
    /**
     * Sort moves for better alpha-beta pruning
     * @private
     * @param {Object[]} moves - Moves to sort
     * @returns {Object[]}
     */
    private _sortMoves;
    /**
     * Evaluate the current position
     * @private
     * @returns {number} - Evaluation (positive = white advantage)
     */
    private _evaluate;
    /**
     * Get position value from piece-square tables
     * @private
     * @param {string} piece - Piece type
     * @param {number} row - Row (0-7)
     * @param {number} col - Column (0-7)
     * @param {'w'|'b'} color - Piece color
     * @returns {number}
     */
    private _getPositionValue;
    /**
     * Evaluate mobility (number of legal moves)
     * @private
     * @returns {number}
     */
    private _evaluateMobility;
    /**
     * Get search statistics
     * @returns {Object}
     */
    getStats(): Object;
}
export default ChessAI;
export type AIConfig = {
    /**
     * - Difficulty level (1-10)
     */
    difficulty?: number;
    /**
     * - Maximum search depth
     */
    maxDepth?: number;
    /**
     * - Maximum thinking time in ms
     */
    maxTime?: number;
    /**
     * - Use opening book
     */
    useOpeningBook?: boolean;
    /**
     * - Randomize equivalent moves
     */
    randomizeEquivalent?: boolean;
    /**
     * - Search strategy
     */
    strategy?: string;
};
//# sourceMappingURL=ChessAI.d.ts.map