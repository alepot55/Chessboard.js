/**
 * Service for managing chess pieces and their operations
 * @module services/PieceService
 * @since 2.0.0
 */

import Piece from '../components/Piece.js';
import { PieceError, ValidationError } from '../errors/ChessboardError.js';
import { ERROR_MESSAGES } from '../errors/messages.js';
import { PIECE_TYPES, PIECE_COLORS } from '../constants/positions.js';
import { DragOptimizations } from '../utils/cross-browser.js';

/**
 * Service responsible for piece management and operations
 * @class
 */
export class PieceService {
    /**
     * Creates a new PieceService instance
     * @param {ChessboardConfig} config - Board configuration
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Gets the path to a piece asset
     * @param {string} piece - Piece identifier (e.g., 'wK', 'bP')
     * @returns {string} Path to piece asset
     * @throws {ValidationError} When piecesPath configuration is invalid
     */
    getPiecePath(piece) {
        const { piecesPath } = this.config;

        if (typeof piecesPath === 'string') {
            return `${piecesPath}/${piece}.svg`;
        } else if (typeof piecesPath === 'object' && piecesPath !== null) {
            return piecesPath[piece];
        } else if (typeof piecesPath === 'function') {
            return piecesPath(piece);
        } else {
            throw new ValidationError(ERROR_MESSAGES.invalid_piecesPath, 'piecesPath', piecesPath);
        }
    }

    /**
     * Converts various piece formats to a Piece instance
     * @param {string|Piece} piece - Piece in various formats
     * @returns {Piece} Piece instance
     * @throws {PieceError} When piece format is invalid
     */
    convertPiece(piece) {
        if (piece instanceof Piece) {
            return piece;
        }

        if (typeof piece === 'string' && piece.length === 2) {
            const [first, second] = piece.split('');
            let type, color;

            // Check format: [type][color] (e.g., 'pw')
            if (PIECE_TYPES.includes(first.toLowerCase()) && PIECE_COLORS.includes(second)) {
                type = first.toLowerCase();
                color = second;
            }
            // Check format: [color][type] (e.g., 'wP')
            else if (PIECE_COLORS.includes(first) && PIECE_TYPES.includes(second.toLowerCase())) {
                color = first;
                type = second.toLowerCase();
            } else {
                throw new PieceError(ERROR_MESSAGES.invalid_piece + piece, piece);
            }

            const piecePath = this.getPiecePath(type + color);
            return new Piece(color, type, piecePath);
        }

        throw new PieceError(ERROR_MESSAGES.invalid_piece + piece, piece);
    }

    /**
     * Adds a piece to a square with optional fade-in animation
     * @param {Square} square - Target square
     * @param {Piece} piece - Piece to add
     * @param {boolean} [fade=true] - Whether to fade in the piece
     * @param {Function} dragFunction - Function to handle drag events
     * @param {Function} [callback] - Callback when animation completes
     */
    addPieceOnSquare(square, piece, fade = true, dragFunction, callback) {
        console.debug(`[PieceService] addPieceOnSquare: ${piece.id} to ${square.id}`);
        square.putPiece(piece);

        if (dragFunction) {
            piece.setDrag(dragFunction(square, piece));
        }

        if (fade) {
            const appearanceStyle = this.config.appearanceStyle || 'fade';
            const duration = this.config.appearanceTime || this.config.fadeTime || 200;

            if (duration > 0 && appearanceStyle !== 'instant') {
                piece.appearAnimate(appearanceStyle, duration, () => {
                    piece.visible();
                    if (callback) callback();
                });
            } else {
                piece.visible();
                if (callback) callback();
            }
        } else {
            piece.visible();
            if (callback) callback();
        }
    }

    /**
     * Removes a piece from a square with configurable capture animation
     * @param {Square} square - Source square
     * @param {boolean} [animate=true] - Whether to animate the removal
     * @param {Function} [callback] - Callback when animation completes
     * @returns {Piece} The removed piece
     * @throws {PieceError} When square has no piece to remove
     */
    removePieceFromSquare(square, animate = true, callback) {
        console.debug(`[PieceService] removePieceFromSquare: ${square.id}`);
        square.check();

        const piece = square.piece;
        if (!piece) {
            if (callback) callback();
            return null;
        }

        // Always remove piece reference synchronously to prevent stale state
        // when a new update starts before the animation completes
        square.piece = null;

        const captureStyle = this.config.captureStyle || 'fade';
        const duration = this.config.captureTime || this.config.fadeTime || 200;

        if (animate && duration > 0) {
            // Animate visual element, then destroy
            piece.captureAnimate(captureStyle, duration, () => {
                piece.destroy();
                if (callback) callback();
            });
        } else {
            piece.destroy();
            if (callback) callback();
        }

        return piece;
    }

