/**
 * Creative Mode - Free piece manipulation without rule enforcement
 * @module modes/CreativeMode
 * @since 3.1.0
 *
 * Features:
 * - Add any piece to any square
 * - Remove pieces freely
 * - Move pieces without rule validation
 * - Copy pieces from one square to another
 * - Clear board or reset to custom positions
 * - Save and load custom positions
 */

import { BaseMode } from './BaseMode.js';

/**
 * @typedef {Object} CreativeModeConfig
 * @extends ModeConfig
 * @property {boolean} [showPiecePalette=true] - Show piece selection palette
 * @property {boolean} [allowIllegalPositions=true] - Allow positions with multiple kings, etc.
 * @property {string[]} [availablePieces] - Pieces available for placement
 * @property {Function} [onPieceAdded] - Callback when piece is added
 * @property {Function} [onPieceRemoved] - Callback when piece is removed
 * @property {Function} [onPositionSaved] - Callback when position is saved
 */

/**
 * Creative mode for free board manipulation
 */
export class CreativeMode extends BaseMode {
  /**
   * Default pieces available in creative mode
   * @static
   */
  static DEFAULT_PIECES = ['wk', 'wq', 'wr', 'wb', 'wn', 'wp', 'bk', 'bq', 'br', 'bb', 'bn', 'bp'];

