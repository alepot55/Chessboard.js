/**
 * Base Mode - Abstract class for all chess board modes
 * @module modes/BaseMode
 * @since 3.1.0
 */

/**
 * @typedef {Object} ModeConfig
 * @property {string} name - Mode name
 * @property {boolean} enforceRules - Whether to enforce chess rules
 * @property {boolean} allowFreeMovement - Allow moving any piece anywhere
 * @property {boolean} allowPieceCreation - Allow adding pieces to the board
 * @property {boolean} allowPieceRemoval - Allow removing pieces from the board
 * @property {boolean} trackTurns - Track whose turn it is
 * @property {boolean} detectGameEnd - Detect checkmate/stalemate
 * @property {Function} [onModeStart] - Callback when mode starts
 * @property {Function} [onModeEnd] - Callback when mode ends
 * @property {Function} [onMove] - Callback after each move
 * @property {Function} [onTurnChange] - Callback when turn changes
 */

/**
 * Abstract base class for all game modes
 * @abstract
 */
export class BaseMode {
  /**
   * @param {Object} chessboard - Reference to the chessboard instance
   * @param {ModeConfig} [config={}] - Mode configuration
   */
  constructor(chessboard, config = {}) {
    if (new.target === BaseMode) {
      throw new Error('BaseMode is abstract and cannot be instantiated directly');
    }

    this.chessboard = chessboard;
    this.config = {
      name: 'base',
      enforceRules: true,
      allowFreeMovement: false,
      allowPieceCreation: false,
      allowPieceRemoval: false,
      trackTurns: true,
      detectGameEnd: true,
      ...config,
    };

    this.isActive = false;
    this.moveHistory = [];
    this.listeners = new Map();
  }

  /**
   * Get mode name
   * @returns {string}
   */
  getName() {
    return this.config.name;
  }

  /**
   * Start the mode
   * @virtual
   */
  start() {
    this.isActive = true;
    this.moveHistory = [];
    this._emit('modeStart', { mode: this.getName() });

    if (this.config.onModeStart) {
      this.config.onModeStart(this);
    }
  }

  /**
   * Stop the mode
   * @virtual
   */
  stop() {
    this.isActive = false;
    this._emit('modeEnd', { mode: this.getName() });

    if (this.config.onModeEnd) {
      this.config.onModeEnd(this);
    }
  }

  /**
   * Check if a move is allowed in this mode
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean}
   * @virtual
   */
  canMove(from, to, options = {}) {
    if (!this.isActive) return false;

    if (this.config.allowFreeMovement) {
      return true;
    }

    // Delegate to chess rules validation
    return this._validateMove(from, to, options);
  }

  /**
   * Execute a move
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean} - Whether the move was successful
   * @virtual
   */
  executeMove(from, to, options = {}) {
    if (!this.canMove(from, to, options)) {
      return false;
    }

    const moveData = {
      from,
      to,
      timestamp: Date.now(),
      ...options,
    };

    this.moveHistory.push(moveData);
    this._emit('move', moveData);

    if (this.config.onMove) {
      this.config.onMove(moveData);
    }

    if (this.config.trackTurns && this.config.onTurnChange) {
      this.config.onTurnChange(this.getCurrentTurn());
    }

    return true;
  }

  /**
   * Check if piece creation is allowed
   * @returns {boolean}
   */
  canCreatePiece() {
    return this.isActive && this.config.allowPieceCreation;
  }

  /**
   * Check if piece removal is allowed
   * @returns {boolean}
   */
  canRemovePiece() {
    return this.isActive && this.config.allowPieceRemoval;
  }

  /**
   * Get current turn
   * @returns {'w'|'b'|null}
   */
  getCurrentTurn() {
    if (!this.config.trackTurns) return null;
    return this.chessboard.turn ? this.chessboard.turn() : 'w';
  }

  /**
   * Check if game is over
   * @returns {boolean}
   */
  isGameOver() {
    if (!this.config.detectGameEnd) return false;
    return this.chessboard.isGameOver ? this.chessboard.isGameOver() : false;
  }

  /**
   * Get game result
   * @returns {Object|null}
   */
  getGameResult() {
    if (!this.isGameOver()) return null;

    const result = {
      isOver: true,
      isCheckmate: this.chessboard.isCheckmate?.() || false,
      isStalemate: this.chessboard.isStalemate?.() || false,
      isDraw: this.chessboard.isDraw?.() || false,
      winner: null,
    };

    if (result.isCheckmate) {
      // The side that just moved won
      result.winner = this.getCurrentTurn() === 'w' ? 'b' : 'w';
    }

    return result;
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
   * @protected
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  _emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error in mode event listener for ${event}:`, err);
      }
    });
  }

  /**
   * Validate move according to chess rules
   * @protected
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @returns {boolean}
   */
  _validateMove(from, to) {
    if (!this.chessboard.positionService) return false;

    const game = this.chessboard.positionService.getGame();
    if (!game) return false;

    // Check if move is legal
    const moves = game.moves({ square: from, verbose: true });
    return moves.some((m) => m.to === to);
  }

  /**
   * Get mode statistics
   * @returns {Object}
   */
  getStats() {
    return {
      mode: this.getName(),
      isActive: this.isActive,
      movesPlayed: this.moveHistory.length,
      currentTurn: this.getCurrentTurn(),
      isGameOver: this.isGameOver(),
    };
  }

  /**
   * Reset the mode
   * @virtual
   */
  reset() {
    this.moveHistory = [];
    this._emit('reset', { mode: this.getName() });
  }

  /**
   * Serialize mode state
   * @returns {Object}
   */
  serialize() {
    return {
      name: this.getName(),
      config: this.config,
      isActive: this.isActive,
      moveHistory: this.moveHistory,
    };
  }

  /**
   * Restore mode state
   * @param {Object} state - Serialized state
   */
  restore(state) {
    if (state.moveHistory) {
      this.moveHistory = state.moveHistory;
    }
    if (state.isActive) {
      this.start();
    }
  }
}

export default BaseMode;
