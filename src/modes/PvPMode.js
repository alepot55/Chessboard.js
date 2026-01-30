/**
 * PvP Mode - Player vs Player with full rule enforcement
 * @module modes/PvPMode
 * @since 3.1.0
 *
 * Features:
 * - Full chess rule enforcement
 * - Turn-based gameplay
 * - Optional time controls
 * - Move history with notation
 * - Game result detection
 * - Draw offers
 * - Resignation
 * - Takeback requests
 */

import { BaseMode } from './BaseMode.js';

/**
 * @typedef {Object} TimeControl
 * @property {number} initial - Initial time in seconds
 * @property {number} increment - Increment per move in seconds
 */

/**
 * @typedef {Object} PvPModeConfig
 * @extends ModeConfig
 * @property {TimeControl|null} [timeControl=null] - Time control settings
 * @property {boolean} [allowTakeback=true] - Allow takeback requests
 * @property {boolean} [allowDrawOffer=true] - Allow draw offers
 * @property {boolean} [showLegalMoves=true] - Highlight legal moves
 * @property {boolean} [showLastMove=true] - Highlight last move
 * @property {boolean} [showCheck=true] - Highlight king when in check
 * @property {Function} [onGameEnd] - Callback when game ends
 * @property {Function} [onTakebackRequest] - Callback for takeback request
 * @property {Function} [onDrawOffer] - Callback for draw offer
 */

/**
 * Player vs Player mode with full rule enforcement
 */
export class PvPMode extends BaseMode {
  /**
   * @param {Object} chessboard - Reference to the chessboard instance
   * @param {PvPModeConfig} [config={}] - Mode configuration
   */
  constructor(chessboard, config = {}) {
    super(chessboard, {
      name: 'pvp',
      enforceRules: true,
      allowFreeMovement: false,
      allowPieceCreation: false,
      allowPieceRemoval: false,
      trackTurns: true,
      detectGameEnd: true,
      timeControl: null,
      allowTakeback: true,
      allowDrawOffer: true,
      showLegalMoves: true,
      showLastMove: true,
      showCheck: true,
      ...config,
    });

    // Player info
    this.players = {
      w: { name: 'White', timeRemaining: null, connected: true },
      b: { name: 'Black', timeRemaining: null, connected: true },
    };

    // Game state
    this.gameStartTime = null;
    this.lastMoveTime = null;
    this.timerInterval = null;
    this.pendingDrawOffer = null;
    this.pendingTakeback = null;
    this.moveNotations = [];
  }

  /**
   * Start PvP game
   * @override
   */
  start() {
    super.start();

    this.gameStartTime = Date.now();
    this.lastMoveTime = this.gameStartTime;

    // Initialize time controls if set
    if (this.config.timeControl) {
      this.players.w.timeRemaining = this.config.timeControl.initial;
      this.players.b.timeRemaining = this.config.timeControl.initial;
      this._startTimer();
    }

    this._emit('gameStart', {
      players: this.players,
      timeControl: this.config.timeControl,
    });
  }

  /**
   * Stop PvP game
   * @override
   */
  stop() {
    this._stopTimer();
    super.stop();
  }

  /**
   * Set player name
   * @param {'w'|'b'} color - Player color
   * @param {string} name - Player name
   */
  setPlayerName(color, name) {
    if (this.players[color]) {
      this.players[color].name = name;
      this._emit('playerUpdated', { color, name });
    }
  }

  /**
   * Get player info
   * @param {'w'|'b'} color - Player color
   * @returns {Object}
   */
  getPlayer(color) {
    return this.players[color];
  }

  /**
   * Execute a move with validation
   * @override
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @param {Object} [options={}] - Additional options
   * @returns {boolean}
   */
  executeMove(from, to, options = {}) {
    if (!this.isActive) return false;

    // Check if it's the correct player's turn
    const piece = this.chessboard.getPiece(from);
    if (!piece) return false;

    const pieceColor = piece[0]; // 'w' or 'b'
    const currentTurn = this.getCurrentTurn();

    if (pieceColor !== currentTurn) {
      this._emit('invalidMove', { reason: 'Not your turn', from, to });
      return false;
    }

    // Validate move
    if (!this.canMove(from, to, options)) {
      this._emit('invalidMove', { reason: 'Illegal move', from, to });
      return false;
    }

    // Get move notation before executing
    const notation = this._getMoveNotation(from, to);

    // Execute the move on the board
    const success = this.chessboard.movePiece(`${from}${to}${options.promotion || ''}`);

    if (!success) {
      this._emit('invalidMove', { reason: 'Move failed', from, to });
      return false;
    }

    // Update time
    if (this.config.timeControl) {
      this._updatePlayerTime(currentTurn);
    }

    // Record move
    const moveData = {
      from,
      to,
      piece,
      notation,
      timestamp: Date.now(),
      ...options,
    };

    this.moveHistory.push(moveData);
    this.moveNotations.push(notation);

    // Clear pending offers
    this.pendingDrawOffer = null;
    this.pendingTakeback = null;

    // Emit events
    this._emit('move', moveData);

    if (this.config.onMove) {
      this.config.onMove(moveData);
    }

    // Check for game end
    this._checkGameEnd();

    // Notify turn change
    if (this.config.onTurnChange) {
      this.config.onTurnChange(this.getCurrentTurn());
    }

    return true;
  }

