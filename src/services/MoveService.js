/**
 * Service for managing chess moves and move validation
 * @module services/MoveService
 * @since 2.0.0
 */

import Move from '../components/Move.js';
import { MoveError } from '../errors/ChessboardError.js';
import { ERROR_MESSAGES } from '../errors/messages.js';
import { PROMOTION_PIECES } from '../constants/positions.js';

/**
 * Service responsible for move management and validation
 * @class
 */
export class MoveService {
  /**
   * Creates a new MoveService instance
   * @param {ChessboardConfig} config - Board configuration
   * @param {PositionService} positionService - Position service instance
   */
  constructor(config, positionService) {
    this.config = config;
    this.positionService = positionService;
    this._movesCache = new Map();
    this._cacheTimeout = null;
  }

  /**
   * Checks if a piece on a square can move
   * @param {Square} square - Square to check
   * @returns {boolean} True if piece can move
   */
  canMove(square) {
    if (!square.piece) return false;

    const { movableColors, onlyLegalMoves } = this.config;

    if (movableColors === 'none') return false;
    if (movableColors === 'w' && square.piece.color === 'b') return false;
    if (movableColors === 'b' && square.piece.color === 'w') return false;

    if (!onlyLegalMoves) return true;

    // Check if position service and game are available
    if (!this.positionService || !this.positionService.getGame()) {
      return false;
    }

    const game = this.positionService.getGame();
    return square.piece.color === game.turn();
  }

  /**
   * Converts various move formats to a Move instance
   * @param {string|Move} move - Move in various formats
   * @param {Object} squares - All board squares
   * @returns {Move} Move instance
   * @throws {MoveError} When move format is invalid
   */
  convertMove(move, squares) {
    if (move instanceof Move) {
      return move;
    }

    if (typeof move === 'string' && move.length >= 4) {
      const fromId = move.slice(0, 2);
      const toId = move.slice(2, 4);
      const promotion = move.slice(4, 5) || null;

      if (!squares[fromId] || !squares[toId]) {
        throw new MoveError(ERROR_MESSAGES.invalid_move_format, fromId, toId);
      }

      return new Move(squares[fromId], squares[toId], promotion);
    }

    throw new MoveError(ERROR_MESSAGES.invalid_move_format, 'unknown', 'unknown');
  }

  /**
   * Checks if a move is legal
   * @param {Move} move - Move to check
   * @returns {boolean} True if move is legal
   */
  isLegalMove(move) {
    const legalMoves = this.getLegalMoves(move.from.id);

    return legalMoves.some(
      (legalMove) => legalMove.to === move.to.id && move.promotion === legalMove.promotion
    );
  }

  /**
   * Gets all legal moves for a square or the entire position
   * @param {string} [from] - Square to get moves from (optional)
   * @param {boolean} [verbose=true] - Whether to return verbose move objects
   * @returns {Array} Array of legal moves
   */
  getLegalMoves(from = null, verbose = true) {
    // Check if position service and game are available
    if (!this.positionService || !this.positionService.getGame()) {
      return [];
    }

    const game = this.positionService.getGame();

    if (!game) return [];

    const options = { verbose };
    if (from) {
      options.square = from;
    }

    return game.moves(options);
  }

  /**
   * Gets legal moves with caching for performance
   * @param {Square} square - Square to get moves from
   * @returns {Array} Array of legal moves
   */
  getCachedLegalMoves(square) {
    // Check if position service and game are available
    if (!this.positionService || !this.positionService.getGame()) {
      return [];
    }

    const game = this.positionService.getGame();
    if (!game) return [];

    const cacheKey = `${square.id}-${game.fen()}`;
    let moves = this._movesCache.get(cacheKey);

    if (!moves) {
      moves = game.moves({ square: square.id, verbose: true });
      this._movesCache.set(cacheKey, moves);

      // Clear cache after a short delay to prevent memory buildup
      if (this._cacheTimeout) {
        clearTimeout(this._cacheTimeout);
      }

      this._cacheTimeout = setTimeout(() => {
        this._movesCache.clear();
      }, 1000);
    }

    return moves;
  }

