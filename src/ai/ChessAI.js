/**
 * Chess AI - Artificial Intelligence engine for chess
 * @module ai/ChessAI
 * @since 3.1.0
 *
 * Features:
 * - Multiple difficulty levels (1-10)
 * - Different strategies (random, minimax, alphabeta)
 * - Position evaluation
 * - Opening book support
 * - Configurable thinking time
 */

/**
 * Piece values for evaluation
 * @constant
 */
const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

/**
 * Piece-square tables for positional evaluation
 * Values from white's perspective (mirrored for black)
 * @constant
 */
const PIECE_SQUARE_TABLES = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  k: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
};

/**
 * Simple opening book with common openings
 * @constant
 */
const OPENING_BOOK = {
  // Starting position responses
  rnbqkbnr_pppppppp_8_8_8_8_PPPPPPPP_RNBQKBNR: ['e2e4', 'd2d4', 'c2c4', 'g1f3'],
  // After 1.e4
  rnbqkbnr_pppppppp_8_8_4P3_8_PPPP1PPP_RNBQKBNR: ['e7e5', 'c7c5', 'e7e6', 'c7c6'],
  // After 1.d4
  rnbqkbnr_pppppppp_8_8_3P4_8_PPP1PPPP_RNBQKBNR: ['d7d5', 'g8f6', 'e7e6'],
};

/**
 * @typedef {Object} AIConfig
 * @property {number} [difficulty=5] - Difficulty level (1-10)
 * @property {number} [maxDepth=4] - Maximum search depth
 * @property {number} [maxTime=5000] - Maximum thinking time in ms
 * @property {boolean} [useOpeningBook=true] - Use opening book
 * @property {boolean} [randomizeEquivalent=true] - Randomize equivalent moves
 * @property {string} [strategy='alphabeta'] - Search strategy
 */

/**
 * Chess AI engine
 */
export class ChessAI {
  /**
   * @param {Object} game - Chess.js game instance
   * @param {AIConfig} [config={}] - AI configuration
   */
  constructor(game, config = {}) {
    this.game = game;
    this.config = {
      difficulty: 5,
      maxDepth: 4,
      maxTime: 5000,
      useOpeningBook: true,
      randomizeEquivalent: true,
      strategy: 'alphabeta',
      ...config,
    };

    // Adjust depth based on difficulty
    this._adjustDifficulty();

    this.nodesSearched = 0;
    this.startTime = 0;
  }

  /**
   * Adjust search parameters based on difficulty
   * @private
   */
  _adjustDifficulty() {
    const difficulty = Math.max(1, Math.min(10, this.config.difficulty));

    // Map difficulty to depth (1-10 -> 1-6)
    this.config.maxDepth = Math.ceil(difficulty / 2);

    // Lower difficulties make random mistakes
    this.mistakeProbability = Math.max(0, (5 - difficulty) * 0.1);
  }

  /**
   * Set difficulty level
   * @param {number} level - Difficulty (1-10)
   */
  setDifficulty(level) {
    this.config.difficulty = level;
    this._adjustDifficulty();
  }

  /**
   * Get best move for current position
   * @returns {Object|null} - Move object { from, to, promotion }
   */
  getBestMove() {
    this.nodesSearched = 0;
    this.startTime = Date.now();

    const moves = this.game.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Try opening book first
    if (this.config.useOpeningBook && this.game.history().length < 10) {
      const bookMove = this._getBookMove();
      if (bookMove) return bookMove;
    }

    // Random mistake at low difficulty
    if (this.mistakeProbability > 0 && Math.random() < this.mistakeProbability) {
      return this._getRandomMove(moves);
    }

    // Choose strategy
    let bestMove;
    switch (this.config.strategy) {
      case 'random':
        bestMove = this._getRandomMove(moves);
        break;
      case 'minimax':
        bestMove = this._minimaxRoot(moves);
        break;
      case 'alphabeta':
      default:
        bestMove = this._alphabetaRoot(moves);
        break;
    }

    return bestMove;
  }