  /**
   * Get move notation
   * @private
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @returns {string}
   */
  _getMoveNotation(from, to) {
    const game = this.chessboard.positionService?.getGame();
    if (!game) return `${from}-${to}`;

    // Try to get SAN notation
    const moves = game.moves({ verbose: true });
    const move = moves.find((m) => m.from === from && m.to === to);

    if (move) {
      return move.san;
    }

    return `${from}-${to}`;
  }

  /**
   * Start the game timer
   * @private
   */
  _startTimer() {
    if (this.timerInterval) return;

    this.timerInterval = setInterval(() => {
      const currentTurn = this.getCurrentTurn();
      if (currentTurn && this.players[currentTurn]) {
        this.players[currentTurn].timeRemaining -= 1;

        this._emit('timerUpdate', {
          color: currentTurn,
          timeRemaining: this.players[currentTurn].timeRemaining,
        });

        // Check for timeout
        if (this.players[currentTurn].timeRemaining <= 0) {
          this._handleTimeout(currentTurn);
        }
      }
    }, 1000);
  }

  /**
   * Stop the game timer
   * @private
   */
  _stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Update player time after move
   * @private
   * @param {'w'|'b'} color - Player who just moved
   */
  _updatePlayerTime(color) {
    if (!this.config.timeControl) return;

    // Add increment
    this.players[color].timeRemaining += this.config.timeControl.increment;

    this._emit('timerUpdate', {
      color,
      timeRemaining: this.players[color].timeRemaining,
    });
  }

  /**
   * Handle player timeout
   * @private
   * @param {'w'|'b'} loser - Player who ran out of time
   */
  _handleTimeout(loser) {
    this._stopTimer();

    const winner = loser === 'w' ? 'b' : 'w';

    this._emit('gameEnd', {
      result: 'timeout',
      winner,
      loser,
      reason: `${this.players[loser].name} ran out of time`,
    });

    if (this.config.onGameEnd) {
      this.config.onGameEnd({ result: 'timeout', winner });
    }

    this.stop();
  }

  /**
   * Check for game end conditions
   * @private
   */
  _checkGameEnd() {
    const game = this.chessboard.positionService?.getGame();
    if (!game) return;

    let result = null;
    let winner = null;
    let reason = '';

    if (game.isCheckmate?.()) {
      winner = this.getCurrentTurn() === 'w' ? 'b' : 'w';
      result = 'checkmate';
      reason = `Checkmate! ${this.players[winner].name} wins`;
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
      this._stopTimer();

      this._emit('gameEnd', { result, winner, reason });

      if (this.config.onGameEnd) {
        this.config.onGameEnd({ result, winner, reason });
      }
    }
  }

  /**
   * Offer a draw
   * @param {'w'|'b'} offerer - Player offering draw
   * @returns {boolean}
   */
  offerDraw(offerer) {
    if (!this.isActive || !this.config.allowDrawOffer) return false;

    this.pendingDrawOffer = offerer;

    this._emit('drawOffered', { offerer });

    if (this.config.onDrawOffer) {
      this.config.onDrawOffer({ offerer });
    }

    return true;
  }

  /**
   * Accept draw offer
   * @returns {boolean}
   */
  acceptDraw() {
    if (!this.pendingDrawOffer) return false;

    this._stopTimer();

    this._emit('gameEnd', {
      result: 'agreement',
      winner: null,
      reason: 'Draw by agreement',
    });

    if (this.config.onGameEnd) {
      this.config.onGameEnd({ result: 'agreement', winner: null });
    }

    this.stop();
    return true;
  }

  /**
   * Decline draw offer
   */
  declineDraw() {
    if (!this.pendingDrawOffer) return;

    const offerer = this.pendingDrawOffer;
    this.pendingDrawOffer = null;

    this._emit('drawDeclined', { offerer });
  }

