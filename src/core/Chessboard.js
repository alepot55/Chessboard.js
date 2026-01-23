/**
 * Main Chessboard class - Orchestrates all services and components
 * @module core/Chessboard
 * @since 2.0.0
 */

import ChessboardConfig from './ChessboardConfig.js';
import Move from '../components/Move.js';
import {
  AnimationService,
  BoardService,
  CoordinateService,
  EventService,
  MoveService,
  PieceService,
  PositionService,
  ValidationService,
} from '../services/index.js';
import { ChessboardError, ConfigurationError } from '../errors/ChessboardError.js';
import { PerformanceMonitor } from '../utils/performance.js';
import { logger } from '../utils/logger.js';

/**
 * Main Chessboard class responsible for coordinating all services
 * Implements the Facade pattern to provide a unified interface
 * @class
 */
class Chessboard {
  /**
   * Creates a new Chessboard instance
   * @param {Object} config - Configuration object
   * @throws {ConfigurationError} If configuration is invalid
   */
  constructor(config) {
    try {
      // Initialize performance monitoring
      this._performanceMonitor = new PerformanceMonitor();
      this._performanceMonitor.startMeasure('chessboard-initialization');

      // Validate and initialize configuration
      this._validateAndInitializeConfig(config);

      // Initialize services
      this._initializeServices();

      // Initialize the board
      this._initialize();

      this._performanceMonitor.endMeasure('chessboard-initialization');
    } catch (error) {
      this._handleConstructorError(error);
    }
    this._undoneMoves = [];
    this._updateBoardPieces(true, true); // Force DOM population immediately
  }

  /**
   * Validates and initializes configuration
   * @private
   * @param {Object} config - Raw configuration object
   * @throws {ConfigurationError} If configuration is invalid
   */
  _validateAndInitializeConfig(config) {
    if (!config || typeof config !== 'object') {
      throw new ConfigurationError('Configuration must be an object', 'config', config);
    }

    this.config = new ChessboardConfig(config);

    // Validate required configuration
    if (!this.config.id_div) {
      throw new ConfigurationError('Configuration must include id_div', 'id_div', this.config.id_div);
    }
  }

  /**
   * Handles constructor errors gracefully
   * @private
   * @param {Error} error - Error that occurred during construction
   */
  _handleConstructorError(error) {
    logger.error('Chessboard initialization failed:', error);

    // Clean up any partially initialized resources
    this._cleanup();

    // Re-throw with additional context
    if (error instanceof ChessboardError) {
      throw error;
    } else {
      throw new ChessboardError('Failed to initialize chessboard', 'INITIALIZATION_ERROR', {
        originalError: error.message,
        stack: error.stack,
      });
    }
  }

  /**
   * Cleans up any partially initialized resources (safe to call multiple times)
   * @private
   */
  _cleanup() {
    // Remove event listeners if present
    if (this.eventService && typeof this.eventService.removeListeners === 'function') {
      this.eventService.removeListeners();
    }
    // Clear timeouts
    if (this._updateTimeout) {
      clearTimeout(this._updateTimeout);
      this._updateTimeout = null;
    }
    // Null all services
    this.validationService = null;
    this.coordinateService = null;
    this.positionService = null;
    this.boardService = null;
    this.pieceService = null;
    this.animationService = null;
    this.moveService = null;
    this.eventService = null;
  }

  /**
   * Initializes all services
   * @private
   */
  _initializeServices() {
    // Core services
    this.validationService = new ValidationService();
    this.coordinateService = new CoordinateService(this.config);
    this.positionService = new PositionService(this.config);
    this.boardService = new BoardService(this.config);
    this.pieceService = new PieceService(this.config);
    this.animationService = new AnimationService(this.config);
    this.moveService = new MoveService(this.config, this.positionService);
    this.eventService = new EventService(
      this.config,
      this.boardService,
      this.moveService,
      this.coordinateService,
      this,
    );

    // State management
    this._updateTimeout = null;
    this._isAnimating = false;

    // Bind methods to preserve context
    this._boundUpdateBoardPieces = this._updateBoardPieces.bind(this);
    this._boundOnSquareClick = this._onSquareClick.bind(this);
    this._boundOnPieceHover = this._onPieceHover.bind(this);
    this._boundOnPieceLeave = this._onPieceLeave.bind(this);
  }

  /**
   * Initializes the board
   * @private
   */
  _initialize() {
    this._initParams();
    this._setGame(this.config.position);
    this._buildBoard();
    this._buildSquares();
    this._addListeners();
    this._updateBoardPieces(true, true); // Initial position load
  }

  /**
   * Initializes parameters and state
   * @private
   */
  _initParams() {
    // Reset state
    this.eventService.setClicked(null);
    this.eventService.setPromoting(false);
    this.eventService.setAnimating(false);
  }

  /**
   * Sets up the game with initial position
   * @private
   * @param {string|Object} position - Initial position
   */
  _setGame(position) {
    this.positionService.setGame(position);
  }

  /**
   * Builds the board DOM structure
   * @private
   * Best practice: always remove squares (destroy JS/DOM) before clearing the board container.
   */
  _buildBoard() {
    logger.debug('CALLED: _buildBoard');
    if (this._isUndoRedo) {
      logger.debug('SKIP _buildBoard per undo/redo');
      return;
    }
    // Force complete cleanup of the board container (DOM)
    const boardContainer = document.getElementById(this.config.id_div);
    if (boardContainer) boardContainer.innerHTML = '';
    // Force remove all pieces from all squares (no animation, best practice)
    if (this.boardService && this.boardService.squares) {
      Object.values(this.boardService.squares).forEach((sq) => {
        if (sq && sq.forceRemoveAllPieces) sq.forceRemoveAllPieces();
      });
    }
    if (this.boardService && this.boardService.removeSquares) this.boardService.removeSquares();
    if (this.boardService && this.boardService.removeBoard) this.boardService.removeBoard();
    this.boardService.buildBoard();
  }

  /**
   * Builds all squares on the board
   * @private
   */
  _buildSquares() {
    logger.debug('CALLED: _buildSquares');
    if (this._isUndoRedo) {
      logger.debug('SKIP _buildSquares per undo/redo');
      return;
    }
    if (this.boardService && this.boardService.removeSquares) {
      this.boardService.removeSquares();
    }
    this.boardService.buildSquares((row, col) => this.coordinateService.realCoord(row, col));
  }

