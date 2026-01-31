/**
 * VsBot Mode - Player vs Computer with AI opponent
 * @module modes/VsBotMode
 * @since 3.1.0
 *
 * Features:
 * - Multiple difficulty levels (1-10)
 * - Configurable bot color
 * - Thinking time simulation
 * - Hint system
 * - Analysis mode
 * - Takeback support
 * - External engine support (Stockfish.js, UCI, Cloud APIs)
 */

import { BaseMode } from './BaseMode.js';
import { ChessAI } from '../ai/ChessAI.js';

/**
 * @typedef {Object} VsBotModeConfig
 * @extends ModeConfig
 * @property {'w'|'b'} [playerColor='w'] - Human player's color
 * @property {number} [botDifficulty=5] - Bot difficulty (1-10)
 * @property {number} [botThinkingTime=1000] - Minimum bot thinking time in ms
 * @property {boolean} [showBotThinking=true] - Show thinking indicator
 * @property {boolean} [allowHints=true] - Allow hint requests
 * @property {boolean} [allowTakeback=true] - Allow takeback
 * @property {boolean} [autoMove=true] - Bot moves automatically
 * @property {Object} [engine=null] - External engine instance (StockfishEngine, UCIEngine, CloudEngine)
 * @property {number} [engineDepth=20] - Search depth for external engine
 * @property {number} [engineMoveTime=1000] - Move time for external engine in ms
 * @property {Function} [onBotMove] - Callback when bot moves
 * @property {Function} [onBotThinking] - Callback when bot starts thinking
 * @property {Function} [onEngineInfo] - Callback for engine analysis info
 */

/**
 * Player vs Bot mode
 */
export class VsBotMode extends BaseMode {
  /**
   * Difficulty level descriptions
   * @static
   */
  static DIFFICULTY_NAMES = {
    1: 'Beginner',
    2: 'Easy',
    3: 'Easy+',
    4: 'Medium-',
    5: 'Medium',
    6: 'Medium+',
    7: 'Hard-',
    8: 'Hard',
    9: 'Expert',
    10: 'Master',
  };

  /**
   * @param {Object} chessboard - Reference to the chessboard instance
   * @param {VsBotModeConfig} [config={}] - Mode configuration
   */
  constructor(chessboard, config = {}) {
    super(chessboard, {
      name: 'vsBot',
      enforceRules: true,
      allowFreeMovement: false,
      allowPieceCreation: false,
      allowPieceRemoval: false,
      trackTurns: true,
      detectGameEnd: true,
      playerColor: 'w',
      botDifficulty: 5,
      botThinkingTime: 1000,
      showBotThinking: true,
      allowHints: true,
      allowTakeback: true,
      autoMove: true,
      ...config,
    });

    this.ai = null;
    this.engine = config.engine || null;
    this.botColor = this.config.playerColor === 'w' ? 'b' : 'w';
    this.isThinking = false;
    this.thinkingTimeout = null;
    this.hintsUsed = 0;
    this.lastBotMove = null;
    this.useExternalEngine = !!config.engine;
  }

  /**
   * Start vs bot game
   * @override
   */
  start() {
    super.start();

    // Initialize AI
    this._initializeAI();

    this._emit('gameStart', {
      playerColor: this.config.playerColor,
      botColor: this.botColor,
      difficulty: this.config.botDifficulty,
      difficultyName: VsBotMode.DIFFICULTY_NAMES[this.config.botDifficulty],
    });

    // If bot plays white, make first move
    if (this.botColor === 'w' && this.config.autoMove) {
      this._scheduleBotMove();
    }
  }

  /**
   * Stop vs bot game
   * @override
   */
  stop() {
    this._cancelBotMove();
    super.stop();
  }

  /**
   * Initialize AI engine
   * @private
   */
  _initializeAI() {
    const game = this.chessboard.positionService?.getGame();
    if (!game) {
      console.error('[VsBotMode] Cannot initialize AI: no game instance');
      return;
    }

    this.ai = new ChessAI(game, {
      difficulty: this.config.botDifficulty,
    });
  }

  /**
   * Set bot difficulty
   * @param {number} level - Difficulty (1-10)
   */
  setDifficulty(level) {
    this.config.botDifficulty = Math.max(1, Math.min(10, level));

    if (this.ai) {
      this.ai.setDifficulty(this.config.botDifficulty);
    }

    this._emit('difficultyChanged', {
      difficulty: this.config.botDifficulty,
      difficultyName: VsBotMode.DIFFICULTY_NAMES[this.config.botDifficulty],
    });
  }

  /**
   * Get difficulty name
   * @returns {string}
   */
  getDifficultyName() {
    return VsBotMode.DIFFICULTY_NAMES[this.config.botDifficulty] || 'Unknown';
  }