  /**
   * Get move from opening book
   * @private
   * @returns {Object|null}
   */
  _getBookMove() {
    const fen = this.game.fen().split(' ')[0].replace(/\//g, '_');
    const bookMoves = OPENING_BOOK[fen];

    if (bookMoves && bookMoves.length > 0) {
      const moveStr = bookMoves[Math.floor(Math.random() * bookMoves.length)];
      const from = moveStr.substring(0, 2);
      const to = moveStr.substring(2, 4);
      const promotion = moveStr.length > 4 ? moveStr[4] : undefined;
      return { from, to, promotion };
    }

    return null;
  }

  /**
   * Get random legal move
   * @private
   * @param {Object[]} moves - Legal moves
   * @returns {Object}
   */
  _getRandomMove(moves) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    const move = moves[randomIndex];
    return { from: move.from, to: move.to, promotion: move.promotion };
  }

  /**
   * Minimax root function
   * @private
   * @param {Object[]} moves - Legal moves
   * @returns {Object}
   */
  _minimaxRoot(moves) {
    let bestMove = null;
    let bestValue = -Infinity;
    const isMaximizing = this.game.turn() === 'w';

    for (const move of moves) {
      this.game.move(move);
      const value = this._minimax(this.config.maxDepth - 1, !isMaximizing);
      this.game.undo();

      if (value > bestValue || (value === bestValue && Math.random() < 0.3)) {
        bestValue = value;
        bestMove = move;
      }
    }

    return bestMove
      ? { from: bestMove.from, to: bestMove.to, promotion: bestMove.promotion }
      : null;
  }