  /**
   * Adds event listeners to squares
   * @private
   */
  _addListeners() {
    this.eventService.addListeners(
      this._boundOnSquareClick,
      this._boundOnPieceHover,
      this._boundOnPieceLeave,
    );
  }

  /**
   * Handles square click events
   * @private
   * @param {Square} square - Clicked square
   * @param {boolean} [animate=true] - Whether to animate
   * @param {boolean} [dragged=false] - Whether triggered by drag
   * @returns {boolean} True if successful
   */
  _onSquareClick(square, animate = true, dragged = false) {
    return this.eventService.onClick(
      square,
      this._onMove.bind(this),
      this._onSelect.bind(this),
      this._onDeselect.bind(this),
      animate,
      dragged,
    );
  }

  /**
   * Handles piece hover events
   * @private
   * @param {Square} square - Hovered square
   */
  _onPieceHover(square) {
    if (this.config.hints && !this.eventService.getClicked()) {
      // Only show hints if no square is selected
      this._hintMoves(square);
    }
  }

  /**
   * Handles piece leave events
   * @private
   * @param {Square} square - Left square
   */
  _onPieceLeave(square) {
    if (this.config.hints && !this.eventService.getClicked()) {
      // Only remove hints if no square is selected
      this._dehintMoves(square);
    }
  }

  /**
   * Handles move execution
   * @private
   * @param {Square} fromSquare - Source square
   * @param {Square} toSquare - Target square
   * @param {string} [promotion] - Promotion piece
   * @param {boolean} [animate=true] - Whether to animate
   * @returns {boolean} True if move was successful
   */
  _onMove(fromSquare, toSquare, promotion = null, animate = true) {
    const move = new Move(fromSquare, toSquare, promotion);

    // 1. Validate the move
    if (!move.check() || (this.config.onlyLegalMoves && !move.isLegal(this.positionService.getGame()))) {
      this._clearVisualState(); // Always clear state on invalid move
      return false;
    }

    // 2. Check for promotion (if not already provided)
    if (!move.hasPromotion() && this._requiresPromotion(move)) {
      // Promotion is required but not provided, let the promotion handler take over.
      // Do not execute the move here.
      return false;
    }

    // 3. Execute the move
    // The onMove callback is for the user to approve the move, not to execute it.
    if (this.config.onMove(move)) {
      this._executeMove(move, animate);
      return true;
    }

    // 4. If user rejects the move, clear state
    this._clearVisualState();
    return false;
  }

  /**
   * Handles square selection
   * @private
   * @param {Square} square - Selected square
   */
  _onSelect(square) {
    if (this.config.clickable) {
      square.select();
      this._hintMoves(square);
    }
  }

  /**
   * Handles square deselection
   * @private
   * @param {Square} square - Deselected square
   */
  _onDeselect(square) {
    this._clearVisualState();
  }

  /**
   * Shows legal move hints for a square
   * @private
   * @param {Square} square - Square to show hints for
   */
  _hintMoves(square) {
    if (!this.moveService.canMove(square)) return;

    // Clear existing hints first
    this.boardService.applyToAllSquares('removeHint');

    const moves = this.moveService.getCachedLegalMoves(square);

    for (const move of moves) {
      if (move.to && move.to.length === 2) {
        const targetSquare = this.boardService.getSquare(move.to);
        if (targetSquare) {
          const hasEnemyPiece = targetSquare.piece
                        && targetSquare.piece.color !== this.positionService.getGame().turn();
          targetSquare.putHint(hasEnemyPiece);
        }
      }
    }
  }

  /**
   * Removes legal move hints for a square
   * @private
   * @param {Square} square - Square to remove hints for
   */
  _dehintMoves(square) {
    const moves = this.moveService.getCachedLegalMoves(square);

    for (const move of moves) {
      if (move.to && move.to.length === 2) {
        const targetSquare = this.boardService.getSquare(move.to);
        if (targetSquare) {
          targetSquare.removeHint();
        }
      }
    }
  }

  /**
   * Checks if a move requires promotion
   * @private
   * @param {Move} move - Move to check
   * @returns {boolean} True if promotion is required
   */
  _requiresPromotion(move) {
    return this.moveService.requiresPromotion(move);
  }

  /**
   * Executes a move
   * @private
   * @param {Move} move - Move to execute
   * @param {boolean} [animate=true] - Whether to animate
   */
  _executeMove(move, animate = true) {
    // Always clear visual state before executing a move to prevent artifacts
    this._clearVisualState();

    const game = this.positionService.getGame();
    if (!game) {
      throw new ChessboardError('Game not initialized', 'GAME_ERROR');
    }

    // Execute the move on the game engine
    const gameMove = this.moveService.executeMove(move);
    if (!gameMove) {
      // This should not happen if validation passed, but as a safeguard:
      logger.error('Move execution failed unexpectedly for move:', move);
      this._updateBoardPieces(false); // Sync board with game state
      return;
    }

    // Clear previous move highlights
    this.boardService.applyToAllSquares('unmoved');

    // Mark squares as moved for styling
    move.from.moved();
    move.to.moved();

    // Handle animations and special moves (castle, en-passant)
    const isCastle = this.moveService.isCastle(gameMove);
    const isEnPassant = this.moveService.isEnPassant(gameMove);

    if (animate && move.from.piece) {
      this.pieceService.translatePiece(
        move,
        !!move.to.piece, // was there a capture?
        animate,
        this._createDragFunction.bind(this),
        () => {
          // After the main piece animation completes...
          if (isCastle) {
            this._handleSpecialMoveAnimation(gameMove);
          } else if (isEnPassant) {
            this._handleSpecialMoveAnimation(gameMove);
          }
          // Notify user that the move is fully complete
          this.config.onMoveEnd(gameMove);
          // A final sync to ensure board is perfect
          this._updateBoardPieces(false);
        },
      );

      // For simultaneous castle, animate the rook alongside the king
      if (isCastle && this.config.animationStyle === 'simultaneous') {
        setTimeout(() => {
          this._handleCastleMove(gameMove, true);
        }, this.config.simultaneousAnimationDelay);
      }
    } else {
      // If not animating, handle special moves immediately and update the board
      if (isCastle) {
        this._handleSpecialMove(gameMove);
      } else if (isEnPassant) {
        this._handleSpecialMove(gameMove);
      }
      this._updateBoardPieces(false);
      this.config.onMoveEnd(gameMove);
    }
  }