  /**
   * @param {Object} chessboard - Reference to the chessboard instance
   * @param {CreativeModeConfig} [config={}] - Mode configuration
   */
  constructor(chessboard, config = {}) {
    super(chessboard, {
      name: 'creative',
      enforceRules: false,
      allowFreeMovement: true,
      allowPieceCreation: true,
      allowPieceRemoval: true,
      trackTurns: false,
      detectGameEnd: false,
      showPiecePalette: true,
      allowIllegalPositions: true,
      availablePieces: CreativeMode.DEFAULT_PIECES,
      ...config,
    });

    this.selectedPiece = null;
    this.savedPositions = new Map();
    this.clipboard = null;
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Start creative mode
   * @override
   */
  start() {
    super.start();

    // Save initial position for undo
    this._saveState();

    // Enable piece interaction
    this._setupInteractions();

    this._emit('creativeStart', {
      availablePieces: this.config.availablePieces,
    });
  }

  /**
   * Stop creative mode
   * @override
   */
  stop() {
    this._cleanupInteractions();
    super.stop();
  }

  /**
   * Setup creative mode interactions
   * @private
   */
  _setupInteractions() {
    // Store original draggable state
    this._originalDraggable = this.chessboard.config.draggable;

    // Enable dragging in creative mode
    if (this.chessboard.config) {
      this.chessboard.config.draggable = true;
    }
  }

  /**
   * Cleanup creative mode interactions
   * @private
   */
  _cleanupInteractions() {
    // Restore original draggable state
    if (this._originalDraggable !== undefined && this.chessboard.config) {
      this.chessboard.config.draggable = this._originalDraggable;
    }
  }

  /**
   * Select a piece type for placement
   * @param {string} piece - Piece code (e.g., 'wq', 'bn')
   */
  selectPiece(piece) {
    if (!this.config.availablePieces.includes(piece)) {
      console.warn(`[CreativeMode] Piece ${piece} not available`);
      return;
    }
    this.selectedPiece = piece;
    this._emit('pieceSelected', { piece });
  }

  /**
   * Deselect current piece
   */
  deselectPiece() {
    this.selectedPiece = null;
    this._emit('pieceDeselected', {});
  }

  /**
   * Get currently selected piece
   * @returns {string|null}
   */
  getSelectedPiece() {
    return this.selectedPiece;
  }

  /**
   * Add a piece to a square
   * @param {string} piece - Piece code
   * @param {string} square - Target square
   * @returns {boolean}
   */
  addPiece(piece, square) {
    if (!this.isActive) return false;

    this._saveState();

    try {
      // Remove existing piece if any
      const existingPiece = this.chessboard.getPiece(square);
      if (existingPiece) {
        this.chessboard.removePiece(square);
      }

      // Add new piece
      this.chessboard.putPiece(piece, square);
      this.chessboard.forceSync();

      this._emit('pieceAdded', { piece, square });

      if (this.config.onPieceAdded) {
        this.config.onPieceAdded({ piece, square });
      }

      return true;
    } catch (err) {
      console.error('[CreativeMode] Error adding piece:', err);
      this.undo(); // Rollback
      return false;
    }
  }

  /**
   * Remove a piece from a square
   * @param {string} square - Square to clear
   * @returns {string|null} - The removed piece code
   */
  removePiece(square) {
    if (!this.isActive) return null;

    const piece = this.chessboard.getPiece(square);
    if (!piece) return null;

    this._saveState();

    try {
      this.chessboard.removePiece(square);
      this.chessboard.forceSync();

      this._emit('pieceRemoved', { piece, square });

      if (this.config.onPieceRemoved) {
        this.config.onPieceRemoved({ piece, square });
      }

      return piece;
    } catch (err) {
      console.error('[CreativeMode] Error removing piece:', err);
      this.undo();
      return null;
    }
  }

  /**
   * Move a piece (no rule validation)
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @returns {boolean}
   */
  movePiece(from, to) {
    if (!this.isActive) return false;

    const piece = this.chessboard.getPiece(from);
    if (!piece) return false;

    this._saveState();

    try {
      // Remove from source
      this.chessboard.removePiece(from);
      // Add to target (replacing any existing piece)
      this.chessboard.putPiece(piece, to);
      this.chessboard.forceSync();

      this._emit('pieceMoved', { piece, from, to });

      return true;
    } catch (err) {
      console.error('[CreativeMode] Error moving piece:', err);
      this.undo();
      return false;
    }
  }

  /**
   * Copy a piece to another square
   * @param {string} from - Source square
   * @param {string} to - Target square
   * @returns {boolean}
   */
  copyPiece(from, to) {
    if (!this.isActive) return false;

    const piece = this.chessboard.getPiece(from);
    if (!piece) return false;

    return this.addPiece(piece, to);
  }

  /**
   * Copy piece to clipboard
   * @param {string} square - Square to copy from
   */
  copyToClipboard(square) {
    this.clipboard = this.chessboard.getPiece(square);
    this._emit('clipboardUpdated', { piece: this.clipboard });
  }

  /**
   * Paste piece from clipboard
   * @param {string} square - Target square
   * @returns {boolean}
   */
  pasteFromClipboard(square) {
    if (!this.clipboard) return false;
    return this.addPiece(this.clipboard, square);
  }

  /**
   * Clear the entire board
   */
  clearBoard() {
    if (!this.isActive) return;

    this._saveState();
    this.chessboard.clear({ animate: false });
    this.chessboard.forceSync();

    this._emit('boardCleared', {});
  }

  /**
   * Set up starting position
   */
  setupStartingPosition() {
    if (!this.isActive) return;

    this._saveState();
    this.chessboard.reset({ animate: false });
    this.chessboard.forceSync();

    this._emit('positionReset', {});
  }

  /**
   * Set a custom position from FEN
   * @param {string} fen - FEN string
   * @returns {boolean}
   */
  setPosition(fen) {
    if (!this.isActive) return false;

    this._saveState();

    try {
      this.chessboard.setPosition(fen);
      this.chessboard.forceSync();

      this._emit('positionSet', { fen });
      return true;
    } catch (err) {
      console.error('[CreativeMode] Error setting position:', err);
      this.undo();
      return false;
    }
  }

  /**
   * Save current position with a name
   * @param {string} name - Position name
   * @returns {string} - FEN string
   */
  savePosition(name) {
    const fen = this.chessboard.fen();
    this.savedPositions.set(name, fen);

    this._emit('positionSaved', { name, fen });

    if (this.config.onPositionSaved) {
      this.config.onPositionSaved({ name, fen });
    }

    return fen;
  }

  /**
   * Load a saved position
   * @param {string} name - Position name
   * @returns {boolean}
   */
  loadPosition(name) {
    const fen = this.savedPositions.get(name);
    if (!fen) {
      console.warn(`[CreativeMode] Position "${name}" not found`);
      return false;
    }

    return this.setPosition(fen);
  }

  /**
   * Get list of saved positions
   * @returns {string[]}
   */
  getSavedPositions() {
    return Array.from(this.savedPositions.keys());
  }

  /**
   * Delete a saved position
   * @param {string} name - Position name
   * @returns {boolean}
   */
  deletePosition(name) {
    return this.savedPositions.delete(name);
  }

  /**
   * Undo last action
   * @returns {boolean}
   */
  undo() {
    if (this.undoStack.length === 0) return false;

    // Save current state to redo stack
    this.redoStack.push(this.chessboard.fen());

    // Restore previous state
    const previousFen = this.undoStack.pop();
    this.chessboard.setPosition(previousFen);
    this.chessboard.forceSync();

    this._emit('undo', { fen: previousFen });
    return true;
  }

  /**
   * Redo last undone action
   * @returns {boolean}
   */
  redo() {
    if (this.redoStack.length === 0) return false;

    // Save current state to undo stack
    this.undoStack.push(this.chessboard.fen());

    // Restore next state
    const nextFen = this.redoStack.pop();
    this.chessboard.setPosition(nextFen);
    this.chessboard.forceSync();

    this._emit('redo', { fen: nextFen });
    return true;
  }

  /**
   * Save current state for undo
   * @private
   */
  _saveState() {
    this.undoStack.push(this.chessboard.fen());
    this.redoStack = []; // Clear redo stack on new action
  }

  /**
   * Validate position (check for illegal setups)
   * @returns {Object} - Validation result
   */
  validatePosition() {
    const fen = this.chessboard.fen();
    const position = fen.split(' ')[0];

    const issues = [];
    let whiteKings = 0;
    let blackKings = 0;
    let whitePawnsOnFirstRank = 0;
    let blackPawnsOnLastRank = 0;

    // Count pieces
    for (const char of position) {
      if (char === 'K') whiteKings++;
      if (char === 'k') blackKings++;
    }

    // Check pawns on first/last rank
    const ranks = position.split('/');
    if (ranks[0].includes('P')) blackPawnsOnLastRank++;
    if (ranks[7].includes('p')) whitePawnsOnFirstRank++;

    if (whiteKings !== 1) {
      issues.push(`White has ${whiteKings} kings (should be 1)`);
    }
    if (blackKings !== 1) {
      issues.push(`Black has ${blackKings} kings (should be 1)`);
    }
    if (whitePawnsOnFirstRank > 0) {
      issues.push('White pawns on 1st rank');
    }
    if (blackPawnsOnLastRank > 0) {
      issues.push('Black pawns on 8th rank');
    }

    return {
      isValid: issues.length === 0,
      issues,
      fen,
    };
  }

  /**
   * Export position as various formats
   * @param {string} [format='fen'] - Export format ('fen', 'pgn', 'json')
   * @returns {string}
   */
  exportPosition(format = 'fen') {
    switch (format) {
      case 'fen':
        return this.chessboard.fen();
      case 'json':
        return JSON.stringify({
          fen: this.chessboard.fen(),
          savedPositions: Object.fromEntries(this.savedPositions),
        });
      default:
        return this.chessboard.fen();
    }
  }

  /**
   * Import position from format
   * @param {string} data - Position data
   * @param {string} [format='fen'] - Import format
   * @returns {boolean}
   */
  importPosition(data, format = 'fen') {
    try {
      switch (format) {
        case 'fen':
          return this.setPosition(data);
        case 'json': {
          const parsed = JSON.parse(data);
          if (parsed.fen) {
            this.setPosition(parsed.fen);
          }
          if (parsed.savedPositions) {
            Object.entries(parsed.savedPositions).forEach(([name, fen]) => {
              this.savedPositions.set(name, fen);
            });
          }
          return true;
        }
        default:
          return this.setPosition(data);
      }
    } catch (err) {
      console.error('[CreativeMode] Error importing position:', err);
      return false;
    }
  }

  /**
   * Get mode-specific stats
   * @override
   * @returns {Object}
   */
  getStats() {
    return {
      ...super.getStats(),
      selectedPiece: this.selectedPiece,
      savedPositionsCount: this.savedPositions.size,
      undoStackSize: this.undoStack.length,
      redoStackSize: this.redoStack.length,
      clipboardPiece: this.clipboard,
      validation: this.validatePosition(),
    };
  }

  /**
   * Reset creative mode
   * @override
   */
  reset() {
    super.reset();
    this.selectedPiece = null;
    this.clipboard = null;
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Serialize mode state
   * @override
   * @returns {Object}
   */
  serialize() {
    return {
      ...super.serialize(),
      selectedPiece: this.selectedPiece,
      savedPositions: Object.fromEntries(this.savedPositions),
      clipboard: this.clipboard,
      undoStack: this.undoStack,
      redoStack: this.redoStack,
    };
  }

  /**
   * Restore mode state
   * @override
   * @param {Object} state - Serialized state
   */
  restore(state) {
    super.restore(state);
    if (state.selectedPiece) this.selectedPiece = state.selectedPiece;
    if (state.savedPositions) {
      this.savedPositions = new Map(Object.entries(state.savedPositions));
    }
    if (state.clipboard) this.clipboard = state.clipboard;
    if (state.undoStack) this.undoStack = state.undoStack;
    if (state.redoStack) this.redoStack = state.redoStack;
  }
}

export default CreativeMode;
