/**
 * Base Engine - Abstract class for all chess engine adapters
 * @module engines/BaseEngine
 * @since 3.1.0
 */
/**
 * @typedef {Object} EngineInfo
 * @property {string} name - Engine name
 * @property {string} author - Engine author
 * @property {string} version - Engine version
 * @property {string[]} options - Supported options
 */
/**
 * @typedef {Object} EngineAnalysis
 * @property {string} bestMove - Best move in UCI format (e.g., "e2e4")
 * @property {string} [ponder] - Ponder move
 * @property {number} score - Centipawn score or mate score
 * @property {boolean} isMate - Whether score is mate in X
 * @property {number} depth - Search depth reached
 * @property {number} nodes - Nodes searched
 * @property {number} time - Time spent in ms
 * @property {string[]} pv - Principal variation
 * @property {number} nps - Nodes per second
 */
/**
 * @typedef {Object} EngineConfig
 * @property {number} [depth=20] - Search depth
 * @property {number} [moveTime=1000] - Time per move in ms
 * @property {number} [threads=1] - Number of threads
 * @property {number} [hashSize=16] - Hash table size in MB
 * @property {boolean} [useNNUE=true] - Use NNUE evaluation
 */
/**
 * Abstract base class for chess engine adapters
 * @abstract
 */
export class BaseEngine {
    /**
     * @param {EngineConfig} [config={}] - Engine configuration
     */
    constructor(config?: EngineConfig);
    config: {
        /**
         * - Search depth
         */
        depth: number;
        /**
         * - Time per move in ms
         */
        moveTime: number;
        /**
         * - Number of threads
         */
        threads: number;
        /**
         * - Hash table size in MB
         */
        hashSize: number;
        /**
         * - Use NNUE evaluation
         */
        useNNUE: boolean;
    };
    isReady: boolean;
    isSearching: boolean;
    info: any;
    listeners: Map<any, any>;
    currentAnalysis: any;
    /**
     * Initialize the engine
     * @abstract
     * @returns {Promise<boolean>}
     */
    init(): Promise<boolean>;
    /**
     * Shutdown the engine
     * @abstract
     * @returns {Promise<void>}
     */
    quit(): Promise<void>;
    /**
     * Check if engine is ready
     * @returns {boolean}
     */
    ready(): boolean;
    /**
     * Set position from FEN or moves
     * @abstract
     * @param {string} [_fen='startpos'] - FEN string or 'startpos'
     * @param {string[]} [_moves=[]] - Moves to apply
     * @returns {Promise<void>}
     */
    setPosition(_fen?: string, _moves?: string[]): Promise<void>;
    /**
     * Start analysis/search
     * @abstract
     * @param {Object} [_options={}] - Search options
     * @param {number} [_options.depth] - Search depth
     * @param {number} [_options.moveTime] - Time per move in ms
     * @param {number} [_options.wtime] - White time remaining
     * @param {number} [_options.btime] - Black time remaining
     * @param {number} [_options.winc] - White increment
     * @param {number} [_options.binc] - Black increment
     * @param {boolean} [_options.infinite=false] - Infinite analysis
     * @returns {Promise<EngineAnalysis>}
     */
    go(_options?: {
        depth?: number | undefined;
        moveTime?: number | undefined;
        wtime?: number | undefined;
        btime?: number | undefined;
        winc?: number | undefined;
        binc?: number | undefined;
        infinite?: boolean | undefined;
    }): Promise<EngineAnalysis>;
    /**
     * Stop current analysis
     * @abstract
     * @returns {Promise<void>}
     */
    stop(): Promise<void>;
    /**
     * Set engine option
     * @abstract
     * @param {string} _name - Option name
     * @param {string|number|boolean} _value - Option value
     * @returns {Promise<void>}
     */
    setOption(_name: string, _value: string | number | boolean): Promise<void>;
    /**
     * Get engine info
     * @returns {EngineInfo|null}
     */
    getInfo(): EngineInfo | null;
    /**
     * Get best move for current position
     * @param {string} fen - Position FEN
     * @param {Object} [options={}] - Search options
     * @returns {Promise<string>} - Best move in UCI format
     */
    getBestMove(fen: string, options?: Object): Promise<string>;
    /**
     * Analyze position
     * @param {string} fen - Position FEN
     * @param {Object} [options={}] - Analysis options
     * @returns {Promise<EngineAnalysis>}
     */
    analyze(fen: string, options?: Object): Promise<EngineAnalysis>;
    /**
     * Start infinite analysis
     * @param {string} fen - Position FEN
     * @returns {Promise<void>}
     */
    startInfiniteAnalysis(fen: string): Promise<void>;
    /**
     * Add event listener
     * @param {string} event - Event name ('info', 'bestmove', 'error')
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
     * @param {*} data - Event data
     */
    protected _emit(event: string, data: any): void;
    /**
     * Parse UCI info line
     * @protected
     * @param {string} line - UCI info line
     * @returns {Object}
     */
    protected _parseInfo(line: string): Object;
    /**
     * Parse bestmove line
     * @protected
     * @param {string} line - UCI bestmove line
     * @returns {Object}
     */
    protected _parseBestMove(line: string): Object;
    /**
     * Convert UCI move to algebraic notation helper
     * @param {string} uciMove - Move in UCI format (e.g., "e2e4")
     * @returns {Object} - {from, to, promotion}
     */
    parseUCIMove(uciMove: string): Object;
}
export default BaseEngine;
export type EngineInfo = {
    /**
     * - Engine name
     */
    name: string;
    /**
     * - Engine author
     */
    author: string;
    /**
     * - Engine version
     */
    version: string;
    /**
     * - Supported options
     */
    options: string[];
};
export type EngineAnalysis = {
    /**
     * - Best move in UCI format (e.g., "e2e4")
     */
    bestMove: string;
    /**
     * - Ponder move
     */
    ponder?: string;
    /**
     * - Centipawn score or mate score
     */
    score: number;
    /**
     * - Whether score is mate in X
     */
    isMate: boolean;
    /**
     * - Search depth reached
     */
    depth: number;
    /**
     * - Nodes searched
     */
    nodes: number;
    /**
     * - Time spent in ms
     */
    time: number;
    /**
     * - Principal variation
     */
    pv: string[];
    /**
     * - Nodes per second
     */
    nps: number;
};
export type EngineConfig = {
    /**
     * - Search depth
     */
    depth?: number;
    /**
     * - Time per move in ms
     */
    moveTime?: number;
    /**
     * - Number of threads
     */
    threads?: number;
    /**
     * - Hash table size in MB
     */
    hashSize?: number;
    /**
     * - Use NNUE evaluation
     */
    useNNUE?: boolean;
};
//# sourceMappingURL=BaseEngine.d.ts.map