  /**
   * Handles special moves (castle, en passant) without animation
   * @private
   * @param {Object} gameMove - Game move object
   */
  _handleSpecialMove(gameMove) {
    if (this.moveService.isCastle(gameMove)) {
      this._handleCastleMove(gameMove, false);
    } else if (this.moveService.isEnPassant(gameMove)) {
      this._handleEnPassantMove(gameMove, false);
    }
  }

  /**
   * Handles special moves (castle, en passant) with animation
   * @private
   * @param {Object} gameMove - Game move object
   */
  _handleSpecialMoveAnimation(gameMove) {
    if (this.moveService.isCastle(gameMove)) {
      this._handleCastleMove(gameMove, true);
    } else if (this.moveService.isEnPassant(gameMove)) {
      this._handleEnPassantMove(gameMove, true);
    }
  }

  /**
   * Handles castle move by moving the rook
   * @private
   * @param {Object} gameMove - Game move object
   * @param {boolean} animate - Whether to animate
   */
  _handleCastleMove(gameMove, animate) {
    const rookMove = this.moveService.getCastleRookMove(gameMove);
    if (!rookMove) return;

    const rookFromSquare = this.boardService.getSquare(rookMove.from);
    const rookToSquare = this.boardService.getSquare(rookMove.to);

    if (!rookFromSquare || !rookToSquare || !rookFromSquare.piece) {
      logger.warn('Castle rook move failed - squares or piece not found');
      return;
    }

    logger.info(`Castle: moving rook from ${rookMove.from} to ${rookMove.to}`);

    if (animate) {
      // Always use translatePiece for smooth sliding animation
      const rookPiece = rookFromSquare.piece;
      this.pieceService.translatePiece(
        { from: rookFromSquare, to: rookToSquare, piece: rookPiece },
        false, // No capture for rook in castle
        animate,
        this._createDragFunction.bind(this),
        () => {
          // After rook animation, update board state
          this._updateBoardPieces(false);
        },
      );
    } else {
      // Just update the board state
      this._updateBoardPieces(false);
    }
  }

  /**
   * Handles en passant move by removing the captured pawn
   * @private
   * @param {Object} gameMove - Game move object
   * @param {boolean} animate - Whether to animate
   */
  _handleEnPassantMove(gameMove, animate) {
    const capturedSquare = this.moveService.getEnPassantCapturedSquare(gameMove);
    if (!capturedSquare) return;

    const capturedSquareObj = this.boardService.getSquare(capturedSquare);
    if (!capturedSquareObj || !capturedSquareObj.piece) {
      logger.warn('En passant captured square not found or empty');
      return;
    }

    logger.info(`En passant: removing captured pawn from ${capturedSquare}`);

    if (animate) {
      // Animate the captured pawn removal
      this.pieceService.removePieceFromSquare(capturedSquareObj, true);
      // Update board state after animation
      setTimeout(() => {
        this._updateBoardPieces(false);
      }, this.config.moveTime);
    } else {
      // Just update the board state
      this._updateBoardPieces(false);
    }
  }

  /**
   * Updates board pieces to match game state
   * @private
   * @param {boolean} [animation=false] - Whether to animate
   * @param {boolean} [isPositionLoad=false] - Whether this is a position load
   */
  _updateBoardPieces(animation = false, isPositionLoad = false) {
    logger.debug('CALLED: _updateBoardPieces', { animation, isPositionLoad, isUndoRedo: this._isUndoRedo });
    // Check if services are available
    if (!this.positionService || !this.moveService || !this.eventService) {
      logger.warn('Cannot update board pieces - services not available');
      return;
    }

    // Clear any pending update
    if (this._updateTimeout) {
      clearTimeout(this._updateTimeout);
      this._updateTimeout = null;
    }

    // Clear moves cache
    this.moveService.clearCache();

    // Add small delay for click-to-move to avoid lag
    if (animation && !this.eventService.getClicked()) {
      this._updateTimeout = setTimeout(() => {
        this._doUpdateBoardPieces(animation, isPositionLoad);
        this._updateTimeout = null;

        // Ensure hints are available for the next turn
        this._ensureHintsAvailable();
      }, 10);
    } else {
      this._doUpdateBoardPieces(animation, isPositionLoad);

      // Ensure hints are available for the next turn
      this._ensureHintsAvailable();
    }
  }

  /**
   * Ensures hints are available for the current turn
   * @private
   */
  _ensureHintsAvailable() {
    if (!this.config.hints) return;

    // Small delay to ensure the board state is fully updated
    setTimeout(() => {
      // Clear any existing hints
      this.boardService.applyToAllSquares('removeHint');

      // The hints will be shown when the user hovers over pieces
      // This just ensures the cache is ready
      this.moveService.clearCache();
    }, 50);
  }

  /**
   * Updates board pieces after a delayed move
   * @private
   */
  _updateBoardPiecesDelayed() {
    this._updateBoardPieces(false);
  }

  /**
   * Performs the actual board update
   * @private
   * @param {boolean} [animation=false] - Whether to animate
   * @param {boolean} [isPositionLoad=false] - Whether this is a position load (affects delay)
   */
  _doUpdateBoardPieces(animation = false, isPositionLoad = false) {
    // Skip update if we're in the middle of a promotion
    if (this._isPromoting) {
      logger.debug('Skipping board update during promotion');
      return;
    }

    // Check if services are available
    if (!this.positionService || !this.positionService.getGame()) {
      logger.error('Cannot update board pieces - position service not available');
      return;
    }

    const squares = this.boardService.getAllSquares();
    const gameStateBefore = this.positionService.getGame().fen();

    logger.debug('_doUpdateBoardPieces - current FEN:', gameStateBefore);
    logger.debug('_doUpdateBoardPieces - animation:', animation, 'style:', this.config.animationStyle, 'isPositionLoad:', isPositionLoad);

    // Determine which animation style to use
    const useSimultaneous = this.config.animationStyle === 'simultaneous';
    logger.debug('_doUpdateBoardPieces - useSimultaneous:', useSimultaneous);

    if (useSimultaneous) {
      logger.info('Using simultaneous animation');
      this._doSimultaneousUpdate(squares, gameStateBefore, animation, isPositionLoad);
    } else {
      logger.info('Using sequential animation');
      this._doSequentialUpdate(squares, gameStateBefore, animation);
    }
  }

