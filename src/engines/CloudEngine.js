/**
 * Cloud Engine - API-based chess engine analysis
 * @module engines/CloudEngine
 * @since 3.1.0
 *
 * Connects to cloud-based chess analysis APIs:
 * - Lichess Cloud Analysis API
 * - Chess.com Analysis API
 * - Custom API endpoints
 *
 * @example
 * const engine = new CloudEngine({
 *   provider: 'lichess',
 *   apiKey: 'your-api-key' // Optional for Lichess
 * });
 * await engine.init();
 * const analysis = await engine.analyze('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
 */

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
  static PROVIDERS = {
    lichess: {
      analysis: 'https://lichess.org/api/cloud-eval',
      tablebase: 'https://tablebase.lichess.ovh/standard',
      opening: 'https://explorer.lichess.ovh/lichess',
    },
    chesscom: {
      analysis: 'https://api.chess.com/pub/analysis',
    },
  };

  /**
   * @param {CloudConfig} [config={}] - Engine configuration
   */
  constructor(config = {}) {
    super({
      depth: 40, // Cloud engines typically go deeper
      multiPv: 1,
      useTablebase: true,
      ...config,
    });

    this.provider = config.provider || 'lichess';
    this.apiKey = config.apiKey || null;
    this.apiUrl = config.apiUrl || null;
    this.multiPv = config.multiPv || 1;
    this.useTablebase = config.useTablebase !== false;

    this.currentFen = null;
    this.cachedAnalysis = new Map();
  }

  /**
   * Initialize the cloud engine
   * @override
   * @returns {Promise<boolean>}
   */
  async init() {
    if (this.isReady) return true;

    try {
      // Test API connectivity
      await this._testConnection();

      this.info = {
        name: `Cloud Engine (${this.provider})`,
        author: this.provider,
        version: '1.0',
        options: ['multiPv', 'useTablebase'],
      };

      this.isReady = true;
      this._emit('ready', this.info);

      return true;
    } catch (error) {
      this._emit('error', error);
      throw error;
    }
  }

  /**
   * Test API connection
   * @private
   * @returns {Promise<void>}
   */
  async _testConnection() {
    const testFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    try {
      await this._fetchAnalysis(testFen);
    } catch (error) {
      // Some providers may not have analysis for start position
      // Just check if we got a response
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new Error(`Failed to connect to ${this.provider} API`);
      }
    }
  }

  /**
   * Shutdown the cloud engine
   * @override
   * @returns {Promise<void>}
   */
  async quit() {
    this.isReady = false;
    this.cachedAnalysis.clear();
    this._emit('quit');
  }

  /**
   * Set position
   * @override
   * @param {string} [fen='startpos'] - FEN string or 'startpos'
   * @param {string[]} [_moves=[]] - Moves to apply (not used for cloud)
   * @returns {Promise<void>}
   */
  async setPosition(fen = 'startpos', _moves = []) {
    if (fen === 'startpos') {
      this.currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    } else {
      this.currentFen = fen;
    }
  }

  /**
   * Start analysis
   * @override
   * @param {Object} [options={}] - Analysis options
   * @returns {Promise<EngineAnalysis>}
   */
  async go(options = {}) {
    if (!this.isReady) throw new Error('Engine not ready');
    if (!this.currentFen) throw new Error('Position not set');

    this.isSearching = true;

    try {
      // Check cache first
      const cacheKey = `${this.currentFen}-${options.multiPv || this.multiPv}`;
      if (this.cachedAnalysis.has(cacheKey)) {
        const cached = this.cachedAnalysis.get(cacheKey);
        this.isSearching = false;
        return cached;
      }

      // Fetch from cloud
      const analysis = await this._fetchAnalysis(this.currentFen, options);

      // Cache result
      this.cachedAnalysis.set(cacheKey, analysis);

      // Limit cache size
      if (this.cachedAnalysis.size > 1000) {
        const firstKey = this.cachedAnalysis.keys().next().value;
        this.cachedAnalysis.delete(firstKey);
      }

      this.isSearching = false;
      this._emit('bestmove', { bestMove: analysis.bestMove, ponder: analysis.ponder });

      return analysis;
    } catch (error) {
      this.isSearching = false;
      throw error;
    }
  }

  /**
   * Stop current analysis (no-op for cloud)
   * @override
   * @returns {Promise<void>}
   */
  async stop() {
    this.isSearching = false;
  }

  /**
   * Set engine option
   * @override
   * @param {string} name - Option name
   * @param {string|number|boolean} value - Option value
   * @returns {Promise<void>}
   */
  async setOption(name, value) {
    switch (name.toLowerCase()) {
      case 'multipv':
        this.multiPv = parseInt(value, 10);
        break;
      case 'usetablebase':
        this.useTablebase = value === true || value === 'true';
        break;
      default:
        this.config[name] = value;
    }
  }

  /**
   * Fetch analysis from cloud API
   * @private
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Options
   * @returns {Promise<EngineAnalysis>}
   */
  async _fetchAnalysis(fen, options = {}) {
    switch (this.provider) {
      case 'lichess':
        return this._fetchLichessAnalysis(fen, options);
      case 'chesscom':
        return this._fetchChesscomAnalysis(fen, options);
      case 'custom':
        return this._fetchCustomAnalysis(fen, options);
      default:
        throw new Error(`Unknown provider: ${this.provider}`);
    }
  }

  /**
   * Fetch analysis from Lichess
   * @private
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Options
   * @returns {Promise<EngineAnalysis>}
   */
  async _fetchLichessAnalysis(fen, options = {}) {
    const multiPv = options.multiPv || this.multiPv;
    const url = new URL(CloudEngine.PROVIDERS.lichess.analysis);
    url.searchParams.set('fen', fen);
    url.searchParams.set('multiPv', multiPv.toString());

    const headers = {};
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      if (response.status === 404) {
        // Position not in cloud, return empty analysis
        return this._createEmptyAnalysis();
      }
      throw new Error(`Lichess API error: ${response.status}`);
    }

    const data = await response.json();
    return this._parseLichessResponse(data);
  }

  /**
   * Parse Lichess API response
   * @private
   * @param {Object} data - API response
   * @returns {EngineAnalysis}
   */
  _parseLichessResponse(data) {
    if (!data.pvs || data.pvs.length === 0) {
      return this._createEmptyAnalysis();
    }

    const pv = data.pvs[0];
    const moves = pv.moves ? pv.moves.split(' ') : [];

    return {
      bestMove: moves[0] || null,
      ponder: moves[1] || null,
      score: pv.cp !== undefined ? pv.cp : pv.mate !== undefined ? pv.mate * 10000 : 0,
      isMate: pv.mate !== undefined,
      depth: data.depth || 0,
      nodes: data.knodes ? data.knodes * 1000 : 0,
      time: 0,
      pv: moves,
      nps: 0,
      multiPv: data.pvs.map((p) => ({
        moves: p.moves ? p.moves.split(' ') : [],
        score: p.cp !== undefined ? p.cp : p.mate !== undefined ? p.mate * 10000 : 0,
        isMate: p.mate !== undefined,
      })),
    };
  }

  /**
   * Fetch analysis from Chess.com
   * @private
   * @param {string} fen - Position FEN
   * @param {Object} [_options={}] - Options
   * @returns {Promise<EngineAnalysis>}
   */
  async _fetchChesscomAnalysis(fen, _options = {}) {
    // Chess.com analysis API (if available)
    const url = new URL(CloudEngine.PROVIDERS.chesscom.analysis);
    url.searchParams.set('fen', fen);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return this._createEmptyAnalysis();
    }

    const data = await response.json();
    return this._parseChesscomResponse(data);
  }

  /**
   * Parse Chess.com API response
   * @private
   * @param {Object} data - API response
   * @returns {EngineAnalysis}
   */
  _parseChesscomResponse(data) {
    // Parse Chess.com format (implementation depends on actual API format)
    if (!data.bestMove) {
      return this._createEmptyAnalysis();
    }

    return {
      bestMove: data.bestMove,
      ponder: data.ponder || null,
      score: data.score || 0,
      isMate: data.isMate || false,
      depth: data.depth || 0,
      nodes: data.nodes || 0,
      time: 0,
      pv: data.pv || [data.bestMove],
      nps: 0,
    };
  }

  /**
   * Fetch analysis from custom API
   * @private
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Options
   * @returns {Promise<EngineAnalysis>}
   */
  async _fetchCustomAnalysis(fen, options = {}) {
    if (!this.apiUrl) {
      throw new Error('Custom API URL not configured');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({ fen, options }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.status}`);
    }

    const data = await response.json();

    // Expect standard analysis format
    return {
      bestMove: data.bestMove || null,
      ponder: data.ponder || null,
      score: data.score || 0,
      isMate: data.isMate || false,
      depth: data.depth || 0,
      nodes: data.nodes || 0,
      time: data.time || 0,
      pv: data.pv || [],
      nps: data.nps || 0,
    };
  }

  /**
   * Create empty analysis result
   * @private
   * @returns {EngineAnalysis}
   */
  _createEmptyAnalysis() {
    return {
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
  }

  /**
   * Get tablebase probe
   * @param {string} fen - Position FEN
   * @returns {Promise<Object|null>}
   */
  async probeTablebase(fen) {
    if (this.provider !== 'lichess') {
      throw new Error('Tablebase probe only available with Lichess provider');
    }

    const url = new URL(CloudEngine.PROVIDERS.lichess.tablebase);
    url.searchParams.set('fen', fen);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      category: data.category, // 'win', 'draw', 'loss', 'maybe-win', etc.
      dtz: data.dtz, // Distance to zeroing (50-move counter)
      dtm: data.dtm, // Distance to mate (if available)
      bestMove: data.moves?.[0]?.uci || null,
      moves: data.moves?.map((m) => ({
        uci: m.uci,
        san: m.san,
        category: m.category,
        dtz: m.dtz,
      })),
    };
  }

  /**
   * Get opening explorer data
   * @param {string} fen - Position FEN
   * @param {Object} [options={}] - Options
   * @returns {Promise<Object>}
   */
  async getOpeningData(fen, options = {}) {
    if (this.provider !== 'lichess') {
      throw new Error('Opening explorer only available with Lichess provider');
    }

    const url = new URL(CloudEngine.PROVIDERS.lichess.opening);
    url.searchParams.set('fen', fen);

    if (options.speeds) {
      url.searchParams.set('speeds', options.speeds.join(','));
    }
    if (options.ratings) {
      url.searchParams.set('ratings', options.ratings.join(','));
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { moves: [], games: 0 };
    }

    const data = await response.json();

    return {
      moves: data.moves?.map((m) => ({
        uci: m.uci,
        san: m.san,
        games: m.white + m.draws + m.black,
        white: m.white,
        draws: m.draws,
        black: m.black,
        averageRating: m.averageRating,
      })),
      games: data.white + data.draws + data.black,
      opening: data.opening,
    };
  }

  /**
   * Clear analysis cache
   */
  clearCache() {
    this.cachedAnalysis.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object}
   */
  getCacheStats() {
    return {
      size: this.cachedAnalysis.size,
      maxSize: 1000,
    };
  }
}

export default CloudEngine;