  /**
   * Set player color
   * @param {'w'|'b'} color - Player color
   */
  setPlayerColor(color) {
    this.config.playerColor = color;
    this.botColor = color === 'w' ? 'b' : 'w';

    this._emit('playerColorChanged', {
      playerColor: color,
      botColor: this.botColor,
    });
  }

  /**
   * Set external engine for bot moves
   * @param {Object} engine - Engine instance (StockfishEngine, UCIEngine, CloudEngine)
   * @param {Object} [options={}] - Engine options
   * @param {number} [options.depth=20] - Search depth
   * @param {number} [options.moveTime=1000] - Move time in ms
   */
  setEngine(engine, options = {}) {
    this.engine = engine;
    this.useExternalEngine = !!engine;
    this.config.engineDepth = options.depth || this.config.engineDepth || 20;
    this.config.engineMoveTime = options.moveTime || this.config.engineMoveTime || 1000;

    // Set up engine event listeners
    if (engine) {
      engine.on('info', (info) => {
        this._emit('engineInfo', info);
        if (this.config.onEngineInfo) {
          this.config.onEngineInfo(info);
        }
      });
    }

    this._emit('engineChanged', {
      engine: engine?.getInfo?.() || null,
      useExternalEngine: this.useExternalEngine,
    });
  }

  /**
   * Remove external engine and use built-in AI
   */
  removeEngine() {
    this.engine = null;
    this.useExternalEngine = false;
    this._emit('engineChanged', { engine: null, useExternalEngine: false });
  }

  /**
   * Check if using external engine
   * @returns {boolean}
   */
  isUsingExternalEngine() {
    return this.useExternalEngine && this.engine !== null;
  }

  /**
   * Check if it's the human player's turn
   * @returns {boolean}
   */
  isPlayerTurn() {
    return this.getCurrentTurn() === this.config.playerColor;
  }

  /**
   * Check if it's the bot's turn
   * @returns {boolean}
   */
  isBotTurn() {
    return this.getCurrentTurn() === this.botColor;
  }

  /**
   * Execute a player move
   * @override
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean}
   */
  executeMove(from, to, options = {}) {
    if (!this.isActive) return false;

    // Only allow moves on player's turn
    if (!this.isPlayerTurn()) {
      this._emit('invalidMove', { reason: "It's the bot's turn", from, to });
      return false;
    }

    // Validate move
    if (!this.canMove(from, to, options)) {
      this._emit('invalidMove', { reason: 'Illegal move', from, to });
      return false;
    }

    // Execute the move
    const moveStr = `${from}${to}${options.promotion || ''}`;
    const success = this.chessboard.movePiece(moveStr);

    if (!success) {
      this._emit('invalidMove', { reason: 'Move failed', from, to });
      return false;
    }

    // Record move
    const moveData = {
      from,
      to,
      player: 'human',
      timestamp: Date.now(),
      ...options,
    };

    this.moveHistory.push(moveData);
    this._emit('move', moveData);

    if (this.config.onMove) {
      this.config.onMove(moveData);
    }

    // Check for game end
    if (this._checkGameEnd()) {
      return true;
    }

    // Schedule bot response
    if (this.config.autoMove) {
      this._scheduleBotMove();
    }

    return true;
  }

  /**
   * Schedule bot move with thinking time
   * @private
   */
  _scheduleBotMove() {
    if (this.isThinking) return;

    this.isThinking = true;

    this._emit('botThinking', { thinking: true });

    if (this.config.onBotThinking) {
      this.config.onBotThinking(true);
    }

    // Simulate thinking time
    const thinkingTime = Math.max(
      this.config.botThinkingTime,
      Math.random() * 500 + 500 // Add some randomness
    );

    this.thinkingTimeout = setTimeout(() => {
      this._makeBotMove();
    }, thinkingTime);
  }

  /**
   * Cancel pending bot move
   * @private
   */
  _cancelBotMove() {
    if (this.thinkingTimeout) {
      clearTimeout(this.thinkingTimeout);
      this.thinkingTimeout = null;
    }
    this.isThinking = false;
  }