  /**
   * Performs sequential piece updates (original behavior)
   * @private
   * @param {Object} squares - All squares
   * @param {string} gameStateBefore - Game state before update
   * @param {boolean} animation - Whether to animate
   */
  _doSequentialUpdate(squares, gameStateBefore, animation) {
    // Map: squareId -> expectedPieceId
    const expectedMap = {};
    Object.values(squares).forEach((square) => {
      expectedMap[square.id] = this.positionService.getGamePieceId(square.id);
    });

    Object.values(squares).forEach((square) => {
      const expectedPieceId = expectedMap[square.id];
      const currentPiece = square.piece;
      const currentPieceId = currentPiece ? currentPiece.getId() : null;

      // If current piece and expected piece are identical, do nothing
      if (currentPieceId === expectedPieceId) {
        return;
      }

      // If there is a current piece but it is not the expected one, remove it
      if (currentPiece && currentPieceId !== expectedPieceId) {
        this.pieceService.removePieceFromSquare(square, animation);
      }

      // If there is an expected piece but it is not the current one, add it
      if (expectedPieceId && currentPieceId !== expectedPieceId) {
        const newPiece = this.pieceService.convertPiece(expectedPieceId);
        this.pieceService.addPieceOnSquare(
          square,
          newPiece,
          animation,
          this._createDragFunction.bind(this),
        );
      }
    });

    this._addListeners();
    const gameStateAfter = this.positionService.getGame().fen();
    if (gameStateBefore !== gameStateAfter) {
      this.config.onChange(gameStateAfter);
    }
  }

  /**
   * Performs simultaneous piece updates
   * @private
   * @param {Object} squares - All squares
   * @param {string} gameStateBefore - Game state before update
   * @param {boolean} [animation=true] - Whether to animate
   * @param {boolean} [isPositionLoad=false] - Whether this is a position load
   */
  _doSimultaneousUpdate(squares, gameStateBefore, animation = true, isPositionLoad = false) {
    // Greedy matching for minimum distance, robust
    const currentMap = {};
    const expectedMap = {};

    Object.values(squares).forEach((square) => {
      const currentPiece = square.piece;
      const expectedPieceId = this.positionService.getGamePieceId(square.id);
      if (currentPiece) {
        // Normalize key as 'color+type' lowercase
        const key = (currentPiece.color + currentPiece.type).toLowerCase();
        if (!currentMap[key]) currentMap[key] = [];
        currentMap[key].push({ square, id: square.id });
      }
      if (expectedPieceId) {
        // Normalize key as 'color+type' lowercase
        const key = expectedPieceId.toLowerCase();
        if (!expectedMap[key]) expectedMap[key] = [];
        expectedMap[key].push({ square, id: square.id });
      }
    });

    let animationsCompleted = 0;
    let totalAnimations = 0;
    const animationDelay = (isPositionLoad || !animation) ? 0 : this.config.simultaneousAnimationDelay;
    let animationIndex = 0;

    Object.keys(expectedMap).forEach((key) => {
      totalAnimations += Math.max((currentMap[key] || []).length, expectedMap[key].length);
    });

    if (totalAnimations === 0) {
      this._addListeners();
      const gameStateAfter = this.positionService.getGame().fen();
      if (gameStateBefore !== gameStateAfter) {
        this.config.onChange(gameStateAfter);
      }
      return;
    }

    const onAnimationComplete = () => {
      animationsCompleted++;
      if (animationsCompleted === totalAnimations) {
        this._addListeners();
        const gameStateAfter = this.positionService.getGame().fen();
        if (gameStateBefore !== gameStateAfter) {
          this.config.onChange(gameStateAfter);
        }
      }
    };

    Object.keys(expectedMap).forEach((key) => {
      const fromList = (currentMap[key] || []).slice();
      const toList = expectedMap[key].slice();

      // 1. Build distance matrix
      const distances = [];
      for (let i = 0; i < fromList.length; i++) {
        distances[i] = [];
        for (let j = 0; j < toList.length; j++) {
          distances[i][j] = Math.abs(fromList[i].square.row - toList[j].square.row)
                        + Math.abs(fromList[i].square.col - toList[j].square.col);
        }
      }

      // 2. Greedy matching: match the closest ones
      const fromMatched = new Array(fromList.length).fill(false);
      const toMatched = new Array(toList.length).fill(false);
      const moves = [];

      while (true) {
        let minDist = Infinity; let minI = -1; let
          minJ = -1;
        for (let i = 0; i < fromList.length; i++) {
          if (fromMatched[i]) continue;
          for (let j = 0; j < toList.length; j++) {
            if (toMatched[j]) continue;
            if (distances[i][j] < minDist) {
              minDist = distances[i][j];
              minI = i;
              minJ = j;
            }
          }
        }
        if (minI === -1 || minJ === -1) break;
        // If position is the same, do nothing (piece unchanged)
        if (fromList[minI].square === toList[minJ].square) {
          fromMatched[minI] = true;
          toMatched[minJ] = true;
          continue;
        }
        // Otherwise, move the piece
        moves.push({ from: fromList[minI].square, to: toList[minJ].square, piece: fromList[minI].square.piece });
        fromMatched[minI] = true;
        toMatched[minJ] = true;
      }

      // 3. Remove unmatched pieces (present only in fromList)
      for (let i = 0; i < fromList.length; i++) {
        if (!fromMatched[i]) {
          if (animationDelay > 0) {
            setTimeout(() => {
              this.pieceService.removePieceFromSquare(fromList[i].square, true, onAnimationComplete);
            }, animationIndex * animationDelay);
          } else {
            this.pieceService.removePieceFromSquare(fromList[i].square, false, onAnimationComplete);
          }
          animationIndex++;
        }
      }

      // 4. Add unmatched pieces (present only in toList)
      for (let j = 0; j < toList.length; j++) {
        if (!toMatched[j]) {
          if (animationDelay > 0) {
            setTimeout(() => {
              const newPiece = this.pieceService.convertPiece(key);
              this.pieceService.addPieceOnSquare(
                toList[j].square,
                newPiece,
                true,
                this._createDragFunction.bind(this),
                onAnimationComplete,
              );
            }, animationIndex * animationDelay);
          } else {
            const newPiece = this.pieceService.convertPiece(key);
            this.pieceService.addPieceOnSquare(
              toList[j].square,
              newPiece,
              false,
              this._createDragFunction.bind(this),
              onAnimationComplete,
            );
          }
          animationIndex++;
        }
      }

      // 5. Animate movements
      moves.forEach((move) => {
        if (animationDelay > 0) {
          setTimeout(() => {
            this.pieceService.translatePiece(
              move,
              false,
              true,
              this._createDragFunction.bind(this),
              onAnimationComplete,
            );
          }, animationIndex * animationDelay);
        } else {
          this.pieceService.translatePiece(
            move,
            false,
            false,
            this._createDragFunction.bind(this),
            onAnimationComplete,
          );
        }
        animationIndex++;
      });
    });
  }

