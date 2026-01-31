/**
 * Service for managing events and user interactions
 * Refactored for simplicity and reliability
 * @module services/EventService
 * @since 2.0.0
 */

import { DragOptimizations } from '../utils/cross-browser.js';
import Move from '../components/Move.js';

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

    // State - keep it minimal
    this.selectedSquare = null; // Currently selected square (for click-to-move)
    this.isDragging = false;
    this.isProcessing = false; // Prevents multiple simultaneous operations

    this.eventListeners = new Map();
  }

  /**
   * Adds event listeners to all squares
   */
  addListeners(onSquareClick, onPieceHover, onPieceLeave) {
    this.removeListeners();

    const squares = this.boardService.getAllSquares();
    Object.values(squares).forEach((square) => {
      this._addSquareListeners(square, onSquareClick, onPieceHover, onPieceLeave);
    });
  }

  /**
   * Adds event listeners to a specific square
   * @private
   */
  _addSquareListeners(square, onSquareClick, onPieceHover, onPieceLeave) {
    const listeners = [];

    // Hover - only show hints for the hovered square's piece
    const handleMouseEnter = () => {
      if (!this.selectedSquare && this.config.hints && square.piece) {
        onPieceHover(square);
      }
    };

    const handleMouseLeave = () => {
      if (!this.selectedSquare && this.config.hints) {
        onPieceLeave(square);
      }
    };

    // Click handler - simple and direct
    const handleClick = (e) => {
      e.stopPropagation();
      if (this.config.clickable && !this.isProcessing && !this.isDragging) {
        onSquareClick(square);
      }
    };

    // Add listeners
    square.element.addEventListener('mouseenter', handleMouseEnter);
    square.element.addEventListener('mouseleave', handleMouseLeave);
    square.element.addEventListener('click', handleClick);

    listeners.push(
      { element: square.element, type: 'mouseenter', handler: handleMouseEnter },
      { element: square.element, type: 'mouseleave', handler: handleMouseLeave },
      { element: square.element, type: 'click', handler: handleClick }
    );

    this.eventListeners.set(square.id, listeners);
  }

  /**
   * Creates a drag function for a piece
   */
  createDragFunction(square, piece, onDragStart, onDragMove, onDrop, onSnapback, onMove, onRemove) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!this.config.draggable || !piece || this.isProcessing || this.isDragging) {
        return;
      }

      if (!this.moveService.canMove(square)) {
        return;
      }

      const img = piece.element;
      const startX = event.clientX || event.touches?.[0]?.clientX || 0;
      const startY = event.clientY || event.touches?.[0]?.clientY || 0;
      let hasMoved = false;
      let targetSquare = null;
      let lastHighlighted = null;

      const moveAt = (clientX, clientY) => {
        const boardElement = this.boardService.element;
        const boardRect = boardElement.getBoundingClientRect();
        const squareSize = boardRect.width / 8;

        const x = clientX - boardRect.left - squareSize / 2;
        const y = clientY - boardRect.top - squareSize / 2;

        img.style.left = `${x}px`;
        img.style.top = `${y}px`;

        // Determine target square
        const relX = clientX - boardRect.left;
        const relY = clientY - boardRect.top;

        if (relX >= 0 && relX <= boardRect.width && relY >= 0 && relY <= boardRect.height) {
          const squareId = this.coordinateService.pixelToSquareID(relX, relY, boardElement);
          targetSquare = squareId ? this.boardService.getSquare(squareId) : null;
        } else {
          targetSquare = null;
        }

        // Update highlight
        if (targetSquare !== lastHighlighted) {
          lastHighlighted?.dehighlight();
          targetSquare?.highlight();
          lastHighlighted = targetSquare;
        }
      };

      const onMouseMove = (e) => {
        const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
        const clientY = e.clientY || e.touches?.[0]?.clientY || 0;

        // Start dragging after threshold
        if (!hasMoved) {
          const dx = Math.abs(clientX - startX);
          const dy = Math.abs(clientY - startY);

          if (dx > 3 || dy > 3) {
            hasMoved = true;
            this.isDragging = true;

            // Visual feedback
            square.select();

            // Prepare piece for dragging
            const style = window.getComputedStyle(img);
            img.style.position = 'absolute';
            img.style.zIndex = '100';
            img.style.width = style.width;
            img.style.height = style.height;
            img.classList.add('dragging');

            DragOptimizations.enableForDrag(img);
            onDragStart(square, piece);
          }
        }

        if (hasMoved) {
          moveAt(clientX, clientY);
          onDragMove(square, targetSquare, piece);
        }
      };

      const onMouseUp = () => {
        // Cleanup listeners
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('touchmove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchend', onMouseUp);

        lastHighlighted?.dehighlight();

        if (!hasMoved) {
          this.isDragging = false;
          return; // Was just a click, let click handler deal with it
        }

        // Don't reset styles here - let PieceService.translatePiece handle it
        // when it detects the piece is dragging. This ensures proper style cleanup
        // after the piece is moved to its new position.

        this.isDragging = false;

        // Handle drop
        const dropResult = onDrop(square, targetSquare, piece);

        if (!targetSquare) {
          // Dropped outside board - reset all styles immediately
          img.classList.remove('dragging');
          img.style.zIndex = '';
          img.style.willChange = 'auto';
          DragOptimizations.cleanupAfterDrag(img);

          if (this.config.dropOffBoard === 'trash' || dropResult === 'trash') {
            this._resetPiecePosition(img);
            onRemove(square);
          } else {
            this._resetPiecePosition(img);
            onSnapback(square, piece);
          }
          square.deselect();
          this.boardService.applyToAllSquares('removeHint');
          return;
        }

        // Try to make the move - PieceService will handle style cleanup
        this._handleMove(square, targetSquare, piece, onMove, onSnapback);
      };

      // Attach listeners
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onMouseMove, { passive: false });
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchend', onMouseUp);
    };
  }

  /**
   * Resets piece position after failed drag
   * @private
   */
  _resetPiecePosition(img) {
    if (!img) return;
    img.style.position = '';
    img.style.left = '';
    img.style.top = '';
    img.style.transform = '';
    img.style.width = '';
    img.style.height = '';
    img.style.zIndex = '';
    img.classList.remove('dragging');
    DragOptimizations.cleanupAfterDrag(img);
  }

  /**
   * Handles a move attempt (from drag or click)
   * @private
   */
  _handleMove(fromSquare, toSquare, piece, onMove, onSnapback) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const cleanup = () => {
      this.isProcessing = false;
      this.selectedSquare = null;
      fromSquare.deselect();
      this.boardService.applyToAllSquares('removeHint');
    };

    // Check if promotion is needed
    const move = new Move(fromSquare, toSquare);
    if (this.moveService.requiresPromotion(move)) {
      this._handlePromotion(fromSquare, toSquare, piece, onMove, onSnapback, cleanup);
      return;
    }

    // Try normal move
    const success = onMove(fromSquare, toSquare, null, true);

    if (success) {
      cleanup();
    } else {
      // Move failed - snapback
      this._resetPiecePosition(piece.element);
      onSnapback(fromSquare, piece);
      cleanup();
    }
  }

  /**
   * Handles promotion move
   * @private
   */
  _handlePromotion(fromSquare, toSquare, piece, onMove, onSnapback, cleanup) {
    // Reset piece position first - clear all drag styles so piece appears at fromSquare
    if (piece && piece.element) {
      this._resetPiecePosition(piece.element);
    }

    // Show promotion UI
    this.moveService.setupPromotion(
      new Move(fromSquare, toSquare),
      this.boardService.squares,
      (selectedPiece) => {
        // Promotion selected - remove UI
        this.boardService.applyToAllSquares('removePromotion');
        this.boardService.applyToAllSquares('removeCover');

        // Execute move with animate=false to bypass translatePiece complexity
        // This directly calls _updateBoardPieces which:
        // - Removes pawn from fromSquare (e7)
        // - Adds promoted piece to toSquare (e8)
        const success = onMove(fromSquare, toSquare, selectedPiece, false);

        if (!success) {
          onSnapback(fromSquare, piece);
        }
        cleanup();
      },
      () => {
        // Promotion cancelled
        this.boardService.applyToAllSquares('removePromotion');
        this.boardService.applyToAllSquares('removeCover');
        onSnapback(fromSquare, piece);
        cleanup();
      }
    );
  }

  /**
   * Handles square click events
   */
  onClick(square, onMove, onSelect, onDeselect, animate = true) {
    if (this.isProcessing || this.isDragging) {
      return false;
    }

    // Case 1: No square selected yet
    if (!this.selectedSquare) {
      if (this.moveService.canMove(square)) {
        this.selectedSquare = square;
        onSelect(square);
      }
      return false;
    }

    // Case 2: Clicking the same square - deselect
    if (this.selectedSquare === square) {
      onDeselect(square);
      this.selectedSquare = null;
      return false;
    }

    // Case 3: Try to make a move
    const from = this.selectedSquare;
    const move = new Move(from, square);

    // Check for promotion
    if (this.moveService.requiresPromotion(move)) {
      this._handlePromotion(
        from,
        square,
        from.piece,
        onMove,
        () => {}, // No snapback needed for click moves
        () => {
          onDeselect(from);
          this.selectedSquare = null;
        }
      );
      return false;
    }

    // Try normal move
    const success = onMove(from, square, null, animate);

    if (success) {
      onDeselect(from);
      this.selectedSquare = null;
      return true;
    }

    // Move failed - try to select the new square instead
    onDeselect(from);
    this.selectedSquare = null;
    this.boardService.applyToAllSquares('removeHint');

    if (this.moveService.canMove(square)) {
      this.selectedSquare = square;
      onSelect(square);
    }

    return false;
  }

  // State management
  setClicked(square) {
    this.selectedSquare = square;
  }

  getClicked() {
    return this.selectedSquare;
  }

  setPromoting(_promotion) {
    // Kept for compatibility but not used in refactored version
  }

  getPromoting() {
    return false;
  }

  setAnimating(_isAnimating) {
    // Kept for compatibility
  }

  getAnimating() {
    return this.isProcessing;
  }

  /**
   * Removes all event listeners
   */
  removeListeners() {
    this.eventListeners.forEach((listeners) => {
      listeners.forEach(({ element, type, handler }) => {
        element.removeEventListener(type, handler);
      });
    });
    this.eventListeners.clear();
  }

  removeAllListeners() {
    this.removeListeners();
  }

  /**
   * Cleans up resources
   */
  destroy() {
    this.removeAllListeners();
    this.selectedSquare = null;
    this.isDragging = false;
    this.isProcessing = false;
  }
}
