/**
 * Service for managing events and user interactions
 * @module services/EventService
 * @since 2.0.0
 */

import { rafThrottle } from '../utils/performance.js';
import { DragOptimizations } from '../utils/cross-browser.js';
import Move from '../components/Move.js';
import Piece from '../components/Piece.js';
import { logger } from '../utils/logger.js';

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

    this.clicked = null;
    this.isDragging = false;
    this.isAnimating = false;
    this.promoting = false;
    this._isProcessingDrop = false;

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

    Object.values(squares).forEach((square) => {
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
    const throttledHover = rafThrottle(() => {
      if (!this.clicked && this.config.hints) {
        onPieceHover(square);
      }
    });

    const throttledLeave = rafThrottle(() => {
      if (!this.clicked && this.config.hints) {
        onPieceLeave(square);
      }
    });

    // Click handler
    const handleClick = (e) => {
      e.stopPropagation();
      if (this.config.clickable && !this.isAnimating) {
        // Cancel any pending drag operations on pieces in this square
        if (square.piece && square.piece._dragTimeout) {
          clearTimeout(square.piece._dragTimeout);
          square.piece._dragTimeout = null;
        }
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
    console.log(
      'Creating drag function for:',
      square.id,
      piece ? `${piece.color}${piece.type}` : 'null'
    );

    return (event) => {
      event.preventDefault();

      if (!this.config.draggable || !piece || this.isAnimating || this.isDragging) {
        return;
      }

      // Set dragging state immediately
      this.isDragging = true;

      const originalFrom = square;
      let isDragging = false;
      const from = originalFrom;
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
        const x = clientX - boardRect.left - squareSize / 2;
        const y = clientY - boardRect.top - squareSize / 2;

        img.style.left = `${x}px`;
        img.style.top = `${y}px`;

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

          // During drag, we don't need to manage clicked state
          // The drag operation is independent of click state

          // Visual feedback
          if (this.config.clickable) {
            from.select();
            // Show hints would be handled by the main class
          }

          // Prepare piece for dragging
          // First, preserve the current computed dimensions
          const computedStyle = window.getComputedStyle(img);
          const currentWidth = computedStyle.width;
          const currentHeight = computedStyle.height;

          img.style.position = 'absolute';
          img.style.zIndex = '100';
          img.classList.add('dragging');

          // Explicitly set the dimensions to maintain size during drag
          img.style.width = currentWidth;
          img.style.height = currentHeight;

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

        // CRITICAL FIX: Remove ALL event listeners immediately to prevent interference
        document.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        img.removeEventListener('mouseup', onMouseUp);

        // If this was just a click, don't interfere
        if (!isDragging) {
          return;
        }

        console.log('onMouseUp: Handling drag completion for piece at', originalFrom.id);

        // Clean up drag state
        img.style.zIndex = '20';
        img.classList.remove('dragging');
        img.style.willChange = 'auto';

        // Clean up drag optimizations that might interfere with click
        DragOptimizations.cleanupAfterDrag(img);

        // Reset drag state immediately to allow subsequent clicks
        this.isDragging = false;

        // Ensure clicked state is clean before handling drop
        // This prevents drag operations from interfering with subsequent clicks
        this.clicked = null;

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
          img.style.width = '';
          img.style.height = '';

          // Clean up drag optimizations
          DragOptimizations.cleanupAfterDrag(img);

          this._handleSnapback(originalFrom, piece, onSnapback);
          this._cleanupAfterFailedMove(originalFrom);
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
    // Clear visual states
    this.boardService.applyToAllSquares('unmoved');
    this.boardService.applyToAllSquares('removeHint');
    fromSquare.deselect();

    // Reset clicked state
    this.clicked = null;

    if (onRemove) {
      onRemove(fromSquare.getId());
    }

    logger.debug('EventService: Trash drop executed, state cleaned up');
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

    // Always cleanup state after snapback
    logger.debug('EventService: Snapback executed, cleaning up state');
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
    console.log('=== _handleDrop CALLED ===');
    console.log('From:', fromSquare.id, 'To:', toSquare.id);
    console.log('Piece:', piece ? `${piece.color}${piece.type}` : 'null');
    console.log('Stack trace:', new Error().stack.split('\n')[1]);
    console.log('Caller:', new Error().stack.split('\n')[2]);

    // CRITICAL FIX: Prevent multiple simultaneous drop operations
    if (this.isAnimating || this._isProcessingDrop) {
      console.log('Drop ignored - already processing or animating');
      return;
    }

    // Set processing flag to prevent interference
    this._isProcessingDrop = true;

    const cleanup = () => {
      this._isProcessingDrop = false;
    };

    // The core issue is state management. A drop action should be atomic.
    // It either succeeds or fails, and the state should be cleaned completely afterward.
    // We should not be setting `this.clicked` here at all.

    try {
      // Check for promotion first, as it's a special case.
      if (this.moveService.requiresPromotion(new Move(fromSquare, toSquare))) {
        logger.debug('Drag move requires promotion:', fromSquare.id, '->', toSquare.id);

        this.moveService.setupPromotion(
          new Move(fromSquare, toSquare),
          this.boardService.squares,
          (selectedPromotion) => {
            logger.debug('Drag promotion selected:', selectedPromotion);
            this.boardService.applyToAllSquares('removePromotion');
            this.boardService.applyToAllSquares('removeCover');

            // Attempt the move with promotion.
            const moveResult = onMove(fromSquare, toSquare, selectedPromotion, true);
            if (moveResult) {
              this._schedulePromotionPieceReplacement(toSquare, selectedPromotion);
              this._cleanupAfterSuccessfulMove(fromSquare);
            } else {
              this._handleSnapback(fromSquare, piece, onSnapback);
              this._cleanupAfterFailedMove(fromSquare);
            }
            cleanup();
          },
          () => {
            logger.debug('Drag promotion cancelled');
            this.boardService.applyToAllSquares('removePromotion');
            this.boardService.applyToAllSquares('removeCover');
            this._handleSnapback(fromSquare, piece, onSnapback);
            this._cleanupAfterFailedMove(fromSquare);
            cleanup();
          }
        );
      } else {
        // Regular move.
        const moveSuccess = onMove(fromSquare, toSquare, null, true);

        if (moveSuccess) {
          this._cleanupAfterSuccessfulMove(fromSquare);
        } else {
          this._handleSnapback(fromSquare, piece, onSnapback);
          this._cleanupAfterFailedMove(fromSquare);
        }
        cleanup();
      }
    } catch (error) {
      console.error('Error in _handleDrop:', error);
      cleanup();
    }
  }

  /**
   * Cleans up visual state after a SUCCESSFUL move
   * @private
   * @param {Square} fromSquare - Source square
   */
  _cleanupAfterSuccessfulMove(fromSquare) {
    // Always reset interaction state after any successful move (drag or click)
    this.clicked = null;
    this.isDragging = false;

    // Clear specific visual states related to the move
    if (fromSquare) {
      fromSquare.deselect();
    }

    // Clean up ALL visual elements after a successful move
    // This includes removing old move highlights to keep the board clean
    this.boardService.applyToAllSquares('removeHint');
    this.boardService.applyToAllSquares('dehighlight');
    this.boardService.applyToAllSquares('removePromotion');
    this.boardService.applyToAllSquares('removeCover');

    logger.debug('EventService: All visual state cleaned up after SUCCESSFUL move');
  }

  /**
   * Cleans up visual state after a FAILED move (snapback, invalid move)
   * @private
   * @param {Square} fromSquare - Source square
   */
  _cleanupAfterFailedMove(fromSquare) {
    // Reset interaction state but be more conservative with visual cleanup
    this.clicked = null;
    this.isDragging = false;

    // Clean specific visual elements related to failed operation
    this.boardService.applyToAllSquares('removePromotion');
    this.boardService.applyToAllSquares('removeCover');
    this.boardService.applyToAllSquares('removeHint');

    // Only deselect the specific square that failed
    if (fromSquare) {
      fromSquare.deselect();
    }

    // Don't aggressively clear all highlights - preserve move history
    // this.boardService.applyToAllSquares('dehighlight');

    logger.debug('EventService: Conservative cleanup after FAILED move');
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
      { transform: `translate(${dx}px, ${dy}px)` },
    ];

    if (piece.element.animate) {
      const animation = piece.element.animate(keyframes, {
        duration,
        easing: 'ease',
        fill: 'none', // Don't keep the final position
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
   * @returns {boolean} True if move was successful
   */
  onClick(square, onMove, onSelect, onDeselect, animate = true) {
    // Always ensure we're not in dragging state during click operations
    this.isDragging = false;

    // If we're animating, ignore the click to prevent state corruption
    if (this.isAnimating) {
      logger.debug('EventService.onClick: Ignoring click during animation');
      return false;
    }

    logger.debug('=== EventService.onClick START ===');
    logger.debug(
      'EventService.onClick: square =',
      square.id,
      'clicked =',
      this.clicked?.id || 'none',
      'isAnimating =',
      this.isAnimating
    );
    logger.debug(
      'EventService.onClick: Square piece =',
      square.piece ? `${square.piece.color}${square.piece.type}` : 'empty'
    );
    logger.debug(
      'EventService.onClick: Clicked square piece =',
      this.clicked?.piece
        ? `${this.clicked.piece.color}${this.clicked.piece.type}`
        : this.clicked
          ? 'empty'
          : 'none'
    );

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
      logger.debug('EventService.onClick: No source square, checking if can move:', square.id);
      if (this.moveService.canMove(square)) {
        logger.debug('EventService.onClick: Can move! Setting clicked to:', square.id);
        this.clicked = square;
        if (this.config.clickable) {
          // Ensure visual selection happens after state is set
          onSelect(square);
          logger.debug('EventService.onClick: Square selected visually:', square.id);
        }
        logger.debug('EventService.onClick: After setting, clicked =', this.clicked?.id || 'none');
        return false;
      }
      logger.debug('EventService.onClick: Cannot move square:', square.id);
      return false;
    }

    logger.debug('EventService.onClick: We have a source square:', from.id, 'target:', square.id);

    // Clicking same square - deselect
    if (this.clicked === square) {
      onDeselect(square);
      this.clicked = null;
      return false;
    }

    // Check if move requires promotion
    if (!promotion && this.moveService.requiresPromotion(new Move(from, square))) {
      logger.debug('Move requires promotion:', from.id, '->', square.id);

      // Set up promotion UI
      this.moveService.setupPromotion(
        new Move(from, square),
        this.boardService.squares,
        (selectedPromotion) => {
          logger.debug('Promotion selected:', selectedPromotion);

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
          logger.debug('Promotion cancelled');

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
    logger.debug('EventService.onClick: Attempting move from', from.id, 'to', square.id);
    logger.debug('EventService.onClick: Current game state before move attempt');
    const moveResult = onMove(from, square, promotion, animate);

    if (moveResult) {
      // Move successful
      logger.debug('EventService.onClick: Move successful');
      onDeselect(from);
      this.clicked = null;
      logger.debug('=== EventService.onClick END (move successful) ===');
      return true;
    }
    // Move failed - deselect current and try to select new piece
    logger.debug(
      'EventService.onClick: Move failed from',
      from.id,
      'to',
      square.id,
      '- resetting state'
    );

    // Always deselect the current piece first
    onDeselect(from);
    this.clicked = null;
    this.isDragging = false;

    // Clear move-related visual states but preserve highlights
    this.boardService.applyToAllSquares('removeHint');

    // Now check if the target square has a piece we can move and select it
    if (this.moveService.canMove(square)) {
      logger.debug('EventService.onClick: Can select new piece at', square.id);

      this.clicked = square;
      if (this.config.clickable) {
        onSelect(square);
        logger.debug('EventService.onClick: New piece selected visually:', square.id);
      }
      logger.debug('EventService.onClick: New piece selected at', square.id);
    } else {
      logger.debug(
        'EventService.onClick: Cannot select piece at',
        square.id,
        '- staying deselected'
      );
    }

    logger.debug('=== EventService.onClick END (move failed) ===');
    return false;
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
      logger.warn('Target square not found:', square.id);
      this.chessboard._isPromoting = false;
      return;
    }

    // Check if piece is present and ready
    if (targetSquare.piece && targetSquare.piece.element) {
      logger.debug('Piece found on', square.id, 'after', attempt, 'attempts');
      this._replacePromotionPiece(square, promotionPiece);

      // Allow normal updates again after transformation
      setTimeout(() => {
        this.chessboard._isPromoting = false;
        logger.debug('Promotion protection ended');
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
      logger.warn('Failed to find piece for promotion after', maxAttempts, 'attempts');
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
    logger.debug('Replacing piece on', square.id, 'with', promotionPiece);

    // Get the target square from the board service
    const targetSquare = this.boardService.getSquare(square.id);
    if (!targetSquare) {
      logger.debug('Target square not found:', square.id);
      return;
    }

    // Get the game state to determine the correct piece color
    const gameState = this.chessboard.positionService.getGame();
    const gamePiece = gameState.get(targetSquare.id);

    if (!gamePiece) {
      logger.debug('No piece found in game state for', targetSquare.id);
      return;
    }

    // Get the current piece on the square
    const currentPiece = targetSquare.piece;

    if (!currentPiece) {
      logger.warn('No piece found on target square for promotion');

      // Try to recover by creating a new piece
      const pieceId = promotionPiece + gamePiece.color;
      const piecePath = this.chessboard.pieceService.getPiecePath(pieceId);

      const newPiece = new Piece(gamePiece.color, promotionPiece, piecePath);

      // Place the new piece on the square
      targetSquare.putPiece(newPiece);

      // Set up drag functionality
      const dragFunction = this.chessboard._createDragFunction.bind(this.chessboard);
      newPiece.setDrag(dragFunction(targetSquare, newPiece));

      logger.debug('Created new promotion piece:', pieceId, 'on', targetSquare.id);
      return;
    }

    // Create the piece ID and get the path
    const pieceId = promotionPiece + gamePiece.color;
    const piecePath = this.chessboard.pieceService.getPiecePath(pieceId);

    logger.debug('Transforming piece to:', pieceId, 'with path:', piecePath);

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

        logger.debug('Successfully transformed piece on', targetSquare.id, 'to', pieceId);
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
    this.eventListeners.forEach((listeners) => {
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
    this.eventListeners.forEach((listeners) => {
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
    this.isDragging = false;
  }
}