  /**
   * Analyzes position changes to determine optimal animation strategy
   * @private
   * @param {Object} squares - All squares
   * @returns {Object} Analysis of changes
   */
  _analyzePositionChanges(squares) {
    const currentPieces = new Map();
    const expectedPieces = new Map();

    // Map current and expected piece positions
    Object.values(squares).forEach((square) => {
      const currentPiece = square.piece;
      const expectedPieceId = this.positionService.getGamePieceId(square.id);

      if (currentPiece) {
        currentPieces.set(square.id, currentPiece.getId());
      }

      if (expectedPieceId) {
        expectedPieces.set(square.id, expectedPieceId);
      }
    });

    logger.debug('Position Analysis:');
    logger.debug('Current pieces:', Array.from(currentPieces.entries()));
    logger.debug('Expected pieces:', Array.from(expectedPieces.entries()));

    // Identify different types of changes
    const moves = []; // Pieces that can slide to new positions
    const removes = []; // Pieces that need to be removed
    const adds = []; // Pieces that need to be added
    const unchanged = []; // Pieces that stay in place

    // First pass: identify pieces that don't need to move (same piece type on same square)
    const processedSquares = new Set();

    currentPieces.forEach((currentPieceId, square) => {
      const expectedPieceId = expectedPieces.get(square);

      if (currentPieceId === expectedPieceId) {
        // Same piece type on same square - no movement needed
        logger.debug(`UNCHANGED: ${currentPieceId} stays on ${square}`);
        unchanged.push({
          piece: currentPieceId,
          square,
        });
        processedSquares.add(square);
      }
    });

    // Second pass: handle pieces that need to move or be removed
    currentPieces.forEach((currentPieceId, fromSquare) => {
      if (processedSquares.has(fromSquare)) {
        return; // Already processed as unchanged
      }

      // Try to find a destination for this piece
      const availableDestination = Array.from(expectedPieces.entries()).find(([toSquare, expectedId]) => expectedId === currentPieceId && !processedSquares.has(toSquare));

      if (availableDestination) {
        const [toSquare, expectedId] = availableDestination;
        logger.debug(`MOVE: ${currentPieceId} from ${fromSquare} to ${toSquare}`);
        moves.push({
          piece: currentPieceId,
          from: fromSquare,
          to: toSquare,
          fromSquare: squares[fromSquare],
          toSquare: squares[toSquare],
        });
        processedSquares.add(toSquare);
      } else {
        // This piece needs to be removed
        logger.debug(`REMOVE: ${currentPieceId} from ${fromSquare}`);
        removes.push({
          piece: currentPieceId,
          square: fromSquare,
          squareObj: squares[fromSquare],
        });
      }
    });

    // Third pass: handle pieces that need to be added
    expectedPieces.forEach((expectedPieceId, toSquare) => {
      if (!processedSquares.has(toSquare)) {
        logger.debug(`ADD: ${expectedPieceId} to ${toSquare}`);
        adds.push({
          piece: expectedPieceId,
          square: toSquare,
          squareObj: squares[toSquare],
        });
      }
    });

    return {
      moves,
      removes,
      adds,
      unchanged,
      totalChanges: moves.length + removes.length + adds.length,
    };
  }

  /**
   * Executes simultaneous changes based on analysis
   * @private
   * @param {Object} changeAnalysis - Analysis of changes
   * @param {string} gameStateBefore - Game state before update
   * @param {boolean} [isPositionLoad=false] - Whether this is a position load
   */
  _executeSimultaneousChanges(changeAnalysis, gameStateBefore, isPositionLoad = false) {
    const {
      moves, removes, adds, unchanged,
    } = changeAnalysis;

    logger.debug('Position changes analysis:', {
      moves: moves.length,
      removes: removes.length,
      adds: adds.length,
      unchanged: unchanged.length,
    });

    // Log unchanged pieces for debugging
    if (unchanged.length > 0) {
      logger.debug('Pieces staying in place:', unchanged.map((u) => `${u.piece} on ${u.square}`));
    }

    let animationsCompleted = 0;
    const totalAnimations = moves.length + removes.length + adds.length;

    // If no animations are needed, complete immediately
    if (totalAnimations === 0) {
      logger.debug('No animations needed, completing immediately');
      this._addListeners();

      // Trigger change event if position changed
      const gameStateAfter = this.positionService.getGame().fen();
      if (gameStateBefore !== gameStateAfter) {
        this.config.onChange(gameStateAfter);
      }
      return;
    }

    const onAnimationComplete = () => {
      animationsCompleted++;
      logger.debug(`Animation completed: ${animationsCompleted}/${totalAnimations}`);
      if (animationsCompleted === totalAnimations) {
        logger.debug('All simultaneous animations completed');
        this._addListeners();

        // Trigger change event if position changed
        const gameStateAfter = this.positionService.getGame().fen();
        if (gameStateBefore !== gameStateAfter) {
          this.config.onChange(gameStateAfter);
        }
      }
    };

    // Determine delay: 0 for position loads, configured delay for normal moves
    const animationDelay = isPositionLoad ? 0 : this.config.simultaneousAnimationDelay;
    logger.debug(`Using animation delay: ${animationDelay}ms (position load: ${isPositionLoad})`);

    let animationIndex = 0;

    // Process moves (pieces sliding to new positions)
    moves.forEach((move) => {
      const delay = animationIndex * animationDelay;
      logger.debug(`Scheduling move ${move.piece} from ${move.from} to ${move.to} with delay ${delay}ms`);

      setTimeout(() => {
        this._animatePieceMove(move, onAnimationComplete);
      }, delay);

      animationIndex++;
    });

    // Process removes (pieces disappearing)
    removes.forEach((remove) => {
      const delay = animationIndex * animationDelay;
      logger.debug(`Scheduling removal of ${remove.piece} from ${remove.square} with delay ${delay}ms`);

      setTimeout(() => {
        this._animatePieceRemoval(remove, onAnimationComplete);
      }, delay);

      animationIndex++;
    });

    // Process adds (pieces appearing)
    adds.forEach((add) => {
      const delay = animationIndex * animationDelay;
      logger.debug(`Scheduling addition of ${add.piece} to ${add.square} with delay ${delay}ms`);

      setTimeout(() => {
        this._animatePieceAddition(add, onAnimationComplete);
      }, delay);

      animationIndex++;
    });
  }