  /**
   * Request takeback
   * @param {'w'|'b'} requester - Player requesting takeback
   * @returns {boolean}
   */
  requestTakeback(requester) {
    if (!this.isActive || !this.config.allowTakeback) return false;
    if (this.moveHistory.length === 0) return false;

    this.pendingTakeback = requester;

    this._emit('takebackRequested', { requester });

    if (this.config.onTakebackRequest) {
      this.config.onTakebackRequest({ requester });
    }

    return true;
  }

  /**
   * Accept takeback request
   * @returns {boolean}
   */
  acceptTakeback() {
    if (!this.pendingTakeback) return false;

    // Undo the last move
    this.chessboard.undoMove();
    this.chessboard.forceSync();

    // Remove from history
    const undonMove = this.moveHistory.pop();
    this.moveNotations.pop();

    this.pendingTakeback = null;

    this._emit('takebackAccepted', { move: undonMove });

    return true;
  }

  /**
   * Decline takeback request
   */
  declineTakeback() {
    if (!this.pendingTakeback) return;

    const requester = this.pendingTakeback;
    this.pendingTakeback = null;

    this._emit('takebackDeclined', { requester });
  }

  /**
   * Resign the game
   * @param {'w'|'b'} resigner - Player resigning
   */
  resign(resigner) {
    if (!this.isActive) return;

    this._stopTimer();

    const winner = resigner === 'w' ? 'b' : 'w';

    this._emit('gameEnd', {
      result: 'resignation',
      winner,
      reason: `${this.players[resigner].name} resigned`,
    });

    if (this.config.onGameEnd) {
      this.config.onGameEnd({ result: 'resignation', winner });
    }

    this.stop();
  }

  /**
   * Get move history in PGN format
   * @returns {string}
   */
  getPGN() {
    const moves = [];
    for (let i = 0; i < this.moveNotations.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = this.moveNotations[i];
      const blackMove = this.moveNotations[i + 1] || '';
      moves.push(`${moveNum}. ${whiteMove} ${blackMove}`);
    }
    return moves.join(' ');
  }

  /**
   * Get formatted time string
   * @param {'w'|'b'} color - Player color
   * @returns {string}
   */
  getFormattedTime(color) {
    const time = this.players[color]?.timeRemaining;
    if (time === null || time === undefined) return '--:--';

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get legal moves for a square
   * @param {string} square - Square to check
   * @returns {string[]} - Array of target squares
   */
  getLegalMoves(square) {
    const game = this.chessboard.positionService?.getGame();
    if (!game) return [];

    const moves = game.moves({ square, verbose: true });
    return moves.map((m) => m.to);
  }

  /**
   * Check if player is in check
   * @returns {boolean}
   */
  isInCheck() {
    const game = this.chessboard.positionService?.getGame();
    return game?.isCheck?.() || false;
  }

  /**
   * Get mode-specific stats
   * @override
   * @returns {Object}
   */
  getStats() {
    return {
      ...super.getStats(),
      players: this.players,
      moveNotations: this.moveNotations,
      pgn: this.getPGN(),
      isInCheck: this.isInCheck(),
      pendingDrawOffer: this.pendingDrawOffer,
      pendingTakeback: this.pendingTakeback,
      gameDuration: this.gameStartTime ? Date.now() - this.gameStartTime : 0,
    };
  }

  /**
   * Reset PvP game
   * @override
   */
  reset() {
    super.reset();
    this._stopTimer();
    this.moveNotations = [];
    this.pendingDrawOffer = null;
    this.pendingTakeback = null;

    if (this.config.timeControl) {
      this.players.w.timeRemaining = this.config.timeControl.initial;
      this.players.b.timeRemaining = this.config.timeControl.initial;
    }
  }

  /**
   * Serialize mode state
   * @override
   * @returns {Object}
   */
  serialize() {
    return {
      ...super.serialize(),
      players: this.players,
      moveNotations: this.moveNotations,
      pendingDrawOffer: this.pendingDrawOffer,
      pendingTakeback: this.pendingTakeback,
      gameStartTime: this.gameStartTime,
    };
  }

  /**
   * Restore mode state
   * @override
   * @param {Object} state - Serialized state
   */
  restore(state) {
    super.restore(state);
    if (state.players) this.players = state.players;
    if (state.moveNotations) this.moveNotations = state.moveNotations;
    if (state.pendingDrawOffer) this.pendingDrawOffer = state.pendingDrawOffer;
    if (state.pendingTakeback) this.pendingTakeback = state.pendingTakeback;
    if (state.gameStartTime) this.gameStartTime = state.gameStartTime;
  }
}

export default PvPMode;
