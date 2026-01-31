import { BaseEngine } from './BaseEngine.js';
/**
 * @typedef {Object} StockfishConfig
 * @extends EngineConfig
 * @property {string} [wasmPath] - Path to Stockfish WASM files
 * @property {boolean} [useNNUE=true] - Use NNUE evaluation
 * @property {string} [nnuePath] - Path to NNUE network file
 */
/**
 * Browser-based Stockfish.js engine adapter
 */
export class StockfishEngine extends BaseEngine {
    /**
     * CDN URLs for Stockfish.js
     */
    static CDN_URLS: {
        stockfish16: string;
        stockfish15: string;
        stockfish14: string;
        unpkg: string;
    };
    /**
     * Check if SharedArrayBuffer is available (needed for multi-threading)
     * @returns {boolean}
     */
    static supportsThreads(): boolean;
    /**
     * Check if WebAssembly is supported
     * @returns {boolean}
     */
    static supportsWasm(): boolean;
    /**
     * @param {StockfishConfig} [config={}] - Engine configuration
     */
    constructor(config?: StockfishConfig);
    worker: Object | Worker | null;
    messageQueue: any[];
    pendingCommand: any;
    wasmPath: any;
    nnuePath: any;
    /**
     * Initialize from a custom Stockfish instance
     * @param {Worker|Object} stockfishInstance - Stockfish worker or instance
     * @returns {Promise<boolean>}
     */
    initFromInstance(stockfishInstance: Worker | Object): Promise<boolean>;
    /**
     * Configure engine options
     * @private
     */
    private _configureEngine;
    /**
     * Start search
     * @override
     * @param {Object} [options={}] - Search options
     * @returns {Promise<EngineAnalysis>}
     */
    override go(options?: Object): Promise<EngineAnalysis>;
    /**
     * Get evaluation of current position
     * @returns {Promise<Object>}
     */
    eval(): Promise<Object>;
    /**
     * Send command to engine
     * @private
     * @param {string} command - UCI command
     */
    private _send;
    /**
     * Send command and wait for response
     * @private
     * @param {string} command - UCI command
     * @param {string} expectedResponse - Expected response to wait for
     * @returns {Promise<void>}
     */
    private _sendAndWait;
    /**
     * Handle engine message
     * @private
     * @param {string} data - Message from engine
     */
    private _handleMessage;
    /**
     * Handle engine error
     * @private
     * @param {Error} error - Error object
     */
    private _handleError;
    /**
     * Parse engine ID
     * @private
     * @param {string} line - ID line
     */
    private _parseId;
    /**
     * Parse engine option
     * @private
     * @param {string} line - Option line
     */
    private _parseOption;
    /**
     * Update current analysis with new info
     * @private
     * @param {Object} info - Parsed info
     */
    private _updateAnalysis;
    /**
     * Parse eval output
     * @private
     * @param {string} output - Eval output
     * @returns {Object}
     */
    private _parseEval;
    /**
     * Get current analysis state
     * @returns {EngineAnalysis|null}
     */
    getCurrentAnalysis(): EngineAnalysis | null;
    /**
     * New game - reset engine state
     * @returns {Promise<void>}
     */
    newGame(): Promise<void>;
}
export default StockfishEngine;
export type StockfishConfig = Object;
//# sourceMappingURL=StockfishEngine.d.ts.map