    /**
     * Moves a piece to a new position with animation
     * @param {Piece} piece - Piece to move
     * @param {Square} targetSquare - Target square
     * @param {number} duration - Animation duration
     * @param {Function} [callback] - Callback function when animation completes
     */
    movePiece(piece, targetSquare, duration, callback) {
        console.debug(`[PieceService] movePiece: ${piece.id} to ${targetSquare.id}`);
        if (!piece) {
            console.warn('PieceService.movePiece: piece is null, skipping animation');
            if (callback) callback();
            return;
        }

        // Build movement options from config
        const moveOptions = {
            style: this.config.moveStyle || 'slide',
            easing: this.config.moveEasing || this.config.moveAnimation || 'ease',
            arcHeight: this.config.moveArcHeight || 0.3,
            landingEffect: this.config.landingEffect || 'none',
            landingDuration: this.config.landingDuration || 150
        };

        piece.translate(
            targetSquare,
            duration,
            this._getTransitionTimingFunction(),
            this.config.moveAnimation,
            callback,
            moveOptions
        );
    }

    /**
     * Handles piece translation with optional capture
     * @param {Move} move - Move object containing from/to squares and piece
     * @param {boolean} removeTarget - Whether to remove piece from target square
     * @param {boolean} animate - Whether to animate the move
     * @param {Function} [dragFunction] - Function to create drag handlers
     * @param {Function} [callback] - Callback function when complete
     */
    translatePiece(move, removeTarget, animate, dragFunction = null, callback = null) {
        console.debug(`[PieceService] translatePiece: ${move.piece.id} from ${move.from.id} to ${move.to.id}`);
        if (!move.piece || !move.piece.element) {
            console.warn('PieceService.translatePiece: move.piece or element is null, skipping translation');
            if (callback) callback();
            return;
        }

        if (removeTarget) {
            // Deselect the captured piece before removing it
            move.to.deselect();
            this.removePieceFromSquare(move.to, false);
        }

        const changeSquareCallback = () => {
            // If piece element was destroyed (e.g., by a newer update), skip
            if (!move.piece.element || !move.piece.element.parentNode) {
                if (callback) callback();
                return;
            }

            // Check if piece still exists and is on the source square
            if (move.from.piece === move.piece) {
                move.from.removePiece(true); // Preserve the piece when moving
            }

            // Only put piece if destination square doesn't already have it
            if (move.to.piece !== move.piece) {
                move.to.putPiece(move.piece);

                // Re-attach drag handler if provided
                if (dragFunction && this.config.draggable && move.piece.element) {
                    move.piece.setDrag(dragFunction(move.to, move.piece));
                }
            }

            if (callback) callback();
        };

        // Check if piece is currently being dragged
        const isDragging = move.piece.element.classList.contains('dragging');

        if (isDragging) {
            // If piece is being dragged, don't animate - just move it immediately
            // The piece is already visually in the correct position from the drag
            changeSquareCallback();
        } else {
            // Normal animation
            const duration = animate ? this.config.moveTime : 0;
            this.movePiece(move.piece, move.to, duration, changeSquareCallback);
        }
    }

    /**
     * Snaps a piece back to its original position
     * @param {Square} square - Square containing the piece
     * @param {boolean} [animate=true] - Whether to animate the snapback
     */
    snapbackPiece(square, animate = true) {
        if (!square || !square.piece) {
            return;
        }
        const piece = square.piece;
        const duration = animate ? this.config.snapbackTime : 0;
        console.debug(`[PieceService] snapbackPiece: ${piece.id} on ${square.id}`);
        piece.translate(
            square,
            duration,
            this._getTransitionTimingFunction(),
            this.config.snapbackAnimation
        );
    }

    /**
     * Centers a piece in its square with animation (after successful drop)
     * @param {Square} square - Square containing the piece to center
     * @param {boolean} animate - Whether to animate the centering
     */
    centerPiece(square, animate = true) {
        if (!square || !square.piece) {
            return;
        }
        const piece = square.piece;
        const duration = animate ? this.config.dropCenterTime : 0;
        console.debug(`[PieceService] centerPiece: ${piece.id} on ${square.id}`);
        piece.translate(
            square,
            duration,
            this._getTransitionTimingFunction(),
            this.config.dropCenterAnimation,
            () => {
                // After animation, reset all drag-related styles
                if (!piece.element) return;
                piece.element.style.position = '';
                piece.element.style.left = '';
                piece.element.style.top = '';
                piece.element.style.transform = '';
                piece.element.style.zIndex = '';
                // Remove inline dimensions set during drag
                piece.element.style.width = '';
                piece.element.style.height = '';
                // Remove dragging class
                piece.element.classList.remove('dragging');
                
                // Clean up drag optimizations that might interfere with click
                DragOptimizations.cleanupAfterDrag(piece.element);
            }
        );
    }

    /**
     * Gets the transition timing function for animations
     * @private
     * @returns {Function} Timing function
     */
    _getTransitionTimingFunction() {
        return (elapsed, duration, type = 'ease') => {
            const x = elapsed / duration;

            switch (type) {
                case 'linear':
                    return x;
                case 'ease':
                    return (x ** 2) * (3 - 2 * x);
                case 'ease-in':
                    return x ** 2;
                case 'ease-out':
                    return -1 * (x - 1) ** 2 + 1;
                case 'ease-in-out':
                    return (x < 0.5) ? 2 * x ** 2 : 4 * x - 2 * x ** 2 - 1;
                default:
                    return x;
            }
        };
    }

    /**
     * Cleans up resources
     */
    destroy() {
        // Cleanup any cached pieces or references
    }
}
