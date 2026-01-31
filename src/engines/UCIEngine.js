/**
 * UCI Engine - Universal Chess Interface protocol wrapper
 * @module engines/UCIEngine
 * @since 3.1.0
 *
 * Provides a base for connecting to UCI-compatible engines via:
 * - WebSocket connections
 * - HTTP API endpoints
 * - Custom transports
 *
 * @example
 * const engine = new UCIEngine({
 *   transport: 'websocket',
 *   url: 'ws://localhost:8080/stockfish'
 * });
 * await engine.init();
 */

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
  constructor(config) {
    if (!config.url && config.transport !== 'custom') {
      throw new Error('URL is required for UCI engine connection');
    }

    super(config);

    this.transport = config.transport || 'websocket';
    this.url = config.url;
    this.customSend = config.customSend;
    this.customReceive = config.customReceive;
    this.reconnectAttempts = config.reconnectAttempts || 3;
    this.reconnectDelay = config.reconnectDelay || 1000;

    this.connection = null;
    this.messageBuffer = '';
    this.pendingPromises = [];
  }

  /**
   * Initialize the engine connection
   * @override
   * @returns {Promise<boolean>}
   */
  async init() {
    if (this.isReady) return true;

    try {
      await this._connect();

      // UCI initialization
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
   * Connect to the engine
   * @private
   * @returns {Promise<void>}
   */
  async _connect() {
    switch (this.transport) {
      case 'websocket':
        await this._connectWebSocket();
        break;
      case 'http':
        // HTTP doesn't need persistent connection
        this.connection = { type: 'http' };
        break;
      case 'custom':
        if (this.customReceive) {
          this.customReceive((msg) => this._handleMessage(msg));
        }
        this.connection = { type: 'custom' };
        break;
      default:
        throw new Error(`Unknown transport: ${this.transport}`);
    }
  }

  /**
   * Connect via WebSocket
   * @private
   * @returns {Promise<void>}
   */
  _connectWebSocket() {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const connect = () => {
        try {
          this.connection = new WebSocket(this.url);

          this.connection.onopen = () => {
            this._emit('connected');
            resolve();
          };

          this.connection.onmessage = (event) => {
            this._handleMessage(event.data);
          };

          this.connection.onerror = (error) => {
            this._emit('error', error);
          };

          this.connection.onclose = () => {
            this._emit('disconnected');
            this.isReady = false;

            // Attempt reconnection
            if (attempts < this.reconnectAttempts) {
              attempts++;
              setTimeout(connect, this.reconnectDelay * attempts);
            }
          };
        } catch (error) {
          if (attempts < this.reconnectAttempts) {
            attempts++;
            setTimeout(connect, this.reconnectDelay * attempts);
          } else {
            reject(error);
          }
        }
      };

      connect();
    });
  }

  /**
   * Shutdown the engine
   * @override
   * @returns {Promise<void>}
   */
  async quit() {
    if (!this.connection) return;

    try {
      await this._send('quit');

      if (this.transport === 'websocket' && this.connection instanceof WebSocket) {
        this.connection.close();
      }
    } catch {
      // Ignore errors during shutdown
    }

    this.connection = null;
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
      this._send(command);
      return this.currentAnalysis;
    }

    if (options.depth) command += ` depth ${options.depth}`;
    if (options.moveTime) command += ` movetime ${options.moveTime}`;
    if (options.wtime) command += ` wtime ${options.wtime}`;
    if (options.btime) command += ` btime ${options.btime}`;
    if (options.winc) command += ` winc ${options.winc}`;
    if (options.binc) command += ` binc ${options.binc}`;

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
      const timeout = setTimeout(() => {
        this.isSearching = false;
        resolve();
      }, 1000);

      const handler = () => {
        clearTimeout(timeout);
        this.off('bestmove', handler);
        this.isSearching = false;
        resolve();
      };

      this.on('bestmove', handler);
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
   * Configure engine options
   * @private
   */
  async _configureEngine() {
    if (this.config.threads > 1) {
      await this._send(`setoption name Threads value ${this.config.threads}`);
    }
    await this._send(`setoption name Hash value ${this.config.hashSize}`);
  }

  /**
   * Send command to engine
   * @private
   * @param {string} command - UCI command
   * @returns {Promise<void>}
   */
  async _send(command) {
    this._emit('command', command);

    switch (this.transport) {
      case 'websocket':
        if (this.connection && this.connection.readyState === WebSocket.OPEN) {
          this.connection.send(command);
        }
        break;
      case 'http':
        await this._sendHttp(command);
        break;
      case 'custom':
        if (this.customSend) {
          await this.customSend(command);
        }
        break;
    }
  }

  /**
   * Send command via HTTP
   * @private
   * @param {string} command - UCI command
   * @returns {Promise<string>}
   */
  async _sendHttp(command) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: command,
    });

    const data = await response.text();

    // Process response lines
    const lines = data.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        this._handleMessage(line);
      }
    }

    return data;
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
   * Handle incoming message
   * @private
   * @param {string} data - Message from engine
   */
  _handleMessage(data) {
    if (typeof data !== 'string') return;

    // Handle multi-line messages
    this.messageBuffer += data;
    const lines = this.messageBuffer.split('\n');
    this.messageBuffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      this._emit('message', trimmed);

      if (trimmed.startsWith('id ')) {
        this._parseId(trimmed);
      } else if (trimmed.startsWith('info ')) {
        const info = this._parseInfo(trimmed.slice(5));
        this._updateAnalysis(info);
        this._emit('info', info);
      } else if (trimmed.startsWith('bestmove ')) {
        const result = this._parseBestMove(trimmed);
        this._emit('bestmove', result);
      } else if (trimmed.startsWith('option ')) {
        this._parseOption(trimmed);
      }
    }
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
   * Update current analysis
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
   * Get connection status
   * @returns {boolean}
   */
  isConnected() {
    if (!this.connection) return false;

    if (this.transport === 'websocket') {
      return this.connection.readyState === WebSocket.OPEN;
    }

    return true;
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

export default UCIEngine;
