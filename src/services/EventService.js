/**
 * Service for managing events and user interactions
 * @module services/EventService
 * @since 2.0.0
 */

import { rafThrottle } from '../utils/performance.js';
import { DragOptimizations } from '../utils/cross-browser.js';
import { ValidationError } from '../errors/ChessboardError.js';
import Move from '../components/Move.js';
import Piece from '../components/Piece.js';

/**
 * Service responsible for event handling and user interactions
 * @class
 */
export class EventService {
    /**
     * Creates a new EventService instance
     * @param {ChessboardConfig} config - Board configuration
     * @param {BoardService} boardService - Board service instance
     * @param {MoveService} moveService - Move service instance
     * @param {CoordinateService} coordinateService - Coordinate service instance
     * @param {Chessboard} chessboard - Chessboard instance
     */
    constructor(config, boardService, moveService, coordinateService, chessboard) {
        this.config = config;
        this.boardService = boardService;
        this.moveService = moveService;
        this.coordinateService = coordinateService;
        this.chessboard = chessboard;

        // State management
        this.clicked = null;
        this.promoting = false;
        this.isAnimating = false;

        // Event listeners storage for cleanup
        this.eventListeners = new Map();
    }

    /**
     * Adds event listeners to all squares
     * @param {Function} onSquareClick - Callback for square clicks
     * @param {Function} onPieceHover - Callback for piece hover
     * @param {Function} onPieceLeave - Callback for piece leave
     */
    addListeners(onSquareClick, onPieceHover, onPieceLeave) {
        // Remove existing listeners to avoid duplicates
        this.removeListeners();

        const squares = this.boardService.getAllSquares();

        Object.values(squares).forEach(square => {
            this._addSquareListeners(square, onSquareClick, onPieceHover, onPieceLeave);
        });
    }

    /**
     * Adds event listeners to a specific square
     * @private
     * @param {Square} square - Square to add listeners to
     * @param {Function} onSquareClick - Click callback
     * @param {Function} onPieceHover - Hover callback
     * @param {Function} onPieceLeave - Leave callback
     */
    _addSquareListeners(square, onSquareClick, onPieceHover, onPieceLeave) {
        const listeners = [];

        // Throttled hover handlers for performance
        const throttledHover = rafThrottle((e) => {
            if (!this.clicked && this.config.hints) {
                onPieceHover(square);
            }
        });

        const throttledLeave = rafThrottle((e) => {
            if (!this.clicked && this.config.hints) {
                onPieceLeave(square);
            }
        });

        // Click handler
        const handleClick = (e) => {
            e.stopPropagation();
            if (this.config.clickable && !this.isAnimating) {
                onSquareClick(square);
            }
        };

        // Add listeners
        square.element.addEventListener('mouseover', throttledHover);
        square.element.addEventListener('mouseout', throttledLeave);
        square.element.addEventListener('click', handleClick);
        square.element.addEventListener('touchstart', handleClick);

        // Store listeners for cleanup
        listeners.push(
            { element: square.element, type: 'mouseover', handler: throttledHover },
            { element: square.element, type: 'mouseout', handler: throttledLeave },
            { element: square.element, type: 'click', handler: handleClick },
            { element: square.element, type: 'touchstart', handler: handleClick }
        );

        this.eventListeners.set(square.id, listeners);
    }