  /**
   * Animates a piece moving from one square to another
   * @private
   * @param {Object} move - Move information
   * @param {Function} onComplete - Callback when animation completes
   */
  _animatePieceMove(move, onComplete) {
    const { fromSquare, toSquare } = move;
    const { piece } = fromSquare;

    if (!piece) {
      logger.warn(`No piece found on ${move.from} for move animation`);
      onComplete();
      return;
    }

    logger.debug(`Animating piece move: ${move.piece} from ${move.from} to ${move.to}`);

    // Use translatePiece for smooth sliding animation
    this.pieceService.translatePiece(
      { from: fromSquare, to: toSquare, piece },
      false, // Assume no capture for now
      true, // Always animate
      this._createDragFunction.bind(this),
      () => {
        logger.debug(`Piece move animation completed: ${move.piece} to ${move.to}`);
        onComplete();
      },
    );
  }

  /**
   * Animates a piece being removed
   * @private
   * @param {Object} remove - Remove information
   * @param {Function} onComplete - Callback when animation completes
   */
  _animatePieceRemoval(remove, onComplete) {
    logger.debug(`Animating piece removal: ${remove.piece} from ${remove.square}`);

    this.pieceService.removePieceFromSquare(remove.squareObj, true, () => {
      logger.debug(`Piece removal animation completed: ${remove.piece} from ${remove.square}`);
      onComplete();
    });
  }

  /**
   * Animates a piece being added
   * @private
   * @param {Object} add - Add information
   * @param {Function} onComplete - Callback when animation completes
   */
  _animatePieceAddition(add, onComplete) {
    logger.debug(`Animating piece addition: ${add.piece} to ${add.square}`);

    const newPiece = this.pieceService.convertPiece(add.piece);
    this.pieceService.addPieceOnSquare(
      add.squareObj,
      newPiece,
      true,
      this._createDragFunction.bind(this),
      () => {
        logger.debug(`Piece addition animation completed: ${add.piece} to ${add.square}`);
        onComplete();
      },
    );
  }

  /**
   * Creates a drag function for a piece
   * @private
   * @param {Square} square - Square containing the piece
   * @param {Piece} piece - Piece to create drag function for
   * @returns {Function} Drag function
   */
  _createDragFunction(square, piece) {
    return this.eventService.createDragFunction(
      square,
      piece,
      this.config.onDragStart,
      this.config.onDragMove,
      this.config.onDrop,
      this._onSnapback.bind(this),
      this._onMove.bind(this),
      this._onRemove.bind(this),
    );
  }

  /**
   * Handles snapback animation
   * @private
   * @param {Square} square - Square containing the piece
   * @param {Piece} piece - Piece to snapback
   */
  _onSnapback(square, piece) {
    this.pieceService.snapbackPiece(square, this.config.snapbackAnimation);
    this.config.onSnapbackEnd(square, piece);
  }

  /**
   * Handles piece removal
   * @private
   * @param {Square} square - Square containing the piece to remove
   */
  _onRemove(square) {
    this.pieceService.removePieceFromSquare(square, true);
    this.positionService.getGame().remove(square.id);
    this._updateBoardPieces(true);
  }

  /**
   * Clears all visual state (selections, hints, highlights)
   * @private
   */
  _clearVisualState() {
    this.boardService.applyToAllSquares('deselect');
    this.boardService.applyToAllSquares('removeHint');
    this.boardService.applyToAllSquares('dehighlight');
    this.eventService.setClicked(null);
  }

  // -------------------
  // Public API Methods
  // -------------------

  // --- POSITION & STATE ---
  /**
   * Get the current position as FEN
   * @returns {string}
   */
  getPosition() { return this.fen(); }

  /**
   * Set the board position (FEN or object)
   * @param {string|Object} position
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  setPosition(position, opts = {}) {
    const animate = opts.animate !== undefined ? opts.animate : true;
    // Remove highlights and selections
    if (this.boardService && this.boardService.applyToAllSquares) {
      this.boardService.applyToAllSquares('removeHint');
      this.boardService.applyToAllSquares('deselect');
      this.boardService.applyToAllSquares('unmoved');
    }
    if (this.positionService && this.positionService.setGame) {
      this.positionService.setGame(position);
    }
    if (this._updateBoardPieces) {
      this._updateBoardPieces(animate, true);
    }
    return true;
  }

  /**
   * Reset the board to the starting position
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  reset(opts = {}) {
    const animate = opts.animate !== undefined ? opts.animate : true;
    // Use the default starting position from config or fallback
    const startPosition = this.config && this.config.position ? this.config.position : 'start';
    this._updateBoardPieces(animate);
    return this.setPosition(startPosition, { animate });
  }

  /**
   * Clear the board
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  clear(opts = {}) {
    const animate = opts.animate !== undefined ? opts.animate : true;
    if (!this.positionService || !this.positionService.getGame()) {
      return false;
    }
    if (this._clearVisualState) this._clearVisualState();
    this.positionService.getGame().clear();
    if (this._updateBoardPieces) {
      this._updateBoardPieces(animate, true);
    }
    return true;
  }

  // --- MOVE MANAGEMENT ---
  /**
   * Undo last move
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  undoMove(opts = {}) {
    const undone = this.positionService.getGame().undo();
    if (undone) {
      this._undoneMoves.push(undone);
      this._updateBoardPieces(opts.animate !== false);
      return undone;
    }
    return null;
  }

  /**
   * Redo last undone move
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  redoMove(opts = {}) {
    if (this._undoneMoves && this._undoneMoves.length > 0) {
      const move = this._undoneMoves.pop();
      const moveObj = { from: move.from, to: move.to };
      if (move.promotion) moveObj.promotion = move.promotion;
      const result = this.positionService.getGame().move(moveObj);
      if (!result) {
        logger.error('Redo failed for move:', moveObj);
      }
      this._updateBoardPieces(opts.animate !== false);
      return result;
    }
    return false;
  }

  /**
   * Get legal moves for a square
   * @param {string} square
   * @returns {Array}
   */
  getLegalMoves(square) {
    const squareObj = this.boardService.getSquare(square);
    if (!squareObj) return [];
    return this.moveService.getCachedLegalMoves(squareObj);
  }

