/**
 * Event handling service for chessboard interactions
 * @module EventService
 */

import { rafThrottle } from '../utils/performance.js';
import { DRAG_THRESHOLD } from '../core/constants.js';

/**
 * Service for managing chessboard events and interactions
 * @class EventService
 */
export class EventService {
    /**
     * Creates a new EventService
     * @param {object} config - Configuration object
     * @param {object} chessboard - Chessboard instance (gameState)
     * @param {object} animationService - Animation service
     */
    constructor(config, chessboard, animationService) {
        this.config = config;
        this.chessboard = chessboard;
        this.gameState = chessboard; // Keep gameState for backward compatibility
        this.animationService = animationService;
        this.eventListeners = new Map();
    }

    /**
     * Creates drag function for a piece
     * @param {object} square - The square containing the piece
     * @param {object} piece - The piece to drag
     * @returns {Function} Drag event handler
     */
    createDragFunction(square, piece) {
        return (event) => {
            event.preventDefault();

            if (!this.config.draggable || !piece) return;

            const originalFrom = square;
            const img = piece.element;

            if (!this._canMove(originalFrom)) return;

            // Track drag state in an object to maintain references
            const dragState = {
                isDragging: false,
                from: originalFrom,
                to: square,
                prec: null,
                moved: false,
                startX: event.clientX || (event.touches?.[0]?.clientX || 0),
                startY: event.clientY || (event.touches?.[0]?.clientY || 0),
                // Calculate initial offset to keep piece centered where user clicked
                offsetX: 0,
                offsetY: 0
            };

            // Calculate initial offset based on where user clicked relative to piece center
            const rect = img.getBoundingClientRect();
            const clickX = event.clientX || (event.touches?.[0]?.clientX || 0);
            const clickY = event.clientY || (event.touches?.[0]?.clientY || 0);
            dragState.offsetX = clickX - (rect.left + rect.width / 2);
            dragState.offsetY = clickY - (rect.top + rect.height / 2);

            const moveAt = (event) => this._moveAt(event, img, dragState);
            
            const onMouseMove = (event) => {
                this._onMouseMove(event, dragState, originalFrom, piece, img, moveAt);
            };
            
            const onMouseUp = () => {
                this._onMouseUp(dragState, originalFrom, piece, img, onMouseMove);
            };

            // Add event listeners
            window.addEventListener('mouseup', onMouseUp, { once: true });
            document.addEventListener('mousemove', onMouseMove);
            img.addEventListener('mouseup', onMouseUp, { once: true });
        };
    }

    /**
     * Adds event listeners to squares
     * @param {object} squares - All board squares
     * @param {Function} onClickHandler - Click handler function
     */
    addSquareListeners(squares, onClickHandler) {
        for (const squareId in squares) {
            const square = squares[squareId];
            this._addSquareEventListeners(square, onClickHandler);
        }
    }

    /**
     * Adds event listeners to a single square
     * @param {object} square - Square to add listeners to
     * @param {Function} onClickHandler - Click handler function
     * @private
     */
    _addSquareEventListeners(square, onClickHandler) {
        const throttledHintMoves = rafThrottle((e) => {
            if (!this.gameState.clicked && this.config.hints) {
                this.chessboard.hintMoves(square);
            }
        });

        const throttledDehintMoves = rafThrottle((e) => {
            if (!this.gameState.clicked && this.config.hints) {
                this.chessboard.dehintMoves();
            }
        });

        const handleClick = (e) => {
            e.stopPropagation();
            if (this.config.clickable) {
                onClickHandler(square);
            }
        };

        this._addEventListener(square.element, "mouseover", throttledHintMoves);
        this._addEventListener(square.element, "mouseout", throttledDehintMoves);
        this._addEventListener(square.element, "click", handleClick);
        this._addEventListener(square.element, "touch", handleClick);
    }

    /**
     * Handles mouse movement during drag - positions piece under cursor
     * @private
     */
    _moveAt(event, img, dragState) {
        // Get mouse coordinates
        let clientX, clientY;
        if (event.touches?.[0]) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        // Position piece using offset to maintain grab position
        const halfWidth = img.offsetWidth / 2;
        const halfHeight = img.offsetHeight / 2;
        
        img.style.position = 'fixed';
        img.style.left = (clientX - halfWidth - (dragState?.offsetX || 0)) + 'px';
        img.style.top = (clientY - halfHeight - (dragState?.offsetY || 0)) + 'px';
        img.style.zIndex = '1000';
        img.style.pointerEvents = 'none';
        
        return true;
    }

    /**
     * Handles mouse move during drag
     * @private
     */
    _onMouseMove(event, dragState, originalFrom, piece, img, moveAt) {
        // Check if mouse has moved enough to be considered a drag
        const currentX = event.clientX || (event.touches?.[0]?.clientX || 0);
        const currentY = event.clientY || (event.touches?.[0]?.clientY || 0);
        const deltaX = Math.abs(currentX - dragState.startX);
        const deltaY = Math.abs(currentY - dragState.startY);
        
        // Only start dragging if mouse moved more than threshold
        if (!dragState.isDragging && (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD)) {
            dragState.isDragging = true;
            
            // Call onDragStart only once when drag starts
            if (!this.config.onDragStart(dragState.from, piece)) {
                dragState.isDragging = false;
                return;
            }
            
            this._startDrag(dragState.from, originalFrom, piece, img);
        }
        
        if (!dragState.isDragging) return;
        
        // Move the piece visually
        if (!moveAt(event)) return;

        const newTo = this._getSquareFromMousePosition(event);
        
        // Only update if target square changed
        if (newTo !== dragState.to) {
            dragState.to = newTo;
            this.config.onDragMove(dragState.from, dragState.to, piece);
            this._updateDragHighlight(dragState.to, dragState.prec);
            dragState.prec = dragState.to;
        }
    }

