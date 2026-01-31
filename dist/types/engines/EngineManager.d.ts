import { StockfishEngine } from './StockfishEngine.js';
import { UCIEngine } from './UCIEngine.js';
import { CloudEngine } from './CloudEngine.js';
/**
 * @typedef {Object} EngineManagerConfig
 * @property {string} [defaultEngine='stockfish'] - Default engine to use
 * @property {boolean} [autoInit=true] - Auto-initialize on load
 */
/**
 * Engine manager for chess board
 */
export class EngineManager {
    /**
     * Available engine types
     */
    static ENGINE_TYPES: {
        stockfish: typeof StockfishEngine;
        uci: typeof UCIEngine;
        cloud: typeof CloudEngine;
    };
    /**
     * Pre-configured engine presets
     */
    static PRESETS: {
        stockfish: {
            type: string;
            config: {
                depth: number;
            };
        };
        'stockfish-lite': {
            type: string;
            config: {
                depth: number;
                threads: number;
                hash: number;
            };
        };
        'stockfish-strong': {
            type: string;
            config: {
                depth: number;
                threads: number;
                hash: number;
            };
        };
        lichess: {
            type: string;
            config: {
                provider: string;
            };
        };
        'lichess-tablebase': {
            type: string;
            config: {
                provider: string;
                useTablebase: boolean;
            };
        };
    };
    /**
     * Get available presets
     * @returns {string[]}
     */
    static getPresets(): string[];
    /**
     * Get available engine types
     * @returns {string[]}
     */
    static getEngineTypes(): string[];
    /**
     * @param {Object} chessboard - Chessboard instance
     * @param {EngineManagerConfig} [config={}] - Configuration
     */
    constructor(chessboard: Object, config?: EngineManagerConfig);
    chessboard: Object;
    config: {
        /**
         * - Default engine to use
         */
        defaultEngine: string;
        /**
         * - Auto-initialize on load
         */
        autoInit: boolean;
    };
    engines: Map<any, any>;
    currentEngine: any;
    currentEngineName: string | null;
    listeners: Map<any, any>;
    /**
     * Load an engine by name or preset
     * @param {string} nameOrPreset - Engine name or preset
     * @param {Object} [config={}] - Engine configuration
     * @returns {Promise<BaseEngine>}
     */
    loadEngine(nameOrPreset: string, config?: Object): Promise<BaseEngine>;
    /**
     * Create and initialize an engine
     * @private
     * @param {string} name - Engine name
     * @param {string} type - Engine type
     * @param {Object} config - Engine configuration
     * @returns {Promise<BaseEngine>}
     */
    private _createEngine;
    /**
     * Get engine by name
     * @param {string} [name] - Engine name (uses current if not specified)
     * @returns {BaseEngine|null}
     */
    getEngine(name?: string): BaseEngine | null;
    /**
     * Set current engine
     * @param {string} name - Engine name
     * @returns {BaseEngine}
     */
    setCurrentEngine(name: string): BaseEngine;
    /**
     * Unload an engine
     * @param {string} name - Engine name
     * @returns {Promise<void>}
     */
    unloadEngine(name: string): Promise<void>;
    /**
     * Unload all engines
     * @returns {Promise<void>}
     */
    unloadAll(): Promise<void>;
    /**
     * Get best move for current position
     * @param {Object} [options={}] - Analysis options
     * @returns {Promise<string>}
     */
    getBestMove(options?: Object): Promise<string>;
    /**
     * Analyze current position
     * @param {Object} [options={}] - Analysis options
     * @returns {Promise<EngineAnalysis>}
     */
    analyze(options?: Object): Promise<EngineAnalysis>;
    /**
     * Analyze a specific position
     * @param {string} fen - Position FEN
     * @param {Object} [options={}] - Analysis options
     * @returns {Promise<EngineAnalysis>}
     */
    analyzePosition(fen: string, options?: Object): Promise<EngineAnalysis>;
    /**
     * Stop current analysis
     * @returns {Promise<void>}
     */
    stopAnalysis(): Promise<void>;
    /**
     * Set engine option
     * @param {string} name - Option name
     * @param {*} value - Option value
     * @param {string} [engineName] - Engine name (uses current if not specified)
     * @returns {Promise<void>}
     */
    setOption(name: string, value: any, engineName?: string): Promise<void>;
    /**
     * Ensure an engine is loaded
     * @private
     */
    private _ensureEngine;
    /**
     * Get list of loaded engines
     * @returns {string[]}
     */
    getLoadedEngines(): string[];
    /**
     * Get current engine name
     * @returns {string|null}
     */
    getCurrentEngineName(): string | null;
    /**
     * Check if an engine is loaded
     * @param {string} name - Engine name
     * @returns {boolean}
     */
    isLoaded(name: string): boolean;
    /**
     * Register event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event callback
     * @returns {this}
     */
    on(event: string, callback: Function): this;
    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event callback
     * @returns {this}
     */
    off(event: string, callback: Function): this;
    /**
     * Emit event
     * @private
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    private _emit;
    /**
     * Destroy manager and all engines
     * @returns {Promise<void>}
     */
    destroy(): Promise<void>;
}
export default EngineManager;
export type EngineManagerConfig = {
    /**
     * - Default engine to use
     */
    defaultEngine?: string;
    /**
     * - Auto-initialize on load
     */
    autoInit?: boolean;
};
//# sourceMappingURL=EngineManager.d.ts.map