  /**
   * Minimax algorithm
   * @private
   * @param {number} depth - Remaining depth
   * @param {boolean} isMaximizing - Maximizing player
   * @returns {number} - Position evaluation
   */
  _minimax(depth, isMaximizing) {
    this.nodesSearched++;

    if (depth === 0 || this.game.isGameOver()) {
      return this._evaluate();
    }

    const moves = this.game.moves({ verbose: true });

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        this.game.move(move);
        const evalScore = this._minimax(depth - 1, false);
        this.game.undo();
        maxEval = Math.max(maxEval, evalScore);
      }
      return maxEval;
    }

    let minEval = Infinity;
    for (const move of moves) {
      this.game.move(move);
      const evalScore = this._minimax(depth - 1, true);
      this.game.undo();
      minEval = Math.min(minEval, evalScore);
    }
    return minEval;
  }

  /**
   * Alpha-beta root function
   * @private
   * @param {Object[]} moves - Legal moves
   * @returns {Object}
   */
  _alphabetaRoot(moves) {
    let bestMove = null;
    let bestValue = -Infinity;
    let alpha = -Infinity;
    const beta = Infinity;
    const isWhite = this.game.turn() === 'w';

    // Sort moves for better pruning (captures first)
    const sortedMoves = this._sortMoves(moves);

    for (const move of sortedMoves) {
      this.game.move(move);
      const value = -this._alphabeta(this.config.maxDepth - 1, -beta, -alpha, !isWhite);
      this.game.undo();

      if (
        value > bestValue ||
        (value === bestValue && this.config.randomizeEquivalent && Math.random() < 0.3)
      ) {
        bestValue = value;
        bestMove = move;
      }

      alpha = Math.max(alpha, value);

      // Time check
      if (Date.now() - this.startTime > this.config.maxTime) break;
    }

    return bestMove
      ? { from: bestMove.from, to: bestMove.to, promotion: bestMove.promotion }
      : null;
  }

  /**
   * Alpha-beta pruning algorithm (negamax variant)
   * @private
   * @param {number} depth - Remaining depth
   * @param {number} alpha - Alpha value
   * @param {number} beta - Beta value
   * @param {boolean} isWhite - White to move
   * @returns {number} - Position evaluation
   */
  _alphabeta(depth, alpha, beta, isWhite) {
    this.nodesSearched++;

    // Check time limit
    if (Date.now() - this.startTime > this.config.maxTime) {
      return this._evaluate() * (isWhite ? 1 : -1);
    }

    if (depth === 0) {
      return this._quiesce(alpha, beta, isWhite);
    }

    if (this.game.isGameOver()) {
      if (this.game.isCheckmate()) {
        return -Infinity + (this.config.maxDepth - depth);
      }
      return 0; // Draw
    }

    const moves = this._sortMoves(this.game.moves({ verbose: true }));

    for (const move of moves) {
      this.game.move(move);
      const score = -this._alphabeta(depth - 1, -beta, -alpha, !isWhite);
      this.game.undo();

      if (score >= beta) {
        return beta; // Beta cutoff
      }

      alpha = Math.max(alpha, score);
    }

    return alpha;
  }

  /**
   * Quiescence search - search captures to avoid horizon effect
   * @private
   * @param {number} alpha - Alpha value
   * @param {number} beta - Beta value
   * @param {boolean} isWhite - White to move
   * @returns {number}
   */
  _quiesce(alpha, beta, isWhite) {
    const standPat = this._evaluate() * (isWhite ? 1 : -1);

    if (standPat >= beta) {
      return beta;
    }

    if (standPat > alpha) {
      alpha = standPat;
    }

    // Only search captures
    const captures = this.game.moves({ verbose: true }).filter((m) => m.captured);

    for (const move of captures) {
      this.game.move(move);
      const score = -this._quiesce(-beta, -alpha, !isWhite);
      this.game.undo();

      if (score >= beta) {
        return beta;
      }

      alpha = Math.max(alpha, score);
    }

    return alpha;
  }

  /**
   * Sort moves for better alpha-beta pruning
   * @private
   * @param {Object[]} moves - Moves to sort
   * @returns {Object[]}
   */
  _sortMoves(moves) {
    return moves.sort((a, b) => {
      // Captures first, prioritized by MVV-LVA
      if (a.captured && !b.captured) return -1;
      if (!a.captured && b.captured) return 1;

      if (a.captured && b.captured) {
        const aValue = PIECE_VALUES[a.captured] - PIECE_VALUES[a.piece];
        const bValue = PIECE_VALUES[b.captured] - PIECE_VALUES[b.piece];
        return bValue - aValue;
      }

      // Promotions
      if (a.promotion && !b.promotion) return -1;
      if (!a.promotion && b.promotion) return 1;

      // Checks
      if (a.san?.includes('+') && !b.san?.includes('+')) return -1;
      if (!a.san?.includes('+') && b.san?.includes('+')) return 1;

      return 0;
    });
  }

  /**
   * Evaluate the current position
   * @private
   * @returns {number} - Evaluation (positive = white advantage)
   */
  _evaluate() {
    const board = this.game.board();
    let score = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (!piece) continue;

        const pieceValue = PIECE_VALUES[piece.type] || 0;
        const positionValue = this._getPositionValue(piece.type, row, col, piece.color);

        const value = pieceValue + positionValue;
        score += piece.color === 'w' ? value : -value;
      }
    }

    // Mobility bonus
    const mobilityScore = this._evaluateMobility();
    score += mobilityScore;

    return score;
  }

  /**
   * Get position value from piece-square tables
   * @private
   * @param {string} piece - Piece type
   * @param {number} row - Row (0-7)
   * @param {number} col - Column (0-7)
   * @param {'w'|'b'} color - Piece color
   * @returns {number}
   */
  _getPositionValue(piece, row, col, color) {
    const table = PIECE_SQUARE_TABLES[piece];
    if (!table) return 0;

    // Mirror table for black pieces
    const actualRow = color === 'w' ? row : 7 - row;
    return table[actualRow][col];
  }

  /**
   * Evaluate mobility (number of legal moves)
   * @private
   * @returns {number}
   */
  _evaluateMobility() {
    const currentTurn = this.game.turn();
    const moves = this.game.moves().length;

    // Simple mobility score
    return currentTurn === 'w' ? moves * 10 : -moves * 10;
  }

  /**
   * Get search statistics
   * @returns {Object}
   */
  getStats() {
    return {
      nodesSearched: this.nodesSearched,
      timeElapsed: Date.now() - this.startTime,
      depth: this.config.maxDepth,
      difficulty: this.config.difficulty,
    };
  }
}

export default ChessAI;
