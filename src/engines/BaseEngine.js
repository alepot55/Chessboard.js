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
  constructor(config = {}) {
    if (new.target === BaseEngine) {
      throw new Error('BaseEngine is abstract and cannot be instantiated directly');
    }

    this.config = {
      depth: 20,
      moveTime: 1000,
      threads: 1,
      hashSize: 16,
      useNNUE: true,
      ...config,
    };

    this.isReady = false;
    this.isSearching = false;
    this.info = null;
    this.listeners = new Map();
    this.currentAnalysis = null;
  }

  /**
   * Initialize the engine
   * @abstract
   * @returns {Promise<boolean>}
   */
  async init() {
    throw new Error('init() must be implemented by subclass');
  }

  /**
   * Shutdown the engine
   * @abstract
   * @returns {Promise<void>}
   */
  async quit() {
    throw new Error('quit() must be implemented by subclass');
  }

  /**
   * Check if engine is ready
   * @returns {boolean}
   */
  ready() {
    return this.isReady;
  }

  /**
   * Set position from FEN or moves
   * @abstract
   * @param {string} [_fen='startpos'] - FEN string or 'startpos'
   * @param {string[]} [_moves=[]] - Moves to apply
   * @returns {Promise<void>}
   */
  async setPosition(_fen = 'startpos', _moves = []) {
    throw new Error('setPosition() must be implemented by subclass');
  }

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
  async go(_options = {}) {
    throw new Error('go() must be implemented by subclass');
  }

  /**
   * Stop current analysis
   * @abstract
   * @returns {Promise<void>}
   */
  async stop() {
    throw new Error('stop() must be implemented by subclass');
  }

  /**
   * Set engine option
   * @abstract
   * @param {string} _name - Option name
   * @param {string|number|boolean} _value - Option value
   * @returns {Promise<void>}
   */
  async setOption(_name, _value) {
    throw new Error('setOption() must be implemented by subclass');
  }

  /**
   * Get engine info
   * @returns {EngineInfo|null}
   */
  getInfo() {
    return this.info;
  }

  /**
   * Get best move for current position
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Search options
   * @returns {Promise<string>} - Best move in UCI format
   */
  async getBestMove(fen, options = {}) {
    await this.setPosition(fen);
    const analysis = await this.go({
      depth: options.depth || this.config.depth,
      moveTime: options.moveTime || this.config.moveTime,
      ...options,
    });
    return analysis.bestMove;
  }

  /**
   * Analyze position
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Analysis options
   * @returns {Promise<EngineAnalysis>}
   */
  async analyze(fen, options = {}) {
    await this.setPosition(fen);
    return this.go({
      depth: options.depth || this.config.depth,
      ...options,
    });
  }

  /**
   * Start infinite analysis
   * @param {string} fen - Position FEN
   * @returns {Promise<void>}
   */
  async startInfiniteAnalysis(fen) {
    await this.setPosition(fen);
    this.go({ infinite: true });
  }

  /**
   * Add event listener
   * @param {string} event - Event name ('info', 'bestmove', 'error')
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
   * @protected
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  _emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error in engine event listener for ${event}:`, err);
      }
    });
  }

  /**
   * Parse UCI info line
   * @protected
   * @param {string} line - UCI info line
   * @returns {Object}
   */
  _parseInfo(line) {
    const info = {};
    const tokens = line.split(' ');
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];

      switch (token) {
        case 'depth':
          info.depth = parseInt(tokens[++i], 10);
          break;
        case 'seldepth':
          info.seldepth = parseInt(tokens[++i], 10);
          break;
        case 'multipv':
          info.multipv = parseInt(tokens[++i], 10);
          break;
        case 'score':
          if (tokens[i + 1] === 'cp') {
            info.score = parseInt(tokens[i + 2], 10);
            info.isMate = false;
            i += 2;
          } else if (tokens[i + 1] === 'mate') {
            info.score = parseInt(tokens[i + 2], 10);
            info.isMate = true;
            i += 2;
          }
          break;
        case 'nodes':
          info.nodes = parseInt(tokens[++i], 10);
          break;
        case 'nps':
          info.nps = parseInt(tokens[++i], 10);
          break;
        case 'time':
          info.time = parseInt(tokens[++i], 10);
          break;
        case 'pv':
          info.pv = tokens.slice(i + 1);
          i = tokens.length;
          break;
        case 'hashfull':
          info.hashfull = parseInt(tokens[++i], 10);
          break;
        case 'tbhits':
          info.tbhits = parseInt(tokens[++i], 10);
          break;
        case 'currmove':
          info.currmove = tokens[++i];
          break;
        case 'currmovenumber':
          info.currmovenumber = parseInt(tokens[++i], 10);
          break;
        default:
          break;
      }
      i++;
    }

    return info;
  }

  /**
   * Parse bestmove line
   * @protected
   * @param {string} line - UCI bestmove line
   * @returns {Object}
   */
  _parseBestMove(line) {
    const tokens = line.split(' ');
    const result = {
      bestMove: tokens[1] || null,
      ponder: null,
    };

    const ponderIndex = tokens.indexOf('ponder');
    if (ponderIndex !== -1 && tokens[ponderIndex + 1]) {
      result.ponder = tokens[ponderIndex + 1];
    }

    return result;
  }

  /**
   * Convert UCI move to algebraic notation helper
   * @param {string} uciMove - Move in UCI format (e.g., "e2e4")
   * @returns {Object} - {from, to, promotion}
   */
  parseUCIMove(uciMove) {
    if (!uciMove || uciMove.length < 4) return null;

    return {
      from: uciMove.slice(0, 2),
      to: uciMove.slice(2, 4),
      promotion: uciMove.length > 4 ? uciMove[4] : null,
    };
  }
}

export default BaseEngine;