  // --- PIECE MANAGEMENT ---
  /**
   * Get the piece at a square
   * @param {string} square
   * @returns {string|null}
   */
  getPiece(square) {
    const sq = this.boardService.getSquare(square);
    if (!sq) return null;
    const { piece } = sq;
    if (!piece) return null;
    return (piece.color + piece.type).toLowerCase();
  }

  /**
   * Put a piece on a square
   * @param {string} piece
   * @param {string} square
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {boolean}
   */
  putPiece(piece, square, opts = {}) {
    const animate = opts.animate !== undefined ? opts.animate : true;
    let pieceStr = piece;
    // Helper to normalize piece input
    if (typeof piece === 'object' && piece.type && piece.color) {
      pieceStr = (piece.color + piece.type).toLowerCase();
    } else if (typeof piece === 'string' && piece.length === 2) {
      const a = piece[0].toLowerCase();
      const b = piece[1].toLowerCase();
      const types = 'kqrbnp';
      const colors = 'wb';
      if (types.includes(a) && colors.includes(b)) {
        pieceStr = b + a;
      } else if (colors.includes(a) && types.includes(b)) {
        pieceStr = a + b;
      } else {
        throw new Error(`[putPiece] Invalid piece: ${piece}`);
      }
    }
    const validSquare = this.validationService.isValidSquare(square);
    const validPiece = this.validationService.isValidPiece(pieceStr);
    if (!validSquare) throw new Error(`[putPiece] Invalid square: ${square}`);
    if (!validPiece) throw new Error(`[putPiece] Invalid piece: ${pieceStr}`);
    if (!this.positionService || !this.positionService.getGame()) {
      throw new Error('[putPiece] No positionService or game');
    }
    const pieceObj = this.pieceService.convertPiece(pieceStr);
    const squareObj = this.boardService.getSquare(square);
    if (!squareObj) throw new Error(`[putPiece] Square not found: ${square}`);
    squareObj.piece = pieceObj;
    const chessJsPiece = { type: pieceObj.type, color: pieceObj.color };
    const game = this.positionService.getGame();
    const result = game.put(chessJsPiece, square);
    if (!result) throw new Error(`[putPiece] Game.put failed for ${pieceStr} on ${square}`);
    this._updateBoardPieces(animate);
    return true;
  }

  /**
   * Remove a piece from a square
   * @param {string} square
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   * @returns {string|null}
   */
  removePiece(square, opts = {}) {
    const animate = opts.animate !== undefined ? opts.animate : true;
    if (!this.validationService.isValidSquare(square)) {
      throw new Error(`[removePiece] Invalid square: ${square}`);
    }
    const squareObj = this.boardService.getSquare(square);
    if (!squareObj) return true;
    if (!squareObj.piece) return true;
    squareObj.piece = null;
    const game = this.positionService.getGame();
    game.remove(square);
    this._updateBoardPieces(animate);
    return true;
  }

  // --- BOARD CONTROL ---
  /**
   * Flip the board orientation
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   */
  flipBoard(opts = {}) {
    if (this.coordinateService && this.coordinateService.flipOrientation) {
      this.coordinateService.flipOrientation();
    }
    if (this._buildBoard) this._buildBoard();
    if (this._buildSquares) this._buildSquares();
    if (this._addListeners) this._addListeners();
    if (this._updateBoardPieces) this._updateBoardPieces(opts.animate !== false);
    logger.debug('FEN after flip:', this.fen(), 'Orientation:', this.coordinateService.getOrientation());
  }

  /**
   * Set the board orientation
   * @param {'w'|'b'} color
   * @param {Object} [opts]
   * @param {boolean} [opts.animate=true]
   */
  setOrientation(color, opts = {}) {
    if (this.validationService.isValidOrientation(color)) {
      this.coordinateService.setOrientation(color);
      if (this._buildBoard) this._buildBoard();
      if (this._buildSquares) this._buildSquares();
      if (this._addListeners) this._addListeners();
      if (this._updateBoardPieces) this._updateBoardPieces(opts.animate !== false);
    }
    return this.coordinateService.getOrientation();
  }

  /**
   * Get the current orientation
   * @returns {'w'|'b'}
   */
  getOrientation() { return this.coordinateService.getOrientation(); }

  /**
   * Resize the board
   * @param {number|string} size
   */
  resizeBoard(size) {
    if (size === 'auto') {
      this.config.size = 'auto';
      document.documentElement.style.setProperty('--dimBoard', 'auto');
      this._updateBoardPieces(false);
      return true;
    }
    if (typeof size !== 'number' || size < 50 || size > 3000) {
      throw new Error(`[resizeBoard] Invalid size: ${size}`);
    }
    this.config.size = size;
    document.documentElement.style.setProperty('--dimBoard', `${size}px`);
    this._updateBoardPieces(false);
    return true;
  }

  // --- HIGHLIGHTING & UI ---
  /**
   * Highlight a square
   * @param {string} square
   * @param {Object} [opts]
   */
  highlight(square, opts = {}) {
    if (!this.validationService.isValidSquare(square)) return;
    if (this.boardService && this.boardService.highlightSquare) {
      this.boardService.highlightSquare(square, opts);
    } else if (this.eventService && this.eventService.highlightSquare) {
      this.eventService.highlightSquare(square, opts);
    }
  }

  /**
   * Remove highlight from a square
   * @param {string} square
   * @param {Object} [opts]
   */
  dehighlight(square, opts = {}) {
    if (!this.validationService.isValidSquare(square)) return;
    if (this.boardService && this.boardService.dehighlightSquare) {
      this.boardService.dehighlightSquare(square, opts);
    } else if (this.eventService && this.eventService.dehighlightSquare) {
      this.eventService.dehighlightSquare(square, opts);
    }
  }