  /**
   * Execute bot move
   * @private
   */
  async _makeBotMove() {
    this.isThinking = false;

    if (!this.isActive) {
      this._emit('botThinking', { thinking: false });
      return;
    }

    let move = null;
    let engineStats = null;

    // Try external engine first, fall back to built-in AI
    if (this.useExternalEngine && this.engine) {
      try {
        move = await this._getEngineBestMove();
        engineStats = { source: 'external', engine: this.engine.getInfo?.()?.name || 'unknown' };
      } catch (error) {
        console.warn('[VsBotMode] External engine failed, falling back to AI:', error);
        // Fall back to built-in AI
        if (this.ai) {
          move = this.ai.getBestMove();
          engineStats = { source: 'builtin', ...this.ai.getStats() };
        }
      }
    } else if (this.ai) {
      // Use built-in AI
      move = this.ai.getBestMove();
      engineStats = { source: 'builtin', ...this.ai.getStats() };
    }

    if (!move) {
      this._emit('botThinking', { thinking: false });
      // Game might be over
      this._checkGameEnd();
      return;
    }

    // Execute the move
    const moveStr = `${move.from}${move.to}${move.promotion || ''}`;
    const success = this.chessboard.movePiece(moveStr);

    if (success) {
      const moveData = {
        ...move,
        player: 'bot',
        timestamp: Date.now(),
        stats: engineStats,
      };

      this.moveHistory.push(moveData);
      this.lastBotMove = moveData;

      this._emit('botMove', moveData);

      if (this.config.onBotMove) {
        this.config.onBotMove(moveData);
      }

      // Check for game end
      this._checkGameEnd();
    }

    this._emit('botThinking', { thinking: false });

    if (this.config.onBotThinking) {
      this.config.onBotThinking(false);
    }
  }

  /**
   * Get best move from external engine
   * @private
   * @returns {Promise<Object>}
   */
  async _getEngineBestMove() {
    if (!this.engine || !this.engine.ready()) {
      throw new Error('Engine not ready');
    }

    const fen = this.chessboard.fen();

    // Set position and get best move
    await this.engine.setPosition(fen);
    const analysis = await this.engine.go({
      depth: this.config.engineDepth || 20,
      moveTime: this.config.engineMoveTime || 1000,
    });

    if (!analysis?.bestMove) {
      return null;
    }

    // Parse UCI move to {from, to, promotion} format
    const uciMove = analysis.bestMove;
    return {
      from: uciMove.substring(0, 2),
      to: uciMove.substring(2, 4),
      promotion: uciMove.length > 4 ? uciMove[4] : undefined,
      score: analysis.score,
      depth: analysis.depth,
      pv: analysis.pv,
    };
  }

  /**
   * Trigger bot move manually (if autoMove is disabled)
   */
  triggerBotMove() {
    if (!this.isBotTurn()) return;
    this._scheduleBotMove();
  }

  /**
   * Get hint for player
   * @returns {Promise<Object|null>} - Suggested move
   */
  async getHint() {
    if (!this.config.allowHints) return null;
    if (!this.isPlayerTurn()) return null;

    let hint = null;

    // Try external engine first for higher quality hints
    if (this.useExternalEngine && this.engine && this.engine.ready()) {
      try {
        const fen = this.chessboard.fen();
        await this.engine.setPosition(fen);
        const analysis = await this.engine.go({
          depth: Math.min(this.config.engineDepth || 20, 15), // Faster for hints
          moveTime: 500,
        });

        if (analysis?.bestMove) {
          const uciMove = analysis.bestMove;
          hint = {
            from: uciMove.substring(0, 2),
            to: uciMove.substring(2, 4),
            promotion: uciMove.length > 4 ? uciMove[4] : undefined,
            score: analysis.score,
            source: 'engine',
          };
        }
      } catch (error) {
        console.warn('[VsBotMode] Engine hint failed:', error);
      }
    }

    // Fall back to built-in AI
    if (!hint) {
      const game = this.chessboard.positionService?.getGame();
      if (!game) return null;

      const hintAI = new ChessAI(game, { difficulty: 8 });
      hint = hintAI.getBestMove();
      if (hint) {
        hint.source = 'builtin';
      }
    }

    if (hint) {
      this.hintsUsed++;
      this._emit('hintUsed', { hint, totalHints: this.hintsUsed });
    }

    return hint;
  }

  /**
   * Request takeback
   * @returns {boolean}
   */
  requestTakeback() {
    if (!this.config.allowTakeback) return false;
    if (this.moveHistory.length < 2) return false;
    if (this.isThinking) return false;

    // Undo last two moves (player + bot)
    this.chessboard.undoMove();
    this.chessboard.undoMove();
    this.chessboard.forceSync();

    // Remove from history
    const botMove = this.moveHistory.pop();
    const playerMove = this.moveHistory.pop();

    this._emit('takeback', { playerMove, botMove });

    return true;
  }

  /**
   * Resign the game
   */
  resign() {
    if (!this.isActive) return;

    this._cancelBotMove();

    this._emit('gameEnd', {
      result: 'resignation',
      winner: this.botColor,
      reason: 'Player resigned',
    });

    if (this.config.onGameEnd) {
      this.config.onGameEnd({ result: 'resignation', winner: this.botColor });
    }

    this.stop();
  }