  /**
   * Executes a move on the game
   * @param {Move} move - Move to execute
   * @returns {Object|null} Move result from chess.js or null if invalid
   */
  executeMove(move) {
    // Check if position service and game are available
    if (!this.positionService || !this.positionService.getGame()) {
      return null;
    }

    const game = this.positionService.getGame();
    if (!game) return null;

    const moveOptions = {
      from: move.from.id,
      to: move.to.id,
    };

    if (move.hasPromotion()) {
      moveOptions.promotion = move.promotion;
    }

    const result = game.move(moveOptions);

    return result;
  }

  /**
   * Checks if a move requires promotion
   * @param {Move} move - Move to check
   * @returns {boolean} True if promotion is required
   */
  requiresPromotion(move) {
    if (!this.config.onlyLegalMoves) {
      return false;
    }

    const game = this.positionService?.getGame();
    if (!game) {
      return false;
    }

    const piece = game.get(move.from.id);
    if (!piece || piece.type !== 'p') {
      return false;
    }

    const targetRank = move.to.row;

    // Check if moving to promotion rank
    if (piece.color === 'w' && targetRank !== 8) {
      return false;
    }
    if (piece.color === 'b' && targetRank !== 1) {
      return false;
    }

    // Check if this is a legal pawn move
    const legalMoves = game.moves({ square: move.from.id, verbose: true });
    const matchingMove = legalMoves.find((m) => m.to === move.to.id);

    return !!matchingMove;
  }

  /**
   * Handles promotion UI setup
   * @param {Move} move - Move requiring promotion
   * @param {Object} squares - All board squares
   * @param {Function} onPromotionSelect - Callback when promotion piece is selected
   * @param {Function} onPromotionCancel - Callback when promotion is cancelled
   * @returns {boolean} True if promotion UI was set up
   */
  setupPromotion(move, squares, onPromotionSelect, onPromotionCancel) {
    const game = this.positionService?.getGame();
    if (!game) return false;

    const piece = game.get(move.from.id);
    if (!piece) return false;

    const targetSquare = move.to;

    // Clear any existing promotion UI
    Object.values(squares).forEach((square) => {
      square.removePromotion();
      square.removeCover();
    });

    // Show promotion choices in a column
    this._showPromotionInColumn(targetSquare, piece, squares, onPromotionSelect, onPromotionCancel);

    return true;
  }

  /**
   * Shows promotion choices in a column
   * @private
   */
  _showPromotionInColumn(targetSquare, piece, squares, onPromotionSelect, onPromotionCancel) {
    // Set up promotion choices starting from border row
    PROMOTION_PIECES.forEach((pieceType, index) => {
      const choiceSquare = this._findPromotionSquare(targetSquare, index, squares);

      if (choiceSquare) {
        const pieceId = pieceType + piece.color;
        const piecePath = this._getPiecePathForPromotion(pieceId);

        choiceSquare.putPromotion(piecePath, () => {
          onPromotionSelect(pieceType);
        });
      }
    });

    // Set up cover squares (for cancellation)
    Object.values(squares).forEach((square) => {
      if (!square.hasPromotion()) {
        square.putCover(() => {
          onPromotionCancel();
        });
      }
    });

    return true;
  }

  /**
   * Finds the appropriate square for a promotion piece
   * @private
   * @param {Square} targetSquare - Target square of the promotion move
   * @param {number} distance - Distance from target square
   * @param {Object} squares - All board squares
   * @returns {Square|null} Square for promotion piece or null
   */
  _findPromotionSquare(targetSquare, index, squares) {
    const col = targetSquare.col;
    const baseRow = targetSquare.row;

    // Calculate row based on index and promotion direction
    // Start from the border row (1 or 8) and go inward
    let row;
    if (baseRow === 8) {
      // White promotion: start from row 8 and go down
      row = 8 - index;
    } else if (baseRow === 1) {
      // Black promotion: start from row 1 and go up
      row = 1 + index;
    } else {
      return null;
    }

    // Ensure row is within bounds
    if (row < 1 || row > 8) {
      return null;
    }

    // Find square by row/col
    for (const square of Object.values(squares)) {
      if (square.col === col && square.row === row) {
        return square;
      }
    }

    return null;
  }