  // --- GAME INFO ---
  /**
   * Get FEN string
   * @returns {string}
   */
  fen() {
    // Avoid recursion: call the underlying game object's fen()
    const game = this.positionService.getGame();
    if (!game || typeof game.fen !== 'function') return '';
    return game.fen();
  }

  /**
   * Get current turn
   * @returns {'w'|'b'}
   */
  turn() { return this.positionService.getGame().turn(); }

  /**
   * Is the game over?
   * @returns {boolean}
   */
  isGameOver() {
    const game = this.positionService.getGame();
    if (!game) return false;
    if (game.isGameOver) return game.isGameOver();
    // Fallback: checkmate or draw
    if (game.isCheckmate && game.isCheckmate()) return true;
    if (game.isDraw && game.isDraw()) return true;
    return false;
  }

  /**
   * Is it checkmate?
   * @returns {boolean}
   */
  isCheckmate() {
    const game = this.positionService.getGame();
    if (!game) return false;
    return game.isCheckmate ? game.isCheckmate() : false;
  }

  /**
   * Is it draw?
   * @returns {boolean}
   */
  isDraw() {
    const game = this.positionService.getGame();
    if (!game) return false;
    return game.isDraw ? game.isDraw() : false;
  }

  /**
   * Get move history
   * @returns {Array}
   */
  getHistory() {
    const game = this.positionService.getGame();
    if (!game) return [];
    return game.history ? game.history() : [];
  }

  // --- LIFECYCLE ---
  /**
   * Destroy the board and cleanup
   */
  destroy() { this._cleanup(); }

  /**
   * Rebuild the board
   */
  rebuild() { this._initialize(); }

  // --- CONFIGURATION ---
  /**
   * Get current config
   * @returns {Object}
   */
  getConfig() { return this.config.getConfig(); }

  /**
   * Set new config
   * @param {Object} newConfig
   */
  setConfig(newConfig) {
    this.config.update(newConfig);

    // Rebuild board if necessary
    if (newConfig.size !== undefined) {
      this.resizeBoard(newConfig.size);
    }

    if (newConfig.orientation !== undefined) {
      this.setOrientation(newConfig.orientation);
    }
  }

  // --- ALIASES/DEPRECATED ---
  // Kept for backward compatibility, mapped to new methods

  /**
   * Make a move
   * @param {string|Object} move - Move string or object
   * @param {Object} [opts] - Options
   * @param {boolean} [opts.animate=true] - Whether to animate
   * @returns {boolean} True if move successful
   */
  movePiece(move, opts = {}) {
    // On any new move, clear the redo stack
    this._undoneMoves = [];
    const animate = opts.animate !== undefined ? opts.animate : true;

    // Parse move if string
    let moveObj = move;
    if (typeof move === 'string') {
      moveObj = this.moveService.parseMove(move);
      if (!moveObj) {
        logger.warn('Invalid move string:', move);
        return false;
      }
    }

    const fromSquare = this.boardService.getSquare(moveObj.from);
    const toSquare = this.boardService.getSquare(moveObj.to);

    if (!fromSquare || !toSquare) {
      logger.warn('Invalid squares for move:', moveObj);
      return false;
    }

    return this._onMove(fromSquare, toSquare, moveObj.promotion, animate);
  }

  move(move, animate = true) {
    // On any new move, clear the redo stack
    this._undoneMoves = [];
    return this.movePiece(move, { animate });
  }

  clearBoard(animate = true) {
    this._updateBoardPieces(animate);
    return this.clear({ animate });
  }

  start(animate = true) {
    this._updateBoardPieces(animate);
    return this.reset({ animate });
  }

  flip(opts = {}) {
    this._updateBoardPieces(opts.animate !== false);
    return this.flipBoard(opts);
  }

  // New API methods that might overlap with old ones or aliases
  position(position, animate = true) {
    if (position === undefined) {
      return this.getPosition();
    }
    return this.setPosition(position, { animate });
  }

  undo(animate = true) {
    return this.undoMove({ animate });
  }

  redo(animate = true) {
    return this.redoMove({ animate });
  }

  history(options = {}) {
    return this.positionService.getGame().history(options);
  }

  lastMove() {
    const history = this.history({ verbose: true });
    return history.length > 0 ? history[history.length - 1] : null;
  }

  orientation(orientation) {
    if (orientation === undefined) {
      return this.getOrientation();
    }
    return this.setOrientation(orientation);
  }

  size(size) {
    if (size === undefined) {
      return this.config.size;
    }
    return this.resizeBoard(size);
  }

  legalMoves(square) {
    return this.getLegalMoves(square);
  }

  isLegal(move) {
    const moveObj = typeof move === 'string' ? this.moveService.parseMove(move) : move;
    if (!moveObj) return false;
    const fromSquare = this.boardService.getSquare(moveObj.from);
    const toSquare = this.boardService.getSquare(moveObj.to);
    if (!fromSquare || !toSquare) return false;
    const moveInstance = new Move(fromSquare, toSquare, moveObj.promotion);
    return moveInstance.isLegal(this.positionService.getGame());
  }

  inCheck() { return this.positionService.getGame().inCheck(); }
  inCheckmate() { return this.positionService.getGame().isCheckmate(); }
  inStalemate() { return this.positionService.getGame().isStalemate(); }
  inDraw() { return this.positionService.getGame().isDraw(); }
  inThreefoldRepetition() { return this.positionService.getGame().isThreefoldRepetition(); }
  pgn(options = {}) { return this.positionService.getGame().pgn(options); }

  loadPgn(pgn, options = {}, animation = true) {
    return this.positionService.getGame().loadPgn(pgn, animation);
  }

  // Implementations for aliases used in README or potential usage
  insert(square, piece) { return this.putPiece(piece, square); }
  get(square) { return this.getPiece(square); }
  piece(square) { return this.getPiece(square); }
  board() { return this.positionService.getGame().board(); }
  ascii() { return this.positionService.getGame().ascii(); }

  // Real implementations for highlight/dehighlight aliases
  highlightSquare(square) {
    return this.boardService.highlight(square);
  }
  dehighlightSquare(square) {
    return this.boardService.dehighlight(square);
  }

  forceSync() { this._updateBoardPieces(true, true); }
}

export { Chessboard };
export default Chessboard;