    /**
     * Creates a drag function for a piece
     * @param {Square} square - Square containing the piece
     * @param {Piece} piece - Piece to create drag function for
     * @param {Function} onDragStart - Drag start callback
     * @param {Function} onDragMove - Drag move callback
     * @param {Function} onDrop - Drop callback
     * @param {Function} onSnapback - Snapback callback
     * @param {Function} onMove - Move execution callback
     * @param {Function} onRemove - Remove piece callback
     * @returns {Function} Drag event handler
     */
    createDragFunction(square, piece, onDragStart, onDragMove, onDrop, onSnapback, onMove, onRemove) {
        return (event) => {
            event.preventDefault();

            if (!this.config.draggable || !piece || this.isAnimating) {
                return;
            }

            const originalFrom = square;
            let isDragging = false;
            let from = originalFrom;
            let to = square;
            let previousHighlight = null;

            const img = piece.element;

            if (!this.moveService.canMove(from)) {
                return;
            }

            // Track initial position for drag threshold
            const startX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
            const startY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;

            const moveAt = (event) => {
                const boardElement = this.boardService.element;
                const squareSize = boardElement.offsetWidth / 8;

                // Get mouse coordinates
                let clientX, clientY;
                if (event.touches && event.touches[0]) {
                    clientX = event.touches[0].clientX;
                    clientY = event.touches[0].clientY;
                } else {
                    clientX = event.clientX;
                    clientY = event.clientY;
                }

                // Calculate position relative to board
                const boardRect = boardElement.getBoundingClientRect();
                const x = clientX - boardRect.left - (squareSize / 2);
                const y = clientY - boardRect.top - (squareSize / 2);

                img.style.left = x + 'px';
                img.style.top = y + 'px';

                return true;
            };

            const onMouseMove = (event) => {
                const currentX = event.clientX || 0;
                const currentY = event.clientY || 0;
                const deltaX = Math.abs(currentX - startX);
                const deltaY = Math.abs(currentY - startY);

                // Start dragging if mouse moved enough
                if (!isDragging && (deltaX > 3 || deltaY > 3)) {
                    isDragging = true;

                    // Set up drag state
                    if (!this.config.clickable) {
                        this.clicked = null;
                        this.clicked = from;
                    } else if (!this.clicked) {
                        this.clicked = from;
                    }

                    // Visual feedback
                    if (this.config.clickable) {
                        from.select();
                        // Show hints would be handled by the main class
                    }

                    // Prepare piece for dragging
                    img.style.position = 'absolute';
                    img.style.zIndex = '100';
                    img.classList.add('dragging');

                    DragOptimizations.enableForDrag(img);

                    // Call drag start callback
                    if (!onDragStart(square, piece)) {
                        return;
                    }
                }

                if (!isDragging) return;

                if (!moveAt(event)) return;

                // Update target square
                const boardElement = this.boardService.element;
                const boardRect = boardElement.getBoundingClientRect();
                const x = event.clientX - boardRect.left;
                const y = event.clientY - boardRect.top;

                let newTo = null;
                if (x >= 0 && x <= boardRect.width && y >= 0 && y <= boardRect.height) {
                    const squareId = this.coordinateService.pixelToSquareID(x, y, boardElement);
                    newTo = squareId ? this.boardService.getSquare(squareId) : null;
                }

                to = newTo;
                onDragMove(from, to, piece);

                // Update visual feedback
                if (to !== previousHighlight) {
                    to?.highlight();
                    previousHighlight?.dehighlight();
                    previousHighlight = to;
                }
            };

            const onMouseUp = () => {
                // Clean up visual feedback
                previousHighlight?.dehighlight();
                document.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);

                // If this was just a click, don't interfere
                if (!isDragging) {
                    return;
                }

                // Clean up drag state
                img.style.zIndex = '20';
                img.classList.remove('dragging');
                img.style.willChange = 'auto';

                // Handle drop
                const dropResult = onDrop(originalFrom, to, piece);
                const isTrashDrop = !to && (this.config.dropOffBoard === 'trash' || dropResult === 'trash');

                if (isTrashDrop) {
                    this._handleTrashDrop(originalFrom, onRemove);
                } else if (!to) {
                    // Reset piece position instantly for snapback
                    img.style.position = '';
                    img.style.left = '';
                    img.style.top = '';
                    img.style.transform = '';

                    this._handleSnapback(originalFrom, piece, onSnapback);
                } else {
                    // Handle drop like a click - simple and reliable
                    this._handleDrop(originalFrom, to, piece, onMove, onSnapback);
                }
            };

            // Attach event listeners
            window.addEventListener('mouseup', onMouseUp, { once: true });
            document.addEventListener('mousemove', onMouseMove);
            img.addEventListener('mouseup', onMouseUp, { once: true });
        };
    }

    /**
     * Handles trash drop (piece removal)
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Function} onRemove - Callback to remove piece
     */
    _handleTrashDrop(fromSquare, onRemove) {
        this.boardService.applyToAllSquares('unmoved');
        this.boardService.applyToAllSquares('removeHint');
        fromSquare.deselect();

        if (onRemove) {
            onRemove(fromSquare.getId());
        }
    }

    /**
     * Handles snapback animation
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Piece} piece - Piece to snapback
     * @param {Function} onSnapback - Snapback callback
     */
    _handleSnapback(fromSquare, piece, onSnapback) {
        if (fromSquare && fromSquare.piece) {
            if (onSnapback) {
                onSnapback(fromSquare, piece);
            }
        }
    }

    /**
     * Handles successful drop
     * @private
     * @param {Square} fromSquare - Source square
     * @param {Square} toSquare - Target square
     * @param {Piece} piece - Piece being dropped
     * @param {Function} onMove - Move callback
     * @param {Function} onSnapback - Snapback callback
     */
    _handleDrop(fromSquare, toSquare, piece, onMove, onSnapback) {
        this.clicked = fromSquare;

        // Check if move requires promotion
        if (this.moveService.requiresPromotion(new Move(fromSquare, toSquare))) {
            console.log('Drag move requires promotion:', fromSquare.id, '->', toSquare.id);

            // Set up promotion UI - use the same logic as click
            this.moveService.setupPromotion(
                new Move(fromSquare, toSquare),
                this.boardService.squares,
                (selectedPromotion) => {
                    console.log('Drag promotion selected:', selectedPromotion);

                    // Clear promotion UI first
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');

                    // Execute the move with promotion
                    const moveResult = onMove(fromSquare, toSquare, selectedPromotion, true);

                    if (moveResult) {
                        // After a successful promotion move, we need to replace the piece
                        // after the drop animation completes
                        this._schedulePromotionPieceReplacement(toSquare, selectedPromotion);

                        this.clicked = null;
                    } else {
                        // Move failed - snapback
                        this._handleSnapback(fromSquare, piece, onSnapback);
                    }
                },
                () => {
                    console.log('Drag promotion cancelled');

                    // Clear promotion UI on cancel
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');

                    // Snapback the piece
                    this._handleSnapback(fromSquare, piece, onSnapback);
                }
            );
        } else {
            // Regular move - no promotion needed
            const moveSuccess = onMove(fromSquare, toSquare, null, true);

            if (moveSuccess) {
                // Move successful - reset clicked state
                this.clicked = null;
            } else {
                // Move failed - snapback
                this._handleSnapback(fromSquare, piece, onSnapback);
            }
        }
    }

    /**
     * Animates piece to center of target square (visual only)
     * @private
     * @param {Piece} piece - Piece to animate
     * @param {Square} targetSquare - Target square
     * @param {Function} callback - Callback when animation completes
     */
    _animatePieceToCenter(piece, targetSquare, callback = null) {
        if (!piece || !targetSquare) {
            if (callback) callback();
            return;
        }

        const duration = this.config.dropCenterTime;

        // Get current position of piece element
        const sourceRect = piece.element.getBoundingClientRect();
        const targetRect = targetSquare.element.getBoundingClientRect();

        const x_start = sourceRect.left + sourceRect.width / 2;
        const y_start = sourceRect.top + sourceRect.height / 2;
        const x_end = targetRect.left + targetRect.width / 2;
        const y_end = targetRect.top + targetRect.height / 2;
        const dx = x_end - x_start;
        const dy = y_end - y_start;

        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
            // Already centered, just reset styles
            piece.element.style.position = '';
            piece.element.style.left = '';
            piece.element.style.top = '';
            piece.element.style.transform = '';
            piece.element.style.zIndex = '';
            if (callback) callback();
            return;
        }

        const keyframes = [
            { transform: 'translate(0, 0)' },
            { transform: `translate(${dx}px, ${dy}px)` }
        ];

        if (piece.element.animate) {
            const animation = piece.element.animate(keyframes, {
                duration: duration,
                easing: 'ease',
                fill: 'none'  // Don't keep the final position
            });

            animation.onfinish = () => {
                // Defensive: check if element still exists
                if (!piece.element) {
                    if (callback) callback();
                    return;
                }
                // Reset all drag-related styles to let default CSS handle positioning
                piece.element.style.position = '';
                piece.element.style.left = '';
                piece.element.style.top = '';
                piece.element.style.transform = '';
                piece.element.style.zIndex = '';
                piece.element.style.transition = '';

                if (callback) callback();
            };
        } else {
            // Fallback for browsers without Web Animations API
            piece.element.style.transition = `transform ${duration}ms ease`;
            piece.element.style.transform = `translate(${dx}px, ${dy}px)`;

            setTimeout(() => {
                // Defensive: check if element still exists
                if (!piece.element) {
                    if (callback) callback();
                    return;
                }
                // After animation, reset ALL positioning styles and let CSS handle centering
                piece.element.style.position = 'relative';
                piece.element.style.left = '0';
                piece.element.style.top = '0';
                piece.element.style.transform = 'translate(-50%, -50%)';
                piece.element.style.zIndex = '20';
                piece.element.style.transition = 'none';

                if (callback) callback();
            }, duration);
        }
    }

    /**
     * Handles square click events
     * @param {Square} square - Clicked square
     * @param {Function} onMove - Move callback
     * @param {Function} onSelect - Select callback
     * @param {Function} onDeselect - Deselect callback
     * @param {boolean} [animate=true] - Whether to animate the move
     * @param {boolean} [dragged=false] - Whether this was triggered by drag
     * @returns {boolean} True if move was successful
     */
    onClick(square, onMove, onSelect, onDeselect, animate = true, dragged = false) {
        console.log('EventService.onClick: square =', square.id, 'clicked =', this.clicked?.id || 'none');

        let from = this.clicked;
        let promotion = null;

        // Handle promotion state
        if (this.promoting) {
            if (this.promoting === 'none') {
                from = null;
            } else {
                promotion = this.promoting;
            }

            this.promoting = false;
            this.boardService.applyToAllSquares('removePromotion');
            this.boardService.applyToAllSquares('removeCover');
        }

        // No source square selected
        if (!from) {
            if (this.moveService.canMove(square)) {
                if (this.config.clickable) {
                    onSelect(square);
                }
                this.clicked = square;
                return false;
            } else {
                return false;
            }
        }

        // Clicking same square - deselect
        if (this.clicked === square) {
            onDeselect(square);
            this.clicked = null;
            return false;
        }

        // Check if move requires promotion
        if (!promotion && this.moveService.requiresPromotion(new Move(from, square))) {
            console.log('Move requires promotion:', from.id, '->', square.id);

            // Set up promotion UI
            this.moveService.setupPromotion(
                new Move(from, square),
                this.boardService.squares,
                (selectedPromotion) => {
                    console.log('Promotion selected:', selectedPromotion);

                    // Clear promotion UI first
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');

                    // Execute the move with promotion
                    const moveResult = onMove(from, square, selectedPromotion, animate);

                    if (moveResult) {
                        // After a successful promotion move, we need to replace the piece
                        // after the drop animation completes
                        this._schedulePromotionPieceReplacement(square, selectedPromotion);

                        onDeselect(from);
                        this.clicked = null;
                    }
                },
                () => {
                    console.log('Promotion cancelled');

                    // Clear promotion UI on cancel
                    this.boardService.applyToAllSquares('removePromotion');
                    this.boardService.applyToAllSquares('removeCover');

                    onDeselect(from);
                    this.clicked = null;
                }
            );
            return false;
        }

        // Attempt to make move
        const moveResult = onMove(from, square, promotion, animate);

        if (moveResult) {
            // Move successful
            onDeselect(from);
            this.clicked = null;
            return true;
        } else {
            // Move failed - check if clicked square has a piece we can move
            if (this.moveService.canMove(square)) {
                // Deselect the previous piece
                onDeselect(from);

                // Select the new piece if clicking is enabled
                if (this.config.clickable) {
                    onSelect(square);
                }

                // Set the new piece as clicked
                this.clicked = square;
                return false;
            } else {
                // Move failed and no valid piece to select
                onDeselect(from);
                this.clicked = null;
                return false;
            }
        }
    }

    /**
     * Schedules piece replacement after promotion animation
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     */
    _schedulePromotionPieceReplacement(square, promotionPiece) {
        // Mark that we're doing a promotion to prevent interference
        this.chessboard._isPromoting = true;

        // Use a more robust approach: poll for the piece to be present
        this._waitForPieceAndReplace(square, promotionPiece, 0);
    }

    /**
     * Waits for piece to be present and then replaces it
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     * @param {number} attempt - Current attempt number
     */
    _waitForPieceAndReplace(square, promotionPiece, attempt) {
        const maxAttempts = 20; // Maximum 1 second of waiting (20 * 50ms)
        const targetSquare = this.boardService.getSquare(square.id);

        if (!targetSquare) {
            console.warn('Target square not found:', square.id);
            this.chessboard._isPromoting = false;
            return;
        }

        // Check if piece is present and ready
        if (targetSquare.piece && targetSquare.piece.element) {
            console.log('Piece found on', square.id, 'after', attempt, 'attempts');
            this._replacePromotionPiece(square, promotionPiece);

            // Allow normal updates again after transformation
            setTimeout(() => {
                this.chessboard._isPromoting = false;
                console.log('Promotion protection ended');
                // Force a board update to ensure everything is correctly synchronized
                this.chessboard._updateBoardPieces(false);
            }, 400); // Wait for transformation animation to complete

            return;
        }

        // If piece not found and we haven't exceeded max attempts, try again
        if (attempt < maxAttempts) {
            setTimeout(() => {
                this._waitForPieceAndReplace(square, promotionPiece, attempt + 1);
            }, 50);
        } else {
            console.warn('Failed to find piece for promotion after', maxAttempts, 'attempts');
            this.chessboard._isPromoting = false;

            // Force a board update to recover from the failed promotion
            this.chessboard._updateBoardPieces(false);
        }
    }

    /**
     * Replaces the piece on the square with the promotion piece
     * @private
     * @param {Square} square - Target square
     * @param {string} promotionPiece - Piece to promote to
     */
    _replacePromotionPiece(square, promotionPiece) {
        console.log('Replacing piece on', square.id, 'with', promotionPiece);

        // Get the target square from the board service
        const targetSquare = this.boardService.getSquare(square.id);
        if (!targetSquare) {
            console.log('Target square not found:', square.id);
            return;
        }

        // Get the game state to determine the correct piece color
        const gameState = this.chessboard.positionService.getGame();
        const gamePiece = gameState.get(targetSquare.id);

        if (!gamePiece) {
            console.log('No piece found in game state for', targetSquare.id);
            return;
        }

        // Get the current piece on the square
        const currentPiece = targetSquare.piece;

        if (!currentPiece) {
            console.warn('No piece found on target square for promotion');

            // Try to recover by creating a new piece
            const pieceId = promotionPiece + gamePiece.color;
            const piecePath = this.chessboard.pieceService.getPiecePath(pieceId);

            const newPiece = new Piece(
                gamePiece.color,
                promotionPiece,
                piecePath
            );

            // Place the new piece on the square
            targetSquare.putPiece(newPiece);

            // Set up drag functionality
            const dragFunction = this.chessboard._createDragFunction.bind(this.chessboard);
            newPiece.setDrag(dragFunction(targetSquare, newPiece));

            console.log('Created new promotion piece:', pieceId, 'on', targetSquare.id);
            return;
        }

        // Create the piece ID and get the path
        const pieceId = promotionPiece + gamePiece.color;
        const piecePath = this.chessboard.pieceService.getPiecePath(pieceId);

        console.log('Transforming piece to:', pieceId, 'with path:', piecePath);

        // Use the new smooth transformation animation
        currentPiece.transformTo(
            promotionPiece,
            piecePath,
            300, // Duration of the transformation animation
            () => {
                // After transformation, set up drag functionality
                const dragFunction = this.chessboard._createDragFunction.bind(this.chessboard);
                currentPiece.setDrag(dragFunction(targetSquare, currentPiece));

                // Ensure hints are properly updated after promotion
                if (this.config.hints && this.chessboard.moveService) {
                    setTimeout(() => {
                        this.chessboard.moveService.clearCache();
                    }, 100);
                }

                console.log('Successfully transformed piece on', targetSquare.id, 'to', pieceId);
            }
        );
    }

    /**
     * Sets the clicked square
     * @param {Square|null} square - Square to set as clicked
     */
    setClicked(square) {
        this.clicked = square;
    }

    /**
     * Gets the currently clicked square
     * @returns {Square|null} Currently clicked square
     */
    getClicked() {
        return this.clicked;
    }

    /**
     * Sets the promotion state
     * @param {string|boolean} promotion - Promotion piece type or false
     */
    setPromoting(promotion) {
        this.promoting = promotion;
    }

    /**
     * Gets the promotion state
     * @returns {string|boolean} Current promotion state
     */
    getPromoting() {
        return this.promoting;
    }

    /**
     * Sets the animation state
     * @param {boolean} isAnimating - Whether animations are in progress
     */
    setAnimating(isAnimating) {
        this.isAnimating = isAnimating;
    }

    /**
     * Gets the animation state
     * @returns {boolean} Whether animations are in progress
     */
    getAnimating() {
        return this.isAnimating;
    }

    /**
     * Removes all existing event listeners
     */
    removeListeners() {
        this.eventListeners.forEach((listeners, squareId) => {
            listeners.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
        });

        this.eventListeners.clear();
    }

    /**
     * Removes all event listeners
     */
    removeAllListeners() {
        this.eventListeners.forEach((listeners, squareId) => {
            listeners.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
        });

        this.eventListeners.clear();
    }

    /**
     * Cleans up resources
     */
    destroy() {
        this.removeAllListeners();
        this.clicked = null;
        this.promoting = false;
        this.isAnimating = false;
    }
}
