import { BaseEngine } from './BaseEngine.js';
/**
 * @typedef {Object} CloudConfig
 * @extends EngineConfig
 * @property {'lichess'|'chesscom'|'custom'} [provider='lichess'] - Cloud provider
 * @property {string} [apiKey] - API key for authentication
 * @property {string} [apiUrl] - Custom API URL (for 'custom' provider)
 * @property {number} [multiPv=1] - Number of principal variations
 * @property {boolean} [useTablebase=true] - Use endgame tablebase
 */
/**
 * Cloud-based chess analysis engine
 */
export class CloudEngine extends BaseEngine {
    /**
     * API endpoints for different providers
     */
    static PROVIDERS: {
        lichess: {
            analysis: string;
            tablebase: string;
            opening: string;
        };
        chesscom: {
            analysis: string;
        };
    };
    /**
     * @param {CloudConfig} [config={}] - Engine configuration
     */
    constructor(config?: CloudConfig);
    provider: any;
    apiKey: any;
    apiUrl: any;
    multiPv: any;
    useTablebase: boolean;
    currentFen: string | null;
    cachedAnalysis: Map<any, any>;
    /**
     * Test API connection
     * @private
     * @returns {Promise<void>}
     */
    private _testConnection;
    /**
     * Start analysis
     * @override
     * @param {Object} [options={}] - Analysis options
     * @returns {Promise<EngineAnalysis>}
     */
    override go(options?: Object): Promise<EngineAnalysis>;
    /**
     * Fetch analysis from cloud API
     * @private
     * @param {string} fen - Position FEN
     * @param {Object} [options={}] - Options
     * @returns {Promise<EngineAnalysis>}
     */
    private _fetchAnalysis;
    /**
     * Fetch analysis from Lichess
     * @private
     * @param {string} fen - Position FEN
     * @param {Object} [options={}] - Options
     * @returns {Promise<EngineAnalysis>}
     */
    private _fetchLichessAnalysis;
    /**
     * Parse Lichess API response
     * @private
     * @param {Object} data - API response
     * @returns {EngineAnalysis}
     */
    private _parseLichessResponse;
    /**
     * Fetch analysis from Chess.com
     * @private
     * @param {string} fen - Position FEN
     * @param {Object} [_options={}] - Options
     * @returns {Promise<EngineAnalysis>}
     */
    private _fetchChesscomAnalysis;
    /**
     * Parse Chess.com API response
     * @private
     * @param {Object} data - API response
     * @returns {EngineAnalysis}
     */
    private _parseChesscomResponse;
    /**
     * Fetch analysis from custom API
     * @private
     * @param {string} fen - Position FEN
     * @param {Object} [options={}] - Options
     * @returns {Promise<EngineAnalysis>}
     */
    private _fetchCustomAnalysis;
    /**
     * Create empty analysis result
     * @private
     * @returns {EngineAnalysis}
     */
    private _createEmptyAnalysis;
    /**
     * Get tablebase probe
     * @param {string} fen - Position FEN
     * @returns {Promise<Object|null>}
     */
    probeTablebase(fen: string): Promise<Object | null>;
    /**
     * Get opening explorer data
     * @param {string} fen - Position FEN
     * @param {Object} [options={}] - Options
     * @returns {Promise<Object>}
     */
    getOpeningData(fen: string, options?: Object): Promise<Object>;
    /**
     * Clear analysis cache
     */
    clearCache(): void;
    /**
     * Get cache statistics
     * @returns {Object}
     */
    getCacheStats(): Object;
}
export default CloudEngine;
export type CloudConfig = Object;
//# sourceMappingURL=CloudEngine.d.ts.map