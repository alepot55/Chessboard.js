import { CreativeMode } from './CreativeMode.js';
import { PvPMode } from './PvPMode.js';
import { VsBotMode } from './VsBotMode.js';
/**
 * @typedef {'creative'|'pvp'|'vsBot'|'analysis'} ModeType
 */
/**
 * Manages different game modes for the chessboard
 */
export class ModeManager {
    /**
     * Available mode constructors
     * @static
     */
    static MODES: {
        creative: typeof CreativeMode;
        pvp: typeof PvPMode;
        vsBot: typeof VsBotMode;
    };
    /**
     * @param {Object} chessboard - Reference to the chessboard instance
     */
    constructor(chessboard: Object);
    chessboard: Object;
    currentMode: any;
    modes: Map<any, any>;
    listeners: Map<any, any>;
    /**
     * Initialize default modes
     * @private
     */
    private _initializeDefaultModes;
    /**
     * Register a custom mode
     * @param {string} name - Mode name
     * @param {typeof BaseMode} ModeClass - Mode class constructor
     * @param {Object} [defaultConfig={}] - Default configuration
     */
    registerMode(name: string, ModeClass: typeof BaseMode, defaultConfig?: Object): void;
    /**
     * Get or create a mode instance
     * @param {string} name - Mode name
     * @param {Object} [config={}] - Mode configuration
     * @returns {BaseMode|null}
     */
    getMode(name: string, config?: Object): BaseMode | null;
    /**
     * Set the active mode
     * @param {ModeType|string} modeName - Name of the mode to activate
     * @param {Object} [config={}] - Mode configuration
     * @returns {BaseMode|null} - The activated mode
     */
    setMode(modeName: ModeType | string, config?: Object): BaseMode | null;
    /**
     * Get the current active mode
     * @returns {BaseMode|null}
     */
    getCurrentMode(): BaseMode | null;
    /**
     * Get current mode name
     * @returns {string|null}
     */
    getCurrentModeName(): string | null;
    /**
     * Check if a specific mode is active
     * @param {string} modeName - Mode name to check
     * @returns {boolean}
     */
    isModeActive(modeName: string): boolean;
    /**
     * Get list of available modes
     * @returns {string[]}
     */
    getAvailableModes(): string[];
    /**
     * Check if a move is allowed in current mode
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @param {Object} [options={}] - Additional options
     * @returns {boolean}
     */
    canMove(from: string, to: string, options?: Object): boolean;
    /**
     * Execute a move in current mode
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @param {Object} [options={}] - Additional options
     * @returns {boolean}
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
     * @private
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    private _emit;
    /**
     * Reset current mode
     */
    reset(): void;
    /**
     * Stop current mode
     */
    stop(): void;
    /**
     * Destroy the mode manager
     */
    destroy(): void;
    /**
     * Get statistics for current mode
     * @returns {Object|null}
     */
    getStats(): Object | null;
    /**
     * Serialize current state
     * @returns {Object}
     */
    serialize(): Object;
}
export default ModeManager;
export type ModeType = "creative" | "pvp" | "vsBot" | "analysis";
//# sourceMappingURL=ModeManager.d.ts.map