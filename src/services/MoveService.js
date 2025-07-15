/**
 * Service for managing chess moves and move validation
 * @module services/MoveService
 * @since 2.0.0
 */

import Move from '../components/Move.js';
import { MoveError, ValidationError } from '../errors/ChessboardError.js';
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
        
        return legalMoves.some(legalMove => 
            legalMove.to === move.to.id && 
            move.promotion === legalMove.promotion
        );
    }

    /**
     * Gets all legal moves for a square or the entire position
     * @param {string} [from] - Square to get moves from (optional)
     * @param {boolean} [verbose=true] - Whether to return verbose move objects
     * @returns {Array} Array of legal moves
     */
    getLegalMoves(from = null, verbose = true) {
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
        const game = this.positionService.getGame();
        if (!game) return null;
        
        const moveOptions = {
            from: move.from.id,
            to: move.to.id
        };
        
        console.log('executeMove - move.promotion:', move.promotion);
        console.log('executeMove - move.hasPromotion():', move.hasPromotion());
        
        if (move.hasPromotion()) {
            moveOptions.promotion = move.promotion;
        }
        
        console.log('executeMove - moveOptions:', moveOptions);
        
        const result = game.move(moveOptions);
        console.log('executeMove - result:', result);
        
        // Check what's actually on the board after the move
        if (result) {
            const pieceOnDestination = game.get(move.to.id);
            console.log('executeMove - piece on destination after move:', pieceOnDestination);
        }
        
        return result;
    }

    /**
     * Checks if a move requires promotion
     * @param {Move} move - Move to check
     * @returns {boolean} True if promotion is required
     */
    requiresPromotion(move) {
        console.log('Checking if move requires promotion:', move.from.id, '->', move.to.id);
        
        if (!this.config.onlyLegalMoves) {
            console.log('Not in legal moves mode, no promotion required');
            return false;
        }
        
        const game = this.positionService.getGame();
        if (!game) {
            console.log('No game instance available');
            return false;
        }
        
        const piece = game.get(move.from.id);
        if (!piece || piece.type !== 'p') {
            console.log('Not a pawn move, no promotion required');
            return false;
        }
        
        const targetRank = move.to.row;
        if (targetRank !== 1 && targetRank !== 8) {
            console.log('Not reaching promotion rank, no promotion required');
            return false;
        }
        
        console.log('Pawn reaching promotion rank, validating move...');
        
        // Additional validation: check if the pawn can actually reach this square
        if (!this._isPawnMoveValid(move.from, move.to, piece.color)) {
            console.log('Pawn move not valid, no promotion required');
            return false;
        }
        
        // First check if the move is legal without promotion
        const simpleMoveObj = {
            from: move.from.id,
            to: move.to.id
        };
        
        try {
            console.log('Testing move without promotion:', simpleMoveObj);
            // Test if the move is legal without promotion first
            const testMove = game.move(simpleMoveObj);
            if (testMove) {
                // Move was successful, but check if it was a promotion
                const wasPromotion = testMove.promotion;
                
                // Undo the test move
                game.undo();
                
                console.log('Move successful without promotion, was promotion:', wasPromotion !== undefined);
                
                // If it was a promotion, return true
                return wasPromotion !== undefined;
            }
        } catch (error) {
            console.log('Move failed without promotion, trying with promotion:', error.message);
            
            // If simple move fails, try with promotion
            const promotionMoveObj = {
                from: move.from.id,
                to: move.to.id,
                promotion: 'q' // test with queen
            };
            
            try {
                console.log('Testing move with promotion:', promotionMoveObj);
                const testMove = game.move(promotionMoveObj);
                if (testMove) {
                    // Undo the test move
                    game.undo();
                    console.log('Move successful with promotion, promotion required');
                    return true;
                }
            } catch (promotionError) {
                console.log('Move failed even with promotion:', promotionError.message);
                // Move is not legal even with promotion
                return false;
            }
        }
        
        console.log('Move validation complete, no promotion required');
        return false;
    }

    /**
     * Validates if a pawn move is theoretically possible
     * @private
     * @param {Square} from - Source square
     * @param {Square} to - Target square
     * @param {string} color - Pawn color ('w' or 'b')
     * @returns {boolean} True if the move is valid for a pawn
     */
    _isPawnMoveValid(from, to, color) {
        const fromRank = from.row;
        const toRank = to.row;
        const fromFile = from.col;
        const toFile = to.col;
        
        console.log(`Validating pawn move: ${from.id} -> ${to.id} (${color})`);
        console.log(`Ranks: ${fromRank} -> ${toRank}, Files: ${fromFile} -> ${toFile}`);
        
        // Direction of pawn movement
        const direction = color === 'w' ? 1 : -1;
        const rankDiff = toRank - fromRank;
        const fileDiff = Math.abs(toFile - fromFile);
        
        // Pawn can only move forward
        if (rankDiff * direction <= 0) {
            console.log('Invalid: Pawn cannot move backward or stay in place');
            return false;
        }
        
        // Pawn can only move 1 rank at a time (except for double move from starting position)
        if (Math.abs(rankDiff) > 2) {
            console.log('Invalid: Pawn cannot move more than 2 ranks');
            return false;
        }
        
        // If moving 2 ranks, must be from starting position
        if (Math.abs(rankDiff) === 2) {
            const startingRank = color === 'w' ? 2 : 7;
            if (fromRank !== startingRank) {
                console.log(`Invalid: Pawn cannot move 2 ranks from rank ${fromRank}`);
                return false;
            }
        }
        
        // Pawn can only move to adjacent files (diagonal capture) or same file (forward move)
        if (fileDiff > 1) {
            console.log('Invalid: Pawn cannot move more than 1 file');
            return false;
        }
        
        console.log('Pawn move validation passed');
        return true;
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
        if (!this.requiresPromotion(move)) return false;
        
        const game = this.positionService.getGame();
        const piece = game.get(move.from.id);
        const targetSquare = move.to;
        
        // Clear any existing promotion UI
        Object.values(squares).forEach(square => {
            square.removePromotion();
            square.removeCover();
        });
        
        // Always show promotion choices in a column
        this._showPromotionInColumn(targetSquare, piece, squares, onPromotionSelect, onPromotionCancel);
        
        return true;
    }
    
    /**
     * Shows promotion choices in a column
     * @private
     */
    _showPromotionInColumn(targetSquare, piece, squares, onPromotionSelect, onPromotionCancel) {
        console.log('Setting up promotion for', targetSquare.id, 'piece color:', piece.color);
        
        // Set up promotion choices starting from border row
        PROMOTION_PIECES.forEach((pieceType, index) => {
            const choiceSquare = this._findPromotionSquare(targetSquare, index, squares);
            
            if (choiceSquare) {
                const pieceId = pieceType + piece.color;
                const piecePath = this._getPiecePathForPromotion(pieceId);
                
                console.log('Setting up promotion choice:', pieceType, 'on square:', choiceSquare.id);
                
                choiceSquare.putPromotion(piecePath, () => {
                    console.log('Promotion choice selected:', pieceType);
                    onPromotionSelect(pieceType);
                });
            } else {
                console.log('Could not find square for promotion choice:', pieceType, 'index:', index);
            }
        });
        
        // Set up cover squares (for cancellation)
        Object.values(squares).forEach(square => {
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
        
        console.log('Looking for promotion square - target:', targetSquare.id, 'index:', index, 'col:', col, 'baseRow:', baseRow);
        
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
            console.log('Invalid promotion row:', baseRow);
            return null;
        }
        
        console.log('Calculated row:', row);
        
        // Ensure row is within bounds
        if (row < 1 || row > 8) {
            console.log('Row out of bounds:', row);
            return null;
        }
        
        // Find square by row/col
        for (const square of Object.values(squares)) {
            if (square.col === col && square.row === row) {
                console.log('Found promotion square:', square.id);
                return square;
            }
        }
        
        console.log('No square found for col:', col, 'row:', row);
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