  /**
   * Gets piece path for promotion UI
   * @private
   * @param {string} pieceId - Piece identifier
   * @returns {string} Path to piece asset
   */
  _getPiecePathForPromotion(pieceId) {
    // This would typically use the PieceService
    // For now, we'll use a simple implementation
    const { piecesPath } = this.config;

    if (typeof piecesPath === 'string') {
      return `${piecesPath}/${pieceId}.svg`;
    }

    // Fallback for other path types
    return `assets/pieces/${pieceId}.svg`;
  }

  /**
   * Parses a move string into a move object
   * @param {string} moveString - Move string (e.g., 'e2e4', 'e7e8q')
   * @returns {Object|null} Move object or null if invalid
   */
  parseMove(moveString) {
    if (typeof moveString !== 'string' || moveString.length < 4 || moveString.length > 5) {
      return null;
    }

    const from = moveString.slice(0, 2);
    const to = moveString.slice(2, 4);
    const promotion = moveString.slice(4, 5);

    // Basic validation
    if (!/^[a-h][1-8]$/.test(from) || !/^[a-h][1-8]$/.test(to)) {
      return null;
    }

    if (promotion && !['q', 'r', 'b', 'n'].includes(promotion.toLowerCase())) {
      return null;
    }

    return {
      from,
      to,
      promotion: promotion || null,
    };
  }

  /**
   * Checks if a move is a castle move
   * @param {Object} gameMove - Game move object from chess.js
   * @returns {boolean} True if move is castle
   */
  isCastle(gameMove) {
    return gameMove && (gameMove.isKingsideCastle() || gameMove.isQueensideCastle());
  }

  /**
   * Gets the rook move for a castle move
   * @param {Object} gameMove - Game move object from chess.js
   * @returns {Object|null} Rook move object or null if not castle
   */
  getCastleRookMove(gameMove) {
    if (!this.isCastle(gameMove)) {
      return null;
    }

    const isKingSide = gameMove.isKingsideCastle();
    const isWhite = gameMove.color === 'w';

    if (isKingSide) {
      // King side castle
      if (isWhite) {
        return { from: 'h1', to: 'f1' };
      }
      return { from: 'h8', to: 'f8' };
    }
    // Queen side castle
    if (isWhite) {
      return { from: 'a1', to: 'd1' };
    }
    return { from: 'a8', to: 'd8' };
  }

  /**
   * Checks if a move is en passant
   * @param {Object} gameMove - Game move object from chess.js
   * @returns {boolean} True if move is en passant
   */
  isEnPassant(gameMove) {
    return gameMove && gameMove.isEnPassant();
  }

  /**
   * Gets the captured pawn square for en passant
   * @param {Object} gameMove - Game move object from chess.js
   * @returns {string|null} Square of captured pawn or null if not en passant
   */
  getEnPassantCapturedSquare(gameMove) {
    if (!this.isEnPassant(gameMove)) {
      return null;
    }

    const toSquare = gameMove.to;
    const rank = parseInt(toSquare[1]);
    const file = toSquare[0];

    // The captured pawn is on the same file but different rank
    if (gameMove.color === 'w') {
      // White captures black pawn one rank below
      return file + (rank - 1);
    }
    // Black captures white pawn one rank above
    return file + (rank + 1);
  }

  /**
   * Clears the moves cache
   */
  clearCache() {
    this._movesCache.clear();
    if (this._cacheTimeout) {
      clearTimeout(this._cacheTimeout);
      this._cacheTimeout = null;
    }
  }

  /**
   * Cleans up resources
   */
  destroy() {
    this.clearCache();
    this.positionService = null;
  }
}
