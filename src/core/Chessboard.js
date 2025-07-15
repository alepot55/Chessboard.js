/**
 * Main Chessboard class - Orchestrates all services and components
 * @module core/Chessboard
 * @since 2.0.0
 */

import ChessboardConfig from './ChessboardConfig.js';
import Move from '../components/Move.js';
import { 
    BoardService, 
    CoordinateService, 
    EventService, 
    MoveService, 
    PieceService, 
    PositionService 
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
        this.coordinateService = new CoordinateService(this.config);
        this.positionService = new PositionService(this.config);
        this.boardService = new BoardService(this.config);
        this.pieceService = new PieceService(this.config);
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
        this._updateBoardPieces();
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
            
            // Animate the move if requested
            if (animate && move.from.piece) {
                const capturedPiece = move.to.piece;
                this.pieceService.translatePiece(
                    move, 
                    !!capturedPiece, 
                    animate, 
                    this._createDragFunction.bind(this),
                    () => {
                        // After animation, trigger change event
                        this.config.onMoveEnd(gameMove);
                    }
                );
            } else {
                // For non-animated moves, update immediately 
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
     * Updates board pieces to match game state
     * @private
     * @param {boolean} [animation=false] - Whether to animate
     */
    _updateBoardPieces(animation = false) {
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
                this._doUpdateBoardPieces(animation);
                this._updateTimeout = null;
                
                // Ensure hints are available for the next turn
                this._ensureHintsAvailable();
            }, 10);
        } else {
            this._doUpdateBoardPieces(animation);
            
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
     */
    _doUpdateBoardPieces(animation = false) {
        // Skip update if we're in the middle of a promotion
        if (this._isPromoting) {
            console.log('Skipping board update during promotion');
            return;
        }
        
        const squares = this.boardService.getAllSquares();
        const gameStateBefore = this.positionService.getGame().fen();
        
        console.log('_doUpdateBoardPieces - current FEN:', gameStateBefore);
        
        // Update each square
        Object.values(squares).forEach(square => {
            const expectedPieceId = this.positionService.getGamePieceId(square.id);
            const currentPiece = square.piece;
            const currentPieceId = currentPiece ? currentPiece.getId() : null;
            
            // Log only for squares that are changing
            if (currentPieceId !== expectedPieceId) {
                console.log(`_doUpdateBoardPieces - ${square.id}: ${currentPieceId} -> ${expectedPieceId}`);
                
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
        this._updateBoardPieces(animation);
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

    // Additional API methods would be added here following the same pattern
    // This is a good starting point for the refactored architecture
}

export default Chessboard;
