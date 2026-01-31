import { BaseEngine } from './BaseEngine.js';
/**
 * @typedef {Object} UCIConfig
 * @extends EngineConfig
 * @property {'websocket'|'http'|'custom'} [transport='websocket'] - Transport type
 * @property {string} url - Engine endpoint URL
 * @property {Function} [customSend] - Custom send function for 'custom' transport
 * @property {Function} [customReceive] - Custom receive setup for 'custom' transport
 * @property {number} [reconnectAttempts=3] - Number of reconnection attempts
 * @property {number} [reconnectDelay=1000] - Delay between reconnects in ms
 */
/**
 * UCI engine connection via WebSocket or HTTP
 */
export class UCIEngine extends BaseEngine {
    /**
     * @param {UCIConfig} config - Engine configuration
     */
    constructor(config: UCIConfig);
    transport: any;
    url: any;
    customSend: any;
    customReceive: any;
    reconnectAttempts: any;
    reconnectDelay: any;
    connection: WebSocket | {
        type: string;
    } | {
        type: string;
    } | null;
    messageBuffer: string;
    pendingPromises: any[];
    /**
     * Connect to the engine
     * @private
     * @returns {Promise<void>}
     */
    private _connect;
    /**
     * Connect via WebSocket
     * @private
     * @returns {Promise<void>}
     */
    private _connectWebSocket;
    /**
     * Start search
     * @override
     * @param {Object} [options={}] - Search options
     * @returns {Promise<EngineAnalysis>}
     */
    override go(options?: Object): Promise<EngineAnalysis>;
    /**
     * Configure engine options
     * @private
     */
    private _configureEngine;
    /**
     * Send command to engine
     * @private
     * @param {string} command - UCI command
     * @returns {Promise<void>}
     */
    private _send;
    /**
     * Send command via HTTP
     * @private
     * @param {string} command - UCI command
     * @returns {Promise<string>}
     */
    private _sendHttp;
    /**
     * Send command and wait for response
     * @private
     * @param {string} command - UCI command
     * @param {string} expectedResponse - Expected response to wait for
     * @returns {Promise<void>}
     */
    private _sendAndWait;
    /**
     * Handle incoming message
     * @private
     * @param {string} data - Message from engine
     */
    private _handleMessage;
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
     * Update current analysis
     * @private
     * @param {Object} info - Parsed info
     */
    private _updateAnalysis;
    /**
     * Get connection status
     * @returns {boolean}
     */
    isConnected(): boolean;
    /**
     * New game - reset engine state
     * @returns {Promise<void>}
     */
    newGame(): Promise<void>;
}
export default UCIEngine;
export type UCIConfig = Object;
//# sourceMappingURL=UCIEngine.d.ts.map