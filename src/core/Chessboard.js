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

/**
 * Main Chessboard class responsible for coordinating all services
 * @class
 */
class Chessboard {
    /**
     * Creates a new Chessboard instance
     * @param {Object} config - Configuration object
     */
    constructor(config) {
        console.log('Chessboard constructor received config:', config);
        
        // Initialize configuration
        this.config = new ChessboardConfig(config);
        console.log('Processed config.id_div:', this.config.id_div);
        
        // Initialize services
        this._initializeServices();
        
        // Initialize the board
        this._initialize();
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
     */
    _buildBoard() {
        this.boardService.buildBoard();
    }

    /**
     * Builds all squares on the board
     * @private
     */
    _buildSquares() {
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
            console.log('Skipping board update during promotion');
            return;
        }
        
        const squares = this.boardService.getAllSquares();
        const gameStateBefore = this.positionService.getGame().fen();
        
        console.log('_doUpdateBoardPieces - current FEN:', gameStateBefore);
        console.log('_doUpdateBoardPieces - animation:', animation, 'style:', this.config.animationStyle, 'isPositionLoad:', isPositionLoad);
        
        // Determine which animation style to use
        const useSimultaneous = this.config.animationStyle === 'simultaneous';
        console.log('_doUpdateBoardPieces - useSimultaneous:', useSimultaneous);
        
        if (useSimultaneous) {
            console.log('Using simultaneous animation');
            this._doSimultaneousUpdate(squares, gameStateBefore, isPositionLoad);
        } else {
            console.log('Using sequential animation');
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
        // Update each square sequentially
        Object.values(squares).forEach(square => {
            const expectedPieceId = this.positionService.getGamePieceId(square.id);
            const currentPiece = square.piece;
            const currentPieceId = currentPiece ? currentPiece.getId() : null;
            
            // Log only for squares that are changing
            if (currentPieceId !== expectedPieceId) {
                console.log(`_doSequentialUpdate - ${square.id}: ${currentPieceId} -> ${expectedPieceId}`);
                
                // Check if we already have the correct piece (from promotion)
                if (currentPiece && currentPiece.getId() === expectedPieceId) {
                    console.log(`Piece ${expectedPieceId} already correctly placed on ${square.id}`);
                } else {
                    // Remove current piece if exists
                    if (currentPiece) {
                        this.pieceService.removePieceFromSquare(square, animation);
                    }
                    
                    // Add new piece if needed
                    if (expectedPieceId) {
                        const newPiece = this.pieceService.convertPiece(expectedPieceId);
                        this.pieceService.addPieceOnSquare(
                            square, 
                            newPiece, 
                            animation,
                            this._createDragFunction.bind(this)
                        );
                    }
                }
            }
        });
        
        // Re-add listeners after updating pieces to ensure hover events work correctly
        this._addListeners();
        
        // Trigger change event if position changed
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
        console.log('_doSimultaneousUpdate - Starting simultaneous update');
        
        // Analyze what changes need to be made
        const changeAnalysis = this._analyzePositionChanges(squares);
        
        if (changeAnalysis.totalChanges === 0) {
            console.log('_doSimultaneousUpdate - No changes needed, returning');
            this._addListeners();
            
            // Trigger change event if position changed
            const gameStateAfter = this.positionService.getGame().fen();
            if (gameStateBefore !== gameStateAfter) {
                this.config.onChange(gameStateAfter);
            }
            return;
        }
        
        console.log('_doSimultaneousUpdate - Change analysis:', changeAnalysis);
        
        // Execute all changes simultaneously
        this._executeSimultaneousChanges(changeAnalysis, gameStateBefore, isPositionLoad);
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
        
        // Find pieces that can move to new positions
        const usedDestinations = new Set();
        
        currentPieces.forEach((pieceId, fromSquare) => {
            const stillExists = Array.from(expectedPieces.entries()).find(([toSquare, expectedId]) => 
                expectedId === pieceId && !usedDestinations.has(toSquare)
            );
            
            if (stillExists) {
                const [toSquare, expectedId] = stillExists;
                if (fromSquare !== toSquare) {
                    // This piece moves from one square to another
                    moves.push({
                        piece: pieceId,
                        from: fromSquare,
                        to: toSquare,
                        fromSquare: squares[fromSquare],
                        toSquare: squares[toSquare]
                    });
                    usedDestinations.add(toSquare);
                } else {
                    // This piece stays in the same place
                    unchanged.push({
                        piece: pieceId,
                        square: fromSquare
                    });
                    usedDestinations.add(toSquare);
                }
            } else {
                // This piece needs to be removed
                removes.push({
                    piece: pieceId,
                    square: fromSquare,
                    squareObj: squares[fromSquare]
                });
            }
        });
        
        // Find pieces that need to be added
        expectedPieces.forEach((pieceId, toSquare) => {
            if (!usedDestinations.has(toSquare)) {
                adds.push({
                    piece: pieceId,
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
    // Public API Methods
    // -------------------

    /**
     * Gets the current position as FEN
     * @returns {string} FEN string
     */
    fen() {
        return this.positionService.getGame().fen();
    }

    /**
     * Gets current turn
     * @returns {string} 'w' or 'b'
     */
    turn() {
        return this.positionService.getGame().turn();
    }

    /**
     * Loads a new position
     * @param {string|Object} position - Position to load
     * @param {Object} [options={}] - Loading options
     * @param {boolean} [animation=true] - Whether to animate
     */
    load(position, options = {}, animation = true) {
        this.boardService.applyToAllSquares('removeHint');
        this.boardService.applyToAllSquares('deselect');
        this.boardService.applyToAllSquares('unmoved');
        
        this.positionService.setGame(position, options);
        this._updateBoardPieces(animation, true); // Position load
    }

    /**
     * Destroys the board and cleans up resources
     */
    destroy() {
        this.eventService.destroy();
        this.boardService.destroy();
        this.positionService.destroy();
        this.pieceService.destroy();
        this.moveService.destroy();
        this.animationService.destroy();
        this.validationService.destroy();
        
        if (this._updateTimeout) {
            clearTimeout(this._updateTimeout);
            this._updateTimeout = null;
        }
    }

    /**
     * Resizes the board
     * @param {number|string} size - New size
     */
    resize(size) {
        this.boardService.resize(size);
        this._updateBoardPieces();
    }

    /**
     * Flips the board orientation
     */
    flip() {
        this.coordinateService.flipOrientation();
        this.destroy();
        this._initParams();
        this._buildBoard();
        this._buildSquares();
        this._addListeners();
        this._updateBoardPieces();
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
     * Makes a move on the board
     * @param {string|Object} move - Move to make
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if move was successful
     */
    move(move, animate = true) {
        if (typeof move === 'string') {
            // Parse move string (e.g., 'e2e4')
            const moveObj = this.moveService.parseMove(move);
            if (!moveObj) return false;
            
            const fromSquare = this.boardService.getSquare(moveObj.from);
            const toSquare = this.boardService.getSquare(moveObj.to);
            
            if (!fromSquare || !toSquare) return false;
            
            return this._onMove(fromSquare, toSquare, moveObj.promotion, animate);
        } else if (move && move.from && move.to) {
            // Handle move object
            const fromSquare = this.boardService.getSquare(move.from);
            const toSquare = this.boardService.getSquare(move.to);
            
            if (!fromSquare || !toSquare) return false;
            
            return this._onMove(fromSquare, toSquare, move.promotion, animate);
        }
        
        return false;
    }

    /**
     * Undoes the last move
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if undo was successful
     */
    undo(animate = true) {
        if (this.positionService.getGame().undo) {
            const undoResult = this.positionService.getGame().undo();
            if (undoResult) {
                this._updateBoardPieces(animate, true); // Position change
                return true;
            }
        }
        return false;
    }

    /**
     * Redoes the last undone move
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if redo was successful
     */
    redo(animate = true) {
        if (this.positionService.getGame().redo) {
            const redoResult = this.positionService.getGame().redo();
            if (redoResult) {
                this._updateBoardPieces(animate, true); // Position change
                return true;
            }
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
        return this.positionService.getGame().inCheckmate();
    }

    /**
     * Checks if the game is in stalemate
     * @returns {boolean} True if in stalemate
     */
    inStalemate() {
        return this.positionService.getGame().inStalemate();
    }

    /**
     * Checks if the game is drawn
     * @returns {boolean} True if drawn
     */
    inDraw() {
        return this.positionService.getGame().inDraw();
    }

    /**
     * Checks if position is threefold repetition
     * @returns {boolean} True if threefold repetition
     */
    inThreefoldRepetition() {
        return this.positionService.getGame().inThreefoldRepetition();
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
     * Clears the board
     * @param {boolean} [animate=true] - Whether to animate
     */
    clear(animate = true) {
        this.positionService.getGame().clear();
        this._updateBoardPieces(animate, true); // Position change
    }

    /**
     * Resets the board to starting position
     * @param {boolean} [animate=true] - Whether to animate
     */
    reset(animate = true) {
        this.positionService.getGame().reset();
        this._updateBoardPieces(animate, true); // Position change
    }

    /**
     * Puts a piece on a square
     * @param {string} square - Square to put piece on
     * @param {string} piece - Piece to put
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if successful
     */
    put(square, piece, animate = true) {
        if (!this.validationService.isValidSquare(square) || !this.validationService.isValidPiece(piece)) {
            return false;
        }
        
        const pieceObj = this.pieceService.convertPiece(piece);
        const squareObj = this.boardService.getSquare(square);
        
        if (!squareObj) return false;
        
        // Update game state
        this.positionService.getGame().put(pieceObj, square);
        
        // Update visual representation
        this._updateBoardPieces(animate, true); // Position change
        
        return true;
    }

    /**
     * Removes a piece from a square
     * @param {string} square - Square to remove piece from
     * @param {boolean} [animate=true] - Whether to animate
     * @returns {boolean} True if successful
     */
    remove(square, animate = true) {
        if (!this.validationService.isValidSquare(square)) {
            return false;
        }
        
        const squareObj = this.boardService.getSquare(square);
        if (!squareObj) return false;
        
        // Update game state
        this.positionService.getGame().remove(square);
        
        // Update visual representation
        this._updateBoardPieces(animate, true); // Position change
        
        return true;
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
}

export default Chessboard;
