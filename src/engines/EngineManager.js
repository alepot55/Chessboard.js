/**
 * Engine Manager - Manages chess engine instances
 * @module engines/EngineManager
 * @since 3.1.0
 *
 * Provides unified interface to manage multiple engine types:
 * - Stockfish.js (browser WebAssembly)
 * - UCI engines (external via WebSocket/Worker)
 * - Cloud engines (API-based)
 *
 * @example
 * const manager = new EngineManager(chessboard);
 * await manager.loadEngine('stockfish');
 * const bestMove = await manager.getBestMove();
 */

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
  static ENGINE_TYPES = {
    stockfish: StockfishEngine,
    uci: UCIEngine,
    cloud: CloudEngine,
  };

  /**
   * Pre-configured engine presets
   */
  static PRESETS = {
    stockfish: {
      type: 'stockfish',
      config: { depth: 20 },
    },
    'stockfish-lite': {
      type: 'stockfish',
      config: { depth: 12, threads: 1, hash: 8 },
    },
    'stockfish-strong': {
      type: 'stockfish',
      config: { depth: 25, threads: 4, hash: 128 },
    },
    lichess: {
      type: 'cloud',
      config: { provider: 'lichess' },
    },
    'lichess-tablebase': {
      type: 'cloud',
      config: { provider: 'lichess', useTablebase: true },
    },
  };

  /**
   * @param {Object} chessboard - Chessboard instance
   * @param {EngineManagerConfig} [config={}] - Configuration
   */
  constructor(chessboard, config = {}) {
    this.chessboard = chessboard;
    this.config = {
      defaultEngine: 'stockfish',
      autoInit: true,
      ...config,
    };

    this.engines = new Map();
    this.currentEngine = null;
    this.currentEngineName = null;
    this.listeners = new Map();
  }

  /**
   * Load an engine by name or preset
   * @param {string} nameOrPreset - Engine name or preset
   * @param {Object} [config={}] - Engine configuration
   * @returns {Promise<BaseEngine>}
   */
  async loadEngine(nameOrPreset, config = {}) {
    // Check if it's a preset
    if (EngineManager.PRESETS[nameOrPreset]) {
      const preset = EngineManager.PRESETS[nameOrPreset];
      return this._createEngine(nameOrPreset, preset.type, { ...preset.config, ...config });
    }

    // Check if it's a direct engine type
    if (EngineManager.ENGINE_TYPES[nameOrPreset]) {
      return this._createEngine(nameOrPreset, nameOrPreset, config);
    }

    throw new Error(`Unknown engine: ${nameOrPreset}`);
  }

  /**
   * Create and initialize an engine
   * @private
   * @param {string} name - Engine name
   * @param {string} type - Engine type
   * @param {Object} config - Engine configuration
   * @returns {Promise<BaseEngine>}
   */
  async _createEngine(name, type, config) {
    const EngineClass = EngineManager.ENGINE_TYPES[type];
    if (!EngineClass) {
      throw new Error(`Unknown engine type: ${type}`);
    }

    const engine = new EngineClass(config);

    // Set up event forwarding
    engine.on('ready', (info) => this._emit('engineReady', { name, info }));
    engine.on('bestmove', (data) => this._emit('bestmove', { name, ...data }));
    engine.on('info', (data) => this._emit('info', { name, ...data }));
    engine.on('error', (error) => this._emit('error', { name, error }));

    // Initialize if configured
    if (this.config.autoInit) {
      await engine.init();
    }

    // Store engine
    this.engines.set(name, engine);

    // Set as current if first engine or if no current
    if (!this.currentEngine) {
      this.currentEngine = engine;
      this.currentEngineName = name;
    }

    this._emit('engineLoaded', { name, engine });

    return engine;
  }

  /**
   * Get engine by name
   * @param {string} [name] - Engine name (uses current if not specified)
   * @returns {BaseEngine|null}
   */
  getEngine(name) {
    if (!name) return this.currentEngine;
    return this.engines.get(name) || null;
  }

  /**
   * Set current engine
   * @param {string} name - Engine name
   * @returns {BaseEngine}
   */
  setCurrentEngine(name) {
    const engine = this.engines.get(name);
    if (!engine) {
      throw new Error(`Engine not loaded: ${name}`);
    }

    this.currentEngine = engine;
    this.currentEngineName = name;
    this._emit('engineChanged', { name, engine });

    return engine;
  }

  /**
   * Unload an engine
   * @param {string} name - Engine name
   * @returns {Promise<void>}
   */
  async unloadEngine(name) {
    const engine = this.engines.get(name);
    if (!engine) return;

    await engine.quit();
    this.engines.delete(name);

    if (this.currentEngineName === name) {
      // Switch to another engine or null
      const remaining = Array.from(this.engines.keys());
      if (remaining.length > 0) {
        this.setCurrentEngine(remaining[0]);
      } else {
        this.currentEngine = null;
        this.currentEngineName = null;
      }
    }

    this._emit('engineUnloaded', { name });
  }

  /**
   * Unload all engines
   * @returns {Promise<void>}
   */
  async unloadAll() {
    const names = Array.from(this.engines.keys());
    await Promise.all(names.map((name) => this.unloadEngine(name)));
  }

  // ============================================================
  // Analysis Methods (delegate to current engine)
  // ============================================================

  /**
   * Get best move for current position
   * @param {Object} [options={}] - Analysis options
   * @returns {Promise<string>}
   */
  async getBestMove(options = {}) {
    this._ensureEngine();

    const fen = this.chessboard.fen();
    await this.currentEngine.setPosition(fen);

    return this.currentEngine.getBestMove(options);
  }

  /**
   * Analyze current position
   * @param {Object} [options={}] - Analysis options
   * @returns {Promise<EngineAnalysis>}
   */
  async analyze(options = {}) {
    this._ensureEngine();

    const fen = this.chessboard.fen();
    return this.currentEngine.analyze(fen, options);
  }

  /**
   * Analyze a specific position
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Analysis options
   * @returns {Promise<EngineAnalysis>}
   */
  async analyzePosition(fen, options = {}) {
    this._ensureEngine();
    return this.currentEngine.analyze(fen, options);
  }

  /**
   * Stop current analysis
   * @returns {Promise<void>}
   */
  async stopAnalysis() {
    if (this.currentEngine) {
      await this.currentEngine.stop();
    }
  }

  /**
   * Set engine option
   * @param {string} name - Option name
   * @param {*} value - Option value
   * @param {string} [engineName] - Engine name (uses current if not specified)
   * @returns {Promise<void>}
   */
  async setOption(name, value, engineName) {
    const engine = engineName ? this.engines.get(engineName) : this.currentEngine;
    if (!engine) {
      throw new Error('No engine available');
    }
    await engine.setOption(name, value);
  }

  // ============================================================
  // Utility Methods
  // ============================================================

  /**
   * Ensure an engine is loaded
   * @private
   */
  _ensureEngine() {
    if (!this.currentEngine) {
      throw new Error('No engine loaded. Call loadEngine() first.');
    }
    if (!this.currentEngine.ready()) {
      throw new Error('Engine not ready. Wait for initialization.');
    }
  }

  /**
   * Get list of loaded engines
   * @returns {string[]}
   */
  getLoadedEngines() {
    return Array.from(this.engines.keys());
  }

  /**
   * Get current engine name
   * @returns {string|null}
   */
  getCurrentEngineName() {
    return this.currentEngineName;
  }

  /**
   * Check if an engine is loaded
   * @param {string} name - Engine name
   * @returns {boolean}
   */
  isLoaded(name) {
    return this.engines.has(name);
  }

  /**
   * Get available presets
   * @returns {string[]}
   */
  static getPresets() {
    return Object.keys(EngineManager.PRESETS);
  }

  /**
   * Get available engine types
   * @returns {string[]}
   */
  static getEngineTypes() {
    return Object.keys(EngineManager.ENGINE_TYPES);
  }

  // ============================================================
  // Event System
  // ============================================================

  /**
   * Register event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @returns {this}
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return this;
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @returns {this}
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
    return this;
  }

  /**
   * Emit event
   * @private
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  _emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * Destroy manager and all engines
   * @returns {Promise<void>}
   */
  async destroy() {
    await this.unloadAll();
    this.listeners.clear();
  }
}

export default EngineManager;
