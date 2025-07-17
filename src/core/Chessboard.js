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
        this._updateBoardPieces(true, true); // Forza popolamento DOM subito
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
        console.log('CHIAMATO: _buildBoard');
        if (this._isUndoRedo) {
            console.log('SKIP _buildBoard per undo/redo');
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
        console.log('CHIAMATO: _buildSquares');
        if (this._isUndoRedo) {
            console.log('SKIP _buildSquares per undo/redo');
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

        if (!move.check()) {
            // Clear state on failed move
            this._clearVisualState();
            return false;
        }

        if (this.config.onlyLegalMoves && !move.isLegal(this.positionService.getGame())) {
            // Clear state on illegal move
            this._clearVisualState();
            return false;
        }

        if (!move.hasPromotion() && this._requiresPromotion(move)) {
            // Don't clear state for promotion - it's handled elsewhere
            return false;
        }

        if (this.config.onMove(move)) {
            // Clear state before executing move
            this._clearVisualState();
            this._executeMove(move, animate);
            return true;
        }

        // Clear state on rejected move
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
        const gameStateBefore = this.positionService.getGame().fen();

        if (this.config.onlyLegalMoves) {
            this.boardService.applyToAllSquares('unmoved');

            const gameMove = this.moveService.executeMove(move);
            if (!gameMove) {
                throw new Error('Move execution failed');
            }

            move.from.moved();
            move.to.moved();

            // Check for special moves that need additional handling
            const isCastleMove = this.moveService.isCastle(gameMove);
            const isEnPassantMove = this.moveService.isEnPassant(gameMove);

            // Animate the move if requested
            if (animate && move.from.piece) {
                const capturedPiece = move.to.piece;

                // For castle moves in simultaneous mode, we need to coordinate both animations
                if (isCastleMove && this.config.animationStyle === 'simultaneous') {
                    // Start king animation
                    this.pieceService.translatePiece(
                        move,
                        !!capturedPiece,
                        animate,
                        this._createDragFunction.bind(this),
                        () => {
                            // King animation completed, trigger change event
                            this.config.onMoveEnd(gameMove);
                        }
                    );

                    // Start rook animation simultaneously (with small delay)
                    setTimeout(() => {
                        this._handleCastleMove(gameMove, true);
                    }, this.config.simultaneousAnimationDelay);
                } else {
                    // Regular move or sequential castle
                    this.pieceService.translatePiece(
                        move,
                        !!capturedPiece,
                        animate,
                        this._createDragFunction.bind(this),
                        () => {
                            // After animation, handle special moves and trigger change event
                            if (isCastleMove) {
                                this._handleSpecialMoveAnimation(gameMove);
                            } else if (isEnPassantMove) {
                                this._handleSpecialMoveAnimation(gameMove);
                            }
                            this.config.onMoveEnd(gameMove);
                        }
                    );
                }
            } else {
                // For non-animated moves, handle special moves immediately
                if (isCastleMove) {
                    this._handleSpecialMove(gameMove);
                } else if (isEnPassantMove) {
                    this._handleSpecialMove(gameMove);
                }
                this._updateBoardPieces(false);
                this.config.onMoveEnd(gameMove);
            }
        } else {
            // Handle non-legal mode
            const piece = this.positionService.getGamePieceId(move.from.id);
            const game = this.positionService.getGame();

            game.remove(move.from.id);
            game.remove(move.to.id);
            game.put({
                type: move.hasPromotion() ? move.promotion : piece[0],
                color: piece[1]
            }, move.to.id);

            // Update board for non-legal mode
            this._updateBoardPieces(animate);
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
            console.warn('Castle rook move failed - squares or piece not found');
            return;
        }

        console.log(`Castle: moving rook from ${rookMove.from} to ${rookMove.to}`);

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
            console.warn('En passant captured square not found or empty');
            return;
        }

        console.log(`En passant: removing captured pawn from ${capturedSquare}`);

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
        console.log('CHIAMATO: _updateBoardPieces', { animation, isPositionLoad, isUndoRedo: this._isUndoRedo });
        // Check if services are available
        if (!this.positionService || !this.moveService || !this.eventService) {
            console.log('Cannot update board pieces - services not available');
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
        // Blocca update se un drag è in corso
        if (this._isDragging) return;
        // Skip update if we're in the middle of a promotion
        if (this._isPromoting) {
            return;
        }
        if (!this.positionService || !this.positionService.getGame()) {
            return;
        }
        const squares = this.boardService.getAllSquares();
        const gameStateBefore = this.positionService.getGame().fen();
        if (/^8\/8\/8\/8\/8\/8\/8\/8/.test(gameStateBefore)) {
            const boardContainer = document.getElementById(this.config.id_div);
            if (boardContainer) {
                const pieceElements = boardContainer.querySelectorAll('.piece');
                pieceElements.forEach(element => {
                    element.remove();
                });
            }
            Object.values(squares).forEach(sq => {
                if (sq && sq.piece) {
                    sq.piece = null;
                }
            });
            this._clearVisualState();
            this._addListeners();
            if (this.config.onChange) this.config.onChange(gameStateBefore);
            return;
        }
        const useSimultaneous = this.config.animationStyle === 'simultaneous';
        if (useSimultaneous) {
            this._doSimultaneousUpdate(squares, gameStateBefore, isPositionLoad);
        } else {
            this._doSequentialUpdate(squares, gameStateBefore, animation);
        }
        // Pulizia finale robusta: rimuovi tutti i pezzi orfani dal DOM e dal riferimento JS
        Object.values(this.boardService.getAllSquares()).forEach(square => {
            const expectedPieceId = this.positionService.getGamePieceId(square.id);
            if (!expectedPieceId && typeof square.forceRemoveAllPieces === 'function') {
                square.forceRemoveAllPieces();
            }
        });
    }

    /**
     * Performs sequential piece updates (original behavior)
     * @private
     * @param {Object} squares - All squares
     * @param {string} gameStateBefore - Game state before update
     * @param {boolean} animation - Whether to animate
     */
    _doSequentialUpdate(squares, gameStateBefore, animation) {
        // Mappa: squareId -> expectedPieceId
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

            // Se c'è un pezzo attuale ma non è quello atteso, rimuovilo
            if (currentPiece && currentPieceId !== expectedPieceId) {
                // Rimozione robusta: elimina tutti i pezzi orfani dal DOM e dal riferimento JS
                if (typeof square.forceRemoveAllPieces === 'function') {
                    square.forceRemoveAllPieces();
                } else {
                    this.pieceService.removePieceFromSquare(square, animation);
                }
            }

            // Se c'è un pezzo atteso ma non è quello attuale, aggiungilo
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
     */
    _doSimultaneousUpdate(squares, gameStateBefore, isPositionLoad = false) {
        // Matching greedy per distanza minima, robusto
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

        Object.keys(expectedMap).forEach(key => {
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

        Object.keys(expectedMap).forEach(key => {
            const fromList = (currentMap[key] || []).slice();
            const toList = expectedMap[key].slice();

            // 1. Costruisci matrice delle distanze
            const distances = [];
            for (let i = 0; i < fromList.length; i++) {
                distances[i] = [];
                for (let j = 0; j < toList.length; j++) {
                    distances[i][j] = Math.abs(fromList[i].square.row - toList[j].square.row) +
                        Math.abs(fromList[i].square.col - toList[j].square.col);
                }
            }

            // 2. Matching greedy: abbina i più vicini
            const fromMatched = new Array(fromList.length).fill(false);
            const toMatched = new Array(toList.length).fill(false);
            const moves = [];

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
                // Se la posizione è la stessa, non fare nulla (pezzo unchanged)
                if (fromList[minI].square === toList[minJ].square) {
                    fromMatched[minI] = true;
                    toMatched[minJ] = true;
                    continue;
                }
                // Altrimenti, sposta il pezzo
                moves.push({ from: fromList[minI].square, to: toList[minJ].square, piece: fromList[minI].square.piece });
                fromMatched[minI] = true;
                toMatched[minJ] = true;
            }

            // 3. Rimuovi i pezzi non abbinati (presenti solo in fromList)
            for (let i = 0; i < fromList.length; i++) {
                if (!fromMatched[i]) {
                    setTimeout(() => {
                        // Rimozione robusta: elimina tutti i pezzi orfani dal DOM e dal riferimento JS
                        if (typeof fromList[i].square.forceRemoveAllPieces === 'function') {
                            fromList[i].square.forceRemoveAllPieces();
                        } else {
                            this.pieceService.removePieceFromSquare(fromList[i].square, true, onAnimationComplete);
                        }
                        onAnimationComplete();
                    }, animationIndex * animationDelay);
                    animationIndex++;
                }
            }

            // 4. Aggiungi i pezzi non abbinati (presenti solo in toList)
            for (let j = 0; j < toList.length; j++) {
                if (!toMatched[j]) {
                    setTimeout(() => {
                        const newPiece = this.pieceService.convertPiece(key);
                        this.pieceService.addPieceOnSquare(
                            toList[j].square,
                            newPiece,
                            true,
                            this._createDragFunction.bind(this),
                            onAnimationComplete
                        );
                    }, animationIndex * animationDelay);
                    animationIndex++;
                }
            }

            // 5. Anima i movimenti
            moves.forEach(move => {
                setTimeout(() => {
                    this.pieceService.translatePiece(
                        move,
                        false,
                        true,
                        this._createDragFunction.bind(this),
                        onAnimationComplete
                    );
                }, animationIndex * animationDelay);
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

        console.log('Position Analysis:');
        console.log('Current pieces:', Array.from(currentPieces.entries()));
        console.log('Expected pieces:', Array.from(expectedPieces.entries()));

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
                console.log(`UNCHANGED: ${currentPieceId} stays on ${square}`);
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
                console.log(`MOVE: ${currentPieceId} from ${fromSquare} to ${toSquare}`);
                moves.push({
                    piece: currentPieceId,
                    from: fromSquare,
                    to: toSquare,
                    fromSquare: squares[fromSquare],
                    toSquare: squares[toSquare]
                });
                processedSquares.add(toSquare);
            } else {
                // This piece needs to be removed
                console.log(`REMOVE: ${currentPieceId} from ${fromSquare}`);
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
                console.log(`ADD: ${expectedPieceId} to ${toSquare}`);
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
        const { moves, removes, adds, unchanged } = changeAnalysis;

        console.log(`Position changes analysis:`, {
            moves: moves.length,
            removes: removes.length,
            adds: adds.length,
            unchanged: unchanged.length
        });

        // Log unchanged pieces for debugging
        if (unchanged.length > 0) {
            console.log('Pieces staying in place:', unchanged.map(u => `${u.piece} on ${u.square}`));
        }

        let animationsCompleted = 0;
        const totalAnimations = moves.length + removes.length + adds.length;

        // If no animations are needed, complete immediately
        if (totalAnimations === 0) {
            console.log('No animations needed, completing immediately');
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
            console.log(`Animation completed: ${animationsCompleted}/${totalAnimations}`);
            if (animationsCompleted === totalAnimations) {
                console.log('All simultaneous animations completed');
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
        console.log(`Using animation delay: ${animationDelay}ms (position load: ${isPositionLoad})`);

        let animationIndex = 0;

        // Process moves (pieces sliding to new positions)
        moves.forEach(move => {
            const delay = animationIndex * animationDelay;
            console.log(`Scheduling move ${move.piece} from ${move.from} to ${move.to} with delay ${delay}ms`);

            setTimeout(() => {
                this._animatePieceMove(move, onAnimationComplete);
            }, delay);

            animationIndex++;
        });

        // Process removes (pieces disappearing)
        removes.forEach(remove => {
            const delay = animationIndex * animationDelay;
            console.log(`Scheduling removal of ${remove.piece} from ${remove.square} with delay ${delay}ms`);

            setTimeout(() => {
                this._animatePieceRemoval(remove, onAnimationComplete);
            }, delay);

            animationIndex++;
        });

        // Process adds (pieces appearing)
        adds.forEach(add => {
            const delay = animationIndex * animationDelay;
            console.log(`Scheduling addition of ${add.piece} to ${add.square} with delay ${delay}ms`);

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
            console.warn(`No piece found on ${move.from} for move animation`);
            onComplete();
            return;
        }

        console.log(`Animating piece move: ${move.piece} from ${move.from} to ${move.to}`);

        // Use translatePiece for smooth sliding animation
        this.pieceService.translatePiece(
            { from: fromSquare, to: toSquare, piece: piece },
            false, // Assume no capture for now
            true, // Always animate
            this._createDragFunction.bind(this),
            () => {
                console.log(`Piece move animation completed: ${move.piece} to ${move.to}`);
                onComplete();
            }
        );
    }

    /**
     * Animates a piece being removed
     * @private
     * @param {Object} remove - Remove information
     * @param {Function} onComplete - Callback when animation completes
     */
    _animatePieceRemoval(remove, onComplete) {
        console.log(`Animating piece removal: ${remove.piece} from ${remove.square}`);

        this.pieceService.removePieceFromSquare(remove.squareObj, true, () => {
            console.log(`Piece removal animation completed: ${remove.piece} from ${remove.square}`);
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
        console.log(`Animating piece addition: ${add.piece} to ${add.square}`);

        const newPiece = this.pieceService.convertPiece(add.piece);
        this.pieceService.addPieceOnSquare(
            add.squareObj,
            newPiece,
            true,
            this._createDragFunction.bind(this),
            () => {
                console.log(`Piece addition animation completed: ${add.piece} to ${add.square}`);
                onComplete();
            }
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
        // Forza la sincronizzazione dopo setPosition
        this._updateBoardPieces(true, false);
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
        const result = this.setPosition(startPosition, { animate });
        // Forza la sincronizzazione dopo reset
        this._updateBoardPieces(true, false);
        return result;
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
        // Forza la rimozione di tutti i pezzi dal DOM
        if (this.boardService && this.boardService.squares) {
            Object.values(this.boardService.squares).forEach(sq => {
                if (sq && sq.piece) sq.piece = null;
            });
        }
        if (this._updateBoardPieces) {
            this._updateBoardPieces(animate, true);
        }
        // Forza la sincronizzazione dopo clear
        this._updateBoardPieces(true, false);
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
            // Forza refresh completo di tutti i pezzi dopo undo
            this._updateBoardPieces(true, true);
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
            // Forza refresh completo di tutti i pezzi dopo redo
            this._updateBoardPieces(true, true);
            return result;
        }
        return false;
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
        // Sempre leggi lo stato aggiornato dal boardService
        const squareObj = typeof square === 'string' ? this.boardService.getSquare(square) : square;
        if (!squareObj || typeof squareObj !== 'object' || !('id' in squareObj)) throw new Error('[getPiece] Parametro square non valido');
        // Forza sync prima di leggere
        this._updateBoardPieces(false, false);
        const piece = squareObj.piece;
        if (!piece) return null;
        return (piece.color + piece.type).toLowerCase();
    }
    /**
     * Put a piece on a square
     * @param {string|Piece} piece
     * @param {string|Square} square
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
        const squareObj = typeof square === 'string' ? this.boardService.getSquare(square) : square;
        if (!squareObj || typeof squareObj !== 'object' || !('id' in squareObj)) throw new Error('[putPiece] Parametro square non valido');
        const pieceObj = this.pieceService.convertPiece(pieceStr);
        if (!pieceObj || typeof pieceObj !== 'object' || !('type' in pieceObj)) throw new Error('[putPiece] Parametro piece non valido');
        // Aggiorna solo il motore chess.js
        const chessJsPiece = { type: pieceObj.type, color: pieceObj.color };
        const game = this.positionService.getGame();
        const result = game.put(chessJsPiece, squareObj.id);
        if (!result) throw new Error(`[putPiece] Game.put failed for ${pieceStr} on ${squareObj.id}`);
        // Non aggiornare direttamente square.piece!
        // Riallinea la board JS allo stato del motore
        this._updateBoardPieces(animate);
        return true;
    }
    /**
     * Remove a piece from a square
     * @param {string|Square} square
     * @param {Object} [opts]
     * @param {boolean} [opts.animate=true]
     * @returns {string|null}
     */
    removePiece(square, opts = {}) {
        const animate = opts.animate !== undefined ? opts.animate : true;
        const squareObj = typeof square === 'string' ? this.boardService.getSquare(square) : square;
        if (!squareObj || typeof squareObj !== 'object' || !('id' in squareObj)) throw new Error('[removePiece] Parametro square non valido');
        // Aggiorna solo il motore chess.js
        const game = this.positionService.getGame();
        game.remove(squareObj.id);
        // Non aggiornare direttamente square.piece!
        // Riallinea la board JS allo stato del motore
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
        console.log('FEN dopo flip:', this.fen(), 'Orientamento:', this.coordinateService.getOrientation());
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
     * @param {string|Square} square
     * @param {Object} [opts]
     */
    highlight(square, opts = {}) {
        // API: accetta id, converte subito in oggetto
        const squareObj = typeof square === 'string' ? this.boardService.getSquare(square) : square;
        if (!squareObj || typeof squareObj !== 'object' || !('id' in squareObj)) throw new Error('[highlight] Parametro square non valido');
        if (this.boardService && this.boardService.highlightSquare) {
            this.boardService.highlightSquare(squareObj, opts);
        } else if (this.eventService && this.eventService.highlightSquare) {
            this.eventService.highlightSquare(squareObj, opts);
        }
    }
    /**
     * Remove highlight from a square
     * @param {string|Square} square
     * @param {Object} [opts]
     */
    dehighlight(square, opts = {}) {
        // API: accetta id, converte subito in oggetto
        const squareObj = typeof square === 'string' ? this.boardService.getSquare(square) : square;
        if (!squareObj || typeof squareObj !== 'object' || !('id' in squareObj)) throw new Error('[dehighlight] Parametro square non valido');
        if (this.boardService && this.boardService.dehighlightSquare) {
            this.boardService.dehighlightSquare(squareObj, opts);
        } else if (this.eventService && this.eventService.dehighlightSquare) {
            this.eventService.dehighlightSquare(squareObj, opts);
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
        // Forza sync prima di interrogare il motore
        this._updateBoardPieces(false, false);
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
    destroy() { /* TODO: robust destroy logic */ }
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
    setConfig(newConfig) { this.setConfig(newConfig); }

    // --- ALIASES/DEPRECATED ---
    // Note: These methods are now implemented as aliases at the end of the class

    /**
     * Alias for flipBoard (for backward compatibility)
     */
    flip(opts = {}) {
        this._updateBoardPieces(opts.animate !== false);
        return this.flipBoard(opts);
    }

    /**
     * Gets the current position as an object
     * @returns {Object} Position object
     */
    position() {
        return this.positionService.getPosition();
    }

    /**
     * Sets a new position
     * @param {string|Object} position - New position
     * @param {boolean} [animate=true] - Whether to animate
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

    // Additional API methods and aliases for backward compatibility
    insert(square, piece) { return this.putPiece(piece, square); }
    build() { return this._initialize(); }
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
    forceSync() { this._updateBoardPieces(true, true); this._updateBoardPieces(true, false); }

    // Metodi mancanti che causano fallimenti nei test
    /**
     * Move a piece from one square to another
     * @param {string|Object} move - Move in format 'e2e4' or {from: 'e2', to: 'e4'}
     * @param {Object} [opts] - Options
     * @param {boolean} [opts.animate=true] - Whether to animate
     * @returns {boolean} True if move was successful
     */
    movePiece(move, opts = {}) {
        const animate = opts.animate !== undefined ? opts.animate : true;

        // --- API: accetta id/stringhe, ma converte subito in oggetti ---
        let fromSquareObj, toSquareObj, promotion;
        if (typeof move === 'string') {
            if (move.length === 4) {
                fromSquareObj = this.boardService.getSquare(move.substring(0, 2));
                toSquareObj = this.boardService.getSquare(move.substring(2, 4));
            } else if (move.length === 5) {
                fromSquareObj = this.boardService.getSquare(move.substring(0, 2));
                toSquareObj = this.boardService.getSquare(move.substring(2, 4));
                promotion = move.substring(4, 5);
            } else {
                throw new Error(`Invalid move format: ${move}`);
            }
        } else if (typeof move === 'object' && move.from && move.to) {
            // Se sono id, converto in oggetti; se sono già oggetti, li uso direttamente
            fromSquareObj = typeof move.from === 'string' ? this.boardService.getSquare(move.from) : move.from;
            toSquareObj = typeof move.to === 'string' ? this.boardService.getSquare(move.to) : move.to;
            promotion = move.promotion;
        } else {
            throw new Error(`Invalid move: ${move}`);
        }

        if (!fromSquareObj || !toSquareObj) {
            throw new Error(`Invalid squares: ${move.from || move.substring(0, 2)} or ${move.to || move.substring(2, 4)}`);
        }

        // --- Internamente: lavora solo con oggetti ---
        const result = this._onMove(fromSquareObj, toSquareObj, promotion, animate);
        // Dopo ogni mossa, forza la sincronizzazione della board
        this._updateBoardPieces(true, false);
        return result;
    }

    // Aliases for backward compatibility
    move(move, animate = true) {
        // On any new move, clear the redo stack
        this._undoneMoves = [];
        return this.movePiece(move, { animate });
    }
    get(square) { return this.getPiece(square); }
    piece(square) { return this.getPiece(square); }
    put(piece, square, opts = {}) { return this.putPiece(piece, square, opts); }
    remove(square, opts = {}) { return this.removePiece(square, opts); }
    load(position, opts = {}) { return this.setPosition(position, opts); }
    resize(size) { return this.resizeBoard(size); }
    start(opts = {}) { return this.reset(opts); }
    clearBoard(opts = {}) { return this.clear(opts); }
}

export { Chessboard };
export default Chessboard;