    /**
     * Handles mouse up (drop)
     * @private
     */
    _onMouseUp(dragState, originalFrom, piece, img, onMouseMove) {
        if (dragState.prec) {
            dragState.prec.dehighlight();
        }
        
        document.removeEventListener('mousemove', onMouseMove);
        
        if (!dragState.isDragging) {
            return; // Was just a click, not a drag
        }
        
        // Reset drag visuals first
        this.animationService.resetDragVisuals(img);
        
        // Clear any selection state
        this.gameState.clicked = null;
        
        // Handle the drop result
        this._handleDropResult(originalFrom, dragState.to, piece);
    }

    /**
     * Starts drag operation
     * @private
     */
    _startDrag(from, originalFrom, piece, img) {
        if (!this.config.clickable) {
            this.gameState.clicked = null;
            this.gameState.clicked = from;
        } else if (!this.gameState.clicked) {
            this.gameState.clicked = from;
        }
        
        // Highlight source square and show hints
        if (this.config.clickable) {
            from.select();
            this.chessboard.hintMoves(from);
        }

        this.animationService.setupDragVisuals(img);
    }

    /**
     * Gets square from mouse position
     * @private
     */
    _getSquareFromMousePosition(event) {
        const boardElement = this.gameState.element;
        const boardRect = boardElement.getBoundingClientRect();
        const { offsetWidth: boardWidth, offsetHeight: boardHeight } = boardElement;
        const x = event.clientX - boardRect.left;
        const y = event.clientY - boardRect.top;

        if (x >= 0 && x <= boardWidth && y >= 0 && y <= boardHeight) {
            let col = Math.floor(x / (boardWidth / 8)); // 0-7
            let row = Math.floor(y / (boardHeight / 8)); // 0-7
            
            // Adjust for board orientation
            if (this.config.orientation === 'b') {
                col = 7 - col;
                row = 7 - row;
            }
            
            // Convert to square coordinates (row 0 = rank 8, row 7 = rank 1)
            const file = String.fromCharCode(97 + col); // a-h
            const rank = 8 - row; // 8-1
            const squareId = file + rank;
            
            return this.gameState.squares[squareId];
        }
        return null;
    }

    /**
     * Updates highlight during drag
     * @private
     */
    _updateDragHighlight(to, prec) {
        if (to !== prec) {
            to?.highlight();
            prec?.dehighlight();
        }
    }

    /**
     * Handles drop result
     * @private
     */
    _handleDropResult(originalFrom, to, piece) {
        console.log('Drop result: from=', originalFrom?.getId(), 'to=', to?.getId(), 'piece=', piece?.getId());
        
        const dropResult = this.config.onDrop(originalFrom, to, piece);
        console.log('onDrop returned:', dropResult);
        
        const isTrashDrop = !to && (this.config.dropOffBoard === 'trash' || dropResult === 'trash');

        if (isTrashDrop) {
            this._handleTrashDrop(originalFrom);
        } else if (!to || dropResult === 'snapback') {
            console.log('Snapback triggered');
            this._handleSnapback(originalFrom, piece);
        } else if (dropResult !== 'snapback') {
            console.log('Attempting move');
            const success = this._handleMove(originalFrom, to);
            console.log('Move success:', success);
            if (!success) {
                console.log('Move failed, snapback');
                this._handleSnapback(originalFrom, piece);
            }
        }
    }

    /**
     * Handles trash drop
     * @private
     */
    _handleTrashDrop(originalFrom) {
        this.gameState.allSquares("unmoved");
        this.gameState.dehintMoves();
        originalFrom.deselect();
        this.gameState.remove(originalFrom.getId());
    }

    /**
     * Handles snapback
     * @private
     */
    _handleSnapback(originalFrom, piece) {
        if (originalFrom?.piece) {
            this.gameState.snapbackPiece(originalFrom);
        }
    }

    /**
     * Handles move execution
     * @private
     */
    _handleMove(originalFrom, to) {
        this.gameState.clicked = originalFrom;
        const success = this.gameState.onClick(to, true, true);
        return success;
    }

    /**
     * Checks if a piece can move
     * @private
     */
    _canMove(square) {
        return this.gameState.canMove(square);
    }

    /**
     * Adds event listener with tracking
     * @private
     */
    _addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, []);
        }
        this.eventListeners.get(element).push({ event, handler });
    }

    /**
     * Removes all event listeners
     */
    removeAllEventListeners() {
        for (const [element, listeners] of this.eventListeners) {
            listeners.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler);
            });
        }
        this.eventListeners.clear();
    }
}
