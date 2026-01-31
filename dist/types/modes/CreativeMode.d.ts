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
    static DEFAULT_PIECES: string[];
    /**
     * @param {Object} chessboard - Reference to the chessboard instance
     * @param {CreativeModeConfig} [config={}] - Mode configuration
     */
    constructor(chessboard: Object, config?: CreativeModeConfig);
    selectedPiece: any;
    savedPositions: Map<any, any>;
    clipboard: any;
    undoStack: any[];
    redoStack: any[];
    /**
     * Setup creative mode interactions
     * @private
     */
    private _setupInteractions;
    _originalDraggable: any;
    /**
     * Cleanup creative mode interactions
     * @private
     */
    private _cleanupInteractions;
    /**
     * Select a piece type for placement
     * @param {string} piece - Piece code (e.g., 'wq', 'bn')
     */
    selectPiece(piece: string): void;
    /**
     * Deselect current piece
     */
    deselectPiece(): void;
    /**
     * Get currently selected piece
     * @returns {string|null}
     */
    getSelectedPiece(): string | null;
    /**
     * Add a piece to a square
     * @param {string} piece - Piece code
     * @param {string} square - Target square
     * @returns {boolean}
     */
    addPiece(piece: string, square: string): boolean;
    /**
     * Remove a piece from a square
     * @param {string} square - Square to clear
     * @returns {string|null} - The removed piece code
     */
    removePiece(square: string): string | null;
    /**
     * Move a piece (no rule validation)
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @returns {boolean}
     */
    movePiece(from: string, to: string): boolean;
    /**
     * Copy a piece to another square
     * @param {string} from - Source square
     * @param {string} to - Target square
     * @returns {boolean}
     */
    copyPiece(from: string, to: string): boolean;
    /**
     * Copy piece to clipboard
     * @param {string} square - Square to copy from
     */
    copyToClipboard(square: string): void;
    /**
     * Paste piece from clipboard
     * @param {string} square - Target square
     * @returns {boolean}
     */
    pasteFromClipboard(square: string): boolean;
    /**
     * Clear the entire board
     */
    clearBoard(): void;
    /**
     * Set up starting position
     */
    setupStartingPosition(): void;
    /**
     * Set a custom position from FEN
     * @param {string} fen - FEN string
     * @returns {boolean}
     */
    setPosition(fen: string): boolean;
    /**
     * Save current position with a name
     * @param {string} name - Position name
     * @returns {string} - FEN string
     */
    savePosition(name: string): string;
    /**
     * Load a saved position
     * @param {string} name - Position name
     * @returns {boolean}
     */
    loadPosition(name: string): boolean;
    /**
     * Get list of saved positions
     * @returns {string[]}
     */
    getSavedPositions(): string[];
    /**
     * Delete a saved position
     * @param {string} name - Position name
     * @returns {boolean}
     */
    deletePosition(name: string): boolean;
    /**
     * Undo last action
     * @returns {boolean}
     */
    undo(): boolean;
    /**
     * Redo last undone action
     * @returns {boolean}
     */
    redo(): boolean;
    /**
     * Save current state for undo
     * @private
     */
    private _saveState;
    /**
     * Validate position (check for illegal setups)
     * @returns {Object} - Validation result
     */
    validatePosition(): Object;
    /**
     * Export position as various formats
     * @param {string} [format='fen'] - Export format ('fen', 'pgn', 'json')
     * @returns {string}
     */
    exportPosition(format?: string): string;
    /**
     * Import position from format
     * @param {string} data - Position data
     * @param {string} [format='fen'] - Import format
     * @returns {boolean}
     */
    importPosition(data: string, format?: string): boolean;
}
export default CreativeMode;
export type CreativeModeConfig = Object;
//# sourceMappingURL=CreativeMode.d.ts.map