  /**
   * Check for game end conditions
   * @private
   * @returns {boolean}
   */
  _checkGameEnd() {
    const game = this.chessboard.positionService?.getGame();
    if (!game) return false;

    let result = null;
    let winner = null;
    let reason = '';

    if (game.isCheckmate?.()) {
      winner = this.getCurrentTurn() === 'w' ? 'b' : 'w';
      result = 'checkmate';
      const winnerName = winner === this.config.playerColor ? 'Player' : 'Bot';
      reason = `Checkmate! ${winnerName} wins`;
    } else if (game.isStalemate?.()) {
      result = 'stalemate';
      reason = 'Stalemate - Draw';
    } else if (game.isThreefoldRepetition?.()) {
      result = 'repetition';
      reason = 'Draw by threefold repetition';
    } else if (game.isInsufficientMaterial?.()) {
      result = 'insufficient';
      reason = 'Draw by insufficient material';
    } else if (game.isDraw?.()) {
      result = 'draw';
      reason = 'Draw';
    }

    if (result) {
      this._cancelBotMove();

      const isPlayerWin = winner === this.config.playerColor;

      this._emit('gameEnd', {
        result,
        winner,
        reason,
        isPlayerWin,
      });

      if (this.config.onGameEnd) {
        this.config.onGameEnd({ result, winner, reason, isPlayerWin });
      }

      return true;
    }

    return false;
  }

  /**
   * Analyze current position
   * @returns {Promise<Object>}
   */
  async analyzePosition() {
    const game = this.chessboard.positionService?.getGame();
    if (!game) return null;

    let bestMove = null;
    let stats = null;
    let source = 'builtin';

    // Try external engine first for deeper analysis
    if (this.useExternalEngine && this.engine && this.engine.ready()) {
      try {
        const fen = this.chessboard.fen();
        await this.engine.setPosition(fen);
        const analysis = await this.engine.go({
          depth: this.config.engineDepth || 20,
          moveTime: this.config.engineMoveTime || 2000,
        });

        if (analysis?.bestMove) {
          const uciMove = analysis.bestMove;
          bestMove = {
            from: uciMove.substring(0, 2),
            to: uciMove.substring(2, 4),
            promotion: uciMove.length > 4 ? uciMove[4] : undefined,
          };
          stats = {
            score: analysis.score,
            depth: analysis.depth,
            nodes: analysis.nodes,
            nps: analysis.nps,
            pv: analysis.pv,
            time: analysis.time,
          };
          source = 'engine';
        }
      } catch (error) {
        console.warn('[VsBotMode] Engine analysis failed:', error);
      }
    }

    // Fall back to built-in AI
    if (!bestMove && this.ai) {
      const analysisAI = new ChessAI(game, { difficulty: 10 });
      bestMove = analysisAI.getBestMove();
      stats = analysisAI.getStats();
    }

    // Get all legal moves
    const moves = game.moves({ verbose: true });

    return {
      bestMove,
      legalMoves: moves.length,
      isCheck: game.isCheck?.() || false,
      turn: game.turn(),
      stats,
      source,
    };
  }

  /**
   * Get mode-specific stats
   * @override
   * @returns {Object}
   */
  getStats() {
    return {
      ...super.getStats(),
      playerColor: this.config.playerColor,
      botColor: this.botColor,
      difficulty: this.config.botDifficulty,
      difficultyName: this.getDifficultyName(),
      hintsUsed: this.hintsUsed,
      isThinking: this.isThinking,
      lastBotMove: this.lastBotMove,
      aiStats: this.ai?.getStats() || null,
      useExternalEngine: this.useExternalEngine,
      engineInfo: this.engine?.getInfo?.() || null,
      engineReady: this.engine?.ready?.() || false,
    };
  }

  /**
   * Reset vs bot game
   * @override
   */
  reset() {
    super.reset();
    this._cancelBotMove();
    this.hintsUsed = 0;
    this.lastBotMove = null;

    // Re-initialize AI
    this._initializeAI();
  }

  /**
   * Serialize mode state
   * @override
   * @returns {Object}
   */
  serialize() {
    return {
      ...super.serialize(),
      playerColor: this.config.playerColor,
      botColor: this.botColor,
      botDifficulty: this.config.botDifficulty,
      hintsUsed: this.hintsUsed,
      lastBotMove: this.lastBotMove,
    };
  }

  /**
   * Restore mode state
   * @override
   * @param {Object} state - Serialized state
   */
  restore(state) {
    super.restore(state);
    if (state.playerColor) this.config.playerColor = state.playerColor;
    if (state.botColor) this.botColor = state.botColor;
    if (state.botDifficulty) this.setDifficulty(state.botDifficulty);
    if (state.hintsUsed) this.hintsUsed = state.hintsUsed;
    if (state.lastBotMove) this.lastBotMove = state.lastBotMove;
  }
}

export default VsBotMode;
