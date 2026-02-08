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
    ValidationService
} from '../services/index.js';
import { ERROR_MESSAGES } from '../errors/index.js';
import { ChessboardError, ValidationError, ConfigurationError } from '../errors/ChessboardError.js';
import { PerformanceMonitor } from '../utils/performance.js';

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
        this._destroyed = false;
        this._animationTimeouts = [];
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
        console.error('Chessboard initialization failed:', error);

        // Clean up any partially initialized resources
        this._cleanup();

        // Re-throw with additional context
        if (error instanceof ChessboardError) {
            throw error;
        } else {
            throw new ChessboardError('Failed to initialize chessboard', 'INITIALIZATION_ERROR', {
                originalError: error.message,
                stack: error.stack
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
            this
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

        // Apply flipped class if initial orientation is black
        if (this.coordinateService.getOrientation() === 'b' && this.boardService.element) {
            this.boardService.element.classList.add('flipped');
        }
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
        if (this._isUndoRedo) {
            return;
        }
        // Forza la pulizia completa del contenitore board (DOM)
        const boardContainer = document.getElementById(this.config.id_div);
        if (boardContainer) boardContainer.innerHTML = '';
        // Force remove all pieces from all squares (no animation, best practice)
        if (this.boardService && this.boardService.squares) {
            Object.values(this.boardService.squares).forEach(sq => sq && sq.forceRemoveAllPieces && sq.forceRemoveAllPieces());
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
        if (this._isUndoRedo) {
            return;
        }
        if (this.boardService && this.boardService.removeSquares) {
            this.boardService.removeSquares();
        }
        this.boardService.buildSquares((row, col) => {
            return this.coordinateService.realCoord(row, col);
        });
    }

    /**
     * Adds event listeners to squares
     * @private
     */
    _addListeners() {
        this.eventService.addListeners(
            this._boundOnSquareClick,
            this._boundOnPieceHover,
            this._boundOnPieceLeave
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
            dragged
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
                    const hasEnemyPiece = targetSquare.piece &&
                        targetSquare.piece.color !== this.positionService.getGame().turn();
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
            console.error('Move execution failed unexpectedly for move:', move);
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
            // For simultaneous castle, start rook animation alongside the king
            const isSimultaneousCastle = isCastle && this.config.animationStyle === 'simultaneous';
            if (isSimultaneousCastle) {
                setTimeout(() => {
                    this._handleCastleMove(gameMove, true);
                }, this.config.simultaneousAnimationDelay);
            }

            this.pieceService.translatePiece(
                move,
                !!move.to.piece, // was there a capture?
                animate,
                this._createDragFunction.bind(this),
                () => {
                    // After the main piece animation completes...
                    // For sequential castle, animate rook AFTER king finishes
                    // For simultaneous, rook was already animated above - don't animate again
                    if (isCastle && !isSimultaneousCastle) {
                        this._handleSpecialMoveAnimation(gameMove);
                    } else if (isEnPassant) {
                        this._handleSpecialMoveAnimation(gameMove);
                    }
                    // Notify user that the move is fully complete
                    this.config.onMoveEnd(gameMove);
                    // For simultaneous castle, the rook callback will handle the final sync
                    // to avoid interfering with the ongoing rook animation
                    if (!isSimultaneousCastle) {
                        this._updateBoardPieces(false);
                    }
                }
            );
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
            return;
        }

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
                }
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
            return;
        }

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
        if (this._destroyed) return;
        // Check if services are available
        if (!this.positionService || !this.moveService || !this.eventService) {
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
        if (this._destroyed) return;
        // Skip update if we're in the middle of a promotion
        if (this._isPromoting) {
            return;
        }

        // Check if services are available
        if (!this.positionService || !this.positionService.getGame()) {
            return;
        }

        const squares = this.boardService.getAllSquares();
        const gameStateBefore = this.positionService.getGame().fen();
        const useSimultaneous = this.config.animationStyle === 'simultaneous';

        if (useSimultaneous) {
            this._doSimultaneousUpdate(squares, gameStateBefore, isPositionLoad, animation);
        } else {
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
        // Cancel running animations and clean orphaned elements
        Object.values(squares).forEach(square => {
            const imgs = square.element.querySelectorAll('img.piece');
            imgs.forEach(img => {
                if (img.getAnimations) {
                    img.getAnimations().forEach(anim => anim.cancel());
                }
                if (!square.piece || img !== square.piece.element) {
                    img.remove();
                }
            });
            if (square.piece && square.piece.element) {
                square.piece.element.style = '';
                square.piece.element.style.opacity = '1';
            }
        });

        const expectedMap = {};
        Object.values(squares).forEach(square => {
            expectedMap[square.id] = this.positionService.getGamePieceId(square.id);
        });

        Object.values(squares).forEach(square => {
            const expectedPieceId = expectedMap[square.id];
            const currentPiece = square.piece;
            const currentPieceId = currentPiece ? currentPiece.getId() : null;

            // Se il pezzo attuale e quello atteso sono identici, non fare nulla
            if (currentPieceId === expectedPieceId) {
                return;
            }

            // Remove current piece if it doesn't match expected
            if (currentPiece && currentPieceId !== expectedPieceId) {
                // Always remove synchronously to avoid race condition with addition
                this.pieceService.removePieceFromSquare(square, false);
            }

            // Add expected piece if it doesn't match current
            if (expectedPieceId && currentPieceId !== expectedPieceId) {
                const newPiece = this.pieceService.convertPiece(expectedPieceId);
                this.pieceService.addPieceOnSquare(
                    square,
                    newPiece,
                    animation,
                    this._createDragFunction.bind(this)
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
     * @param {boolean} [isPositionLoad=false] - Whether this is a position load
     * @param {boolean} [animation=true] - Whether to animate
     */
    _doSimultaneousUpdate(squares, gameStateBefore, isPositionLoad = false, animation = true) {
        // Increment generation to invalidate stale animation callbacks
        this._updateGeneration = (this._updateGeneration || 0) + 1;
        const generation = this._updateGeneration;

        // Cancel pending animation timeouts from previous update
        if (this._animationTimeouts) {
            this._animationTimeouts.forEach(tid => clearTimeout(tid));
            this._animationTimeouts = [];
        }

        // Cancel all running animations and force-sync DOM state
        Object.values(squares).forEach(square => {
            const imgs = square.element.querySelectorAll('img.piece');
            imgs.forEach(img => {
                // Cancel all Web Animations on this element so onfinish callbacks don't fire
                if (img.getAnimations) {
                    img.getAnimations().forEach(anim => anim.cancel());
                }
                // Remove orphaned images not matching current piece
                if (!square.piece || img !== square.piece.element) {
                    img.remove();
                }
            });
            // Reset current piece element to clean state (remove animation artifacts)
            if (square.piece && square.piece.element) {
                square.piece.element.style = '';
                square.piece.element.style.opacity = '1';
                // Ensure element is attached to correct square
                if (!square.element.contains(square.piece.element)) {
                    square.element.appendChild(square.piece.element);
                }
            }
        });

        const currentMap = {};
        const expectedMap = {};

        Object.values(squares).forEach(square => {
            const currentPiece = square.piece;
            const expectedPieceId = this.positionService.getGamePieceId(square.id);
            if (currentPiece) {
                // Normalizza la chiave come 'color+type' lowercase
                const key = (currentPiece.color + currentPiece.type).toLowerCase();
                if (!currentMap[key]) currentMap[key] = [];
                currentMap[key].push({ square, id: square.id });
            }
            if (expectedPieceId) {
                // Normalizza la chiave come 'color+type' lowercase
                const key = expectedPieceId.toLowerCase();
                if (!expectedMap[key]) expectedMap[key] = [];
                expectedMap[key].push({ square, id: square.id });
            }
        });

        let animationsCompleted = 0;
        let totalAnimations = 0;
        const animationDelay = isPositionLoad ? 0 : this.config.simultaneousAnimationDelay;
        let animationIndex = 0;

        // First pass: compute matching for all piece types
        const allRemovals = [];
        const allAdditions = [];
        const allMoves = [];

        Object.keys(expectedMap).forEach(key => {
            const fromList = (currentMap[key] || []).slice();
            const toList = expectedMap[key].slice();

            // Build distance matrix
            const distances = [];
            for (let i = 0; i < fromList.length; i++) {
                distances[i] = [];
                for (let j = 0; j < toList.length; j++) {
                    distances[i][j] = Math.abs(fromList[i].square.row - toList[j].square.row) +
                        Math.abs(fromList[i].square.col - toList[j].square.col);
                }
            }

            // Greedy matching: pair closest pieces
            const fromMatched = new Array(fromList.length).fill(false);
            const toMatched = new Array(toList.length).fill(false);

            while (true) {
                let minDist = Infinity, minI = -1, minJ = -1;
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
                fromMatched[minI] = true;
                toMatched[minJ] = true;
                // Skip unchanged pieces (same square)
                if (fromList[minI].square === toList[minJ].square) {
                    continue;
                }
                allMoves.push({ from: fromList[minI].square, to: toList[minJ].square, piece: fromList[minI].square.piece });
            }

            // Collect unmatched current pieces (to remove)
            for (let i = 0; i < fromList.length; i++) {
                if (!fromMatched[i]) {
                    allRemovals.push(fromList[i].square);
                }
            }

            // Collect unmatched expected pieces (to add)
            for (let j = 0; j < toList.length; j++) {
                if (!toMatched[j]) {
                    allAdditions.push({ square: toList[j].square, key });
                }
            }
        });

        // Also count removals for pieces whose type doesn't exist in expectedMap
        Object.keys(currentMap).forEach(key => {
            if (!expectedMap[key]) {
                currentMap[key].forEach(entry => {
                    allRemovals.push(entry.square);
                });
            }
        });

        // Count only actual animations
        totalAnimations = allRemovals.length + allAdditions.length + allMoves.length;

        if (totalAnimations === 0) {
            this._addListeners();
            const gameStateAfter = this.positionService.getGame().fen();
            if (gameStateBefore !== gameStateAfter) {
                this.config.onChange(gameStateAfter);
            }
            return;
        }

        // Detach moving pieces from source squares BEFORE any removals/additions
        // This prevents additions to a move's source square from destroying the piece
        allMoves.forEach(move => {
            if (move.from.piece === move.piece) {
                move.from.removePiece(true); // preserve element, just detach reference
            }
        });

        // No animation: apply all changes synchronously
        if (!animation) {
            allRemovals.forEach(square => {
                this.pieceService.removePieceFromSquare(square, false);
            });
            allMoves.forEach(move => {
                this.pieceService.translatePiece(
                    move, false, false, this._createDragFunction.bind(this)
                );
            });
            allAdditions.forEach(({ square, key }) => {
                const newPiece = this.pieceService.convertPiece(key);
                this.pieceService.addPieceOnSquare(
                    square, newPiece, false, this._createDragFunction.bind(this)
                );
            });
            this._addListeners();
            const gameStateAfter = this.positionService.getGame().fen();
            if (gameStateBefore !== gameStateAfter) {
                this.config.onChange(gameStateAfter);
            }
            return;
        }

        // Animated path
        if (!this._animationTimeouts) this._animationTimeouts = [];

        const onAnimationComplete = () => {
            // Ignore callbacks from stale/destroyed boards
            if (this._destroyed || this._updateGeneration !== generation) return;
            animationsCompleted++;
            if (animationsCompleted === totalAnimations) {
                this._addListeners();
                const gameStateAfter = this.positionService.getGame().fen();
                if (gameStateBefore !== gameStateAfter) {
                    this.config.onChange(gameStateAfter);
                }
            }
        };

        // Dispatch moves first (pieces already detached from source)
        allMoves.forEach(move => {
            const tid = setTimeout(() => {
                if (this._destroyed || this._updateGeneration !== generation) return;
                this.pieceService.translatePiece(
                    move,
                    false,
                    true,
                    this._createDragFunction.bind(this),
                    onAnimationComplete
                );
            }, animationIndex * animationDelay);
            this._animationTimeouts.push(tid);
            animationIndex++;
        });

        // Dispatch removals
        allRemovals.forEach(square => {
            const tid = setTimeout(() => {
                if (this._destroyed || this._updateGeneration !== generation) return;
                this.pieceService.removePieceFromSquare(square, true, onAnimationComplete);
            }, animationIndex * animationDelay);
            this._animationTimeouts.push(tid);
            animationIndex++;
        });

        // Dispatch additions
        allAdditions.forEach(({ square, key }) => {
            const tid = setTimeout(() => {
                if (this._destroyed || this._updateGeneration !== generation) return;
                const newPiece = this.pieceService.convertPiece(key);
                this.pieceService.addPieceOnSquare(
                    square,
                    newPiece,
                    true,
                    this._createDragFunction.bind(this),
                    onAnimationComplete
                );
            }, animationIndex * animationDelay);
            this._animationTimeouts.push(tid);
            animationIndex++;
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
        Object.values(squares).forEach(square => {
            const currentPiece = square.piece;
            const expectedPieceId = this.positionService.getGamePieceId(square.id);

            if (currentPiece) {
                currentPieces.set(square.id, currentPiece.getId());
            }

            if (expectedPieceId) {
                expectedPieces.set(square.id, expectedPieceId);
            }
        });

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
                unchanged.push({
                    piece: currentPieceId,
                    square: square
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
            const availableDestination = Array.from(expectedPieces.entries()).find(([toSquare, expectedId]) =>
                expectedId === currentPieceId && !processedSquares.has(toSquare)
            );

            if (availableDestination) {
                const [toSquare, expectedId] = availableDestination;
                moves.push({
                    piece: currentPieceId,
                    from: fromSquare,
                    to: toSquare,
                    fromSquare: squares[fromSquare],
                    toSquare: squares[toSquare]
                });
                processedSquares.add(toSquare);
            } else {
                removes.push({
                    piece: currentPieceId,
                    square: fromSquare,
                    squareObj: squares[fromSquare]
                });
            }
        });

        // Third pass: handle pieces that need to be added
        expectedPieces.forEach((expectedPieceId, toSquare) => {
            if (!processedSquares.has(toSquare)) {
                adds.push({
                    piece: expectedPieceId,
                    square: toSquare,
                    squareObj: squares[toSquare]
                });
            }
        });

        return {
            moves,
            removes,
            adds,
            unchanged,
            totalChanges: moves.length + removes.length + adds.length
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
        const { moves, removes, adds } = changeAnalysis;

        let animationsCompleted = 0;
        const totalAnimations = moves.length + removes.length + adds.length;

        // If no animations are needed, complete immediately
        if (totalAnimations === 0) {
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
            if (animationsCompleted === totalAnimations) {
                this._addListeners();

                // Trigger change event if position changed
                const gameStateAfter = this.positionService.getGame().fen();
                if (gameStateBefore !== gameStateAfter) {
                    this.config.onChange(gameStateAfter);
                }
            }
        };

        const animationDelay = isPositionLoad ? 0 : this.config.simultaneousAnimationDelay;
        let animationIndex = 0;

        // Process moves
        moves.forEach(move => {
            const delay = animationIndex * animationDelay;
            setTimeout(() => {
                this._animatePieceMove(move, onAnimationComplete);
            }, delay);
            animationIndex++;
        });

        // Process removes
        removes.forEach(remove => {
            const delay = animationIndex * animationDelay;
            setTimeout(() => {
                this._animatePieceRemoval(remove, onAnimationComplete);
            }, delay);
            animationIndex++;
        });

        // Process adds
        adds.forEach(add => {
            const delay = animationIndex * animationDelay;
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
        const piece = fromSquare.piece;

        if (!piece) {
            onComplete();
            return;
        }

        this.pieceService.translatePiece(
            { from: fromSquare, to: toSquare, piece: piece },
            false,
            true,
            this._createDragFunction.bind(this),
            onComplete
        );
    }

    /**
     * Animates a piece being removed
     * @private
     * @param {Object} remove - Remove information
     * @param {Function} onComplete - Callback when animation completes
     */
    _animatePieceRemoval(remove, onComplete) {
        this.pieceService.removePieceFromSquare(remove.squareObj, true, onComplete);
    }

    /**
     * Animates a piece being added
     * @private
     * @param {Object} add - Add information
     * @param {Function} onComplete - Callback when animation completes
     */
    _animatePieceAddition(add, onComplete) {
        const newPiece = this.pieceService.convertPiece(add.piece);
        this.pieceService.addPieceOnSquare(
            add.squareObj,
            newPiece,
            true,
            this._createDragFunction.bind(this),
            onComplete
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
            this._onRemove.bind(this)
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
    // Public API Methods (Refactored)
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
        // setPosition already calls _updateBoardPieces, don't call it twice
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

        // Clear the game state
        this.positionService.getGame().clear();

        // Let _updateBoardPieces handle removal (no manual loop to avoid race conditions)
        this._updateBoardPieces(animate, true);

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
            this._updateBoardPieces(opts.animate !== false);
            return result;
        }
        return false;
    }
    /**
     * Move a piece from one square to another
     * @param {string} moveStr - Move in format 'e2e4' or 'e7e8q' (with promotion)
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {Object|boolean} Move result or false if invalid
     */
    movePiece(moveStr, opts = {}) {
        const animate = opts.animate !== false;
        if (typeof moveStr !== 'string' || moveStr.length < 4) {
            return false;
        }
        const from = moveStr.slice(0, 2);
        const to = moveStr.slice(2, 4);
        const promotion = moveStr.length > 4 ? moveStr[4].toLowerCase() : undefined;

        const moveObj = { from, to };
        if (promotion) moveObj.promotion = promotion;

        const result = this.positionService.getGame().move(moveObj);
        if (result) {
            this._updateBoardPieces(animate);
        }
        return result || false;
    }

    /**
     * Get legal moves for a square
     * @param {string} square
     * @returns {Array}
     */
    getLegalMoves(square) { return this.legalMoves(square); }

    // --- PIECE MANAGEMENT ---
    /**
     * Get the piece at a square
     * @param {string} square
     * @returns {string|null}
     */
    getPiece(square) {
        // Use game state as source of truth
        // Returns piece in format 'wq' (color + type)
        if (!this.positionService || !this.positionService.getGame()) return null;
        const piece = this.positionService.getGame().get(square);
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
        if (typeof piece === 'object' && piece.type && piece.color) {
            pieceStr = (piece.color + piece.type).toLowerCase();
        } else if (typeof piece === 'string' && piece.length === 2) {
            // Accetta sia 'wq' che 'qw', normalizza a 'wq'
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
        if (!this.positionService || !this.positionService.getGame()) {
            return false;
        }
        const game = this.positionService.getGame();
        // Remove from game state first (source of truth)
        const removed = game.remove(square);
        // Then update the board visually
        const squareObj = this.boardService.getSquare(square);
        if (squareObj) {
            squareObj.piece = null;
        }
        this._updateBoardPieces(animate);
        return removed !== null;
    }

    // --- BOARD CONTROL ---
    /**
     * Flip the board orientation
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true] - Enable animation (for 'animate' mode)
     * @param {string} [opts.mode] - Override flip mode ('visual', 'animate', 'none')
     */
    flipBoard(opts = {}) {
        const flipMode = opts.mode || this.config.flipMode || 'visual';

        // Update internal orientation state
        if (this.coordinateService && this.coordinateService.flipOrientation) {
            this.coordinateService.flipOrientation();
        }

        const boardElement = this.boardService.element;
        const isFlipped = this.coordinateService.getOrientation() === 'b';

        switch (flipMode) {
            case 'visual':
                // CSS flexbox flip - instant, no piece animation needed
                this._flipVisual(boardElement, isFlipped);
                break;

            case 'animate':
                // Animate pieces to mirrored positions
                this._flipAnimate(opts.animate !== false);
                break;

            case 'none':
                // No visual change - only internal orientation updated
                // Useful for programmatic orientation without visual feedback
                break;

            default:
                this._flipVisual(boardElement, isFlipped);
        }
    }

    /**
     * Visual flip using CSS flexbox (instant)
     * @private
     * @param {HTMLElement} boardElement - Board DOM element
     * @param {boolean} isFlipped - Whether board should be flipped
     */
    _flipVisual(boardElement, isFlipped) {
        if (!boardElement) return;

        if (isFlipped) {
            boardElement.classList.add('flipped');
        } else {
            boardElement.classList.remove('flipped');
        }
    }

    /**
     * Animate flip using FLIP technique (First-Last-Invert-Play)
     * Same end state as visual mode (CSS flip), but pieces animate smoothly.
     * @private
     * @param {boolean} animate - Whether to animate the movement
     */
    _flipAnimate(animate) {
        const boardElement = this.boardService.element;
        if (!boardElement) return;

        const squares = this.boardService.getAllSquares();

        // FIRST: Record current visual position of every piece
        const pieceRects = {};
        for (const [id, square] of Object.entries(squares)) {
            if (square.piece && square.piece.element) {
                pieceRects[id] = square.piece.element.getBoundingClientRect();
            }
        }

        // LAST: Apply CSS flip (instant) - same as visual mode
        const isFlipped = this.coordinateService.getOrientation() === 'b';
        this._flipVisual(boardElement, isFlipped);

        if (!animate || Object.keys(pieceRects).length === 0) return;

        // INVERT + PLAY: Animate each piece from old position to new
        const duration = this.config.moveTime || 200;
        const easing = 'cubic-bezier(0.33, 1, 0.68, 1)';

        for (const [id, oldRect] of Object.entries(pieceRects)) {
            const square = squares[id];
            if (!square || !square.piece || !square.piece.element) continue;

            const piece = square.piece;
            const newRect = piece.element.getBoundingClientRect();
            const dx = oldRect.left - newRect.left;
            const dy = oldRect.top - newRect.top;

            if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;

            if (piece.element.animate) {
                const anim = piece.element.animate([
                    { transform: `translate(${dx}px, ${dy}px)` },
                    { transform: 'translate(0, 0)' }
                ], { duration, easing, fill: 'forwards' });
                anim.onfinish = () => {
                    anim.cancel();
                    if (piece.element) piece.element.style.transform = '';
                };
            } else {
                // setTimeout fallback for jsdom / older browsers
                piece.element.style.transform = `translate(${dx}px, ${dy}px)`;
                setTimeout(() => {
                    if (!piece.element) return;
                    piece.element.style.transition = `transform ${duration}ms`;
                    piece.element.style.transform = 'translate(0, 0)';
                    setTimeout(() => {
                        if (!piece.element) return;
                        piece.element.style.transition = '';
                        piece.element.style.transform = '';
                    }, duration);
                }, 0);
            }
        }
    }

    /**
     * Set the flip mode at runtime
     * @param {'visual'|'animate'|'none'} mode - The flip mode to use
     */
    setFlipMode(mode) {
        const validModes = ['visual', 'animate', 'none'];
        if (!validModes.includes(mode)) {
            console.warn(`Invalid flip mode: ${mode}. Valid options: ${validModes.join(', ')}`);
            return;
        }
        this.config.flipMode = mode;
    }

    /**
     * Get the current flip mode
     * @returns {string} Current flip mode
     */
    getFlipMode() {
        return this.config.flipMode || 'visual';
    }

    // --- MOVEMENT CONFIGURATION ---

    /**
     * Set the movement style
     * @param {'slide'|'arc'|'hop'|'teleport'|'fade'} style - Movement style
     */
    setMoveStyle(style) {
        const validStyles = ['slide', 'arc', 'hop', 'teleport', 'fade'];
        if (!validStyles.includes(style)) {
            console.warn(`Invalid move style: ${style}. Valid: ${validStyles.join(', ')}`);
            return;
        }
        this.config.moveStyle = style;
    }

    /**
     * Get the current movement style
     * @returns {string} Current movement style
     */
    getMoveStyle() {
        return this.config.moveStyle || 'slide';
    }

    /**
     * Set the capture animation style
     * @param {'fade'|'shrink'|'instant'|'explode'} style - Capture style
     */
    setCaptureStyle(style) {
        const validStyles = ['fade', 'shrink', 'instant', 'explode'];
        if (!validStyles.includes(style)) {
            console.warn(`Invalid capture style: ${style}. Valid: ${validStyles.join(', ')}`);
            return;
        }
        this.config.captureStyle = style;
    }

    /**
     * Get the current capture style
     * @returns {string} Current capture style
     */
    getCaptureStyle() {
        return this.config.captureStyle || 'fade';
    }

    /**
     * Set the appearance animation style
     * @param {'fade'|'pulse'|'pop'|'drop'|'instant'} style - Appearance style
     */
    setAppearanceStyle(style) {
        const validStyles = ['fade', 'pulse', 'pop', 'drop', 'instant'];
        if (!validStyles.includes(style)) {
            console.warn(`Invalid appearance style: ${style}. Valid: ${validStyles.join(', ')}`);
            return;
        }
        this.config.appearanceStyle = style;
    }

    /**
     * Get the current appearance style
     * @returns {string} Current appearance style
     */
    getAppearanceStyle() {
        return this.config.appearanceStyle || 'fade';
    }

    /**
     * Set the landing effect
     * @param {'none'|'bounce'|'pulse'|'settle'} effect - Landing effect
     */
    setLandingEffect(effect) {
        const validEffects = ['none', 'bounce', 'pulse', 'settle'];
        if (!validEffects.includes(effect)) {
            console.warn(`Invalid landing effect: ${effect}. Valid: ${validEffects.join(', ')}`);
            return;
        }
        this.config.landingEffect = effect;
    }

    /**
     * Get the current landing effect
     * @returns {string} Current landing effect
     */
    getLandingEffect() {
        return this.config.landingEffect || 'none';
    }

    /**
     * Set the movement duration
     * @param {number|string} duration - Duration in ms or preset name ('instant', 'veryFast', 'fast', 'normal', 'slow', 'verySlow')
     */
    setMoveTime(duration) {
        const presets = { instant: 0, veryFast: 100, fast: 200, normal: 400, slow: 600, verySlow: 1000 };
        if (typeof duration === 'string' && presets[duration] !== undefined) {
            this.config.moveTime = presets[duration];
        } else if (typeof duration === 'number' && duration >= 0) {
            this.config.moveTime = duration;
        } else {
            console.warn(`Invalid move time: ${duration}`);
        }
    }

    /**
     * Get the current movement duration
     * @returns {number} Duration in ms
     */
    getMoveTime() {
        return this.config.moveTime;
    }

    /**
     * Set the easing function for movements
     * @param {string} easing - CSS easing function
     */
    setMoveEasing(easing) {
        const validEasings = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'];
        if (!validEasings.includes(easing)) {
            console.warn(`Invalid easing: ${easing}. Valid: ${validEasings.join(', ')}`);
            return;
        }
        this.config.moveEasing = easing;
    }

    /**
     * Configure multiple movement settings at once
     * @param {Object} options - Movement configuration
     * @param {string} [options.style] - Movement style
     * @param {string} [options.captureStyle] - Capture animation style
     * @param {string} [options.landingEffect] - Landing effect
     * @param {number|string} [options.duration] - Movement duration
     * @param {string} [options.easing] - Easing function
     * @param {number} [options.arcHeight] - Arc height for arc/hop styles (0-1)
     */
    configureMovement(options) {
        if (options.style) this.setMoveStyle(options.style);
        if (options.captureStyle) this.setCaptureStyle(options.captureStyle);
        if (options.appearanceStyle) this.setAppearanceStyle(options.appearanceStyle);
        if (options.landingEffect) this.setLandingEffect(options.landingEffect);
        if (options.duration !== undefined) this.setMoveTime(options.duration);
        if (options.easing) this.setMoveEasing(options.easing);
        if (options.arcHeight !== undefined) {
            this.config.moveArcHeight = Math.max(0, Math.min(1, options.arcHeight));
        }
    }

    /**
     * Get all movement configuration
     * @returns {Object} Current movement configuration
     */
    getMovementConfig() {
        return {
            style: this.config.moveStyle || 'slide',
            captureStyle: this.config.captureStyle || 'fade',
            appearanceStyle: this.config.appearanceStyle || 'fade',
            landingEffect: this.config.landingEffect || 'none',
            duration: this.config.moveTime,
            easing: this.config.moveEasing || 'ease',
            arcHeight: this.config.moveArcHeight || 0.3
        };
    }

    /**
     * Set the board orientation
     * @param {'w'|'b'} color
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true] - Enable animation (for 'animate' mode)
     * @param {string} [opts.mode] - Override flip mode ('visual', 'animate', 'none')
     */
    setOrientation(color, opts = {}) {
        if (this.validationService.isValidOrientation(color)) {
            const currentOrientation = this.coordinateService.getOrientation();
            if (currentOrientation !== color) {
                this.coordinateService.setOrientation(color);

                const flipMode = opts.mode || this.config.flipMode || 'visual';
                const boardElement = this.boardService.element;
                const isFlipped = color === 'b';

                switch (flipMode) {
                    case 'visual':
                        this._flipVisual(boardElement, isFlipped);
                        break;
                    case 'animate':
                        this._flipAnimate(opts.animate !== false);
                        break;
                    case 'none':
                        // No visual change
                        break;
                    default:
                        this._flipVisual(boardElement, isFlipped);
                }
            }
        }
        return this.coordinateService.getOrientation();
    }
    /**
     * Get the current orientation
     * @returns {'w'|'b'}
     */
    getOrientation() { return this.orientation(); }
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
    destroy() {
        this._destroyed = true;

        // Remove all event listeners
        if (this.eventService) {
            this.eventService.removeAllListeners();
            this.eventService.destroy();
        }

        // Clear all timeouts
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
        }

        // Clear all animation timeouts
        if (this._animationTimeouts) {
            this._animationTimeouts.forEach(tid => clearTimeout(tid));
            this._animationTimeouts = [];
        }

        // Destroy services
        if (this.moveService) this.moveService.destroy();
        if (this.animationService && this.animationService.destroy) this.animationService.destroy();
        if (this.pieceService && this.pieceService.destroy) this.pieceService.destroy();
        if (this.boardService && this.boardService.destroy) this.boardService.destroy();
        if (this.positionService && this.positionService.destroy) this.positionService.destroy();
        if (this.coordinateService && this.coordinateService.destroy) this.coordinateService.destroy();
        if (this.validationService) this.validationService.destroy();
        if (this.config && this.config.destroy) this.config.destroy();

        // Clear references
        this._cleanup();
    }
    /**
     * Rebuild the board
     */
    rebuild() { this._initialize(); }

    // --- CONFIGURATION ---
    /**
     * Get current config
     * @returns {Object}
     */
    getConfig() { return this.config; }
    /**
     * Set new config
     * @param {Object} newConfig
     */
    setConfig(newConfig) {
        if (this.config && typeof this.config.update === 'function') {
            this.config.update(newConfig);
        }
    }

    // --- ALIASES/DEPRECATED ---
    /**
     * Alias for move (deprecated)
     */
    move(move, animate = true) {
        // On any new move, clear the redo stack
        this._undoneMoves = [];
        return this.movePiece(move, { animate });
    }
    /**
     * Alias for clear (deprecated)
     */
    clearBoard(animate = true) {
        this._updateBoardPieces(animate);
        return this.clear({ animate });
    }
    /**
     * Alias for reset (deprecated)
     */
    start(animate = true) {
        this._updateBoardPieces(animate);
        return this.reset({ animate });
    }

    /**
     * Alias for flipBoard (for backward compatibility)
     */
    flip(opts = {}) {
        this._updateBoardPieces(opts.animate !== false);
        return this.flipBoard(opts);
    }

    /**
     * Gets or sets the current position
     * @param {string|Object} [position] - Position to set (FEN or object). If omitted, returns current position.
     * @param {boolean} [animate=true] - Whether to animate when setting
     * @returns {Object} Current position object (when getting)
     */
    position(position, animate = true) {
        if (position === undefined) {
            return this.positionService.getPosition();
        }
        this.load(position, {}, animate); // load() already handles isPositionLoad=true
    }

    /**
     * Undoes the last move
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if undo was successful
     */
    undo(animate = true) {
        const undone = this.positionService.getGame().undo();
        if (undone) {
            this._undoneMoves.push(undone);
            this._updateBoardPieces(animate);
            return undone;
        }
        return null;
    }

    /**
     * Redoes the last undone move
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if redo was successful
     */
    redo(animate = true) {
        if (this._undoneMoves && this._undoneMoves.length > 0) {
            const move = this._undoneMoves.pop();
            const moveObj = { from: move.from, to: move.to };
            if (move.promotion) moveObj.promotion = move.promotion;
            const result = this.positionService.getGame().move(moveObj);
            this._updateBoardPieces(animate);
            return result;
        }
        return false;
    }

    /**
     * Gets the game history
     * @returns {Array} Array of moves
     */
    history() {
        return this.positionService.getGame().history();
    }

    /**
     * Gets the current game state
     * @returns {Object} Game state object
     */
    game() {
        return this.positionService.getGame();
    }

    /**
     * Gets or sets the orientation
     * @param {string} [orientation] - New orientation
     * @returns {string} Current orientation
     */
    orientation(orientation) {
        if (orientation === undefined) {
            return this.coordinateService.getOrientation();
        }

        if (this.validationService.isValidOrientation(orientation)) {
            this.coordinateService.setOrientation(orientation);
            this.flip();
        }

        return this.coordinateService.getOrientation();
    }

    /**
     * Gets or sets the size
     * @param {number|string} [size] - New size
     * @returns {number|string} Current size
     */
    size(size) {
        if (size === undefined) {
            return this.config.size;
        }

        if (this.validationService.isValidSize(size)) {
            this.config.size = size;
            this.resize(size);
        }

        return this.config.size;
    }

    /**
     * Gets legal moves for a square
     * @param {string} square - Square to get moves for
     * @returns {Array} Array of legal moves
     */
    legalMoves(square) {
        const squareObj = this.boardService.getSquare(square);
        if (!squareObj) return [];

        return this.moveService.getCachedLegalMoves(squareObj);
    }

    /**
     * Checks if a move is legal
     * @param {string|Object} move - Move to check
     * @returns {boolean} True if move is legal
     */
    isLegal(move) {
        const moveObj = typeof move === 'string' ? this.moveService.parseMove(move) : move;
        if (!moveObj) return false;

        const fromSquare = this.boardService.getSquare(moveObj.from);
        const toSquare = this.boardService.getSquare(moveObj.to);

        if (!fromSquare || !toSquare) return false;

        const moveInstance = new Move(fromSquare, toSquare, moveObj.promotion);
        return moveInstance.isLegal(this.positionService.getGame());
    }

    /**
     * Checks if the game is over
     * @returns {boolean} True if game is over
     */
    isGameOver() {
        return this.positionService.getGame().isGameOver();
    }

    /**
     * Checks if the current player is in check
     * @returns {boolean} True if in check
     */
    inCheck() {
        return this.positionService.getGame().inCheck();
    }

    /**
     * Checks if the current player is in checkmate
     * @returns {boolean} True if in checkmate
     */
    inCheckmate() {
        return this.positionService.getGame().isCheckmate();
    }

    /**
     * Checks if the game is in stalemate
     * @returns {boolean} True if in stalemate
     */
    inStalemate() {
        return this.positionService.getGame().isStalemate();
    }

    /**
     * Checks if the game is drawn
     * @returns {boolean} True if drawn
     */
    inDraw() {
        return this.positionService.getGame().isDraw();
    }

    /**
     * Checks if position is threefold repetition
     * @returns {boolean} True if threefold repetition
     */
    inThreefoldRepetition() {
        return this.positionService.getGame().isThreefoldRepetition();
    }

    /**
     * Gets the PGN representation of the game
     * @returns {string} PGN string
     */
    pgn() {
        return this.positionService.getGame().pgn();
    }

    /**
     * Loads a PGN string
     * @param {string} pgn - PGN string to load
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if loaded successfully
     */
    loadPgn(pgn, animate = true) {
        try {
            const success = this.positionService.getGame().loadPgn(pgn);
            if (success) {
                this._updateBoardPieces(animate, true); // Position load
            }
            return success;
        } catch (error) {
            console.error('Error loading PGN:', error);
            return false;
        }
    }

    /**
     * Gets configuration options
     * @returns {Object} Configuration object
     */
    getConfig() {
        return this.config.getConfig();
    }

    /**
     * Updates configuration options
     * @param {Object} newConfig - New configuration options
     */
    setConfig(newConfig) {
        this.config.update(newConfig);

        // Rebuild board if necessary
        if (newConfig.size !== undefined) {
            this.resize(newConfig.size);
        }

        if (newConfig.orientation !== undefined) {
            this.orientation(newConfig.orientation);
        }
    }

    /**
     * Gets or sets the animation style
     * @param {string} [style] - New animation style ('sequential' or 'simultaneous')
     * @returns {string} Current animation style
     */
    animationStyle(style) {
        if (style === undefined) {
            return this.config.animationStyle;
        }

        if (this.validationService.isValidAnimationStyle(style)) {
            this.config.animationStyle = style;
        }

        return this.config.animationStyle;
    }

    /**
     * Gets or sets the simultaneous animation delay
     * @param {number} [delay] - New delay in milliseconds
     * @returns {number} Current delay
     */
    simultaneousAnimationDelay(delay) {
        if (delay === undefined) {
            return this.config.simultaneousAnimationDelay;
        }

        if (typeof delay === 'number' && delay >= 0) {
            this.config.simultaneousAnimationDelay = delay;
        }

        return this.config.simultaneousAnimationDelay;
    }

    // Additional API methods would be added here following the same pattern
    // This is a good starting point for the refactored architecture

    // Ensure all public API methods from README are present and routed
    insert(square, piece) { return this.putPiece(piece, square); }
    get(square) { return this.getPiece(square); }
    // Note: position() is defined above at line ~1684 with getter/setter functionality
    build() { return this._initialize(); }
    resize(value) { return this.resizeBoard(value); }
    piece(square) { return this.getPiece(square); }
    ascii() { return this.positionService.getGame().ascii(); }
    board() { return this.positionService.getGame().board(); }
    getCastlingRights(color) { return this.positionService.getGame().getCastlingRights(color); }
    getComment() { return this.positionService.getGame().getComment(); }
    getComments() { return this.positionService.getGame().getComments(); }
    lastMove() { return this.positionService.getGame().lastMove(); }
    moveNumber() { return this.positionService.getGame().moveNumber(); }
    moves(options = {}) { return this.positionService.getGame().moves(options); }
    squareColor(squareId) { return this.boardService.getSquare(squareId).isWhite() ? 'light' : 'dark'; }
    isDrawByFiftyMoves() { return this.positionService.getGame().isDrawByFiftyMoves(); }
    isInsufficientMaterial() { return this.positionService.getGame().isInsufficientMaterial(); }
    isStalemate() { return this.positionService.getGame().isStalemate(); }
    isThreefoldRepetition() { return this.positionService.getGame().isThreefoldRepetition(); }
    load(fen, options = {}, animation = true) { return this.setPosition(fen, { ...options, animate: animation }); }
    loadPgn(pgn, options = {}, animation = true) { return this.positionService.getGame().loadPgn(pgn, animation); }
    put(pieceId, squareId, animation = true) {
        console.debug('[put] called with:', { pieceId, squareId, animation });
        let pieceObj = null;
        // Helper to normalize string like 'wQ', 'Qw', 'Wq', 'qw', etc.
        function parsePieceString(str) {
            if (typeof str !== 'string' || str.length !== 2) return null;
            const a = str[0].toLowerCase();
            const b = str[1].toLowerCase();
            const types = 'kqrbnp';
            const colors = 'wb';
            if (types.includes(a) && colors.includes(b)) {
                return { type: a, color: b };
            } else if (colors.includes(a) && types.includes(b)) {
                return { type: b, color: a };
            }
            return null;
        }
        if (typeof pieceId === 'string') {
            pieceObj = parsePieceString(pieceId);
            console.debug('[put] parsed piece string:', pieceObj);
            if (!pieceObj) {
                console.error(`[put] Invalid piece string: '${pieceId}'. Use e.g. 'wQ', 'Qw', 'bK', 'kb'`);
                return false;
            }
        } else if (typeof pieceId === 'object' && pieceId.type && pieceId.color) {
            const type = String(pieceId.type).toLowerCase();
            const color = String(pieceId.color).toLowerCase();
            if ('kqrbnp'.includes(type) && 'wb'.includes(color)) {
                pieceObj = { type, color };
                console.debug('[put] normalized piece object:', pieceObj);
            } else {
                console.error(`[put] Invalid piece object: {type: '${pieceId.type}', color: '${pieceId.color}'}`);
                return false;
            }
        } else {
            console.error('[put] Invalid pieceId:', pieceId);
            return false;
        }
        if (typeof squareId !== 'string' || squareId.length !== 2) {
            console.error('[put] Invalid squareId:', squareId);
            return false;
        }
        // Call the internal putPiece method
        const result = this.putPiece(pieceObj, squareId, { animate: animation });
        console.debug('[put] putPiece result:', result);
        return result;
    }
    remove(squareId, animation = true) { return this.removePiece(squareId, { animate: animation }); }
    removeComment() { return this.positionService.getGame().removeComment(); }
    removeComments() { return this.positionService.getGame().removeComments(); }
    removeHeader(field) { return this.positionService.getGame().removeHeader(field); }
    setCastlingRights(color, rights) { return this.positionService.getGame().setCastlingRights(color, rights); }
    setComment(comment) { return this.positionService.getGame().setComment(comment); }
    setHeader(key, value) { return this.positionService.getGame().setHeader(key, value); }
    validateFen(fen) { return this.positionService.getGame().validateFen(fen); }

    // Implementazioni reali per highlight/dehighlight
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
