/**
 * Stockfish Engine - Browser-based Stockfish.js adapter
 * @module engines/StockfishEngine
 * @since 3.1.0
 *
 * Uses Stockfish.js (WebAssembly) for browser-based analysis.
 * Supports both single-threaded and multi-threaded (SharedArrayBuffer) modes.
 *
 * @example
 * const engine = new StockfishEngine();
 * await engine.init();
 * const bestMove = await engine.getBestMove('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
 * console.log(bestMove); // "e2e4"
 */

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
  static CDN_URLS = {
    // Stockfish.js official releases
    stockfish16: 'https://cdn.jsdelivr.net/npm/stockfish.js@16/stockfish.js',
    stockfish15: 'https://cdn.jsdelivr.net/npm/stockfish.js@15/stockfish.js',
    stockfish14: 'https://cdn.jsdelivr.net/npm/stockfish@14/stockfish.js',
    // Alternative CDNs
    unpkg: 'https://unpkg.com/stockfish.js/stockfish.js',
  };

  /**
   * @param {StockfishConfig} [config={}] - Engine configuration
   */
  constructor(config = {}) {
    super({
      threads: 1,
      hashSize: 16,
      useNNUE: true,
      ...config,
    });

    this.worker = null;
    this.messageQueue = [];
    this.pendingCommand = null;
    this.wasmPath = config.wasmPath || null;
    this.nnuePath = config.nnuePath || null;
  }

  /**
   * Check if SharedArrayBuffer is available (needed for multi-threading)
   * @returns {boolean}
   */
  static supportsThreads() {
    try {
      return typeof SharedArrayBuffer !== 'undefined';
    } catch {
      return false;
    }
  }

  /**
   * Check if WebAssembly is supported
   * @returns {boolean}
   */
  static supportsWasm() {
    try {
      return typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
    } catch {
      return false;
    }
  }

  /**
   * Initialize the Stockfish engine
   * @override
   * @returns {Promise<boolean>}
   */
  async init() {
    if (this.isReady) return true;

    if (!StockfishEngine.supportsWasm()) {
      throw new Error('WebAssembly is not supported in this environment');
    }

    try {
      // Create worker
      const workerUrl = this.wasmPath || StockfishEngine.CDN_URLS.stockfish16;
      this.worker = new Worker(workerUrl);

      // Set up message handling
      this.worker.onmessage = (e) => this._handleMessage(e.data);
      this.worker.onerror = (e) => this._handleError(e);

      // Initialize UCI
      await this._sendAndWait('uci', 'uciok');

      // Configure engine options
      await this._configureEngine();

      // Wait for ready
      await this._sendAndWait('isready', 'readyok');

      this.isReady = true;
      this._emit('ready', this.info);

      return true;
    } catch (error) {
      this._emit('error', error);
      throw error;
    }
  }

  /**
   * Initialize from a custom Stockfish instance
   * @param {Worker|Object} stockfishInstance - Stockfish worker or instance
   * @returns {Promise<boolean>}
   */
  async initFromInstance(stockfishInstance) {
    if (this.isReady) return true;

    try {
      if (stockfishInstance instanceof Worker) {
        this.worker = stockfishInstance;
        this.worker.onmessage = (e) => this._handleMessage(e.data);
        this.worker.onerror = (e) => this._handleError(e);
      } else if (typeof stockfishInstance.postMessage === 'function') {
        // Duck-typing for custom implementations
        this.worker = stockfishInstance;
        if (typeof stockfishInstance.addMessageListener === 'function') {
          stockfishInstance.addMessageListener((msg) => this._handleMessage(msg));
        }
      } else {
        throw new Error('Invalid Stockfish instance');
      }

      await this._sendAndWait('uci', 'uciok');
      await this._configureEngine();
      await this._sendAndWait('isready', 'readyok');

      this.isReady = true;
      this._emit('ready', this.info);

      return true;
    } catch (error) {
      this._emit('error', error);
      throw error;
    }
  }

  /**
   * Configure engine options
   * @private
   */
  async _configureEngine() {
    // Set threads (only if SharedArrayBuffer available)
    if (StockfishEngine.supportsThreads() && this.config.threads > 1) {
      await this._send(`setoption name Threads value ${this.config.threads}`);
    }

    // Set hash size
    await this._send(`setoption name Hash value ${this.config.hashSize}`);

    // Configure NNUE if available
    if (this.config.useNNUE) {
      await this._send('setoption name Use NNUE value true');
      if (this.nnuePath) {
        await this._send(`setoption name EvalFile value ${this.nnuePath}`);
      }
    }
  }

  /**
   * Shutdown the engine
   * @override
   * @returns {Promise<void>}
   */
  async quit() {
    if (!this.worker) return;

    try {
      this._send('quit');
      this.worker.terminate();
    } catch {
      // Ignore errors during shutdown
    }

    this.worker = null;
    this.isReady = false;
    this.isSearching = false;
    this._emit('quit');
  }

  /**
   * Set position
   * @override
   * @param {string} [fen='startpos'] - FEN string or 'startpos'
   * @param {string[]} [moves=[]] - Moves to apply
   * @returns {Promise<void>}
   */
  async setPosition(fen = 'startpos', moves = []) {
    if (!this.isReady) throw new Error('Engine not ready');

    let command;
    if (fen === 'startpos') {
      command = 'position startpos';
    } else {
      command = `position fen ${fen}`;
    }

    if (moves.length > 0) {
      command += ` moves ${moves.join(' ')}`;
    }

    await this._send(command);
  }

  /**
   * Start search
   * @override
   * @param {Object} [options={}] - Search options
   * @returns {Promise<EngineAnalysis>}
   */
  async go(options = {}) {
    if (!this.isReady) throw new Error('Engine not ready');
    if (this.isSearching) {
      await this.stop();
    }

    this.isSearching = true;
    this.currentAnalysis = {
      bestMove: null,
      ponder: null,
      score: 0,
      isMate: false,
      depth: 0,
      nodes: 0,
      time: 0,
      pv: [],
      nps: 0,
    };

    // Build go command
    let command = 'go';

    if (options.infinite) {
      command += ' infinite';
    } else {
      if (options.depth) {
        command += ` depth ${options.depth}`;
      }
      if (options.moveTime) {
        command += ` movetime ${options.moveTime}`;
      }
      if (options.wtime) {
        command += ` wtime ${options.wtime}`;
      }
      if (options.btime) {
        command += ` btime ${options.btime}`;
      }
      if (options.winc) {
        command += ` winc ${options.winc}`;
      }
      if (options.binc) {
        command += ` binc ${options.binc}`;
      }
      if (options.movestogo) {
        command += ` movestogo ${options.movestogo}`;
      }
      if (options.nodes) {
        command += ` nodes ${options.nodes}`;
      }
      if (options.mate) {
        command += ` mate ${options.mate}`;
      }
    }

    // For infinite analysis, just send command and return
    if (options.infinite) {
      this._send(command);
      return this.currentAnalysis;
    }

    // Wait for bestmove
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => {
          this.isSearching = false;
          reject(new Error('Search timeout'));
        },
        (options.moveTime || this.config.moveTime) + 30000
      );

      const handler = (data) => {
        if (data.bestMove) {
          clearTimeout(timeout);
          this.off('bestmove', handler);
          this.isSearching = false;
          resolve({
            ...this.currentAnalysis,
            ...data,
          });
        }
      };

      this.on('bestmove', handler);
      this._send(command);
    });
  }

  /**
   * Stop current search
   * @override
   * @returns {Promise<void>}
   */
  async stop() {
    if (!this.isSearching) return;

    return new Promise((resolve) => {
      const handler = () => {
        this.off('bestmove', handler);
        this.isSearching = false;
        resolve();
      };

      // Set timeout in case bestmove never comes
      const timeout = setTimeout(() => {
        this.off('bestmove', handler);
        this.isSearching = false;
        resolve();
      }, 1000);

      this.on('bestmove', () => {
        clearTimeout(timeout);
        handler();
      });

      this._send('stop');
    });
  }

  /**
   * Set engine option
   * @override
   * @param {string} name - Option name
   * @param {string|number|boolean} value - Option value
   * @returns {Promise<void>}
   */
  async setOption(name, value) {
    if (!this.isReady) throw new Error('Engine not ready');
    await this._send(`setoption name ${name} value ${value}`);
    await this._sendAndWait('isready', 'readyok');
  }

  /**
   * Get evaluation of current position
   * @returns {Promise<Object>}
   */
  async eval() {
    if (!this.isReady) throw new Error('Engine not ready');

    return new Promise((resolve) => {
      let output = '';

      const handler = (msg) => {
        if (typeof msg === 'string') {
          output += `${msg}\n`;
        }
      };

      this.on('message', handler);

      setTimeout(() => {
        this.off('message', handler);
        resolve(this._parseEval(output));
      }, 100);

      this._send('eval');
    });
  }

  /**
   * Send command to engine
   * @private
   * @param {string} command - UCI command
   */
  _send(command) {
    if (!this.worker) return;

    this._emit('command', command);
    this.worker.postMessage(command);
  }

  /**
   * Send command and wait for response
   * @private
   * @param {string} command - UCI command
   * @param {string} expectedResponse - Expected response to wait for
   * @returns {Promise<void>}
   */
  _sendAndWait(command, expectedResponse) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout waiting for ${expectedResponse}`));
      }, 10000);

      const handler = (msg) => {
        if (typeof msg === 'string' && msg.includes(expectedResponse)) {
          clearTimeout(timeout);
          this.off('message', handler);
          resolve();
        }
      };

      this.on('message', handler);
      this._send(command);
    });
  }

  /**
   * Handle engine message
   * @private
   * @param {string} data - Message from engine
   */
  _handleMessage(data) {
    if (typeof data !== 'string') return;

    this._emit('message', data);

    // Parse different message types
    if (data.startsWith('id ')) {
      this._parseId(data);
    } else if (data.startsWith('info ')) {
      const info = this._parseInfo(data.slice(5));
      this._updateAnalysis(info);
      this._emit('info', info);
    } else if (data.startsWith('bestmove ')) {
      const result = this._parseBestMove(data);
      this._emit('bestmove', result);
    } else if (data.startsWith('option ')) {
      this._parseOption(data);
    }
  }

  /**
   * Handle engine error
   * @private
   * @param {Error} error - Error object
   */
  _handleError(error) {
    this._emit('error', error);
  }

  /**
   * Parse engine ID
   * @private
   * @param {string} line - ID line
   */
  _parseId(line) {
    if (!this.info) {
      this.info = { name: '', author: '', version: '', options: [] };
    }

    if (line.startsWith('id name ')) {
      this.info.name = line.slice(8);
      // Extract version from name
      const versionMatch = this.info.name.match(/(\d+(?:\.\d+)*)/);
      if (versionMatch) {
        this.info.version = versionMatch[1];
      }
    } else if (line.startsWith('id author ')) {
      this.info.author = line.slice(10);
    }
  }

  /**
   * Parse engine option
   * @private
   * @param {string} line - Option line
   */
  _parseOption(line) {
    if (!this.info) {
      this.info = { name: '', author: '', version: '', options: [] };
    }

    const nameMatch = line.match(/option name ([^ ]+)/);
    if (nameMatch) {
      this.info.options.push(nameMatch[1]);
    }
  }

  /**
   * Update current analysis with new info
   * @private
   * @param {Object} info - Parsed info
   */
  _updateAnalysis(info) {
    if (!this.currentAnalysis) return;

    if (info.depth !== undefined) this.currentAnalysis.depth = info.depth;
    if (info.score !== undefined) {
      this.currentAnalysis.score = info.score;
      this.currentAnalysis.isMate = info.isMate || false;
    }
    if (info.nodes !== undefined) this.currentAnalysis.nodes = info.nodes;
    if (info.time !== undefined) this.currentAnalysis.time = info.time;
    if (info.nps !== undefined) this.currentAnalysis.nps = info.nps;
    if (info.pv !== undefined) this.currentAnalysis.pv = info.pv;
  }

  /**
   * Parse eval output
   * @private
   * @param {string} output - Eval output
   * @returns {Object}
   */
  _parseEval(output) {
    // Simple parsing of eval output
    const lines = output.split('\n');
    const result = { raw: output };

    for (const line of lines) {
      if (line.includes('Final evaluation')) {
        const match = line.match(/([-+]?\d+\.?\d*)/);
        if (match) {
          result.evaluation = parseFloat(match[1]);
        }
      }
    }

    return result;
  }

  /**
   * Get current analysis state
   * @returns {EngineAnalysis|null}
   */
  getCurrentAnalysis() {
    return this.currentAnalysis;
  }

  /**
   * New game - reset engine state
   * @returns {Promise<void>}
   */
  async newGame() {
    if (!this.isReady) throw new Error('Engine not ready');
    await this._send('ucinewgame');
    await this._sendAndWait('isready', 'readyok');
  }
}

export default StockfishEngine;
