/**
 * Mode Manager - Manages game modes for the chessboard
 * @module modes/ModeManager
 * @since 3.1.0
 */

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
  static MODES = {
    creative: CreativeMode,
    pvp: PvPMode,
    vsBot: VsBotMode,
  };

  /**
   * @param {Object} chessboard - Reference to the chessboard instance
   */
  constructor(chessboard) {
    this.chessboard = chessboard;
    this.currentMode = null;
    this.modes = new Map();
    this.listeners = new Map();

    // Initialize default modes
    this._initializeDefaultModes();
  }

  /**
   * Initialize default modes
   * @private
   */
  _initializeDefaultModes() {
    // Pre-register all available modes
    Object.entries(ModeManager.MODES).forEach(([name, ModeClass]) => {
      this.registerMode(name, ModeClass);
    });
  }

  /**
   * Register a custom mode
   * @param {string} name - Mode name
   * @param {typeof BaseMode} ModeClass - Mode class constructor
   * @param {Object} [defaultConfig={}] - Default configuration
   */
  registerMode(name, ModeClass, defaultConfig = {}) {
    this.modes.set(name, {
      ModeClass,
      defaultConfig,
      instance: null,
    });
  }

  /**
   * Get or create a mode instance
   * @param {string} name - Mode name
   * @param {Object} [config={}] - Mode configuration
   * @returns {BaseMode|null}
   */
  getMode(name, config = {}) {
    const modeEntry = this.modes.get(name);
    if (!modeEntry) {
      console.error(`[ModeManager] Unknown mode: ${name}`);
      return null;
    }

    // Create new instance if needed or config changed
    if (!modeEntry.instance) {
      const mergedConfig = { ...modeEntry.defaultConfig, ...config };
      modeEntry.instance = new modeEntry.ModeClass(this.chessboard, mergedConfig);
    }

    return modeEntry.instance;
  }

  /**
   * Set the active mode
   * @param {ModeType|string} modeName - Name of the mode to activate
   * @param {Object} [config={}] - Mode configuration
   * @returns {BaseMode|null} - The activated mode
   */
  setMode(modeName, config = {}) {
    // Stop current mode if any
    if (this.currentMode) {
      this.currentMode.stop();
      this._emit('modeChanged', {
        from: this.currentMode.getName(),
        to: modeName,
      });
    }

    // Get or create the new mode
    const mode = this.getMode(modeName, config);
    if (!mode) {
      return null;
    }

    this.currentMode = mode;
    mode.start();

    this._emit('modeActivated', {
      mode: modeName,
      config: mode.config,
    });

    return mode;
  }

  /**
   * Get the current active mode
   * @returns {BaseMode|null}
   */
  getCurrentMode() {
    return this.currentMode;
  }

  /**
   * Get current mode name
   * @returns {string|null}
   */
  getCurrentModeName() {
    return this.currentMode ? this.currentMode.getName() : null;
  }

  /**
   * Check if a specific mode is active
   * @param {string} modeName - Mode name to check
   * @returns {boolean}
   */
  isModeActive(modeName) {
    return this.currentMode && this.currentMode.getName() === modeName;
  }

  /**
   * Get list of available modes
   * @returns {string[]}
   */
  getAvailableModes() {
    return Array.from(this.modes.keys());
  }

  /**
   * Check if a move is allowed in current mode
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean}
   */
  canMove(from, to, options = {}) {
    if (!this.currentMode) return true; // No mode restrictions
    return this.currentMode.canMove(from, to, options);
  }

  /**
   * Execute a move in current mode
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean}
   */
  executeMove(from, to, options = {}) {
    if (!this.currentMode) return false;
    return this.currentMode.executeMove(from, to, options);
  }

  /**
   * Check if piece creation is allowed
   * @returns {boolean}
   */
  canCreatePiece() {
    if (!this.currentMode) return false;
    return this.currentMode.canCreatePiece();
  }

  /**
   * Check if piece removal is allowed
   * @returns {boolean}
   */
  canRemovePiece() {
    if (!this.currentMode) return false;
    return this.currentMode.canRemovePiece();
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emit event
   * @private
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  _emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[ModeManager] Error in event listener for ${event}:`, err);
      }
    });
  }

  /**
   * Reset current mode
   */
  reset() {
    if (this.currentMode) {
      this.currentMode.reset();
    }
  }

  /**
   * Stop current mode
   */
  stop() {
    if (this.currentMode) {
      this.currentMode.stop();
      this.currentMode = null;
    }
  }

  /**
   * Destroy the mode manager
   */
  destroy() {
    this.stop();
    this.modes.clear();
    this.listeners.clear();
  }

  /**
   * Get statistics for current mode
   * @returns {Object|null}
   */
  getStats() {
    if (!this.currentMode) return null;
    return this.currentMode.getStats();
  }

  /**
   * Serialize current state
   * @returns {Object}
   */
  serialize() {
    return {
      currentMode: this.currentMode ? this.currentMode.serialize() : null,
      availableModes: this.getAvailableModes(),
    };
  }
}

export default ModeManager;
